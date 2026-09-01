"use client";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer"; // 1. Importamos a Gaveta

export default function Header() {
  const logoRef = useRef<HTMLImageElement>(null);
  const [isLight, setIsLight] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // 2. Criamos o controle de abrir/fechar
  
  const { cartCount } = useCart(); 

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
          <div className="brand">
            <div className="brand-name">
              <img src="/img/Fidele-logocabecalho.png" alt="FIDÈLE" ref={logoRef} />
            </div>
          </div>
          <nav className="links">
            <a href="#">Tops</a>
            <a href="#">Tanks</a>
            <a href="#">Bags</a>
            <a href="#">Lançamentos</a>
            <a href="#">Sobre</a>
          </nav>
          <div className="nav-icons">
            <div className="icon-btn burger">☰</div>
            <div className="icon-btn">🔎</div>
            <div className="icon-btn theme-toggle" onClick={toggleTheme}>
              {isLight ? '🌙' : '☀️'}
            </div>
            {/* 3. Trocamos o Alert pela função que abre a Gaveta */}
            <div className="icon-btn cart" onClick={() => setIsCartOpen(true)}>
              🛍
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* 4. Colocamos a Gaveta aqui, passando o estado para ela saber quando deve aparecer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}