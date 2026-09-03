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

/** Foto usada na vitrine e na miniatura do carrinho. */
export function productCover(product: Product): string {
  return product.coverImage ?? productImage(product.imagePrefix, 1);
}
