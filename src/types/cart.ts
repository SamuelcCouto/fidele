import type { Product, Size } from "@/types/product";

export interface CartItem extends Pick<Product, "id" | "name" | "priceInCents"> {
  image: string;
  size: Size;
  /**
   * Nome da cor escolhida. Junto com `id` e `size`, identifica a linha do
   * carrinho — "Marco 23 Cinza P" e "Marco 23 Branco P" são linhas distintas.
   */
  color: string;
  quantity: number;
}
