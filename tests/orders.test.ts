import { beforeEach, describe, expect, it, vi } from "vitest";
import { recordPaidOrder } from "@/lib/orders";
import type { PendingOrder } from "@/lib/pending-orders";

const { getPendingOrder } = vi.hoisted(() => ({ getPendingOrder: vi.fn() }));
const { sendOrderEmail } = vi.hoisted(() => ({ sendOrderEmail: vi.fn() }));

vi.mock("@/lib/pending-orders", () => ({ getPendingOrder }));
vi.mock("@/lib/email", () => ({ sendOrderEmail }));

const PAGAMENTO = {
  orderNsu: "pedido-1",
  transactionNsu: "tx-1",
  slug: "abc123",
};

const PEDIDO_PENDENTE: PendingOrder = {
  orderNsu: "pedido-1",
  createdAt: "2026-09-16T12:00:00.000Z",
  customer: { name: "Maria Silva", phone: "62992210708" },
  address: { cep: "74473813", street: "Rua das Flores", number: "123", city: "Goiânia", uf: "GO" },
  items: [],
  totalInCents: 11_500,
};

beforeEach(() => {
  getPendingOrder.mockReset();
  sendOrderEmail.mockReset();
});

describe("recordPaidOrder", () => {
  it("manda o e-mail quando encontra o pedido salvo", async () => {
    getPendingOrder.mockResolvedValue(PEDIDO_PENDENTE);
    sendOrderEmail.mockResolvedValue(undefined);

    await recordPaidOrder(PAGAMENTO);

    expect(sendOrderEmail).toHaveBeenCalledWith(PEDIDO_PENDENTE, PAGAMENTO);
  });

  it("não tenta mandar e-mail quando não há pedido salvo", async () => {
    getPendingOrder.mockResolvedValue(null);

    await recordPaidOrder(PAGAMENTO);

    expect(sendOrderEmail).not.toHaveBeenCalled();
  });

  it("não deixa vazar erro de leitura do pedido pendente", async () => {
    getPendingOrder.mockRejectedValue(new Error("Redis fora do ar"));

    await expect(recordPaidOrder(PAGAMENTO)).resolves.toBeUndefined();
    expect(sendOrderEmail).not.toHaveBeenCalled();
  });

  it("não deixa vazar erro de envio do e-mail", async () => {
    getPendingOrder.mockResolvedValue(PEDIDO_PENDENTE);
    sendOrderEmail.mockRejectedValue(new Error("Resend fora do ar"));

    await expect(recordPaidOrder(PAGAMENTO)).resolves.toBeUndefined();
  });
});
