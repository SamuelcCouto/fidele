import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EmailError, sendOrderEmail } from "@/lib/email";
import type { PaidOrder } from "@/lib/orders";
import type { PendingOrder } from "@/lib/pending-orders";

function json(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body, text: async () => JSON.stringify(body) } as unknown as Response;
}

const PEDIDO: PendingOrder = {
  orderNsu: "pedido-1",
  createdAt: "2026-09-16T12:00:00.000Z",
  customer: { name: "Maria Silva", phone: "62992210708" },
  address: {
    cep: "74473813",
    street: "Rua das Flores",
    number: "123",
    neighborhood: "Setor Central",
    city: "Goiânia",
    uf: "GO",
  },
  items: [
    {
      name: "Camisa Marco 23",
      color: "Branco",
      size: "P",
      quantity: 2,
      priceInCents: 11_500,
    },
  ],
  totalInCents: 23_000,
};

const PAGAMENTO: PaidOrder = {
  orderNsu: "pedido-1",
  transactionNsu: "tx-1",
  slug: "abc123",
  receiptUrl: "https://comprovante.infinitepay.io/1",
};

beforeEach(() => {
  vi.unstubAllGlobals();
  process.env.RESEND_API_KEY = "re_teste";
  process.env.ORDER_NOTIFICATION_EMAIL = "lealrodrigues2003@icloud.com";
  delete process.env.ORDER_EMAIL_FROM;
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.RESEND_API_KEY;
  delete process.env.ORDER_NOTIFICATION_EMAIL;
  delete process.env.ORDER_EMAIL_FROM;
});

describe("sendOrderEmail", () => {
  it("recusa sem RESEND_API_KEY", async () => {
    delete process.env.RESEND_API_KEY;
    vi.stubGlobal("fetch", vi.fn());
    await expect(sendOrderEmail(PEDIDO, PAGAMENTO)).rejects.toBeInstanceOf(
      EmailError,
    );
  });

  it("recusa sem ORDER_NOTIFICATION_EMAIL", async () => {
    delete process.env.ORDER_NOTIFICATION_EMAIL;
    vi.stubGlobal("fetch", vi.fn());
    await expect(sendOrderEmail(PEDIDO, PAGAMENTO)).rejects.toBeInstanceOf(
      EmailError,
    );
  });

  it("manda para o Resend com remetente, destinatário e itens do pedido", async () => {
    const fetchMock = vi.fn(async () => json({ id: "email-1" }));
    vi.stubGlobal("fetch", fetchMock);

    await sendOrderEmail(PEDIDO, PAGAMENTO);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers).toMatchObject({
      Authorization: "Bearer re_teste",
    });

    const body = JSON.parse(String(init.body));
    expect(body.to).toBe("lealrodrigues2003@icloud.com");
    expect(body.from).toBe("FIDÈLE <onboarding@resend.dev>");
    expect(body.html).toContain("Camisa Marco 23");
    expect(body.html).toContain("Maria Silva");
    expect(body.html).toContain("Rua das Flores");
    expect(body.html).toContain(PAGAMENTO.receiptUrl);
  });

  it("usa o remetente customizado quando configurado", async () => {
    process.env.ORDER_EMAIL_FROM = "FIDÈLE <pedidos@fideleoficial.com.br>";
    const fetchMock = vi.fn(async () => json({ id: "email-1" }));
    vi.stubGlobal("fetch", fetchMock);

    await sendOrderEmail(PEDIDO, PAGAMENTO);

    const body = JSON.parse(
      String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body),
    );
    expect(body.from).toBe("FIDÈLE <pedidos@fideleoficial.com.br>");
  });

  it("escapa HTML no nome do cliente", async () => {
    const fetchMock = vi.fn(async () => json({ id: "email-1" }));
    vi.stubGlobal("fetch", fetchMock);

    await sendOrderEmail(
      { ...PEDIDO, customer: { ...PEDIDO.customer, name: '<img src=x onerror=alert(1)>' } },
      PAGAMENTO,
    );

    const body = JSON.parse(
      String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body),
    );
    expect(body.html).not.toContain("<img");
    expect(body.html).toContain("&lt;img");
  });

  it("propaga erro quando o Resend recusa", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ message: "inválido" }, false, 422)));
    await expect(sendOrderEmail(PEDIDO, PAGAMENTO)).rejects.toBeInstanceOf(
      EmailError,
    );
  });
});
