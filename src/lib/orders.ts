import { sendOrderEmail } from "@/lib/email";
import { getPendingOrder } from "@/lib/pending-orders";

/**
 * Ponto único onde um pedido pago é registrado.
 *
 * A loja ainda não tem banco de dados de pedidos, então o registro de
 * verdade continua sendo o painel da InfinitePay — isto só dispara o aviso
 * de separação a partir do que o checkout guardou no Redis (`pending-orders`)
 * quando o link de pagamento foi criado.
 */
export interface PaidOrder {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
  /** Valor cobrado, em centavos. */
  amountInCents?: number;
  /** Valor efetivamente pago — maior que o cobrado quando há juros. */
  paidAmountInCents?: number;
  installments?: number;
  captureMethod?: string;
  receiptUrl?: string;
}

export async function recordPaidOrder(order: PaidOrder): Promise<void> {
  console.info(
    `[pedido pago] ${order.orderNsu} — ${order.captureMethod ?? "?"}, ` +
      `${order.installments ?? 1}x, transação ${order.transactionNsu}`,
  );

  let pending;
  try {
    pending = await getPendingOrder(order.orderNsu);
  } catch (cause) {
    console.error(
      `[pedido pago] ${order.orderNsu}: falha ao buscar os dados do pedido:`,
      cause,
    );
    return;
  }

  if (!pending) {
    // TTL vencido, falha ao salvar na criação, ou notificação de um pedido de
    // antes desta funcionalidade existir — nos três casos não há o que enviar.
    console.warn(
      `[pedido pago] ${order.orderNsu}: sem dados salvos do pedido, aviso não enviado.`,
    );
    return;
  }

  try {
    await sendOrderEmail(pending, order);
  } catch (cause) {
    console.error(
      `[pedido pago] ${order.orderNsu}: falha ao enviar o e-mail da ordem de serviço:`,
      cause,
    );
  }
}
