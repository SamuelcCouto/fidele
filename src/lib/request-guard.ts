import { NextResponse } from "next/server";

/**
 * Barreira contra CSRF nas rotas JSON.
 *
 * O problema encontrado na auditoria: a rota lia o corpo com `request.json()`
 * sem olhar o Content-Type. Um formulário escondido em qualquer site
 * conseguia postar em /api/checkout com `enctype="text/plain"` e o corpo era
 * processado — cada visitante daquele site virava uma cobrança nova na conta
 * da loja, cada um com o próprio IP, contornando o limitador por IP.
 *
 * Duas travas, nesta ordem:
 *
 * 1. Content-Type tem de ser application/json. O navegador não deixa um
 *    formulário cross-site usar esse tipo sem antes fazer um preflight, e o
 *    preflight morre porque a loja não devolve nenhum cabeçalho CORS.
 * 2. Se vier Origin — e o navegador manda em todo POST —, o host tem de ser
 *    o da própria loja.
 *
 * Requisição sem Origin (curl, servidor a servidor) passa na segunda trava de
 * propósito: sem navegador não existe CSRF, porque não há sessão de vítima
 * para ser usada.
 */
export function rejectCrossSiteRequest(request: Request): NextResponse | null {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().split(";")[0]?.trim().endsWith("/json")) {
    return NextResponse.json(
      { error: "Content-Type deve ser application/json." },
      { status: 415 },
    );
  }

  const origin = request.headers.get("origin");
  if (origin && !isSameHost(origin, request)) {
    return NextResponse.json({ error: "Origem não autorizada." }, { status: 403 });
  }

  return null;
}

function isSameHost(origin: string, request: Request): boolean {
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    // "null" é o que o navegador manda de um iframe em sandbox.
    return false;
  }

  const hostHeader = request.headers.get("host");
  if (hostHeader && hostHeader === originHost) return true;

  try {
    return new URL(request.url).host === originHost;
  } catch {
    return false;
  }
}
