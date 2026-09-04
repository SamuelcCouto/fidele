import type { NextConfig } from "next";

/**
 * Cabeçalhos de segurança.
 *
 * A Vercel já entrega o Strict-Transport-Security em produção; estes são os
 * que faltavam. Não há Content-Security-Policy: o script de tema roda inline
 * no <head> para o tema salvo não piscar, então uma CSP exigiria nonce por
 * requisição — e uma CSP mal calibrada quebra a loja em silêncio. Fica como
 * próximo passo, com teste dedicado.
 */
const securityHeaders = [
  // Impede o navegador de "adivinhar" o tipo de um arquivo e executá-lo.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Ninguém embute a loja num iframe — fecha clickjacking sobre o carrinho.
  { key: "X-Frame-Options", value: "DENY" },
  // Não vaza a URL completa (com o CEP do cliente, por exemplo) para terceiros.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  // Não anunciar o framework: é reconhecimento grátis para quem procura alvo.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
