export interface FaqEntry {
  question: string;
  answer: string;
}

export const howToBuySteps: string[] = [
  "Navegue pela nossa vitrine e escolha a peça que mais combina com você.",
  'Selecione o tamanho ideal (P, M, G, GG) e clique em "Comprar".',
  "Acesse o seu carrinho clicando no ícone da sacola no canto superior direito.",
  'Clique em "Finalizar Compra" e siga os passos no checkout. É rápido e 100% seguro!',
];

export const faqEntries: FaqEntry[] = [
  {
    question: "Qual o prazo de postagem?",
    answer:
      "Enviamos seu pedido em até 48h úteis após a confirmação do pagamento.",
  },
  {
    question: "Vocês enviam para todo o Brasil?",
    answer:
      "Sim, enviamos para todo o território nacional via Correios ou Transportadora.",
  },
  {
    question: "Posso trocar se não servir?",
    answer:
      "Com certeza! A primeira troca é facilitada em até 7 dias após o recebimento.",
  },
];
