import { formatCep } from "@/lib/cep";
import { formatPrice } from "@/lib/format-price";
import { formatPhone } from "@/lib/phone";
import type { PendingOrder } from "@/lib/pending-orders";

export function orderItemsSummary(order: PendingOrder): string {
  return order.items
    .map((item) => `${item.quantity}x ${item.name} — ${item.color}, Tam ${item.size}`)
    .join("\n");
}

export function orderAddressSummary(order: PendingOrder): string {
  const { street, number, complement, neighborhood, city, uf, cep } = order.address;
  const line1 = `${street}, ${number}${complement ? ` — ${complement}` : ""}`;
  const line2 = [neighborhood, `${city}/${uf}`].filter(Boolean).join(" — ");

  return `${line1}\n${line2} — CEP ${formatCep(cep)}`;
}

/** Texto que o próprio comprador manda pelo WhatsApp — mesmo padrão do rodapé. */
export function whatsappOrderMessage(order: PendingOrder): string {
  return [
    "Olá! Acabei de finalizar minha compra na FIDÈLE 💗",
    "",
    `Pedido: ${order.orderNsu}`,
    orderItemsSummary(order),
    "",
    "Entrega:",
    orderAddressSummary(order),
    "",
    `Nome: ${order.customer.name}`,
    `Telefone: ${formatPhone(order.customer.phone)}`,
    `Total: ${formatPrice(order.totalInCents)}`,
  ].join("\n");
}
