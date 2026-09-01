// Definimos o "molde" de como um produto deve ser
export interface Product {
  id: string;
  name: string;
  price: string;
  installments: string;
  description: string[];
  sizes: string[];
  imagePrefix: string; // Ex: "marco" (para buscar marco1.jpg, marco2.jpg...)
  imageCount: number;  // Quantidade de fotos que aquele produto tem
}

// Nosso Banco de Dados simulado com TODAS as peças da vitrine!
export const productsData: Record<string, Product> = {
  "regata": {
    id: "regata",
    name: "Regata Orvalho",
    price: "R$ 130,00",
    installments: "ou 3x de R$ 43,33 sem juros",
    description: [
      "Cor: Branco",
      "Modelo: Regata orvalho"
    ],
    sizes: ["P", "M", "G", "GG"],
    imagePrefix: "regata",
    imageCount: 8, // Vai gerar de regata1.jpg até regata8.jpg
  },
  "polo": {
    id: "polo",
    name: "Polo Florescer",
    price: "R$ 155,00",
    installments: "ou 3x de R$ 51,66 sem juros",
    description: [
      "A Polo Florescer carrega em seus detalhes o significado de renascer. Seu bordado representa uma flor desabrochando, simbolizando transformação, novos ciclos e o florescer de uma nova versão de si. O olho representa a capacidade de ver o novo — enxergar novas possibilidades, novos caminhos e tudo aquilo que nasce quando nos permitimos transformar.",
      "Modelo: Polo Florescer",
      "Cor: Rosa",
      "Detalhes: Bordado autoral. Flor (renascimento) e Olho (ver o novo)."
    ],
    sizes: ["P", "M", "G", "GG"],
    imagePrefix: "polo",
    imageCount: 8,
  },
  "despertar": {
    id: "despertar",
    name: "Regata Despertar",
    price: "R$ 115,00",
    installments: "ou 3x de R$ 38,33 sem juros",
    description: [
      "Cor: Branco",
      "Modelo: Regata Despertar"
    ],
    sizes: ["M", "G", "GG"],
    imagePrefix: "despertar",
    imageCount: 7,
  },
  "marco": {
    id: "marco",
    name: "Camisa Marco 23",
    price: "R$ 115,00",
    installments: "ou 3x de R$ 38,33 sem juros",
    description: [
      "A Camisa Marco 23 traz o estilo utilitário do bolso cargo em uma proposta moderna e cheia de personalidade.",
      "Modelo: Camisa Marco 23",
      "Detalhes: Bolso cargo",
      "Cores disponíveis: Cinza e Branco"
    ],
    sizes: ["P", "M", "G"],
    imagePrefix: "marco",
    imageCount: 14,
  },
  "essencia": {
    id: "essencia",
    name: "Camisa Essência",
    price: "R$ 115,00",
    installments: "ou 3x de R$ 38,33 sem juros",
    description: [
      "A Camisa Essência traduz a beleza de uma peça que não precisa de excessos para se destacar.",
      "A essência é sobre simplicidade, versatilidade e a beleza de encontrar significado nos detalhes.",
      "Modelo: Camisa Essência",
      "Cores: Branco, Preto e Bege",
      "Detalhes: Bordado no bolso"
    ],
    sizes: ["P", "M", "G", "GG"],
    imagePrefix: "essencia",
    imageCount: 19,
  },
  "eva": {
    id: "eva",
    name: "Regata Eva",
    price: "R$ 100,00",
    installments: "ou 3x de R$ 33,33 sem juros",
    description: [
      "Uma peça essencial que une conforto e versatilidade para o seu dia a dia.",
      "Modelo: Regata Eva",
      "Cores disponíveis: Preto, cinza, bege e terracota"
    ],
    sizes: ["P", "M", "G", "GG"],
    imagePrefix: "eva",
    imageCount: 14,
  },
  "ciclo": {
    id: "ciclo",
    name: "Regata Ciclo",
    price: "R$ 100,00",
    installments: "ou 3x de R$ 33,33 sem juros",
    description: [
      "Modelo: Regata Ciclo",
      "Cores disponíveis: Marrom, bege e terracota"
    ],
    sizes: ["M", "G", "GG"],
    imagePrefix: "ciclo",
    imageCount: 8,
  }
};