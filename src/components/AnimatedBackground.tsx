"use client"; // A mágica que permite rodar JS no navegador
import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bgField = bgRef.current;
    if (!bgField) return;

    function buildField() {
      if (!bgField) return;
      bgField.innerHTML = ''; // Limpa o fundo antes de recriar
      
      setTimeout(() => {
        const w = document.body.scrollWidth;
        const h = document.body.scrollHeight;
        const area = w * h;
        // Calcula a quantidade de logos baseada no tamanho da tela
        const count = Math.min(600, Math.max(150, Math.round(area / 8000)));
        
        for(let i = 0; i < count; i++){
          const el = document.createElement('img');
          el.src = '/img/fdl-logo.png'; 
          el.alt = '';
          
          const size = 50 + Math.random() * 90; 
          const rot = (Math.random() * 50 - 25).toFixed(1);
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const op = (0.15 + Math.random() * 0.25).toFixed(2);
          const dur = (6 + Math.random() * 10).toFixed(1);
          const delay = (Math.random() * 6).toFixed(1);
          
          el.style.setProperty('--rot', rot + 'deg');
          el.style.top = top + '%';
          el.style.left = left + '%';
          el.style.width = size + 'px';
          el.style.opacity = op;
          el.style.transform = `rotate(${rot}deg)`;
          el.style.animationDuration = dur + 's';
          el.style.animationDelay = delay + 's';
          
          bgField.appendChild(el);
        }
      }, 100);
    }

    buildField();
    
    // Atualiza a quantidade se o usuário redimensionar a tela
    let resizeT: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(buildField, 300);
    };

    // Efeito Parallax do mouse
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      if (bgField) bgField.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Regra de ouro do React: sempre limpe a bagunça ao sair da página!
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div className="bg-field" ref={bgRef}></div>;
}