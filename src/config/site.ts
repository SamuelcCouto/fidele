export const siteConfig = {
  name: "FIDÈLE",
  title: "FIDÈLE — Loja Oficial",
  description: "Peças pensadas com exclusividade, tecido premium e atitude.",
  whatsapp: "5562992210708",
  instagram: "fideleoficial",
} as const;

export const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}`;
export const instagramUrl = `https://www.instagram.com/${siteConfig.instagram}/`;

/** Abre a conversa com a mensagem já escrita, para o cliente só apertar enviar. */
export function whatsappUrlWithText(text: string): string {
  return `${whatsappUrl}?text=${encodeURIComponent(text)}`;
}

/**
 * Endereços que a InfinitePay recebe no momento da cobrança. Ficam aqui para
 * a rota de checkout e as telas de retorno não divergirem em silêncio.
 */
export const checkoutRoutes = {
  /** `redirect_url`: para onde o comprador volta depois de pagar. */
  return: "/pedido/confirmado",
  /** `webhook_url`: notificação servidor-a-servidor. */
  webhook: "/api/webhooks/infinitepay",
} as const;
