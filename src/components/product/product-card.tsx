import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";
import { productCover } from "@/lib/product-image";
import type { Product } from "@/types/product";
import s from "./product-card.module.css";

export function ProductCard({ product }: { product: Product }) {
  const href = `/${product.id}`;

  return (
    <article className={s.card}>
      <Link href={href} className={s.thumb} aria-label={product.name}>
        <Image
          src={productCover(product)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 240px"
          className={s.thumbImage}
        />
      </Link>

      <div className={s.info}>
        <p className={s.name}>{product.name}</p>
        <p className={s.price}>{formatPrice(product.priceInCents)}</p>
        <Link href={href} className={s.buy}>
          Comprar
        </Link>
      </div>
    </article>
  );
}
