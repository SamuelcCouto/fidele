/**
 * Área de entrega da loja.
 *
 * A Elivânia entrega pessoalmente, na região — pedido de fora daqui não é
 * recusado, é encaminhado para o WhatsApp, onde ela avalia caso a caso.
 */
export const DELIVERY_UF = "GO";

export const DELIVERY_CITIES = [
  "Goiânia",
  "Aparecida de Goiânia",
  "Trindade",
] as const;

/**
 * O ViaCEP devolve o nome acentuado ("Aparecida de Goiânia"), mas comparar
 * string acentuada é frágil: uma variação de grafia recusaria um cliente que
 * mora na área. A comparação acontece sempre sobre a forma normalizada.
 */
export function normalizeCityName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

const ALLOWED_CITIES = new Set(DELIVERY_CITIES.map(normalizeCityName));

export function isDeliverable(city: string, uf: string): boolean {
  return (
    uf.trim().toUpperCase() === DELIVERY_UF &&
    ALLOWED_CITIES.has(normalizeCityName(city))
  );
}

/** "Goiânia, Aparecida de Goiânia e Trindade" */
export const DELIVERY_AREA_LABEL = new Intl.ListFormat("pt-BR", {
  type: "conjunction",
}).format(DELIVERY_CITIES);
