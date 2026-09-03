const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const DEFAULT_INSTALLMENTS = 3;

/** Formata centavos como moeda brasileira. Ex.: 13000 -> "R$ 130,00" */
export function formatPrice(cents: number): string {
  return brl.format(cents / 100);
}

/**
 * Texto de parcelamento derivado do preço, em vez de escrito à mão por produto.
 * Arredonda para baixo — a diferença fica na última parcela, como faz o mercado.
 */
export function formatInstallments(
  cents: number,
  times: number = DEFAULT_INSTALLMENTS,
): string {
  return `ou ${times}x de ${formatPrice(Math.floor(cents / times))} sem juros`;
}
