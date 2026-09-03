"use client";

import Image from "next/image";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/format-price";
import type { CartItem } from "@/types/cart";
import s from "./cart-line-item.module.css";

export function CartLineItem({ item }: { item: CartItem }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className={s.item}>
      <div className={s.thumb}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className={s.thumbImage}
        />
      </div>

      <div className={s.info}>
        <span className={s.title}>{item.name}</span>
        <span className={s.size}>Tam: {item.size}</span>

        <div className={s.quantity}>
          <button
            type="button"
            className={s.qtyButton}
            aria-label={`Diminuir quantidade de ${item.name}`}
            onClick={() => updateQuantity(item.id, item.size, -1)}
          >
            −
          </button>
          <span className={s.qtyValue}>{item.quantity}</span>
          <button
            type="button"
            className={s.qtyButton}
            aria-label={`Aumentar quantidade de ${item.name}`}
            onClick={() => updateQuantity(item.id, item.size, 1)}
          >
            +
          </button>
        </div>

        <span className={s.price}>
          {formatPrice(item.priceInCents * item.quantity)}
        </span>

        <button
          type="button"
          className={s.remove}
          onClick={() => removeFromCart(item.id, item.size)}
        >
          Remover todos
        </button>
      </div>
    </div>
  );
}
