import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
import { catalogItems, searchCatalog } from "@/lib/catalog";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Busca",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  // Mesma função usada pelo autocomplete do header — antes cada tela
  // implementava o próprio filtro.
  const results = query ? searchCatalog(query) : catalogItems();

  return (
    <main className={s.main}>
      <SectionTitle>
        Resultados para: <em>{query}</em>
      </SectionTitle>

      {results.length > 0 ? (
        <ProductGrid items={results} />
      ) : (
        <div className={s.empty}>
          <p className={s.emptyText}>
            Poxa, não encontramos nenhuma peça com esse nome. 💔
          </p>
          <Link href="/#produtos">
            <Button variant="outline">Ver todos os produtos</Button>
          </Link>
        </div>
      )}
    </main>
  );
}
