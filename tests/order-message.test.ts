import { describe, expect, it } from "vitest";
import { whatsappOrderMessage } from "@/lib/order-message";
import type { PendingOrder } from "@/lib/pending-orders";

const PEDIDO: PendingOrder = {
  orderNsu: "pedido-1",
  createdAt: "2026-09-16T12:00:00.000Z",
  customer: { name: "Maria Silva", phone: "62992210708" },
  address: {
    cep: "74473813",
    street: "Rua das Flores",
    number: "123",
    complement: "Apto 12",
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

describe("whatsappOrderMessage", () => {
  it("inclui pedido, itens, endereço completo e contato", () => {
    // O Intl usa espaço não-quebrável entre "R$" e o número.
    const message = whatsappOrderMessage(PEDIDO).replace(/ /g, " ");

    expect(message).toContain("pedido-1");
    expect(message).toContain("2x Camisa Marco 23 — Branco, Tam P");
    expect(message).toContain("Rua das Flores, 123 — Apto 12");
    expect(message).toContain("Setor Central — Goiânia/GO");
    expect(message).toContain("CEP 74473-813");
    expect(message).toContain("Maria Silva");
    expect(message).toContain("(62) 99221-0708");
    expect(message).toContain("R$ 230,00");
  });
});
