"use client";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  
  // Memória para sabermos se o pagamento está sendo gerado (para mudar o texto do botão)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // A MÁGICA ACONTECE AQUI: Função disparada ao clicar em "Finalizar Compra"
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsCheckoutLoading(true); // Muda o botão para "Gerando Pagamento..."

    try {
      // 1. Bate na porta da nossa API Backend (o arquivo route.ts)
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }), // Manda o carrinho para a API
      });

      const data = await response.json();

      if (data.init_point) {
        // 2. Se deu tudo certo, redireciona o cliente para a tela de pagamento (no nosso teste, o Google)
        window.location.href = data.init_point;
      } else {
        alert("Erro ao gerar o link de pagamento. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Falha na comunicação com o servidor.");
    } finally {
      setIsCheckoutLoading(false); // Volta o botão ao normal se der erro
    }
  };

  return (
    <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        
        <div className="cart-header">
          <h2>Seu Carrinho ({cartCount})</h2>
          <button className="close-cart" onClick={onClose}>✖</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "50px", color: "#aaa" }}>
              Seu carrinho está vazio.
            </p>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <span className="cart-item-title">{item.name}</span>
                  <span className="cart-item-size">Tam: {item.size}</span>
                  
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.size, -1)}>-</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.size, 1)}>+</button>
                  </div>

                  <span className="cart-item-price">{item.price}</span>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id, item.size)}
                  >
                    Remover todos
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>{cartTotal}</span>
          </div>
          {/* O Botão agora chama o handleCheckout em vez do alert */}
          <button 
            className="buy-btn-large" 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCheckoutLoading}
            style={{ opacity: cart.length === 0 || isCheckoutLoading ? 0.7 : 1 }}
          >
            {isCheckoutLoading ? "Gerando Pagamento..." : "Finalizar Compra"}
          </button>
        </div>

      </div>
    </div>
  );
}