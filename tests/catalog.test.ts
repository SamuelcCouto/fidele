import { describe, expect, it } from "vitest";
import {
  catalogItems,
  catalogSlugs,
  getProduct,
  resolveSlug,
  searchCatalog,
} from "@/lib/catalog";

describe("getProduct", () => {
  it("encontra produto existente", () => {
    expect(getProduct("marco")?.name).toBe("Camisa Marco 23");
  });

  it("devolve undefined para produto inexistente", () => {
    expect(getProduct("nao-existe")).toBeUndefined();
  });

  // Regressão: `productsData["__proto__"]` devolvia o Object.prototype, que é
  // truthy, e o código seguinte quebrava com 500 em rota pública.
  it.each([
    "__proto__",
    "constructor",
    "toString",
    "valueOf",
    "hasOwnProperty",
    "isPrototypeOf",
  ])("não trata a chave herdada %s como produto", (key) => {
    expect(getProduct(key)).toBeUndefined();
  });
});

describe("resolveSlug", () => {
  it("resolve o slug base com a primeira cor", () => {
    expect(resolveSlug("marco")).toMatchObject({
      product: { id: "marco" },
      color: { name: "Cinza" },
    });
  });

  it("resolve a variação de cor", () => {
    expect(resolveSlug("marco-branco")?.color.name).toBe("Branco");
  });

  it("resolve cor com acento pelo slug sem acento", () => {
    expect(resolveSlug("eva-terracota")?.color.name).toBe("Terracota");
  });

  it("recusa cor que não pertence ao produto", () => {
    expect(resolveSlug("marco-terracota")).toBeNull();
  });

  it("recusa slug inventado", () => {
    expect(resolveSlug("nao-existe")).toBeNull();
  });

  it.each(["__proto__", "constructor", "toString"])(
    "recusa a chave herdada %s",
    (key) => {
      expect(resolveSlug(key)).toBeNull();
    },
  );
});

describe("catálogo", () => {
  it("gera um card por cor", () => {
    const items = catalogItems();
    const marco = items.filter((item) => item.product.id === "marco");
    expect(marco).toHaveLength(2);
    expect(marco.map((item) => item.title)).toEqual([
      "Camisa Marco 23 Cinza",
      "Camisa Marco 23 Branco",
    ]);
  });

  it("não põe a cor no título de produto de cor única", () => {
    const ciclo = catalogItems().find((item) => item.product.id === "ciclo");
    expect(ciclo?.title).toBe("Regata Ciclo");
    expect(ciclo?.href).toBe("/ciclo");
  });

  it("todo slug gerado é resolvível — nenhum card leva a 404", () => {
    for (const slug of catalogSlugs()) {
      expect(resolveSlug(slug), `slug ${slug}`).not.toBeNull();
    }
  });

  it("todo href da vitrine é um slug pré-renderizado", () => {
    const slugs = new Set(catalogSlugs());
    for (const item of catalogItems()) {
      expect(slugs.has(item.href.slice(1)), `href ${item.href}`).toBe(true);
    }
  });

  it("a capa de cada cor é a primeira foto dela", () => {
    for (const item of catalogItems()) {
      expect(item.image).toBe(item.color.images[0]);
    }
  });

  it("toda foto referenciada tem caminho de imagem válido", () => {
    for (const item of catalogItems()) {
      for (const src of item.color.images) {
        expect(src).toMatch(/^\/img\/[\w-]+\.jpg$/);
      }
    }
  });
});

describe("searchCatalog", () => {
  it("encontra ignorando acento", () => {
    const semAcento = searchCatalog("essencia");
    const comAcento = searchCatalog("Essência");
    expect(semAcento.length).toBeGreaterThan(0);
    expect(comAcento).toEqual(semAcento);
  });

  it("encontra pelo nome da cor", () => {
    expect(searchCatalog("terracota").map((item) => item.title)).toContain(
      "Regata Eva Terracota",
    );
  });

  it("devolve vazio para consulta em branco", () => {
    expect(searchCatalog("   ")).toEqual([]);
  });

  it("devolve vazio quando nada casa", () => {
    expect(searchCatalog("guarda-chuva")).toEqual([]);
  });
});
