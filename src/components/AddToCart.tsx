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
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false); // Nova memória para o erro
  
  const { addToCart, setIsCartOpen } = useCart();

  const handleBuy = () => {
    // Se o cliente não escolheu o tamanho:
    if (!selectedSize) {
      setShowError(true); // Liga o aviso visual
      
      // Desliga o aviso e a animação depois de 2 segundos para o cliente poder tentar de novo
      setTimeout(() => setShowError(false), 2000); 
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

    setShowModal(true);
  };

  const handleGoToCart = () => {
    setShowModal(false);
    setIsCartOpen(true); 
  };

  return (
    <>
      <div className={`pdp-sizes ${showError ? "shake-animation" : ""}`}>
        <p>Tamanho:</p>
        
        {/* Nossa nova mensagem de erro suave */}
        <div className={`size-error-msg ${showError ? "visible" : ""}`}>
          ⚠️ Escolha um tamanho para continuar.
        </div>

        <div className="size-options">
          {product.sizes.map((size) => (
            <button
              key={size}
              className="size-btn"
              style={{
                borderColor: selectedSize === size ? "var(--pink)" : (showError ? "#ff4d4d" : "var(--line)"),
                color: selectedSize === size ? "var(--pink)" : (showError ? "#ff4d4d" : "var(--cream)"),
              }}
              onClick={() => {
                setSelectedSize(size);
                setShowError(false); // Se a pessoa clicar no tamanho, o erro some na hora!
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button className="buy-btn-large" onClick={handleBuy}>
        Comprar
      </button>

      <div className={`modal-overlay ${showModal ? "show" : ""}`}>
        <div className="modal-box">
          <h3>Perfeito! 🛍️</h3>
          <p>
            A <strong>{product.name}</strong> (Tam: {selectedSize}) foi adicionada ao seu carrinho com sucesso.
          </p>
          <div className="modal-buttons">
            <button className="btn-outline" onClick={() => setShowModal(false)}>
              Continuar Comprando
            </button>
            <button className="btn-solid" onClick={handleGoToCart}>
              Ir para o Carrinho
            </button>
          </div>
        </div>
      </div>
    </>
  );
}