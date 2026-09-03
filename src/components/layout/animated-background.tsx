"use client";

import { useEffect, useRef } from "react";
import s from "./animated-background.module.css";

const MAX_LOGOS = 600;
const MIN_LOGOS = 150;
const AREA_PER_LOGO = 8000;

export function AnimatedBackground() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    let buildTimer: ReturnType<typeof setTimeout>;
    let resizeTimer: ReturnType<typeof setTimeout>;
    let parallaxFrame = 0;

    const buildField = () => {
      clearTimeout(buildTimer);
      // Espera o layout assentar para medir a altura real do documento.
      buildTimer = setTimeout(() => {
        const area = document.body.scrollWidth * document.body.scrollHeight;
        const count = Math.min(
          MAX_LOGOS,
          Math.max(MIN_LOGOS, Math.round(area / AREA_PER_LOGO)),
        );

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < count; i += 1) {
          const logo = document.createElement("img");
          logo.src = "/img/fdl-logo.png";
          logo.alt = "";
          logo.decoding = "async";

          const rotation = (Math.random() * 50 - 25).toFixed(1);
          logo.style.setProperty("--rot", `${rotation}deg`);
          logo.style.top = `${Math.random() * 100}%`;
          logo.style.left = `${Math.random() * 100}%`;
          logo.style.width = `${50 + Math.random() * 90}px`;
          logo.style.opacity = (0.15 + Math.random() * 0.25).toFixed(2);
          logo.style.transform = `rotate(${rotation}deg)`;
          logo.style.animationDuration = `${(6 + Math.random() * 10).toFixed(1)}s`;
          logo.style.animationDelay = `${(Math.random() * 6).toFixed(1)}s`;

          fragment.appendChild(logo);
        }

        field.replaceChildren(fragment);
      }, 100);
    };

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildField, 300);
    };

    // Parallax limitado a um quadro por frame — o handler original escrevia
    // no style a cada evento de mousemove.
    const handleMouseMove = (event: MouseEvent) => {
      if (parallaxFrame) return;
      parallaxFrame = requestAnimationFrame(() => {
        parallaxFrame = 0;
        const x = (event.clientX / window.innerWidth - 0.5) * 24;
        const y = (event.clientY / window.innerHeight - 0.5) * 24;
        field.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    buildField();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(buildTimer);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(parallaxFrame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <div ref={fieldRef} className={s.field} aria-hidden="true" />;
}
