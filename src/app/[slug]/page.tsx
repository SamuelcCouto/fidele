import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductGallery } from "@/components/product/product-gallery";
import { productsData } from "@/data/products";
import { formatInstallments, formatPrice } from "@/lib/format-price";
import { productCover } from "@/lib/product-image";
import s from "./page.module.css";

type Params = { params: Promise<{ slug: string }> };

// O catálogo é estático: as 7 páginas de produto são pré-renderizadas.
export function generateStaticParams() {
  return Object.keys(productsData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = productsData[slug];

  if (!product) return {};

  return {
    title: product.name,
    description: product.description[0] ?? product.name,
    openGraph: {
      title: product.name,
      images: [productCover(product)],
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = productsData[slug];

  if (!product) {
    notFound();
  }

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

            <AddToCart product={product} />
          </div>
        </div>
      </section>
    </main>
  );
}
