import { NextResponse } from "next/server";
import { z } from "zod";
import { productsData } from "@/data/products";
import { formatPrice } from "@/lib/format-price";
import { MAX_QUANTITY_PER_ITEM, type CheckoutResponse } from "@/types/checkout";
import { SIZES } from "@/types/product";

/**
 * Destino provisório até a integração com o Mercado Pago.
 * TODO: criar a preferência de pagamento com `lineItems` e devolver o
 * `init_point` real (o pacote `mercadopago` já está instalado).
 */
const CHECKOUT_STUB_URL = "https://www.google.com";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        size: z.enum(SIZES),
        quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_ITEM),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  try {
    const lineItems = [];

    for (const item of parsed.data.items) {
      const product = productsData[item.id];

      if (!product) {
        return NextResponse.json(
          { error: `Produto desconhecido: ${item.id}` },
          { status: 400 },
        );
      }

      if (!product.sizes.includes(item.size)) {
        return NextResponse.json(
          { error: `Tamanho ${item.size} indisponível para ${product.name}.` },
          { status: 400 },
        );
      }

      lineItems.push({
        id: product.id,
        title: product.name,
        quantity: item.quantity,
        // O preço vem SEMPRE do catálogo. Se viesse do corpo da requisição,
        // bastaria editar o localStorage para comprar qualquer peça por R$ 0,01.
        unitPriceInCents: product.priceInCents,
      });
    }

    const totalInCents = lineItems.reduce(
      (total, item) => total + item.unitPriceInCents * item.quantity,
      0,
    );

    // Log sem dados do comprador: vira sumidouro de PII assim que houver
    // endereço e contato no pedido.
    console.info(
      `[checkout] ${lineItems.length} item(ns), total ${formatPrice(totalInCents)}`,
    );

    const response: CheckoutResponse = { init_point: CHECKOUT_STUB_URL };
    return NextResponse.json(response);
  } catch (cause) {
    console.error("[checkout] falha ao gerar o pagamento:", cause);
    return NextResponse.json(
      { error: "Falha ao gerar o pagamento." },
      { status: 500 },
    );
  }
}
