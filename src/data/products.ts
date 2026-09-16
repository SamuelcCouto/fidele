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
    description: [
      "A Orvalho foi criada para mostrar que até os detalhes mais simples podem mudar completamente uma peça.",
      "Confeccionada em malha ribana e aplicações de gotas que dão um toque marcante à peça, criando um visual delicado, mas cheio de personalidade.",
    ],
    sizes: ["P", "M", "G", "GG"],
    // regata2 é a frente (estampa FIDÈLE); regata1 são as costas.
    colors: [
      {
        name: "Branco",
        images: img("regata", 2, 1, 3, 4, 5, 6, 7),
        soldOut: ["P"],
      },
    ],
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
    colors: [
      {
        name: "Rosa",
        images: img("polo", 2, 3, 4, 5, 6, 1, 7, 8),
        soldOut: ["P", "M"],
      },
    ],
  },
  despertar: {
    id: "despertar",
    name: "Regata Despertar",
    priceInCents: 11500,
    description: [
      "A Despertar traz esse contraste em um bordado colorido que mistura formas e cores de um jeito inesperado. Confeccionada em microfibra, é uma peça leve e simples na base, mas que ganha toda a sua identidade no detalhe.",
    ],
    sizes: ["M", "G", "GG"],
    colors: [{ name: "Branco", images: img("despertar", 2, 3, 5, 1, 4, 6, 7) }],
  },
  marco: {
    id: "marco",
    name: "Camisa Marco 23",
    priceInCents: 11500,
    description: [
      "A Marco 23 é uma camisa de modelagem reta, confeccionada em tecido leve e com mangas curtas. Possui gola tradicional, fechamento frontal por botões e dois bolsos cargo funcionais aplicados na parte da frente. A gola recebe um detalhe exclusivo da FIDÈLE, trazendo a identidade da marca.",
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
      "A Essencial é uma camisa de linho com modelagem reta e mangas curtas. Possui gola tradicional, fechamento frontal por botões e bolso funcional aplicado na parte da frente, que recebe a estampa exclusiva da FIDÈLE.",
      "O tecido leve do linho e a construção da peça deixam a camisa com uma proposta simples e natural, enquanto os detalhes da marca dão identidade ao modelo.",
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
      "Eva é uma regata de modelagem reta, confeccionada em malha ribana. Possui gola e cavas com acabamento em ribana, trazendo uma construção simples e bem definida. Uma peça básica na modelagem, mas que ganha identidade através da assinatura da marca.",
    ],
    sizes: ["P", "M", "G", "GG"],
    colors: [
      // eva1 ficou de fora: duas modelos com cores diferentes na mesma foto.
      { name: "Preto", images: img("eva", 7, 8, 2) },
      { name: "Cinza", images: img("eva", 4, 5, 6, 3) },
      // eva10 traz o bordado FL FIDÈLE; eva9 é o lado liso.
      { name: "Bege", images: img("eva", 10, 9, 13) },
      { name: "Terracota", images: img("eva", 11, 12, 14) },
    ],
  },
  ciclo: {
    id: "ciclo",
    name: "Regata Ciclo",
    priceInCents: 10000,
    description: [
      "A Ciclo é uma regata confeccionada em microfibra, com modelagem mais ajustada ao corpo e decote amplo. O acabamento das cavas e da gola acompanha a proposta clean da peça, enquanto o bordado da FIDÈLE em moldura oval traz o detalhe que se destaca na parte frontal.",
    ],
    sizes: ["M", "G", "GG"],
    // Bege e terracota saíram da vitrine até existirem fotos delas: três cards
    // com a mesma imagem marrom pareciam defeito e induziam o cliente a erro.
    colors: [{ name: "Marrom", images: img("ciclo", 2, 3, 5, 4, 1, 6, 7, 8) }],
  },
};
