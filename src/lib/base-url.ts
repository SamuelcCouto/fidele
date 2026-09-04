/**
 * URL pública da loja. A InfinitePay precisa dela para montar o `redirect_url`
 * e o `webhook_url` — links absolutos, que ela mesma vai acessar de fora.
 */
export function getBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  // Deploys de preview na Vercel, quando a variável não foi definida à mão.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}

/**
 * Em `next dev` a loja é `http://localhost:3000`: a InfinitePay não consegue
 * chamar o webhook de lá. Anunciar um endereço inalcançável só gera retentativa
 * perdida do lado dela, então nesse caso o campo simplesmente não é enviado.
 */
export function isPubliclyReachable(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== "https:") return false;

    return (
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      !hostname.endsWith(".local")
    );
  } catch {
    return false;
  }
}
