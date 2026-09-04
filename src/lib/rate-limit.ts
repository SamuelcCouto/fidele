/**
 * Limitador de requisições por IP.
 *
 * Motivo concreto: /api/checkout cria cobranças de verdade na conta da loja.
 * Sem teto, um script gera milhares de faturas — não rouba dinheiro, mas
 * entope o painel da vendedora e queima a reputação da conta na InfinitePay.
 *
 * LIMITAÇÃO CONHECIDA: o estado vive na memória do processo. Na Vercel cada
 * instância serverless tem a sua, então o teto real é por instância, e some
 * quando a instância hiberna. Isso encarece muito o abuso, mas não o impede —
 * a proteção completa é o firewall da Vercel, configurado no painel.
 */
interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimitRule {
  /** Requisições permitidas na janela. */
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  /** Segundos até a janela mais restritiva liberar. Zero quando `ok`. */
  retryAfterSeconds: number;
}

const buckets = new Map<string, Bucket>();

/** Teto de chaves guardadas, para a memória não crescer sem limite. */
const MAX_BUCKETS = 10_000;

function prune(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Consome uma unidade de cada regra. Se qualquer uma estourar, nenhuma é
 * consumida — senão bater na janela curta gastaria crédito da janela longa.
 */
export function rateLimit(
  identity: string,
  rules: RateLimitRule[],
  now: number = Date.now(),
): RateLimitResult {
  if (buckets.size > MAX_BUCKETS) prune(now);

  const entries = rules.map((rule, index) => {
    const key = `${identity}:${index}`;
    const existing = buckets.get(key);
    const bucket =
      existing && existing.resetAt > now
        ? existing
        : { count: 0, resetAt: now + rule.windowMs };

    return { key, rule, bucket };
  });

  const blocked = entries.filter(({ rule, bucket }) => bucket.count >= rule.limit);

  if (blocked.length > 0) {
    const soonest = Math.min(...blocked.map(({ bucket }) => bucket.resetAt));
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((soonest - now) / 1000)),
    };
  }

  for (const { key, bucket } of entries) {
    bucket.count += 1;
    buckets.set(key, bucket);
  }

  return { ok: true, retryAfterSeconds: 0 };
}

/**
 * IP do cliente. Na Vercel o `x-forwarded-for` é escrito pelo proxy dela e o
 * primeiro valor é o IP real de quem chamou.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return request.headers.get("x-real-ip") ?? "desconhecido";
}

/** Só existe para os testes: zera o estado entre casos. */
export function resetRateLimit(): void {
  buckets.clear();
}
