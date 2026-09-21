import { kvGet, kvSet } from "@/lib/kv";

export interface PendingOrderItem {
  name: string;
  color: string;
  size: string;
  quantity: number;
  priceInCents: number;
}

export interface PendingOrderAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  uf: string;
}

export interface PendingOrder {
  orderNsu: string;
  createdAt: string;
  customer: { name: string; phone: string };
  address: PendingOrderAddress;
  items: PendingOrderItem[];
  totalInCents: number;
}

/**
 * Uma semana é sobra: a InfinitePay confirma o pagamento em minutos, quase
 * sempre no mesmo dia. O teto existe só para não acumular pedido abandonado
 * para sempre no Redis.
 */
const TTL_SECONDS = 7 * 24 * 60 * 60;

function key(orderNsu: string): string {
  return `pending-order:${orderNsu}`;
}

export async function savePendingOrder(order: PendingOrder): Promise<void> {
  await kvSet(key(order.orderNsu), JSON.stringify(order), TTL_SECONDS);
}

export async function getPendingOrder(
  orderNsu: string,
): Promise<PendingOrder | null> {
  const raw = await kvGet(key(orderNsu));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PendingOrder;
  } catch {
    return null;
  }
}
