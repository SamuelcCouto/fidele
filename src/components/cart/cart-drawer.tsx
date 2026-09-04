"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/cn";
import type { CheckoutRequest, CheckoutResponse } from "@/types/checkout";
import type { DeliveryCheckResponse } from "@/types/delivery";
import { CartLineItem } from "./cart-line-item";
import { canCheckout, DeliveryCheck } from "./delivery-check";
import s from "./cart-drawer.module.css";

export function CartDrawer() {
  const { cart, cartTotal, cartCount, isCartOpen, setIsCartOpen } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delivery, setDelivery] = useState<DeliveryCheckResponse | null>(null);

  const close = () => setIsCartOpen(false);

  const handleCheckout = async () => {
    // O guard estreita o tipo: daqui para baixo o CEP já foi confirmado.
    if (cart.length === 0 || !canCheckout(delivery)) return;

    setIsLoading(true);
    setError(null);

    // Só identificação, quantidade e CEP seguem para o servidor: o preço é
    // recalculado lá a partir do catálogo, e a cidade é reconsultada no ViaCEP.
    const payload: CheckoutRequest = {
      items: cart.map(({ id, size, color, quantity }) => ({
        id,
        size,
        color,
        quantity,
      })),
      cep: delivery.cep,
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // 422 (fora da área) e 503 (CEP não verificável) trazem um texto que o
        // cliente precisa ler; os demais viram mensagem genérica.
        const problem = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(
          problem?.error ?? `Checkout respondeu ${response.status}`,
        );
      }

      const data = (await response.json()) as CheckoutResponse;
      if (!data.checkoutUrl) {
        throw new Error("Resposta do checkout sem checkoutUrl");
      }

      window.location.href = data.checkoutUrl;
    } catch (cause) {
      console.error("Erro no checkout:", cause);
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "Não conseguimos gerar o pagamento. Tente novamente.",
      );
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
              <CartLineItem
                key={`${item.id}-${item.size}-${item.color}`}
                item={item}
              />
            ))
          )}
        </div>

        <div className={s.footer}>
          {cart.length > 0 && <DeliveryCheck onResult={setDelivery} />}

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
            disabled={cart.length === 0 || isLoading || !canCheckout(delivery)}
          >
            {isLoading
              ? "Gerando Pagamento..."
              : cart.length > 0 && !canCheckout(delivery)
                ? "Informe o CEP para continuar"
                : "Finalizar Compra"}
          </Button>
        </div>
      </aside>
    </div>
  );
}
