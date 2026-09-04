import type { Product } from "@/types/product";

/**
 * Catálogo estático. Preços em centavos — o texto de parcelamento é derivado
 * por `formatInstallments`, não escrito à mão (evita divergir do preço).
 *
 * As cores são dados estruturados, não texto na descrição: a vitrine gera um
 * card por cor, o cliente escolhe na página do produto e a cor viaja até a
 * ordem de pedido. Antes ficavam só como frase solta ("Cores disponíveis:
 * Cinza e Branco") e ninguém sabia qual cor havia sido comprada.
 */
export const productsData: Record<string, Product> = {
  regata: {
    id: "regata",
    name: "Regata Orvalho",
    priceInCents: 13000,
    description: ["Modelo: Regata orvalho"],
    sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "Branco", image: "/img/regatabranca.jpg" }],
    imagePrefix: "regata",
    imageCount: 7,
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
    colors: [{ name: "Rosa", image: "/img/polo1.jpg" }],
    imagePrefix: "polo",
    imageCount: 8,
  },
  despertar: {
    id: "despertar",
    name: "Regata Despertar",
    priceInCents: 11500,
    description: ["Modelo: Regata Despertar"],
    sizes: ["M", "G", "GG"],
    colors: [{ name: "Branco", image: "/img/despertar1.jpg" }],
    imagePrefix: "despertar",
    imageCount: 7,
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
      { name: "Cinza", image: "/img/marco2.jpg" },
      { name: "Branco", image: "/img/marco13.jpg" },
    ],
    imagePrefix: "marco",
    imageCount: 14,
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
      { name: "Branco", image: "/img/essencia14.jpg" },
      { name: "Preto", image: "/img/essencia12.jpg" },
      { name: "Bege", image: "/img/essencia3.jpg" },
    ],
    imagePrefix: "essencia",
    imageCount: 19,
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
      { name: "Preto", image: "/img/eva7.jpg" },
      { name: "Cinza", image: "/img/eva4.jpg" },
      { name: "Bege", image: "/img/eva10.jpg" },
      { name: "Terracota", image: "/img/eva12.jpg" },
    ],
    imagePrefix: "eva",
    imageCount: 14,
  },
  ciclo: {
    id: "ciclo",
    name: "Regata Ciclo",
    priceInCents: 10000,
    description: ["Modelo: Regata Ciclo"],
    sizes: ["M", "G", "GG"],
    // ATENÇÃO: só existem fotos da peça marrom. Bege e terracota estão
    // usando a mesma imagem até a Elivânia enviar as fotos reais.
    colors: [
      { name: "Marrom", image: "/img/ciclo2.jpg" },
      { name: "Bege", image: "/img/ciclo2.jpg" },
      { name: "Terracota", image: "/img/ciclo2.jpg" },
    ],
    imagePrefix: "ciclo",
    imageCount: 8,
  },
};
