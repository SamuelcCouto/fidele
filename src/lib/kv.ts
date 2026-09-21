/**
 * Cliente mínimo para a API REST do Upstash Redis — sem SDK, só `fetch`, no
 * mesmo espírito de `infinitepay.ts`.
 *
 * Existe porque a loja não tem banco de dados: o pedido criado no checkout
 * precisa sobreviver até o webhook de pagamento chegar, minutos (às vezes
 * dias) depois, numa outra execução do servidor — memória local não chega lá
 * na Vercel.
 */
export class KvError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "KvError";
  }
}

function credentials(): { url: string; token: string } {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new KvError(
      "UPSTASH_REDIS_REST_URL ou UPSTASH_REDIS_REST_TOKEN não configurados.",
    );
  }

  return { url, token };
}

/** Executa um comando Redis via o endpoint genérico do Upstash. */
async function command(args: (string | number)[]): Promise<unknown> {
  const { url, token } = credentials();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new KvError(`Upstash respondeu ${response.status}.`);
  }

  const body = (await response.json().catch(() => null)) as {
    result?: unknown;
    error?: string;
  } | null;

  if (!body || body.error) {
    throw new KvError(`Upstash devolveu erro: ${body?.error ?? "resposta vazia"}`);
  }

  return body.result;
}

export async function kvSet(
  key: string,
  value: string,
  ttlSeconds: number,
): Promise<void> {
  await command(["SET", key, value, "EX", ttlSeconds]);
}

export async function kvGet(key: string): Promise<string | null> {
  const result = await command(["GET", key]);
  return typeof result === "string" ? result : null;
}
