const RECEIPT_HOSTS = ["infinitepay.io", "infinitepay.com.br"];

/**
 * `receipt_url` chega pela querystring do retorno do checkout — texto que
 * qualquer pessoa consegue trocar. Renderizar sem conferir o destino
 * transformaria a tela de confirmação em trampolim de phishing com a cara da
 * loja: o cliente acabou de pagar, confia no que vê e clica.
 *
 * Só https em domínio da InfinitePay passa. Note o ponto em `.${host}`: sem
 * ele, "infinitepay.io.golpe.com" seria aceito.
 */
export function safeReceiptUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;

    const trusted = RECEIPT_HOSTS.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );

    return trusted ? url.toString() : null;
  } catch {
    return null;
  }
}
