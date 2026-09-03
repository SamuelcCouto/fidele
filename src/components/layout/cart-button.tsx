"use client";

import { BagIcon } from "@/components/ui/icons";
import { useCart } from "@/contexts/cart-context";
import s from "./cart-button.module.css";

export function CartButton() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <button
      type="button"
      className={s.button}
      aria-label={`Abrir carrinho (${cartCount} ${cartCount === 1 ? "item" : "itens"})`}
      onClick={() => setIsCartOpen(true)}
    >
      <BagIcon />
      {cartCount > 0 && <span className={s.count}>{cartCount}</span>}
    </button>
  );
}
