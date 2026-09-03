"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import s from "./logo.module.css";

export function Logo() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let angle = 0;
    let frame = 0;

    const animate = () => {
      angle += 0.03;
      if (ref.current) {
        const y = Math.sin(angle) * 3;
        const rotation = Math.cos(angle) * 2;
        ref.current.style.transform = `translateY(${y}px) rotate(${rotation}deg)`;
      }
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Link href="/" className={s.logo} aria-label="FIDÈLE — página inicial">
      <span ref={ref} className={s.inner}>
        <Image
          src="/img/Fidele-logocabecalho.png"
          alt="FIDÈLE"
          width={46}
          height={40}
          priority
          className={s.image}
        />
      </span>
    </Link>
  );
}
