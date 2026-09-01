"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void; // NOVA FUNÇÃO
  cartCount: number;
  cartTotal: string; // NOVO TOTAL
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("@fidele:cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      );
      let newCart;
      if (existingItemIndex >= 0) {
        newCart = [...prev];
        newCart[existingItemIndex].quantity += 1;
      } else {
        newCart = [...prev, newItem];
      }
      localStorage.setItem("@fidele:cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  // Função para remover item específico
  const removeFromCart = (id: string, size: string) => {
    setCart((prev) => {
      const newCart = prev.filter(item => !(item.id === id && item.size === size));
      localStorage.setItem("@fidele:cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Calcula o valor total convertendo "R$ 130,00" para 130.00
  const cartTotalNumber = cart.reduce((acc, item) => {
    const numericPrice = parseFloat(item.price.replace("R$ ", "").replace(",", "."));
    return acc + (numericPrice * item.quantity);
  }, 0);
  
  const cartTotal = `R$ ${cartTotalNumber.toFixed(2).replace(".", ",")}`;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
}