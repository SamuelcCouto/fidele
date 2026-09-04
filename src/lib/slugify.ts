/**
 * Transforma um rótulo em trecho de URL: "Terracota" -> "terracota",
 * "Aparecida de Goiânia" -> "aparecida-de-goiania".
 *
 * Derivar em vez de escrever o slug à mão no catálogo evita que nome e URL
 * divirjam quando alguém renomear uma cor.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
