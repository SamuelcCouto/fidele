import { productsData } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  // Pega a palavra que a pessoa digitou na URL (o ?q=...)
  const resolvedParams = await searchParams;
  const query = (resolvedParams.q || "").toLowerCase();

  // Transforma o nosso objeto de produtos em uma lista (Array) para podermos filtrar
  const allProducts = Object.values(productsData);

  // Filtra os produtos: verifica se a palavra digitada tem no Nome ou na Descrição
  const results = allProducts.filter((product) => {
    const matchName = product.name.toLowerCase().includes(query);
    const matchDesc = product.description.some((linha) => linha.toLowerCase().includes(query));
    return matchName || matchDesc;
  });

  return (
    <main style={{ padding: '60px 5%', minHeight: '70vh' }}>
      
      <div className="section-title centered" style={{ marginBottom: '40px' }}>
        <h2>Resultados para: <span>"{query}"</span></h2>
      </div>

      {results.length > 0 ? (
        <div className="product-grid">
          {/* Faz um loop só nos produtos que bateram com a pesquisa */}
          {results.map((product) => (
            <ProductCard 
              key={product.id} 
              name={product.name} 
              price={product.price} 
              image={`/img/${product.imagePrefix}1.jpg`} 
              link={`/${product.id}`} 
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ color: 'var(--cream)', fontSize: '1.2rem', marginBottom: '30px' }}>
            Poxa, não encontramos nenhuma peça com esse nome. 💔
          </p>
          <Link href="/#produtos">
            <button className="btn-outline">Ver todos os produtos</button>
          </Link>
        </div>
      )}

    </main>
  );
}