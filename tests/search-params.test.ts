import { describe, expect, it } from "vitest";
import { firstParam } from "@/lib/search-params";

describe("firstParam", () => {
  it("devolve a string quando o parâmetro veio uma vez só", () => {
    expect(firstParam("eva")).toBe("eva");
  });

  // Regressão: `?q=a&q=b` chega como array. O tipo declarado dizia `string`,
  // o `.trim()` seguinte quebrava, e a busca devolvia 500 para qualquer um
  // que repetisse o parâmetro na URL.
  it("devolve o primeiro valor quando o parâmetro foi repetido", () => {
    expect(firstParam(["eva", "marco"])).toBe("eva");
  });

  it("devolve undefined para array vazio", () => {
    expect(firstParam([])).toBeUndefined();
  });

  it("devolve undefined quando o parâmetro não veio", () => {
    expect(firstParam(undefined)).toBeUndefined();
  });

  it("o resultado é sempre string ou undefined — nunca array", () => {
    for (const entrada of ["a", ["a", "b"], [], undefined]) {
      const saida = firstParam(entrada);
      expect(saida === undefined || typeof saida === "string").toBe(true);
    }
  });
});
