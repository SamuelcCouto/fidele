import Image from "next/image";
import Link from "next/link";
import type { CatalogItem } from "@/lib/catalog";
import { formatPrice } from "@/lib/format-price";
import s from "./product-card.module.css";

export function ProductCard({ item }: { item: CatalogItem }) {
  return (
    <article className={s.card}>
      <Link href={item.href} className={s.thumb} aria-label={item.title}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 240px"
          className={s.thumbImage}
        />
      </Link>

      <div className={s.info}>
        <p className={s.name}>{item.title}</p>
        <p className={s.price}>{formatPrice(item.product.priceInCents)}</p>
        <Link href={item.href} className={s.buy}>
          Comprar
        </Link>
      </div>
    </article>
  );
}
