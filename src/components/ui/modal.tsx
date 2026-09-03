"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import s from "./modal.module.css";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  /** Botões de ação do rodapé. */
  actions: ReactNode;
  /** Largura máxima da caixa, quando o padrão não serve. */
  maxWidth?: CSSProperties["maxWidth"];
}

export function Modal({
  isOpen,
  title,
  children,
  actions,
  maxWidth,
}: ModalProps) {
  return (
    <div className={cn(s.overlay, isOpen && s.open)} aria-hidden={!isOpen}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={s.box}
        style={maxWidth ? { maxWidth } : undefined}
      >
        <h3 className={s.title}>{title}</h3>
        <div className={s.body}>{children}</div>
        <div className={s.actions}>{actions}</div>
      </div>
    </div>
  );
}
