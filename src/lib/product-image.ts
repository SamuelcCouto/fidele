import type { Product } from "@/types/product";

/** Caminho da n-ésima foto de um produto. Ex.: ("marco", 3) -> "/img/marco3.jpg" */
export function productImage(prefix: string, index: number): string {
  return `/img/${prefix}${index}.jpg`;
}

/** Todas as fotos da galeria, na ordem. */
export function productImages(product: Product): string[] {
  return Array.from({ length: product.imageCount }, (_, i) =>
    productImage(product.imagePrefix, i + 1),
  );
}

/**
 * Capa padrão do produto — a foto da primeira cor. Onde a cor escolhida é
 * conhecida, use a imagem dela em vez desta.
 */
export function productCover(product: Product): string {
  return product.colors[0].image;
}
