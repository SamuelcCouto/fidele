import { ProductCard } from "./product-card";
import type { Product } from "@/types/product";
import s from "./product-grid.module.css";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className={s.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
