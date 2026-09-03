"use client";

import { useState } from "react";
import { MenuIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { CartButton } from "./cart-button";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { SearchBar } from "./search-bar";
import { ThemeToggle } from "./theme-toggle";
import s from "./header.module.css";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <>
      <header className={s.header}>
        <div className={s.row}>
          <button
            type="button"
            className={cn(s.iconButton, s.burger)}
            aria-label="Abrir menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon />
          </button>

          <Logo />

          <SearchBar variant="desktop" />

          <div className={s.actions}>
            <ThemeToggle />

            <button
              type="button"
              className={cn(s.iconButton, s.searchToggle)}
              aria-label="Buscar"
              aria-expanded={showMobileSearch}
              onClick={() => setShowMobileSearch((open) => !open)}
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              className={s.iconButton}
              title="Minha Conta"
              aria-label="Minha conta"
              onClick={() => alert("Login / Cashback em breve!")}
            >
              <UserIcon />
            </button>

            <CartButton />
          </div>
        </div>

        {showMobileSearch && (
          <SearchBar
            variant="mobile"
            onNavigate={() => setShowMobileSearch(false)}
          />
        )}
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
