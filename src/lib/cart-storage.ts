import type { CartItem } from "@/types/cart";
import { isSize } from "@/types/product";

const STORAGE_KEY = "@fidele:cart";
const CART_EVENT = "fidele:cartchange";

const EMPTY: CartItem[] = [];

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.priceInCents === "number" &&
    Number.isFinite(item.priceInCents) &&
    typeof item.image === "string" &&
    isSize(item.size) &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

/**
 * Nunca lança: um valor corrompido no localStorage derrubava o site inteiro
 * em toda página, já que o JSON.parse rodava solto dentro de um efeito.
 */
function parse(raw: string | null): CartItem[] {
  if (!raw) return EMPTY;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;

    const items = parsed.filter(isCartItem);
    return items.length > 0 ? items : EMPTY;
  } catch {
    return EMPTY;
  }
}

// `useSyncExternalStore` exige que o snapshot mantenha a mesma referência
// enquanto o dado não muda, senão o React renderiza em laço.
let cachedRaw: string | null = null;
let cachedCart: CartItem[] = EMPTY;

function rawFromStorage(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getCartSnapshot(): CartItem[] {
  const raw = rawFromStorage();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedCart = parse(raw);
  }
  return cachedCart;
}

/** No servidor o carrinho é sempre vazio — ele só existe no navegador. */
export function getServerCartSnapshot(): CartItem[] {
  return EMPTY;
}

export function subscribeCart(onChange: () => void): () => void {
  window.addEventListener(CART_EVENT, onChange);
  // Mantém abas do mesmo navegador em sincronia.
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(CART_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Ponto único de escrita. Recebe o carrinho atual já validado, para os
 * mutadores não dependerem de um valor capturado em closure.
 */
export function updateCart(
  updater: (current: CartItem[]) => CartItem[],
): void {
  const next = updater(getCartSnapshot());

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Cota estourada ou storage bloqueado (aba anônima): o carrinho segue
    // válido em memória até o fim da sessão.
  }

  cachedRaw = rawFromStorage();
  cachedCart = next;
  window.dispatchEvent(new Event(CART_EVENT));
}

/**
 * Esvazia o carrinho. Usado quando o pagamento é confirmado — o comprador não
 * pode voltar para a loja e reencontrar as peças que acabou de pagar.
 */
export function clearCart(): void {
  updateCart(() => EMPTY);
}
