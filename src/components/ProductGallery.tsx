"use client"; // Precisa disso porque tem interação (clique)
import { useState } from "react";

interface GalleryProps {
  prefix: string; // Ex: "marco"
  count: number;  // Ex: 14
}

export default function ProductGallery({ prefix, count }: GalleryProps) {
  // A "memória" do React para guardar qual é a foto grande atual
  const [mainImage, setMainImage] = useState(`/img/${prefix}1.jpg`);

  // Cria um array de números [1, 2, 3... até o count]
  const images = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <div className="pdp-gallery">
      {/* Miniaturas */}
      <div className="pdp-thumbnails">
        {images.map((num) => {
          const src = `/img/${prefix}${num}.jpg`;
          return (
            <img
              key={num}
              src={src}
              alt={`Miniatura ${num}`}
              // Se a foto atual for igual a essa miniatura, ganha a borda rosa (active)
              className={`thumb ${mainImage === src ? 'active' : ''}`}
              // Quando clica, troca a foto grande!
              onClick={() => setMainImage(src)}
            />
          );
        })}
      </div>
      
      {/* Foto Grande Principal */}
      <div className="pdp-main-image">
        <img src={mainImage} alt="Produto Principal" />
      </div>
    </div>
  );
}