import type { ReactNode } from "react";
import s from "./section-title.module.css";

interface SectionTitleProps {
  children: ReactNode;
  /** Âncora de rolagem, ex.: "produtos" para o link /#produtos. */
  id?: string;
}

export function SectionTitle({ children, id }: SectionTitleProps) {
  return (
    <div id={id} className={s.wrapper}>
      <h2 className={s.heading}>{children}</h2>
    </div>
  );
}
