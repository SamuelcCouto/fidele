"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeCart,
  updateCart,
} from "@/lib/cart-storage";
import { formatPrice } from "@/lib/format-price";
import type { CartItem } from "@/types/cart";
import type { Size } from "@/types/product";

interface CartContextValue {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: Size) => void;
  updateQuantity: (id: string, size: Size, amount: number) => void;
  cartCount: number;
  cartTotalInCents: number;
  cartTotal: string;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // O localStorage é a fonte da verdade; o React apenas se inscreve nele.
  // Isso dispensa o efeito de hidratação e a persistência espalhada pelos
  // mutadores, e ainda mantém abas do mesmo navegador em sincronia.
  const cart = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );

  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (newItem: CartItem) => {
    updateCart((current) => {
      const index = current.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size,
      );

      if (index < 0) return [...current, newItem];

      const next = [...current];
      // Substitui o item em vez de mutá-lo: o spread acima é raso, então
      // `next[index].quantity += 1` alteraria também o estado anterior.
      next[index] = {
        ...next[index],
        quantity: next[index].quantity + newItem.quantity,
      };
      return next;
    });
  };

  const removeFromCart = (id: string, size: Size) => {
    updateCart((current) =>
      current.filter((item) => !(item.id === id && item.size === size)),
    );
  };

  const updateQuantity = (id: string, size: Size, amount: number) => {
    updateCart((current) =>
      current
        .map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotalInCents = cart.reduce(
    (total, item) => total + item.priceInCents * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotalInCents,
        cartTotal: formatPrice(cartTotalInCents),
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}
