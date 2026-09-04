export const SIZES = ["P", "M", "G", "GG"] as const;

export type Size = (typeof SIZES)[number];

export function isSize(value: unknown): value is Size {
  return typeof value === "string" && (SIZES as readonly string[]).includes(value);
}

export interface ProductColor {
  /** Nome exibido e gravado no pedido. Ex.: "Cinza" */
  name: string;
  /** Capa desta cor na vitrine e no carrinho. */
  image: string;
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
  /** Prefixo dos arquivos em /public/img — ex.: "marco" gera marco1.jpg…marcoN.jpg */
  imagePrefix: string;
  imageCount: number;
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
