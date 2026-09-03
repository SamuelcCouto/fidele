import type { Product, Size } from "@/types/product";

export interface CartItem extends Pick<Product, "id" | "name" | "priceInCents"> {
  image: string;
  size: Size;
  quantity: number;
}
