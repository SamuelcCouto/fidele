import Image from "next/image";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionTitle } from "@/components/ui/section-title";
import { allProducts } from "@/lib/search-products";
import s from "./page.module.css";

const categories = ["Parte de cima", "Parte de baixo", "Fitness"];

export default function Home() {
  // A vitrine sai do catálogo — antes os 7 produtos eram redigitados aqui à
  // mão e a foto da regata já tinha divergido da usada nas outras telas.
  const products = allProducts();

  return (
    <>
      <div className={s.promo}>
        <span>💳 3x SEM JUROS NO CARTÃO</span>
        <span>•</span>
        <span>🚚 FRETE GRÁTIS ACIMA DE R$ 299</span>
      </div>

      <main>
        <section className={s.hero}>
          <div className={s.heroInner}>
            <div className={s.heroCover}>
              <Image
                src="/img/capa.jpg"
                alt="Equipe Fidèle"
                fill
                priority
                sizes="100vw"
                className={s.heroImage}
              />
            </div>
            <p className={s.heroSub}>
              Seja leal a você mesma. Esqueça as regras — se você gosta, use!
            </p>
          </div>
        </section>

        <SectionTitle id="produtos">
          Mais <em>Desejados</em>
        </SectionTitle>

        <div className={s.pills}>
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={index === 0 ? `${s.pill} ${s.active}` : s.pill}
            >
              {category}
            </button>
          ))}
        </div>

        <ProductGrid products={products} />

        <section id="quem-somos" className={s.about}>
          <h3>
            Você já conhece a <em>FIDÈLE?</em>
          </h3>
          <Image
            src="/img/capa.jpg"
            alt="Equipe Fidèle"
            width={400}
            height={267}
            sizes="(max-width: 768px) 100vw, 400px"
            className={s.aboutImage}
          />
          <p className={s.aboutText}>
            Mais do que uma marca de streetwear, somos um movimento. Peças
            pensadas com exclusividade, tecido premium e atitude para quem dita
            as próprias regras.
          </p>
        </section>
      </main>
    </>
  );
}
