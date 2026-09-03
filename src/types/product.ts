export const SIZES = ["P", "M", "G", "GG"] as const;

export type Size = (typeof SIZES)[number];

export function isSize(value: unknown): value is Size {
  return typeof value === "string" && (SIZES as readonly string[]).includes(value);
}

export interface Product {
  id: string;
  name: string;
  /** Preço em centavos. Nunca guardar dinheiro como string ou float. */
  priceInCents: number;
  description: string[];
  sizes: Size[];
  /** Prefixo dos arquivos em /public/img — ex.: "marco" gera marco1.jpg…marcoN.jpg */
  imagePrefix: string;
  imageCount: number;
  /** Foto de capa da vitrine, quando não for a primeira da galeria. */
  coverImage?: string;
}
