import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/webhooks/infinitepay/route";
import { resetRateLimit } from "@/lib/rate-limit";

/**
 * O webhook da InfinitePay não é assinado: qualquer um que descubra a URL
 * pode postar "o pedido X foi pago". A garantia toda mora em consultar o
 * payment_check antes de acreditar — é isso que estes testes travam.
 */
function json(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body } as unknown as Response;
}

function mockPaymentCheck(resposta: unknown, ok = true, status = 200) {
  const fetchMock = vi.fn(async (_url: string | URL, _init?: RequestInit) =>
    json(resposta, ok, status),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const NOTIFICACAO = {
  invoice_slug: "abc123",
  transaction_nsu: "00000000-0000-0000-0000-000000000000",
  order_nsu: "pedido-1",
  amount: 13000,
  paid_amount: 13000,
  installments: 1,
  capture_method: "pix",
  receipt_url: "https://comprovante.infinitepay.io/1",
};

let ipSeq = 0;

function post(body: unknown) {
  ipSeq += 1;
  return POST(
    new Request("https://loja.test/api/webhooks/infinitepay", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": `192.0.2.${ipSeq}`,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  vi.unstubAllGlobals();
  resetRateLimit();
  process.env.INFINITEPAY_HANDLE = "loja-de-teste";
  ipSeq = (ipSeq + 10) % 200;
});

describe("POST /api/webhooks/infinitepay", () => {
  it("registra o pagamento quando a InfinitePay confirma", async () => {
    mockPaymentCheck({ success: true, paid: true, amount: 13000 });
    const response = await post(NOTIFICACAO);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      received: true,
      paid: true,
    });
  });

  // Notificação forjada: o corpo diz que foi pago, a InfinitePay diz que não.
  // Quem manda é a InfinitePay.
  it("não aceita notificação forjada como pagamento", async () => {
    mockPaymentCheck({ success: false });
    const response = await post({ ...NOTIFICACAO, order_nsu: "forjado" });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      received: true,
      paid: false,
    });
  });

  // Regressão: quando a cobrança não existe, a API responde só
  // `{"success": false}`, sem o campo `paid`. Exigir esse campo transformava
  // a resposta legítima em erro de contrato — e o 400 fazia a InfinitePay
  // reenviar sem fim.
  it("aceita resposta sem o campo paid sem entrar em laço de retentativa", async () => {
    mockPaymentCheck({ success: false });
    expect((await post(NOTIFICACAO)).status).toBe(200);
  });

  it("confere sempre com a InfinitePay antes de decidir", async () => {
    const fetchMock = mockPaymentCheck({ success: true, paid: true });
    await post(NOTIFICACAO);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("payment_check");
  });

  // 400 é o código que a InfinitePay entende como "reenvie". Só faz sentido
  // quando a falha é nossa e transitória.
  it("pede retentativa quando não consegue confirmar", async () => {
    mockPaymentCheck({}, false, 503);
    expect((await post(NOTIFICACAO)).status).toBe(400);
  });

  it("engole corpo fora do contrato sem pedir retentativa", async () => {
    mockPaymentCheck({ success: true, paid: true });
    const response = await post({ foo: "bar" });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ received: true });
  });

  it("engole corpo que não é JSON", async () => {
    mockPaymentCheck({ success: true, paid: true });
    expect((await post("nao sou json")).status).toBe(200);
  });

  it("limita rajada para não virar amplificador de chamadas de saída", async () => {
    mockPaymentCheck({ success: true, paid: true });

    const chamar = () =>
      POST(
        new Request("https://loja.test/api/webhooks/infinitepay", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": "192.0.2.222",
          },
          body: JSON.stringify(NOTIFICACAO),
        }),
      );

    for (let i = 0; i < 60; i++) {
      expect((await chamar()).status, `notificação ${i + 1}`).toBe(200);
    }

    expect((await chamar()).status).toBe(429);
  });
});
