import { z } from "zod";

/**
 * Cliente da API de Checkout da InfinitePay.
 *
 * Duas rotas nos interessam:
 *   POST /links         → cria a cobrança e devolve a URL de pagamento
 *   POST /payment_check → confirma se uma cobrança foi realmente paga
 *
 * A API não usa header de autenticação: o `handle` (InfiniteTag) é a própria
 * identificação do vendedor. Duas consequências que moldam este arquivo:
 *
 *   1. O handle nunca pode vazar para o cliente — por isso ele é lido de
 *      `process.env` aqui, e este módulo só é importado por código de servidor.
 *   2. Nada que chegue pela borda (querystring do redirect, corpo do webhook)
 *      prova pagamento. Só `payment_check` prova. Ver `checkPayment`.
 */

const API_BASE = "https://api.checkout.infinitepay.io";

/** A cobrança é síncrona no fluxo de compra: melhor falhar do que pendurar. */
const TIMEOUT_MS = 10_000;

/** Preço em centavos — a InfinitePay não aceita reais. */
export interface PaymentLinkItem {
  quantity: number;
  price: number;
  description: string;
}

export interface CreatePaymentLinkInput {
  items: PaymentLinkItem[];
  orderNsu: string;
  redirectUrl: string;
  /** Omitido quando a loja não está publicamente acessível. */
  webhookUrl?: string;
}

export interface PaymentCheckInput {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
}

export class InfinitePayError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number, options?: ErrorOptions) {
    super(message, options);
    this.name = "InfinitePayError";
    this.status = status;
  }
}

/**
 * O `$` da InfiniteTag é enfeite de exibição; a API espera o handle cru.
 * Tirar aqui evita um 4xx silencioso caso a variável seja colada com o cifrão.
 */
function getHandle(): string {
  const handle = process.env.INFINITEPAY_HANDLE?.trim().replace(/^\$/, "");

  if (!handle) {
    throw new InfinitePayError(
      "INFINITEPAY_HANDLE não configurado no ambiente.",
    );
  }

  return handle;
}

async function post<T>(
  path: string,
  body: unknown,
  schema: z.ZodType<T>,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (cause) {
    // Rede fora ou estouro do timeout: a cobrança não chegou a ser criada.
    throw new InfinitePayError(`Falha de rede em ${path}.`, undefined, {
      cause,
    });
  }

  // A API responde erro em JSON, mas um 502 do proxy dela vem em HTML.
  const raw: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new InfinitePayError(
      `${path} respondeu ${response.status}: ${JSON.stringify(raw)}`,
      response.status,
    );
  }

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    // Um 200 com corpo fora do contrato é tão quebrado quanto um 500 —
    // tratar como sucesso aqui redirecionaria o cliente para `undefined`.
    throw new InfinitePayError(
      `Resposta fora do contrato em ${path}: ${JSON.stringify(raw)}`,
      response.status,
    );
  }

  return parsed.data;
}

const paymentLinkSchema = z.object({ url: z.url() });

/** Cria a cobrança e devolve a URL do checkout hospedado da InfinitePay. */
export async function createPaymentLink(
  input: CreatePaymentLinkInput,
): Promise<string> {
  const { url } = await post(
    "/links",
    {
      handle: getHandle(),
      order_nsu: input.orderNsu,
      redirect_url: input.redirectUrl,
      ...(input.webhookUrl ? { webhook_url: input.webhookUrl } : {}),
      items: input.items,
    },
    paymentLinkSchema,
  );

  return url;
}

const paymentCheckSchema = z.object({
  success: z.boolean(),
  paid: z.boolean(),
  amount: z.number().optional(),
  paid_amount: z.number().optional(),
  installments: z.number().optional(),
  capture_method: z.string().optional(),
});

export type PaymentCheck = z.infer<typeof paymentCheckSchema>;

/**
 * Única fonte de verdade sobre "foi pago?".
 *
 * Tanto a volta do `redirect_url` quanto o corpo do webhook são texto que
 * qualquer pessoa consegue forjar — nenhum dos dois é assinado. Esta chamada
 * pergunta direto para a InfinitePay, e é ela que decide.
 */
export async function checkPayment(
  input: PaymentCheckInput,
): Promise<PaymentCheck> {
  return post(
    "/payment_check",
    {
      handle: getHandle(),
      order_nsu: input.orderNsu,
      transaction_nsu: input.transactionNsu,
      slug: input.slug,
    },
    paymentCheckSchema,
  );
}
