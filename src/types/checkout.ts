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
  /** Nome da cor. O servidor confere que ela pertence ao produto. */
  color: string;
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutItemInput[];
  /** Oito dígitos, sem máscara. Define se a loja entrega no endereço. */
  cep: string;
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

/**
 * Teto de caracteres para os campos de texto do pedido. Id e cor são slugs e
 * nomes curtos; o limite existe para o servidor não ecoar de volta um valor
 * gigante na mensagem de erro.
 */
export const MAX_FIELD_LENGTH = 64;
