"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ProductColor } from "@/types/product";

interface SelectedColorValue {
  color: ProductColor;
  setColor: (color: ProductColor) => void;
}

const SelectedColorContext = createContext<SelectedColorValue | undefined>(
  undefined,
);

/**
 * A cor escolhida é lida por dois componentes que não são pai e filho: a
 * galeria, de um lado da página, e o seletor, do outro. O contexto liga os
 * dois sem transformar a página inteira em componente de cliente.
 */
export function SelectedColorProvider({
  initial,
  children,
}: {
  initial: ProductColor;
  children: ReactNode;
}) {
  const [color, setColor] = useState(initial);

  return (
    <SelectedColorContext.Provider value={{ color, setColor }}>
      {children}
    </SelectedColorContext.Provider>
  );
}

export function useSelectedColor(): SelectedColorValue {
  const context = useContext(SelectedColorContext);

  if (!context) {
    throw new Error(
      "useSelectedColor deve ser usado dentro de um SelectedColorProvider",
    );
  }

  return context;
}
