"use client";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface AddToCartProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    sizes: string[];
  };
}

export default function AddToCart({ product }: AddToCartProps) {
  // Guarda qual tamanho o usuário clicou
  const [selectedSize, setSelectedSize] = useState<string>("");
  // Puxa a função de salvar do nosso Contexto
  const { addToCart } = useCart();

  const handleBuy = () => {
    if (!selectedSize) {
      alert("Por favor, selecione um tamanho antes de comprar!");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: 1,
    });

    alert(`${product.name} (Tam: ${selectedSize}) adicionado ao carrinho!`);
  };

  return (
    <>
      <div className="pdp-sizes">
        <p>Tamanho:</p>
        <div className="size-options">
          {product.sizes.map((size) => (
            <button
              key={size}
              className="size-btn"
              style={{
                // Pinta de rosa se for o tamanho selecionado!
                borderColor: selectedSize === size ? "var(--pink)" : "var(--line)",
                color: selectedSize === size ? "var(--pink)" : "var(--cream)",
              }}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button className="buy-btn-large" onClick={handleBuy}>
        Comprar
      </button>
    </>
  );
}