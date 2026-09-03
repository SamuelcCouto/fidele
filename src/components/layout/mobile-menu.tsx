"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { instagramUrl, whatsappUrl } from "@/config/site";
import { faqEntries, howToBuySteps } from "@/data/faq";
import { cn } from "@/lib/cn";
import s from "./mobile-menu.module.css";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [openPanel, setOpenPanel] = useState<"how-to-buy" | "faq" | null>(null);

  const closePanel = () => {
    setOpenPanel(null);
    onClose();
  };

  return (
    <>
      <div
        className={cn(s.scrim, isOpen && s.open)}
        aria-hidden={!isOpen}
        onClick={onClose}
      >
        <aside
          className={s.drawer}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          onClick={(event) => event.stopPropagation()}
        >
          <div className={s.header}>
            <h2>Menu</h2>
            <button
              type="button"
              className={s.close}
              aria-label="Fechar menu"
              onClick={onClose}
            >
              ✖
            </button>
          </div>

          <nav className={s.nav}>
            <Link href="/" className={s.link} onClick={onClose}>
              Início
            </Link>
            <Link href="/#produtos" className={s.link} onClick={onClose}>
              Produtos
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
              onClick={onClose}
            >
              Contato
            </a>
            <button
              type="button"
              className={s.link}
              onClick={() => setOpenPanel("how-to-buy")}
            >
              Como Comprar
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
              onClick={onClose}
            >
              Trocas e Devoluções
            </a>
            <Link href="/#quem-somos" className={s.link} onClick={onClose}>
              Quem Somos
            </Link>
            <button
              type="button"
              className={s.link}
              onClick={() => setOpenPanel("faq")}
            >
              Perguntas Frequentes
            </button>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
              onClick={onClose}
            >
              Siga no Instagram
            </a>
          </nav>

          <button
            type="button"
            className={s.footer}
            onClick={() =>
              alert("Área de Login / Cashback será desenvolvida em breve!")
            }
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Iniciar sessão . Criar uma conta</span>
          </button>
        </aside>
      </div>

      <Modal
        isOpen={openPanel === "how-to-buy"}
        title="Como Comprar 🛍️"
        maxWidth={450}
        actions={
          <Button variant="solid" onClick={closePanel}>
            Entendi
          </Button>
        }
      >
        <ol className={s.steps}>
          {howToBuySteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Modal>

      <Modal
        isOpen={openPanel === "faq"}
        title="Perguntas Frequentes 💬"
        maxWidth={500}
        actions={
          <Button variant="solid" onClick={closePanel}>
            Fechar
          </Button>
        }
      >
        <dl className={s.faq}>
          {faqEntries.map((entry) => (
            <div key={entry.question}>
              <dt>{entry.question}</dt>
              <dd>{entry.answer}</dd>
            </div>
          ))}
        </dl>
      </Modal>
    </>
  );
}
