import type { Size } from "@/types/product";

/**
 * Contrato do POST /api/checkout.
 *
 * O cliente manda apenas identificação e quantidade — nunca o preço.
 * O servidor rederiva o valor a partir do catálogo, senão bastaria editar o
 * localStorage para comprar qualquer peça por R$ 0,01.
 */
export interface CheckoutItemInput {
  id: string;
  size: Size;
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutItemInput[];
}

export interface CheckoutResponse {
  init_point: string;
}

export const MAX_QUANTITY_PER_ITEM = 20;
