import { NextResponse } from "next/server";
import { z } from "zod";
import { DELIVERY_AREA_LABEL, isDeliverable } from "@/config/delivery";
import { checkoutRoutes } from "@/config/site";
import { getProduct } from "@/lib/catalog";
import { getBaseUrl, isPubliclyReachable } from "@/lib/base-url";
import { cepDigits, lookupCep } from "@/lib/cep";
import { formatPrice } from "@/lib/format-price";
import {
  createPaymentLink,
  InfinitePayError,
  type PaymentLinkItem,
} from "@/lib/infinitepay";
import {
  MAX_FIELD_LENGTH,
  MAX_LINE_ITEMS,
  MAX_QUANTITY_PER_ITEM,
  type CheckoutResponse,
} from "@/types/checkout";
import { findColor, SIZES } from "@/types/product";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        // Teto de tamanho: id e cor entram nas mensagens de erro, e sem
        // limite um corpo de 200 KB devolvia 200 KB ecoados de volta.
        id: z.string().min(1).max(MAX_FIELD_LENGTH),
        size: z.enum(SIZES),
        color: z.string().min(1).max(MAX_FIELD_LENGTH),
        quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_ITEM),
      }),
    )
    .min(1)
    .max(MAX_LINE_ITEMS),
  cep: z.string().min(8).max(9),
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
    const product = getProduct(item.id);

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

    // A cor também é conferida contra o catálogo: aceitar o texto que veio do
    // cliente colocaria uma cor inexistente na ordem de pedido.
    const color = findColor(product, item.color);

    if (!color) {
      return NextResponse.json(
        { error: `Cor ${item.color} indisponível para ${product.name}.` },
        { status: 400 },
      );
    }

    items.push({
      quantity: item.quantity,
      // O preço vem SEMPRE do catálogo. Se viesse do corpo da requisição,
      // bastaria editar o localStorage para comprar qualquer peça por R$ 0,01.
      // A InfinitePay também trabalha em centavos, então não há conversão.
      price: product.priceInCents,
      // `description` é o único campo livre do item: é por ele que a cor e o
      // tamanho chegam até quem vai separar a peça.
      description: `${product.name} — ${color.name} — Tam ${item.size}`,
    });
  }

  const totalInCents = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Área de entrega: o carrinho já checa e bloqueia o botão, mas isso é UI —
  // um POST direto passaria por cima. A decisão que vale é esta.
  const cep = cepDigits(parsed.data.cep);

  try {
    const address = await lookupCep(cep);

    if (!address) {
      return NextResponse.json(
        { error: "CEP não encontrado." },
        { status: 400 },
      );
    }

    if (!isDeliverable(address.city, address.uf)) {
      return NextResponse.json(
        {
          error: `No momento entregamos apenas em ${DELIVERY_AREA_LABEL}.`,
          city: address.city,
          uf: address.uf,
        },
        { status: 422 },
      );
    }
  } catch (cause) {
    // Sem confirmar a cidade não dá para cobrar: seria vender uma entrega que
    // talvez não exista. O carrinho oferece o WhatsApp nesse caso.
    console.error("[checkout] falha ao verificar o CEP:", cause);
    return NextResponse.json(
      { error: "Não foi possível verificar seu CEP agora." },
      { status: 503 },
    );
  }

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
