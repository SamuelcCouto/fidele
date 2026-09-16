export const SIZES = ["P", "M", "G", "GG"] as const;

export type Size = (typeof SIZES)[number];

export function isSize(value: unknown): value is Size {
  return typeof value === "string" && (SIZES as readonly string[]).includes(value);
}

export interface ProductColor {
  /** Nome exibido e gravado no pedido. Ex.: "Cinza" */
  name: string;
  /**
   * Fotos desta cor, na ordem da galeria. A primeira é a capa e deve ser
   * sempre a peça sozinha — a vitrine vende a roupa, não a produção de foto.
   * As fotos com modelo vêm depois, para mostrar caimento.
   */
  images: string[];
  /**
   * Tamanhos esgotados NESTA cor. Fica na cor e não no produto porque o
   * estoque acaba por cor: a Marco 23 pode ter acabado o P cinza e continuar
   * com P branco.
   *
   * Controle manual, editado à mão quando a loja avisa. Não é sistema de
   * estoque — não desconta em venda nem repõe sozinho.
   */
  soldOut?: Size[];
}

export interface Product {
  id: string;
  name: string;
  /** Preço em centavos. Nunca guardar dinheiro como string ou float. */
  priceInCents: number;
  description: string[];
  sizes: Size[];
  /**
   * Ao menos uma. A vitrine gera um card por cor; a página do produto só
   * mostra o seletor quando há mais de uma — não há escolha a fazer com uma só.
   */
  colors: ProductColor[];
}

/** Capa da cor: a primeira foto, por definição a da peça sozinha. */
export function colorCover(color: ProductColor): string {
  return color.images[0];
}

export function hasColorChoice(product: Product): boolean {
  return product.colors.length > 1;
}

export function findColor(
  product: Product,
  name: string,
): ProductColor | undefined {
  return product.colors.find((color) => color.name === name);
}

/** Este tamanho acabou nesta cor? */
export function isSoldOut(color: ProductColor, size: Size): boolean {
  return color.soldOut?.includes(size) ?? false;
}

/** A cor inteira acabou — nenhum tamanho disponível. */
export function isColorSoldOut(product: Product, color: ProductColor): boolean {
  return product.sizes.every((size) => isSoldOut(color, size));
}
