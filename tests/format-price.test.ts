import { describe, expect, it } from "vitest";
import { formatInstallments, formatPrice } from "@/lib/format-price";
import { allProducts } from "@/lib/catalog";

describe("formatPrice", () => {
  it.each([
    [13000, "R$ 130,00"],
    [10000, "R$ 100,00"],
    [1, "R$ 0,01"],
    [0, "R$ 0,00"],
  ])("formata %i centavos como %s", (centavos, esperado) => {
    // O Intl usa espaço não-quebrável entre "R$" e o número.
    expect(formatPrice(centavos).replace(/ /g, " ")).toBe(esperado);
  });
});

describe("formatInstallments", () => {
  it("arredonda a parcela para baixo", () => {
    expect(formatInstallments(10000).replace(/ /g, " ")).toBe(
      "ou 3x de R$ 33,33 sem juros",
    );
  });
});

describe("catálogo", () => {
  it("todo preço é inteiro positivo em centavos", () => {
    for (const product of allProducts()) {
      expect(Number.isInteger(product.priceInCents), product.id).toBe(true);
      expect(product.priceInCents, product.id).toBeGreaterThan(0);
    }
  });

  it("todo produto tem ao menos uma cor e um tamanho", () => {
    for (const product of allProducts()) {
      expect(product.colors.length, product.id).toBeGreaterThan(0);
      expect(product.sizes.length, product.id).toBeGreaterThan(0);
    }
  });

  it("nenhum produto repete nome de cor", () => {
    for (const product of allProducts()) {
      const names = product.colors.map((color) => color.name);
      expect(new Set(names).size, product.id).toBe(names.length);
    }
  });
});
