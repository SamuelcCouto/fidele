import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPendingOrder, savePendingOrder } from "@/lib/pending-orders";

// vi.mock é reordenado para o topo do módulo: as variáveis que a fábrica usa
// precisam vir de vi.hoisted, senão o acesso cai antes de existirem.
const { kvSet, kvGet } = vi.hoisted(() => ({ kvSet: vi.fn(), kvGet: vi.fn() }));

vi.mock("@/lib/kv", () => ({ kvSet, kvGet }));

const PEDIDO = {
  orderNsu: "pedido-1",
  createdAt: "2026-09-16T12:00:00.000Z",
  customer: { name: "Maria Silva", phone: "62992210708" },
  address: {
    cep: "74473813",
    street: "Rua das Flores",
    number: "123",
    city: "Goiânia",
    uf: "GO",
  },
  items: [
    { name: "Camisa Marco 23", color: "Branco", size: "P", quantity: 1, priceInCents: 11_500 },
  ],
  totalInCents: 11_500,
};

beforeEach(() => {
  kvSet.mockReset();
  kvGet.mockReset();
});

describe("savePendingOrder", () => {
  it("salva com a chave prefixada e TTL de uma semana", async () => {
    await savePendingOrder(PEDIDO);

    expect(kvSet).toHaveBeenCalledWith(
      "pending-order:pedido-1",
      JSON.stringify(PEDIDO),
      7 * 24 * 60 * 60,
    );
  });
});

describe("getPendingOrder", () => {
  it("devolve o pedido salvo", async () => {
    kvGet.mockResolvedValue(JSON.stringify(PEDIDO));
    expect(await getPendingOrder("pedido-1")).toEqual(PEDIDO);
  });

  it("devolve null quando não há nada salvo", async () => {
    kvGet.mockResolvedValue(null);
    expect(await getPendingOrder("pedido-inexistente")).toBeNull();
  });

  it("devolve null quando o conteúdo salvo não é JSON válido", async () => {
    kvGet.mockResolvedValue("isso não é json");
    expect(await getPendingOrder("pedido-1")).toBeNull();
  });
});
