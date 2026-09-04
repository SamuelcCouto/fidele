import { describe, expect, it } from "vitest";
import {
  DELIVERY_AREA_LABEL,
  DELIVERY_CITIES,
  isDeliverable,
  normalizeCityName,
} from "@/config/delivery";

describe("área de entrega", () => {
  it.each(DELIVERY_CITIES)("entrega em %s", (city) => {
    expect(isDeliverable(city, "GO")).toBe(true);
  });

  // O ViaCEP devolve o nome acentuado; uma variação de grafia não pode
  // recusar um cliente que mora na área.
  it.each([
    ["Aparecida de Goiania", "GO"],
    ["APARECIDA DE GOIÂNIA", "GO"],
    ["  goiânia  ", "GO"],
    ["Goiania", "go"],
  ])("aceita a variação de grafia %s/%s", (city, uf) => {
    expect(isDeliverable(city, uf)).toBe(true);
  });

  it.each([
    ["São Paulo", "SP"],
    ["Anápolis", "GO"],
    ["Rio de Janeiro", "RJ"],
    ["", "GO"],
  ])("não entrega em %s/%s", (city, uf) => {
    expect(isDeliverable(city, uf)).toBe(false);
  });

  // Cidade certa, estado errado: existe "Trindade" em PE também.
  it("não entrega em cidade homônima de outro estado", () => {
    expect(isDeliverable("Trindade", "PE")).toBe(false);
  });

  it("normaliza tirando acento e caixa", () => {
    expect(normalizeCityName("Aparecida de Goiânia")).toBe(
      "aparecida de goiania",
    );
  });

  it("o texto mostrado ao cliente lista todas as cidades atendidas", () => {
    for (const city of DELIVERY_CITIES) {
      expect(DELIVERY_AREA_LABEL).toContain(city);
    }
  });
});
