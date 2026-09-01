"use client";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";
import MobileMenu from "./MobileMenu"; // 1. Importamos o menu

export default function Header() {
  const logoRef = useRef<HTMLImageElement>(null);
  const [isLight, setIsLight] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controle do Hambúrguer
  
  const { cartCount, isCartOpen, setIsCartOpen } = useCart(); 

  useEffect(() => {
    let angle = 0;
    let animationFrameId: number;
    const animateLogo = () => {
      angle += 0.03;
      const y = Math.sin(angle) * 3; 
      const rot = Math.cos(angle) * 2; 
      if (logoRef.current) {
        logoRef.current.style.transform = `translateY(${y}px) rotate(${rot}deg)`;
      }
      animationFrameId = requestAnimationFrame(animateLogo);
    };
    animateLogo();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const toggleTheme = () => {
    const body = document.body;
    body.classList.toggle('light-theme');
    setIsLight(body.classList.contains('light-theme')); 
  };

  return (
    <>
      <header>
        <div className="nav-row">
          
          {/* ESQUERDA: Ícone Hambúrguer (Só aparece no Mobile) */}
          <div className="burger" onClick={() => setIsMenuOpen(true)}>
            <svg className="icon-svg" viewBox="0 0 24 24">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </div>

          {/* CENTRO-ESQUERDA: Logo */}
          <div className="brand">
            <div className="brand-name">
              <a href="/">
                <img src="/img/Fidele-logocabecalho.png" alt="FIDÈLE" ref={logoRef} style={{ maxHeight: '40px' }} />
              </a>
            </div>
          </div>

          {/* CENTRO: Barra de Pesquisa (Aparece no Desktop) */}
          <div className="search-container">
            <input type="text" className="search-input" placeholder="Olá, o que você procura?" />
            <button className="search-btn-inside">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          {/* DIREITA: Ícones de Ação */}
          <div className="nav-icons">
            {/* Tema */}
            <div style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={toggleTheme} title="Trocar Tema">
              {isLight ? '🌙' : '☀️'}
            </div>

            {/* Lupa solta (Só aparece no Mobile) */}
            <div className="mobile-search-icon">
              <svg className="icon-svg" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            {/* Ícone de Login/Usuário */}
            <div onClick={() => alert("Login / Cashback em breve!")} title="Minha Conta">
              <svg className="icon-svg" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            {/* Ícone da Sacola Elegante */}
            <div className="cart-wrapper" onClick={() => setIsCartOpen(true)}>
              <svg className="icon-svg" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
          </div>

        </div>
      </header>

      {/* Nossos Menus que deslizam */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}