"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useSelectedColor } from "./selected-color";
import s from "./product-gallery.module.css";

export function ProductGallery({ productName }: { productName: string }) {
  const { color } = useSelectedColor();
  const [chosen, setChosen] = useState<string | null>(null);

  // Trocar de cor troca a foto grande: a escolhida deixa de existir na lista
  // da nova cor e a capa dela assume. Derivar assim, em vez de zerar o estado
  // num efeito, evita o quadro intermediário com a foto da cor anterior.
  const main =
    chosen && color.images.includes(chosen) ? chosen : color.images[0];

  return (
    <div className={s.gallery}>
      <div className={s.thumbnails}>
        {color.images.map((src, index) => (
          <button
            key={src}
            type="button"
            aria-label={`Ver foto ${index + 1} de ${productName} ${color.name}`}
            aria-pressed={main === src}
            className={cn(s.thumb, main === src && s.active)}
            onClick={() => setChosen(src)}
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
          src={main}
          alt={`${productName} ${color.name}`}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 600px"
          className={s.mainImage}
        />
      </div>
    </div>
  );
}
