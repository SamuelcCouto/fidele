"use client";
import { useState } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Memória para sabermos qual popup deve aparecer
  const [showComoComprar, setShowComoComprar] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  return (
    <>
      <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
        <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
          
          <div className="cart-header">
            <h2 style={{ fontSize: '1.2rem' }}>Menu</h2>
            <button className="close-cart" onClick={onClose}>✖</button>
          </div>

          <nav className="mobile-menu-content">
            {/* 1. Início: O "/" faz o efeito F5 e joga pro topo da home */}
            <a href="/" className="mobile-link" onClick={onClose}>Início</a>
            
            {/* 2. Produtos: Vai rolar até a âncora #produtos */}
            <a href="/#produtos" className="mobile-link" onClick={onClose}>Produtos</a>
            
            {/* 3. Contato: REDIRECIONADO PARA O WHATSAPP */}
            <a href="https://wa.me/5562992210708" target="_blank" rel="noopener noreferrer" className="mobile-link" onClick={onClose}>
              Contato
            </a>
            
            {/* 4. Como Comprar: Abre a nossa caixa personalizada */}
            <a href="#" className="mobile-link" onClick={(e) => { e.preventDefault(); setShowComoComprar(true); }}>
              Como Comprar
            </a>
            
            {/* 5. Trocas: REDIRECIONADO PARA O WHATSAPP */}
            <a href="https://wa.me/5562992210708" target="_blank" rel="noopener noreferrer" className="mobile-link" onClick={onClose}>
              Trocas e Devoluções
            </a>
            
            {/* 6. Quem Somos: Vai rolar até a âncora #quem-somos */}
            <a href="/#quem-somos" className="mobile-link" onClick={onClose}>Quem Somos</a>
            
            {/* 7. Perguntas Frequentes: Abre a nossa caixa personalizada */}
            <a href="#" className="mobile-link" onClick={(e) => { e.preventDefault(); setShowFaq(true); }}>
              Perguntas Frequentes
            </a>
            
            {/* 8. Instagram: Abre em nova aba */}
            <a href="https://www.instagram.com/fideleoficial/" target="_blank" rel="noopener noreferrer" className="mobile-link" onClick={onClose}>
              Siga no Instagram
            </a>
          </nav>

          <div className="mobile-menu-footer" onClick={() => alert("Área de Login / Cashback será desenvolvida em breve!")}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Iniciar sessão . Criar uma conta</span>
          </div>

        </div>
      </div>

      {/* ==================================================== */}
      {/* POPUP: COMO COMPRAR (Com z-index maior pra ficar por cima de tudo) */}
      <div className={`modal-overlay ${showComoComprar ? "show" : ""}`} style={{ zIndex: 10005 }}>
        <div className="modal-box" style={{ maxWidth: '450px' }}>
          <h3>Como Comprar 🛍️</h3>
          <p style={{ textAlign: 'left', fontSize: '0.95rem' }}>
            1. Navegue pela nossa vitrine e escolha a peça que mais combina com você.<br/><br/>
            2. Selecione o tamanho ideal (P, M, G, GG) e clique em "Comprar".<br/><br/>
            3. Acesse o seu carrinho clicando no ícone da sacola no canto superior direito.<br/><br/>
            4. Clique em "Finalizar Compra" e siga os passos no checkout. É rápido e 100% seguro!<br/>
          </p>
          <div className="modal-buttons">
            <button className="btn-solid" onClick={() => { setShowComoComprar(false); onClose(); }}>
              Entendi
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* POPUP: PERGUNTAS FREQUENTES (Pronto para o conteúdo da cliente) */}
      <div className={`modal-overlay ${showFaq ? "show" : ""}`} style={{ zIndex: 10005 }}>
        <div className="modal-box" style={{ maxWidth: '500px' }}>
          <h3>Perguntas Frequentes 💬</h3>
          
          <div style={{ textAlign: 'left', fontSize: '0.9rem', marginBottom: '25px', maxHeight: '40vh', overflowY: 'auto', paddingRight: '10px' }}>
            {/* A cliente pode adicionar quantas perguntas quiser aqui depois */}
            <p><strong>Qual o prazo de postagem?</strong><br/>Enviamos seu pedido em até 48h úteis após a confirmação do pagamento.</p>
            <br/>
            <p><strong>Vocês enviam para todo o Brasil?</strong><br/>Sim, enviamos para todo o território nacional via Correios ou Transportadora.</p>
            <br/>
            <p><strong>Posso trocar se não servir?</strong><br/>Com certeza! A primeira troca é facilitada em até 7 dias após o recebimento.</p>
          </div>

          <div className="modal-buttons">
            <button className="btn-solid" onClick={() => { setShowFaq(false); onClose(); }}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}