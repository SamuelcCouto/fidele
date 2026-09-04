import { productsData } from "@/data/products";
import { slugify } from "@/lib/slugify";
import {
  colorCover,
  hasColorChoice,
  type Product,
  type ProductColor,
} from "@/types/product";

/**
 * Uma peça como ela aparece na vitrine.
 *
 * Produto com mais de uma cor rende vários itens: "Camisa Marco 23 Cinza" e
 * "Camisa Marco 23 Branco" ocupam cards separados e têm URL própria, mas
 * levam para a mesma página — com a cor clicada já selecionada.
 */
export interface CatalogItem {
  product: Product;
  color: ProductColor;
  /** Nome com a cor, quando o produto tem mais de uma. */
  title: string;
  href: string;
  image: string;
}

export function allProducts(): Product[] {
  return Object.values(productsData);
}

/**
 * Busca no catálogo por id.
 *
 * `productsData` é um objeto literal, então `productsData["__proto__"]`
 * devolve o Object.prototype — que é truthy e passa por qualquer checagem de
 * existência, quebrando o código seguinte com 500 numa rota pública. O mesmo
 * vale para "constructor", "toString", "valueOf" e "hasOwnProperty".
 * Só propriedade própria conta como produto.
 */
export function getProduct(id: string): Product | undefined {
  return Object.hasOwn(productsData, id) ? productsData[id] : undefined;
}

export function toCatalogItem(
  product: Product,
  color: ProductColor,
): CatalogItem {
  const multi = hasColorChoice(product);

  return {
    product,
    color,
    title: multi ? `${product.name} ${color.name}` : product.name,
    href: multi ? `/${product.id}-${slugify(color.name)}` : `/${product.id}`,
    image: colorCover(color),
  };
}

/** Toda a vitrine, um card por cor. */
export function catalogItems(): CatalogItem[] {
  return allProducts().flatMap((product) =>
    product.colors.map((color) => toCatalogItem(product, color)),
  );
}

export interface ResolvedSlug {
  product: Product;
  color: ProductColor;
}

/**
 * Aceita tanto o slug do produto ("marco") quanto o da variação
 * ("marco-cinza"). O slug base continua valendo para não quebrar link antigo
 * nem resultado de busca já indexado; nele, a primeira cor vem selecionada.
 */
export function resolveSlug(slug: string): ResolvedSlug | null {
  const direct = getProduct(slug);
  if (direct) return { product: direct, color: direct.colors[0] };

  for (const product of allProducts()) {
    const prefix = `${product.id}-`;
    if (!slug.startsWith(prefix)) continue;

    const wanted = slug.slice(prefix.length);
    const color = product.colors.find((item) => slugify(item.name) === wanted);
    if (color) return { product, color };
  }

  return null;
}

/** Todos os endereços que a rota /[slug] precisa pré-renderizar. */
export function catalogSlugs(): string[] {
  const slugs = new Set<string>();

  for (const product of allProducts()) {
    slugs.add(product.id);

    if (hasColorChoice(product)) {
      for (const color of product.colors) {
        slugs.add(`${product.id}-${slugify(color.name)}`);
      }
    }
  }

  return [...slugs];
}

/**
 * Única implementação da busca — consumida pelo autocomplete do header e pela
 * página /busca. Compara pela forma normalizada, então "essencia" encontra
 * "Essência" e "camisa essencia" também.
 */
export function searchCatalog(query: string): CatalogItem[] {
  const term = slugify(query);
  if (!term) return [];

  return catalogItems().filter((item) => {
    const haystack = [item.title, item.color.name, ...item.product.description];
    return slugify(haystack.join(" ")).includes(term);
  });
}
