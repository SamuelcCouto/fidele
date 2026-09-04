import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy — sem nonce, de propósito.
 *
 * A documentação do Next 16 é explícita: CSP com nonce exige renderização
 * dinâmica em TODAS as páginas. Isso apagaria as 16 páginas de produto
 * pré-renderizadas, tiraria o cache de CDN e faria cada visita passar pelo
 * servidor — loja mais lenta e mais cara, em troca de proteção contra um
 * cenário que esta loja não tem: não há conteúdo enviado por usuário em
 * lugar nenhum, e o React escapa tudo que é renderizado (verificado).
 *
 * O que 'unsafe-inline' custa: um script injetado inline rodaria. O que a
 * política ainda garante, e é o ganho real aqui: script de origem externa
 * bloqueado, nada de <object>/<embed>, página não pode ser embutida em
 * iframe, formulário não pode postar para fora, e <base> não pode ser
 * sequestrado para reescrever URLs relativas.
 *
 * Se um dia houver campo de texto que outra pessoa lê — avaliação de produto,
 * comentário —, a conta inverte e vale migrar para nonce.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  // next/font baixa as fontes do Google em tempo de build e as serve daqui.
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Em desenvolvimento o Next usa websocket para recarregar a página.
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  // Só em produção: em localhost isso forçaria https e quebraria o dev.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Impede o navegador de "adivinhar" o tipo de um arquivo e executá-lo.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Redundante com frame-ancestors, mas cobre navegador antigo sem CSP.
  { key: "X-Frame-Options", value: "DENY" },
  // Não vaza a URL completa (com o CEP do cliente, por exemplo) para fora.
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
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Resposta de API carrega dado do cliente (o CEP, a cidade dele).
        // O padrão do Next é "public, max-age=0, must-revalidate", que
        // autoriza cache compartilhado a guardar uma cópia.
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
