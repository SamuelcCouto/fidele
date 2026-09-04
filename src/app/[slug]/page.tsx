import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductGallery } from "@/components/product/product-gallery";
import { catalogSlugs, resolveSlug, toCatalogItem } from "@/lib/catalog";
import { formatInstallments, formatPrice } from "@/lib/format-price";
import s from "./page.module.css";

type Params = { params: Promise<{ slug: string }> };

// O catálogo é estático: cada produto e cada variação de cor viram páginas
// pré-renderizadas.
export function generateStaticParams() {
  return catalogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveSlug(slug);

  if (!resolved) return {};

  const item = toCatalogItem(resolved.product, resolved.color);

  return {
    title: item.title,
    description: resolved.product.description[0] ?? item.title,
    openGraph: {
      title: item.title,
      images: [item.image],
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const resolved = resolveSlug(slug);

  if (!resolved) {
    notFound();
  }

  const { product, color } = resolved;

  return (
    <main>
      <section className={s.section}>
        <div className={s.main}>
          <ProductGallery product={product} />

          <div className={s.info}>
            <h1 className={s.title}>{product.name}</h1>
            <p className={s.price}>{formatPrice(product.priceInCents)}</p>
            <p className={s.installments}>
              {formatInstallments(product.priceInCents)}
            </p>

            <div className={s.details}>
              {product.description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            {/* A cor vem selecionada conforme o card clicado na vitrine. */}
            <AddToCart product={product} initialColor={color.name} />
          </div>
        </div>
      </section>
    </main>
  );
}
