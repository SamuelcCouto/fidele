"use client";

import { useSyncExternalStore } from "react";
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeTheme,
} from "@/lib/theme";
import s from "./theme-toggle.module.css";

export function ThemeToggle() {
  // O tema real já foi aplicado no <html> pelo script inline do layout,
  // antes da primeira pintura. Aqui só lemos de volta para o rótulo do botão.
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  return (
    <button
      type="button"
      className={s.toggle}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Trocar tema"
      aria-label="Trocar tema"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
