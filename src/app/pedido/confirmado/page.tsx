import type { Metadata } from "next";
import Link from "next/link";
import { ClearCartOnPaid } from "@/components/cart/clear-cart-on-paid";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/config/site";
import { checkPayment } from "@/lib/infinitepay";
import { safeReceiptUrl } from "@/lib/receipt-url";
import { firstParam, type QueryValue } from "@/lib/search-params";
import s from "@/app/status.module.css";

export const metadata: Metadata = {
  title: "Seu pedido",
  // Tela de transação: não deve entrar em busca nem ser compartilhada.
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  order_nsu?: QueryValue;
  transaction_nsu?: QueryValue;
  slug?: QueryValue;
  capture_method?: QueryValue;
  receipt_url?: QueryValue;
}>;

export default async function OrderReturnPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  // Parâmetro repetido na URL chega como array; só o primeiro valor conta.
  const orderNsu = firstParam(params.order_nsu);
  const transactionNsu = firstParam(params.transaction_nsu);
  const slug = firstParam(params.slug);
  const receiptUrl = safeReceiptUrl(firstParam(params.receipt_url));

  // A volta do checkout não prova pagamento: os parâmetros vêm na URL e são
  // editáveis. Quem decide é a InfinitePay, consultada aqui no servidor.
  let status: "paid" | "pending" | "unknown" = "unknown";

  if (orderNsu && transactionNsu && slug) {
    try {
      const payment = await checkPayment({
        orderNsu,
        transactionNsu,
        slug,
      });

      status = payment.success && payment.paid ? "paid" : "pending";
    } catch (cause) {
      console.error("[retorno] falha ao confirmar pagamento:", cause);
      status = "unknown";
    }
  }

  return (
    <main className={s.main}>
      {status === "paid" && <ClearCartOnPaid />}

      {status === "paid" && (
        <>
          <h1 className={s.title}>
            Pagamento <em>confirmado</em>
          </h1>
          <p className={s.text}>
            Recebemos seu pedido e ele já está na fila de separação. A gente
            entra em contato pelo WhatsApp para combinar a entrega.
          </p>
        </>
      )}

      {status === "pending" && (
        <>
          <h1 className={s.title}>
            Pagamento <em>em análise</em>
          </h1>
          <p className={s.text}>
            Ainda não recebemos a confirmação da InfinitePay. Se você acabou de
            pagar, é normal levar alguns instantes — assim que cair, a gente te
            chama no WhatsApp.
          </p>
        </>
      )}

      {status === "unknown" && (
        <>
          <h1 className={s.title}>
            Não conseguimos <em>conferir</em>
          </h1>
          <p className={s.text}>
            Seu pagamento pode ter sido concluído normalmente, mas não
            conseguimos confirmar agora. Antes de tentar pagar de novo, fale com
            a gente no WhatsApp.
          </p>
        </>
      )}

      <div className={s.actions}>
        <Link href="/#produtos">
          <Button variant="solid">Voltar para a loja</Button>
        </Link>

        {receiptUrl && (
          <a href={receiptUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">Ver comprovante</Button>
          </a>
        )}

        {status !== "paid" && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">Falar no WhatsApp</Button>
          </a>
        )}
      </div>
    </main>
  );
}
