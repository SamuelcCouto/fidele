"use client";
import { useCart } from "@/contexts/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, cartTotal, cartCount } = useCart();

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
                  <span className="cart-item-size">Tam: {item.size} | Qtd: {item.quantity}</span>
                  <span className="cart-item-price">{item.price}</span>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id, item.size)}
                  >
                    Remover
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
          <button 
            className="buy-btn-large" 
            onClick={() => alert("Integração com o Checkout (MercadoPago/Stripe) virá na próxima fase!")}
          >
            Finalizar Compra
          </button>
        </div>

      </div>
    </div>
  );
}