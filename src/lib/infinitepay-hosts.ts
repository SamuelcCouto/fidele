const INFINITEPAY_HOSTS = ["infinitepay.io", "infinitepay.com.br"];

/**
 * Confere se uma URL aponta mesmo para a InfinitePay.
 *
 * Note o ponto em `.${host}`: sem ele, "infinitepay.io.site-do-golpe.com"
 * passaria, porque termina com a string "infinitepay.io".
 */
export function isInfinitePayUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;

    return INFINITEPAY_HOSTS.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}
