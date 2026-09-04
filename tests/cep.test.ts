import { afterEach, describe, expect, it, vi } from "vitest";
import { CepLookupError, cepDigits, formatCep, isCompleteCep, lookupCep } from "@/lib/cep";

function respondeCom(body: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  } as unknown as Response);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("formatação de CEP", () => {
  it.each([
    ["74473813", "74473-813"],
    ["74473-813", "74473-813"],
    [" 74473 813 ", "74473-813"],
    ["7447", "7447"],
  ])("formata %s como %s", (entrada, esperado) => {
    expect(formatCep(entrada)).toBe(esperado);
  });

  it("descarta o que não é dígito e corta em oito", () => {
    expect(cepDigits("abc74473813999")).toBe("74473813");
  });

  it("reconhece CEP completo", () => {
    expect(isCompleteCep("74473-813")).toBe(true);
    expect(isCompleteCep("7447381")).toBe(false);
  });
});

describe("lookupCep", () => {
  it("devolve cidade e UF", async () => {
    vi.stubGlobal(
      "fetch",
      respondeCom({ cep: "74473-813", localidade: "Goiânia", uf: "GO", bairro: "Setor" }),
    );
    await expect(lookupCep("74473813")).resolves.toEqual({
      cep: "74473813",
      city: "Goiânia",
      uf: "GO",
      neighborhood: "Setor",
    });
  });

  // O ViaCEP devolve `erro` ora booleano, ora string — comprovado consultando
  // a API de verdade. Os dois têm de significar "CEP não existe".
  it.each([true, "true"])("trata erro:%s como CEP inexistente", async (erro) => {
    vi.stubGlobal("fetch", respondeCom({ erro }));
    await expect(lookupCep("99999999")).resolves.toBeNull();
  });

  // Não é "CEP inexistente": tratar como tal recusaria um cliente válido.
  it("trata 200 sem cidade como falha, não como inexistente", async () => {
    vi.stubGlobal("fetch", respondeCom({ cep: "74473-813" }));
    await expect(lookupCep("74473813")).rejects.toBeInstanceOf(CepLookupError);
  });

  it("trata erro HTTP como falha", async () => {
    vi.stubGlobal("fetch", respondeCom({}, false, 503));
    await expect(lookupCep("74473813")).rejects.toBeInstanceOf(CepLookupError);
  });

  it("trata queda de rede como falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(lookupCep("74473813")).rejects.toBeInstanceOf(CepLookupError);
  });

  it("recusa CEP incompleto sem chamar a rede", async () => {
    const fetchSpy = respondeCom({});
    vi.stubGlobal("fetch", fetchSpy);
    await expect(lookupCep("7447")).rejects.toBeInstanceOf(CepLookupError);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
