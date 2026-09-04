import type { CatalogItem } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import s from "./product-grid.module.css";

export function ProductGrid({ items }: { items: CatalogItem[] }) {
  return (
    <div className={s.grid}>
      {items.map((item) => (
        // O href é único por produto+cor — serve de chave sem inventar outra.
        <ProductCard key={item.href} item={item} />
      ))}
    </div>
  );
}
