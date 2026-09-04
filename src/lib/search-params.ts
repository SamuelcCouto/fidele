/**
 * O que o Next entrega em `searchParams` é `string | string[] | undefined`:
 * `?q=a&q=b` chega como array.
 *
 * Declarar o campo como `string` era mentira que o TypeScript aceitava sem
 * reclamar — e o `.trim()` logo abaixo derrubava a página com 500. Bastava
 * repetir o parâmetro na URL para qualquer visitante quebrar a busca.
 */
export type QueryValue = string | string[] | undefined;

/** Primeiro valor do parâmetro, que é o comportamento esperado de um form. */
export function firstParam(value: QueryValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
