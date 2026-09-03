import { NextResponse } from "next/server";
import { z } from "zod";
import { checkPayment } from "@/lib/infinitepay";
import { recordPaidOrder } from "@/lib/orders";

/**
 * Webhook de pagamento da InfinitePay.
 *
 * A notificação NÃO é assinada: qualquer pessoa que descubra esta URL pode
 * postar "pedido X foi pago". Por isso o corpo aqui serve apenas para saber
 * *qual* cobrança conferir — quem responde se ela foi paga é a própria
 * InfinitePay, via `payment_check`. Nada do corpo vira verdade sem essa volta.
 *
 * Contrato de resposta esperado pela InfinitePay: 200 encerra a entrega,
 * 400 pede retentativa.
 */
const webhookSchema = z.object({
  invoice_slug: z.string().min(1),
  transaction_nsu: z.string().min(1),
  order_nsu: z.string().min(1),
  amount: z.number().optional(),
  paid_amount: z.number().optional(),
  installments: z.number().optional(),
  capture_method: z.string().optional(),
  receipt_url: z.string().optional(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    // Corpo ilegível não melhora com retentativa.
    return NextResponse.json({ error: "JSON inválido." }, { status: 200 });
  }

  const parsed = webhookSchema.safeParse(payload);
  if (!parsed.success) {
    console.warn("[webhook] corpo fora do contrato, ignorado.");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const notification = parsed.data;

  try {
    const payment = await checkPayment({
      orderNsu: notification.order_nsu,
      transactionNsu: notification.transaction_nsu,
      slug: notification.invoice_slug,
    });

    if (!payment.success || !payment.paid) {
      // Verificado e não pago: ou a cobrança ainda não liquidou, ou a
      // notificação é forjada. Nos dois casos não há o que registrar, e pedir
      // retentativa só criaria laço — a tela de retorno confere de novo.
      console.warn(
        `[webhook] ${notification.order_nsu} não consta como pago na InfinitePay.`,
      );
      return NextResponse.json({ received: true, paid: false }, { status: 200 });
    }

    if (
      notification.amount !== undefined &&
      payment.amount !== undefined &&
      notification.amount !== payment.amount
    ) {
      // O valor que vale é o da consulta; a divergência fica registrada.
      console.warn(
        `[webhook] ${notification.order_nsu}: corpo diz ${notification.amount}, ` +
          `InfinitePay diz ${payment.amount}.`,
      );
    }

    await recordPaidOrder({
      orderNsu: notification.order_nsu,
      transactionNsu: notification.transaction_nsu,
      slug: notification.invoice_slug,
      amountInCents: payment.amount,
      paidAmountInCents: payment.paid_amount,
      installments: payment.installments,
      captureMethod: payment.capture_method,
      receiptUrl: notification.receipt_url,
    });

    return NextResponse.json({ received: true, paid: true });
  } catch (cause) {
    // Não deu para confirmar (rede, timeout, instabilidade): 400 para a
    // InfinitePay reenviar. Perder a notificação seria pior.
    console.error(
      `[webhook] falha ao confirmar ${notification.order_nsu}:`,
      cause,
    );
    return NextResponse.json(
      { error: "Não foi possível confirmar o pagamento." },
      { status: 400 },
    );
  }
}
