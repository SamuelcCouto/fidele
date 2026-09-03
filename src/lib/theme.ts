export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "@fidele:theme";

const THEME_EVENT = "fidele:themechange";

/**
 * Roda inline no <head>, antes da primeira pintura, para o tema salvo não
 * piscar em escuro na carga. O padrão é escuro, então só o claro é marcado.
 */
export const themeInitScript = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light"){document.documentElement.dataset.theme="light"}}catch(e){}`;

export function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** O servidor sempre renderiza o tema padrão; o cliente corrige na hidratação. */
export function getServerThemeSnapshot(): Theme {
  return "dark";
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // storage bloqueado: o tema vale só para esta navegação
  }

  window.dispatchEvent(new Event(THEME_EVENT));
}

export function subscribeTheme(onChange: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    // Outra aba trocou o tema: aplica no DOM antes de avisar o React.
    document.documentElement.dataset.theme =
      event.newValue === "light" ? "light" : "dark";
    onChange();
  };

  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", handleStorage);
  };
}
