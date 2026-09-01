"use client"; // Habilita clicks e animações neste Lego
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const logoRef = useRef<HTMLImageElement>(null);
  const [isLight, setIsLight] = useState(false); // Memória do React para saber o tema atual

  // Animação orgânica da Logo FDL
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

  // Função do clique do Sol/Lua
  const toggleTheme = () => {
    const body = document.body;
    body.classList.toggle('light-theme');
    setIsLight(body.classList.contains('light-theme')); // Atualiza o ícone
  };

  return (
    <header>
      <div className="nav-row">
        <div className="brand">
          <div className="brand-name">
            {/* O ref={} conecta essa imagem à animação do JS acima */}
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
          {/* Adicionamos o evento onClick do React */}
          <div className="icon-btn theme-toggle" onClick={toggleTheme}>
            {isLight ? '🌙' : '☀️'}
          </div>
          <div className="icon-btn cart" onClick={() => alert('O Carrinho será implementado em breve!')}>
            🛍<span className="cart-count">2</span>
          </div>
        </div>
      </div>
    </header>
  );
}