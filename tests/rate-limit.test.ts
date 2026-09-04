import { beforeEach, describe, expect, it } from "vitest";
import { clientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit";

const REGRA = [{ limit: 3, windowMs: 60_000 }];

describe("rateLimit", () => {
  beforeEach(resetRateLimit);

  it("libera até o teto e bloqueia depois", () => {
    for (let i = 0; i < 3; i++) {
      expect(rateLimit("ip-a", REGRA).ok, `chamada ${i + 1}`).toBe(true);
    }
    expect(rateLimit("ip-a", REGRA).ok).toBe(false);
  });

  it("conta cada identidade separadamente", () => {
    for (let i = 0; i < 3; i++) rateLimit("ip-a", REGRA);
    expect(rateLimit("ip-b", REGRA).ok).toBe(true);
  });

  it("libera de novo quando a janela passa", () => {
    const agora = 1_000_000;
    for (let i = 0; i < 3; i++) rateLimit("ip-c", REGRA, agora);
    expect(rateLimit("ip-c", REGRA, agora).ok).toBe(false);
    expect(rateLimit("ip-c", REGRA, agora + 60_001).ok).toBe(true);
  });

  it("informa quantos segundos faltam", () => {
    const agora = 1_000_000;
    for (let i = 0; i < 3; i++) rateLimit("ip-d", REGRA, agora);
    const bloqueado = rateLimit("ip-d", REGRA, agora + 20_000);
    expect(bloqueado.ok).toBe(false);
    expect(bloqueado.retryAfterSeconds).toBe(40);
  });

  // Sem isto, estourar a janela de 1 minuto queimaria crédito da de 1 hora, e
  // quem levasse um bloqueio curto ficaria bloqueado o resto da hora.
  it("bloqueio da janela curta não consome a janela longa", () => {
    const regras = [
      { limit: 2, windowMs: 60_000 },
      { limit: 10, windowMs: 3_600_000 },
    ];
    let agora = 1_000_000;

    // Rajada de 20 na primeira janela: 2 passam, 18 são recusadas — e só as
    // 2 que passaram são cobradas da janela longa.
    for (let i = 0; i < 20; i++) rateLimit("ip-e", regras, agora);

    // Quatro janelas curtas seguintes, 2 por janela: total de 10 na longa.
    for (let janela = 0; janela < 4; janela++) {
      agora += 60_001;
      expect(rateLimit("ip-e", regras, agora).ok, `janela ${janela} #1`).toBe(true);
      expect(rateLimit("ip-e", regras, agora).ok, `janela ${janela} #2`).toBe(true);
      expect(rateLimit("ip-e", regras, agora).ok, `janela ${janela} #3`).toBe(false);
    }

    // Janela curta zerada de novo, mas a longa chegou ao teto de 10.
    agora += 60_001;
    expect(rateLimit("ip-e", regras, agora).ok).toBe(false);
  });
});

describe("clientIp", () => {
  it("usa o primeiro valor de x-forwarded-for", () => {
    const request = new Request("https://exemplo.com", {
      headers: { "x-forwarded-for": "203.0.113.9, 70.41.3.18" },
    });
    expect(clientIp(request)).toBe("203.0.113.9");
  });

  it("cai para x-real-ip", () => {
    const request = new Request("https://exemplo.com", {
      headers: { "x-real-ip": "198.51.100.4" },
    });
    expect(clientIp(request)).toBe("198.51.100.4");
  });

  it("não quebra sem nenhum cabeçalho", () => {
    expect(clientIp(new Request("https://exemplo.com"))).toBe("desconhecido");
  });
});
