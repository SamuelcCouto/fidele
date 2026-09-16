import Image from "next/image";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionTitle } from "@/components/ui/section-title";
import { catalogItems } from "@/lib/catalog";
import s from "./page.module.css";

export default function Home() {
  // A vitrine sai do catálogo, um card por cor: com poucos produtos, as
  // variações dão volume à grade e o cliente já vê a cor antes de entrar.
  const items = catalogItems();

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
            <p className={s.heroSub}>Seja leal a você mesma!</p>
          </div>
        </section>

        <SectionTitle id="produtos">
          Drop <em>Renascer</em>
        </SectionTitle>

        <ProductGrid items={items} />

        <section id="quem-somos" className={s.about}>
          {/* A cliente pediu para tirar a frase "Você já conhece a FIDÈLE?" e
              deixar só a arte da marca. O <h3> continua sendo o título da
              seção: o alt da imagem é que dá o nome acessível. */}
          <h3 className={s.aboutHeading}>
            <Image
              src="/img/logofidele.png"
              alt="FIDÈLE"
              width={802}
              height={522}
              sizes="(max-width: 768px) 70vw, 280px"
              className={s.aboutLogo}
            />
          </h3>
          <Image
            src="/img/capa.jpg"
            alt="Equipe Fidèle"
            width={400}
            height={267}
            sizes="(max-width: 768px) 100vw, 400px"
            className={s.aboutImage}
          />
          <div className={s.aboutText}>
            <p>
              No dia 23 a Fidèle nasceu da vontade de criar algo que fosse além
              das roupas.
            </p>
            <p>
              Somos para mulheres que têm personalidade, opinião e não foram
              feitas para caber nas regras que as pessoas criaram.
            </p>
            <p>
              Cada peça carrega atitude, identidade e liberdade para você ser
              exatamente quem é.
            </p>
            <p>Porque estilo não deveria dizer quem você precisa ser.</p>
            <p className={s.aboutSignature}>
              Seja leal a você mesma. Esqueça as regras. Se você gosta, use.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
