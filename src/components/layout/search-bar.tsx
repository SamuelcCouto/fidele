"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { searchCatalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/format-price";
import s from "./search-bar.module.css";

interface SearchBarProps {
  variant?: "desktop" | "mobile";
  /** Chamado após navegar, para o header fechar a busca mobile. */
  onNavigate?: () => void;
}

export function SearchBar({ variant = "desktop", onNavigate }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Deriva do texto em vez de guardar resultados em outro useState —
  // eram três estados para uma informação só.
  const results = useMemo(() => searchCatalog(query), [query]);
  const showDropdown = isFocused && query.trim().length > 0;

  const finish = () => {
    setQuery("");
    setIsFocused(false);
    onNavigate?.();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    router.push(`/busca?q=${encodeURIComponent(term)}`);
    finish();
  };

  const goToProduct = (href: string) => {
    router.push(href);
    finish();
  };

  const isMobile = variant === "mobile";

  return (
    <form
      className={cn(s.form, isMobile ? s.mobile : s.desktop)}
      onSubmit={handleSubmit}
      role="search"
    >
      <input
        type="search"
        className={s.input}
        placeholder={isMobile ? "Buscar produtos..." : "Olá, o que você procura?"}
        aria-label="Buscar produtos"
        value={query}
        autoFocus={isMobile}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {isMobile ? (
        <Button type="submit" variant="buy" className={s.submitMobile}>
          Ir
        </Button>
      ) : (
        <button type="submit" className={s.submitInside} aria-label="Buscar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      )}

      {/* preventDefault no mousedown mantém o foco no input, para que o
          clique no resultado aconteça antes do blur fechar o dropdown. */}
      <div
        className={cn(s.dropdown, showDropdown && s.visible)}
        onMouseDown={(event) => event.preventDefault()}
      >
        {results.length > 0 ? (
          results.map((item) => (
            <button
              key={item.href}
              type="button"
              className={s.result}
              onClick={() => goToProduct(item.href)}
            >
              <span className={s.resultThumb}>
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="45px"
                  className={s.resultImage}
                />
              </span>
              <span className={s.resultInfo}>
                <span className={s.resultName}>{item.title}</span>
                <span className={s.resultPrice}>
                  {formatPrice(item.product.priceInCents)}
                </span>
              </span>
            </button>
          ))
        ) : (
          <p className={s.empty}>Nenhum produto encontrado.</p>
        )}
      </div>
    </form>
  );
}
