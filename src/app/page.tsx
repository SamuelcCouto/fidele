import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <>
      {/* FAIXA PROMO */}
      <div className="promo-bar">
        <span>💳 3x SEM JUROS NO CARTÃO</span>
        <span>•</span>
        <span>🚚 FRETE GRÁTIS ACIMA DE R$ 299</span>
      </div>

      <main>
        {/* BANNER DAS MENINAS NO TOPO */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-cover">
              <img src="/img/capa.jpg" alt="Equipe Fidèle" />
            </div>
            <p className="hero-sub">Seja leal a você mesma. Esqueça as regras — se você gosta, use!</p>
          </div>
        </section>

        {/* 1. ADICIONAMOS O ID="produtos" AQUI NO TÍTULO */}
        <div id="produtos" className="section-title centered" style={{ scrollMarginTop: '80px' }}>
          <h2>Mais <span>Desejados</span></h2>
        </div>
        
        <div className="category-pills">
          <button className="pill active">Parte de cima</button>
          <button className="pill">Parte de baixo</button>
          <button className="pill">Fitness</button>
        </div>

        {/* GRADE DE PRODUTOS COMPLETA */}
        <div className="product-grid">
          <ProductCard name="Regata Orvalho" price="R$ 130,00" image="/img/regatabranca.jpg" link="/regata" />
          <ProductCard name="Polo Florescer" price="R$ 155,00" image="/img/polo1.jpg" link="/polo" />
          <ProductCard name="Regata Despertar" price="R$ 115,00" image="/img/despertar1.jpg" link="/despertar" />
          <ProductCard name="Camisa Essência" price="R$ 115,00" image="/img/essencia1.jpg" link="/essencia" />
          <ProductCard name="Regata Eva" price="R$ 100,00" image="/img/eva1.jpg" link="/eva" />
          <ProductCard name="Camisa Marco 23" price="R$ 115,00" image="/img/marco1.jpg" link="/marco" />
          <ProductCard name="Regata Ciclo" price="R$ 100,00" image="/img/ciclo1.jpg" link="/ciclo" />
        </div>

        {/* 2. ADICIONAMOS O ID="quem-somos" AQUI NA SESSÃO */}
        <section id="quem-somos" className="about-section" style={{ scrollMarginTop: '80px' }}>
          <h3>Você já conhece a <span>FIDÈLE?</span></h3>
          <div className="about-content">
            <img src="/img/capa.jpg" alt="Equipe Fidele" />
            <p>Mais do que uma marca de streetwear, somos um movimento. Peças pensadas com exclusividade, tecido premium e atitude para quem dita as próprias regras.</p>
          </div>
        </section>
      </main>
    </>
  );
}