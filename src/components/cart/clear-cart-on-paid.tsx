"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart-storage";

/**
 * O carrinho vive no localStorage do navegador, mas quem confirma o pagamento
 * é o servidor. Este componente é a ponte entre os dois: a tela de retorno só
 * o renderiza depois que a InfinitePay confirmou a cobrança.
 *
 * Chama `clearCart` direto do módulo de storage em vez de passar pelo contexto
 * porque a referência precisa ser estável — vinda do contexto, ela mudaria a
 * cada render e o efeito rodaria em laço.
 */
export function ClearCartOnPaid() {
  useEffect(() => {
    clearCart();
  }, []);

  return null;
}
