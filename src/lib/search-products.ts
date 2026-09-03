import { productsData } from "@/data/products";
import type { Product } from "@/types/product";

export function allProducts(): Product[] {
  return Object.values(productsData);
}

/**
 * Única implementação da busca — consumida pelo autocomplete do header e pela
 * página /busca, que antes filtravam por conta própria.
 */
export function searchProducts(query: string): Product[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  return allProducts().filter(
    (product) =>
      product.name.toLowerCase().includes(term) ||
      product.description.some((line) => line.toLowerCase().includes(term)),
  );
}
