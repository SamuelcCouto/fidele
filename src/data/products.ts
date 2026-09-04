import type { Product } from "@/types/product";

/** Monta os caminhos das fotos: img("marco", 2, 3) -> ["/img/marco2.jpg", …] */
const img = (prefix: string, ...numbers: number[]): string[] =>
  numbers.map((n) => `/img/${prefix}${n}.jpg`);

/**
 * Catálogo estático. Preços em centavos — o texto de parcelamento é derivado
 * por `formatInstallments`, não escrito à mão (evita divergir do preço).
 *
 * As cores são dados estruturados, não texto na descrição: a vitrine gera um
 * card por cor, o cliente escolhe na página do produto, a galeria acompanha a
 * escolha e a cor viaja até a ordem de pedido.
 *
 * Em cada cor, a PRIMEIRA foto é sempre a peça sozinha — é ela que vai para a
 * vitrine. Fotos com modelo entram depois, para mostrar caimento.
 */
export const productsData: Record<string, Product> = {
  regata: {
    id: "regata",
    name: "Regata Orvalho",
    priceInCents: 13000,
    description: ["Modelo: Regata orvalho"],
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "Branco", images: img("regata", 1, 2, 3, 4, 5, 6, 7) }],
  },
  polo: {
    id: "polo",
    name: "Polo Florescer",
    priceInCents: 15500,
    description: [
      "A Polo Florescer carrega em seus detalhes o significado de renascer. Seu bordado representa uma flor desabrochando, simbolizando transformação, novos ciclos e o florescer de uma nova versão de si. O olho representa a capacidade de ver o novo — enxergar novas possibilidades, novos caminhos e tudo aquilo que nasce quando nos permitimos transformar.",
      "Modelo: Polo Florescer",
      "Detalhes: Bordado autoral. Flor (renascimento) e Olho (ver o novo).",
    ],
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "Rosa", images: img("polo", 2, 3, 4, 5, 6, 1, 7, 8) }],
  },
  despertar: {
    id: "despertar",
    name: "Regata Despertar",
    priceInCents: 11500,
    description: ["Modelo: Regata Despertar"],
    sizes: ["M", "G", "GG"],
    colors: [{ name: "Branco", images: img("despertar", 2, 3, 5, 1, 4, 6, 7) }],
  },
  marco: {
    id: "marco",
    name: "Camisa Marco 23",
    priceInCents: 11500,
    description: [
      "A Camisa Marco 23 traz o estilo utilitário do bolso cargo em uma proposta moderna e cheia de personalidade.",
      "Modelo: Camisa Marco 23",
      "Detalhes: Bolso cargo",
    ],
    sizes: ["P", "M", "G"],
    colors: [
      { name: "Cinza", images: img("marco", 2, 3, 4, 6, 11, 1, 7, 8) },
      { name: "Branco", images: img("marco", 13, 5, 12, 14, 9, 10) },
    ],
  },
  essencia: {
    id: "essencia",
    name: "Camisa Essência",
    priceInCents: 11500,
    description: [
      "A Camisa Essência traduz a beleza de uma peça que não precisa de excessos para se destacar.",
      "A essência é sobre simplicidade, versatilidade e a beleza de encontrar significado nos detalhes.",
      "Modelo: Camisa Essência",
      "Detalhes: Bordado no bolso",
    ],
    sizes: ["P", "M", "G", "GG"],
    colors: [
      // essencia9 e essencia17 ficaram de fora: são fotos de grupo com mais de
      // uma cor, não dá para atribuir a nenhuma.
      { name: "Branco", images: img("essencia", 14, 19, 16, 15, 18) },
      { name: "Preto", images: img("essencia", 12, 13, 11, 1, 8, 10) },
      { name: "Bege", images: img("essencia", 3, 2, 4, 5, 6, 7) },
    ],
  },
  eva: {
    id: "eva",
    name: "Regata Eva",
    priceInCents: 10000,
    description: [
      "Uma peça essencial que une conforto e versatilidade para o seu dia a dia.",
      "Modelo: Regata Eva",
    ],
    sizes: ["P", "M", "G", "GG"],
    colors: [
      // eva1 ficou de fora: duas modelos com cores diferentes na mesma foto.
      { name: "Preto", images: img("eva", 7, 8, 2) },
      { name: "Cinza", images: img("eva", 4, 5, 6, 3) },
      { name: "Bege", images: img("eva", 9, 10, 13) },
      { name: "Terracota", images: img("eva", 11, 12, 14) },
    ],
  },
  ciclo: {
    id: "ciclo",
    name: "Regata Ciclo",
    priceInCents: 10000,
    description: ["Modelo: Regata Ciclo"],
    sizes: ["M", "G", "GG"],
    // Bege e terracota saíram da vitrine até existirem fotos delas: três cards
    // com a mesma imagem marrom pareciam defeito e induziam o cliente a erro.
    colors: [{ name: "Marrom", images: img("ciclo", 2, 3, 5, 4, 1, 6, 7, 8) }],
  },
};
