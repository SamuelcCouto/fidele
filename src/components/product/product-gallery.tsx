"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { productImages } from "@/lib/product-image";
import type { Product } from "@/types/product";
import s from "./product-gallery.module.css";

export function ProductGallery({ product }: { product: Product }) {
  const images = productImages(product);
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className={s.gallery}>
      <div className={s.thumbnails}>
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            aria-label={`Ver foto ${index + 1} de ${product.name}`}
            aria-pressed={mainImage === src}
            className={cn(s.thumb, mainImage === src && s.active)}
            onClick={() => setMainImage(src)}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="80px"
              className={s.thumbImage}
            />
          </button>
        ))}
      </div>

      <div className={s.main}>
        <Image
          src={mainImage}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 600px"
          className={s.mainImage}
        />
      </div>
    </div>
  );
}
