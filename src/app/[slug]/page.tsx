import { productsData } from "@/data/products";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";

// 1. Adicionamos 'async' antes da função
// 2. Avisamos ao TypeScript que o params agora é uma Promise (promessa)
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // 3. Usamos 'await' para mandar o código esperar a URL ser lida completamente
  const resolvedParams = await params;

  // Busca o produto no nosso arquivo de dados usando o slug resolvido (ex: "marco")
  const product = productsData[resolvedParams.slug];

  // Se o cliente digitar /blabla e o produto não existir, força a página 404 oficial!
  if (!product) {
    notFound();
  }

  // Se achou, monta a página com as variáveis do produto!
  return (
    <main>
      <section className="pdp-lus-section">
        <div className="pdp-lus-main">
          
          {/* ESQUERDA: Nossa nova galeria inteligente injetada aqui */}
          <ProductGallery prefix={product.imagePrefix} count={product.imageCount} />

          {/* DIREITA: Informações e Compra */}
          <div className="pdp-info">
            <h1 className="pdp-title">{product.name}</h1>
            <p className="pdp-price">{product.price}</p>
            <p className="pdp-installments">{product.installments}</p>

            <div className="pdp-details">
              {/* Faz um loop nas linhas de descrição do produto */}
              {product.description.map((linha, index) => (
                <p key={index}>{linha}</p>
              ))}
            </div>

            <div className="pdp-sizes">
              <p>Tamanho:</p>
              <div className="size-options">
                {/* Faz um loop nos tamanhos disponíveis daquele produto específico */}
                {product.sizes.map((size) => (
                  <button key={size} className="size-btn">{size}</button>
                ))}
              </div>
            </div>

            <button className="buy-btn-large">Comprar</button>
          </div>

        </div>
      </section>
    </main>
  );
}