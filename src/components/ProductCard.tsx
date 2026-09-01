interface ProductProps {
  name: string;
  price: string;
  image: string;
  link: string;
}

export default function ProductCard({ name, price, image, link }: ProductProps) {
  return (
    <div className="product-card">
      <div className="product-thumb">
        <a href={link}>
          <img src={image} alt={name} />
        </a>
      </div>
      <div className="product-info">
        <p className="product-name">{name}</p>
        <p className="product-price">{price}</p>
        <a 
          href={link} 
          className="buy-btn" 
          style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
        >
          Comprar
        </a>
      </div>
    </div>
  );
}