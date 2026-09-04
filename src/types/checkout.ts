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
  /** URL do checkout hospedado da InfinitePay. */
  checkoutUrl: string;
  /** Identificador do pedido, ecoado de volta no retorno e no webhook. */
  orderNsu: string;
}

export const MAX_QUANTITY_PER_ITEM = 20;

/** Teto de linhas distintas por pedido — o carrinho real nunca chega perto. */
export const MAX_LINE_ITEMS = 50;
