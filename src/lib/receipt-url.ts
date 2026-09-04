import { isInfinitePayUrl } from "@/lib/infinitepay-hosts";

/**
 * `receipt_url` chega pela querystring do retorno do checkout — texto que
 * qualquer pessoa consegue trocar. Renderizar sem conferir o destino
 * transformaria a tela de confirmação em trampolim de phishing com a cara da
 * loja: o cliente acabou de pagar, confia no que vê e clica.
 */
export function safeReceiptUrl(value: string | undefined): string | null {
  if (!value || !isInfinitePayUrl(value)) return null;
  return new URL(value).toString();
}
