/**
 * Ponto único onde um pedido pago é registrado.
 *
 * A loja ainda não tem banco de dados, então hoje isto é só um log — o
 * registro de verdade continua sendo o painel da InfinitePay. A função existe
 * mesmo assim para que a confirmação de pagamento tenha um lugar só: quando
 * houver persistência, muda este arquivo e nada mais.
 *
 * TODO: gravar o pedido (order_nsu, itens, comprador, status) e disparar o
 * aviso de separação. Sem isso, `order_nsu` é um identificador que não aponta
 * para lugar nenhum e a chegada duplicada de um webhook não é detectável.
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
}
