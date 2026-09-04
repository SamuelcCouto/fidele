import { NextResponse } from "next/server";
import { z } from "zod";
import { isDeliverable } from "@/config/delivery";
import { cepDigits, lookupCep } from "@/lib/cep";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import type { DeliveryCheckResponse } from "@/types/delivery";

/**
 * Consulta de área de entrega, usada pelo carrinho para dar resposta imediata
 * ao cliente.
 *
 * Existe para o navegador não falar direto com o ViaCEP: mantém uma
 * implementação só da regra, aproveita o cache do servidor e deixa a mesma
 * função ser reusada pelo /api/checkout — que é quem de fato decide, já que
 * uma validação só no front-end é contornável.
 *
 * O CEP vai no corpo, não na query string: não é dado público do pedido e não
 * tem por que ficar registrado em log de URL.
 */
const requestSchema = z.object({
  cep: z.string().min(8).max(9),
});

/**
 * Mais folgado que o checkout: aqui não nasce cobrança, e o carrinho dispara
 * uma consulta a cada CEP completado. O teto existe para não virar proxy de
 * consulta de CEP de terceiros às custas da loja.
 */
const DELIVERY_LIMITS = [
  { limit: 30, windowMs: 60_000 },
  { limit: 200, windowMs: 60 * 60_000 },
];

export async function POST(request: Request) {
  const limit = rateLimit(`entrega:${clientIp(request)}`, DELIVERY_LIMITS);

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Muitas consultas. Aguarde um instante." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "CEP inválido." }, { status: 400 });
  }

  const cep = cepDigits(parsed.data.cep);
  if (cep.length !== 8) {
    return NextResponse.json({ error: "CEP inválido." }, { status: 400 });
  }

  // Todos os desfechos abaixo são 200 com `status` no corpo: para o carrinho,
  // "não entregamos aí" não é erro de requisição — é uma resposta que ele
  // precisa saber diferenciar de "CEP não existe" e de "não deu para checar".
  try {
    const address = await lookupCep(cep);

    if (!address) {
      const body: DeliveryCheckResponse = { status: "not-found", cep };
      return NextResponse.json(body);
    }

    const body: DeliveryCheckResponse = {
      status: isDeliverable(address.city, address.uf)
        ? "deliverable"
        : "out-of-area",
      cep,
      city: address.city,
      uf: address.uf,
    };

    return NextResponse.json(body);
  } catch (cause) {
    console.error("[entrega] falha ao consultar o CEP:", cause);
    const body: DeliveryCheckResponse = { status: "unavailable", cep };
    return NextResponse.json(body);
  }
}
