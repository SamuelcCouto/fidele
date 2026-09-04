import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductGallery } from "@/components/product/product-gallery";
import { SelectedColorProvider } from "@/components/product/selected-color";
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
        {/* Galeria e seletor ficam em lados opostos da página, mas compartilham
            a cor escolhida — daí o provider envolver os dois. Começa na cor do
            card clicado na vitrine. */}
        <SelectedColorProvider initial={color}>
          <div className={s.main}>
            <ProductGallery productName={product.name} />

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

              <AddToCart product={product} />
            </div>
          </div>
        </SelectedColorProvider>
      </section>
    </main>
  );
}
