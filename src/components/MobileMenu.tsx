"use client";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      {/* O clique dentro do menu não fecha o overlay */}
      <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
        
        <div className="cart-header">
          <h2 style={{ fontSize: '1.2rem' }}>Menu</h2>
          <button className="close-cart" onClick={onClose}>✖</button>
        </div>

        <nav className="mobile-menu-content">
          <a href="/" className="mobile-link" onClick={onClose}>Início</a>
          <a href="#" className="mobile-link" onClick={onClose}>Produtos</a>
          <a href="#" className="mobile-link" onClick={onClose}>Contato</a>
          <a href="#" className="mobile-link" onClick={onClose}>Como Comprar</a>
          <a href="#" className="mobile-link" onClick={onClose}>Trocas e Devoluções</a>
          <a href="#" className="mobile-link" onClick={onClose}>Quem Somos</a>
          <a href="#" className="mobile-link" onClick={onClose}>Perguntas Frequentes</a>
          <a href="#" className="mobile-link" onClick={onClose}>Link na bio</a>
        </nav>

        <div 
          className="mobile-menu-footer" 
          onClick={() => alert("Área de Login / Cashback será desenvolvida em breve!")}
        >
          {/* Ícone de Usuário Pequeno */}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Iniciar sessão . Criar uma conta</span>
        </div>

      </div>
    </div>
  );
}