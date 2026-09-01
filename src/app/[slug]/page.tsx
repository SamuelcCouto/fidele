import { productsData } from "@/data/products";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import AddToCart from "@/components/AddToCart"; // Puxamos o botão novo!

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = productsData[resolvedParams.slug];

  if (!product) {
    notFound();
  }

  // Preparamos um pacote de dados enxuto para mandar pro carrinho
  const cartProductInfo = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: `/img/${product.imagePrefix}1.jpg`, // Pega a foto 1 como miniatura
    sizes: product.sizes,
  };

  return (
    <main>
      <section className="pdp-lus-section">
        <div className="pdp-lus-main">
          
          <ProductGallery prefix={product.imagePrefix} count={product.imageCount} />

          <div className="pdp-info">
            <h1 className="pdp-title">{product.name}</h1>
            <p className="pdp-price">{product.price}</p>
            <p className="pdp-installments">{product.installments}</p>

            <div className="pdp-details">
              {product.description.map((linha, index) => (
                <p key={index}>{linha}</p>
              ))}
            </div>

            {/* Injetamos a inteligência de compra aqui, substituindo o antigo */}
            <AddToCart product={cartProductInfo} />

          </div>
        </div>
      </section>
    </main>
  );
}