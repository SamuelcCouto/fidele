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
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, amount: number) => void;
  cartCount: number;
  cartTotal: string;
  // NOVAS FUNÇÕES PARA CONTROLAR A GAVETA GLOBALMENTE
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado da gaveta

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

  const removeFromCart = (id: string, size: string) => {
    setCart((prev) => {
      const newCart = prev.filter(item => !(item.id === id && item.size === size));
      localStorage.setItem("@fidele:cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (id: string, size: string, amount: number) => {
    setCart((prev) => {
      const newCart = prev.map(item => {
        if (item.id === id && item.size === size) {
          return { ...item, quantity: item.quantity + amount };
        }
        return item;
      }).filter(item => item.quantity > 0);
      localStorage.setItem("@fidele:cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartTotalNumber = cart.reduce((acc, item) => {
    const numericPrice = parseFloat(item.price.replace("R$ ", "").replace(",", "."));
    return acc + (numericPrice * item.quantity);
  }, 0);
  
  const cartTotal = `R$ ${cartTotalNumber.toFixed(2).replace(".", ",")}`;

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal,
      isCartOpen, setIsCartOpen // Disponibiliza para o site todo
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
}