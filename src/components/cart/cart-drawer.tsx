"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/cn";
import type { CheckoutRequest, CheckoutResponse } from "@/types/checkout";
import { CartLineItem } from "./cart-line-item";
import s from "./cart-drawer.module.css";

export function CartDrawer() {
  const { cart, cartTotal, cartCount, isCartOpen, setIsCartOpen } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => setIsCartOpen(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsLoading(true);
    setError(null);

    // Só identificação e quantidade seguem para o servidor: o preço é
    // recalculado lá a partir do catálogo.
    const payload: CheckoutRequest = {
      items: cart.map(({ id, size, quantity }) => ({ id, size, quantity })),
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Checkout respondeu ${response.status}`);
      }

      const data = (await response.json()) as CheckoutResponse;
      if (!data.init_point) {
        throw new Error("Resposta do checkout sem init_point");
      }

      window.location.href = data.init_point;
    } catch (cause) {
      console.error("Erro no checkout:", cause);
      setError("Não conseguimos gerar o pagamento. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(s.scrim, isCartOpen && s.open)}
      aria-hidden={!isCartOpen}
      onClick={close}
    >
      <aside
        className={s.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={s.header}>
          <h2>Seu Carrinho ({cartCount})</h2>
          <button
            type="button"
            className={s.close}
            aria-label="Fechar carrinho"
            onClick={close}
          >
            ✖
          </button>
        </div>

        <div className={s.items}>
          {cart.length === 0 ? (
            <p className={s.empty}>Seu carrinho está vazio.</p>
          ) : (
            cart.map((item) => (
              <CartLineItem key={`${item.id}-${item.size}`} item={item} />
            ))
          )}
        </div>

        <div className={s.footer}>
          <div className={s.total}>
            <span>Total:</span>
            <span>{cartTotal}</span>
          </div>

          {error && (
            <p role="alert" className={s.error}>
              {error}
            </p>
          )}

          <Button
            variant="buy"
            fullWidth
            onClick={handleCheckout}
            disabled={cart.length === 0 || isLoading}
          >
            {isLoading ? "Gerando Pagamento..." : "Finalizar Compra"}
          </Button>
        </div>
      </aside>
    </div>
  );
}
