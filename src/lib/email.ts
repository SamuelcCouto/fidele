import { formatCep } from "@/lib/cep";
import { formatPrice } from "@/lib/format-price";
import { formatPhone } from "@/lib/phone";
import type { PaidOrder } from "@/lib/orders";
import type { PendingOrder } from "@/lib/pending-orders";

const RESEND_API = "https://api.resend.com/emails";

export class EmailError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "EmailError";
  }
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Nome, rua e complemento vêm do cliente e viram HTML no corpo do e-mail. */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

function buildHtml(order: PendingOrder, payment: PaidOrder): string {
  const { street, number, complement, neighborhood, city, uf, cep } = order.address;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<li>${item.quantity}x ${escapeHtml(item.name)} — ${escapeHtml(item.color)}, Tam ${escapeHtml(item.size)} — ${formatPrice(item.priceInCents)}</li>`,
    )
    .join("");

  const addressLine = [
    `${escapeHtml(street)}, ${escapeHtml(number)}`,
    complement ? escapeHtml(complement) : null,
    neighborhood ? escapeHtml(neighborhood) : null,
    `${escapeHtml(city)}/${escapeHtml(uf)}`,
    `CEP ${formatCep(cep)}`,
  ]
    .filter(Boolean)
    .join(" — ");

  return `
    <h2>Novo pedido pago — ${escapeHtml(order.orderNsu)}</h2>
    <p><strong>Cliente:</strong> ${escapeHtml(order.customer.name)} — ${formatPhone(order.customer.phone)}</p>
    <p><strong>Entrega:</strong> ${addressLine}</p>
    <p><strong>Itens:</strong></p>
    <ul>${itemsHtml}</ul>
    <p><strong>Total:</strong> ${formatPrice(order.totalInCents)}</p>
    ${payment.installments && payment.installments > 1 ? `<p>${payment.installments}x</p>` : ""}
    ${payment.receiptUrl ? `<p><a href="${escapeHtml(payment.receiptUrl)}">Ver comprovante</a></p>` : ""}
  `.trim();
}

/**
 * Dispara pelo Resend assim que o webhook confirma o pagamento. Best-effort:
 * quem chama decide o que fazer se isto falhar — não deve derrubar a
 * confirmação do pagamento em si.
 */
export async function sendOrderEmail(
  order: PendingOrder,
  payment: PaidOrder,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !to) {
    throw new EmailError(
      "RESEND_API_KEY ou ORDER_NOTIFICATION_EMAIL não configurados.",
    );
  }

  const from = process.env.ORDER_EMAIL_FROM ?? "FIDÈLE <onboarding@resend.dev>";

  const response = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Novo pedido FIDÈLE — ${order.customer.name}`,
      html: buildHtml(order, payment),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new EmailError(`Resend respondeu ${response.status}: ${detail}`);
  }
}
