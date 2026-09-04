import { NextResponse } from "next/server";
import { z } from "zod";
import { checkoutRoutes } from "@/config/site";
import { productsData } from "@/data/products";
import { getBaseUrl, isPubliclyReachable } from "@/lib/base-url";
import { formatPrice } from "@/lib/format-price";
import {
  createPaymentLink,
  InfinitePayError,
  type PaymentLinkItem,
} from "@/lib/infinitepay";
import {
  MAX_LINE_ITEMS,
  MAX_QUANTITY_PER_ITEM,
  type CheckoutResponse,
} from "@/types/checkout";
import { SIZES } from "@/types/product";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        size: z.enum(SIZES),
        quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_ITEM),
      }),
    )
    .min(1)
    .max(MAX_LINE_ITEMS),
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

  const items: PaymentLinkItem[] = [];

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

    items.push({
      quantity: item.quantity,
      // O preço vem SEMPRE do catálogo. Se viesse do corpo da requisição,
      // bastaria editar o localStorage para comprar qualquer peça por R$ 0,01.
      // A InfinitePay também trabalha em centavos, então não há conversão.
      price: product.priceInCents,
      // `description` é o único campo livre do item: é por ele que o tamanho
      // chega até quem vai separar a peça.
      description: `${product.name} — Tam ${item.size}`,
    });
  }

  const totalInCents = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const baseUrl = getBaseUrl();
  const webhookUrl = `${baseUrl}${checkoutRoutes.webhook}`;
  const orderNsu = crypto.randomUUID();

  try {
    const checkoutUrl = await createPaymentLink({
      items,
      orderNsu,
      redirectUrl: `${baseUrl}${checkoutRoutes.return}`,
      // Em desenvolvimento a InfinitePay não alcança a loja: sem webhook, a
      // confirmação fica por conta da tela de retorno.
      webhookUrl: isPubliclyReachable(webhookUrl) ? webhookUrl : undefined,
    });

    // Log sem dados do comprador: vira sumidouro de PII assim que houver
    // endereço e contato no pedido.
    console.info(
      `[checkout] ${orderNsu} — ${items.length} item(ns), total ${formatPrice(totalInCents)}`,
    );

    const response: CheckoutResponse = { checkoutUrl, orderNsu };
    return NextResponse.json(response);
  } catch (cause) {
    console.error(`[checkout] ${orderNsu} falhou:`, cause);

    // Configuração ausente é erro nosso (500); recusa da InfinitePay por
    // payload inválido também — em nenhum dos casos o comprador pode agir.
    // A mensagem devolvida é sempre genérica: detalhe de integração não vaza.
    const status =
      cause instanceof InfinitePayError && cause.status === 429 ? 503 : 500;

    return NextResponse.json(
      { error: "Falha ao gerar o pagamento." },
      { status },
    );
  }
}
