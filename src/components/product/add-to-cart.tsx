"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/cn";
import { colorCover, hasColorChoice, type Product, type Size } from "@/types/product";
import { useSelectedColor } from "./selected-color";
import s from "./add-to-cart.module.css";

export function AddToCart({ product }: { product: Product }) {
  // A cor vive no contexto porque a galeria também depende dela.
  const { color, setColor } = useSelectedColor();

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => () => clearTimeout(errorTimer.current), []);

  const handleBuy = () => {
    if (!selectedSize) {
      setShowError(true);
      clearTimeout(errorTimer.current);
      errorTimer.current = setTimeout(() => setShowError(false), 2000);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      priceInCents: product.priceInCents,
      // A miniatura no carrinho é a da cor escolhida, não a do produto.
      image: colorCover(color),
      size: selectedSize,
      color: color.name,
      quantity: 1,
    });

    setShowModal(true);
  };

  const handleSelectSize = (size: Size) => {
    setSelectedSize(size);
    setShowError(false);
  };

  return (
    <>
      {hasColorChoice(product) && (
        <div className={s.colors}>
          <p className={s.label}>Cor: {color.name}</p>

          <div className={s.options}>
            {product.colors.map((option) => (
              <button
                key={option.name}
                type="button"
                aria-pressed={option.name === color.name}
                className={cn(s.color, option.name === color.name && s.selected)}
                onClick={() => setColor(option)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={cn(s.sizes, showError && s.shake)}>
        <p className={s.label}>Tamanho:</p>

        <p role="alert" className={cn(s.error, showError && s.visible)}>
          ⚠️ Escolha um tamanho para continuar.
        </p>

        <div className={s.options}>
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={selectedSize === size}
              className={cn(
                s.size,
                selectedSize === size && s.selected,
                showError && s.invalid,
              )}
              onClick={() => handleSelectSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Button variant="buy" fullWidth onClick={handleBuy}>
        Comprar
      </Button>

      <Modal
        isOpen={showModal}
        title="Perfeito! 🛍️"
        actions={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Continuar Comprando
            </Button>
            <Button
              variant="solid"
              onClick={() => {
                setShowModal(false);
                setIsCartOpen(true);
              }}
            >
              Ir para o Carrinho
            </Button>
          </>
        }
      >
        A <strong>{product.name}</strong> ({color.name}, Tam: {selectedSize})
        foi adicionada ao seu carrinho com sucesso.
      </Modal>
    </>
  );
}
