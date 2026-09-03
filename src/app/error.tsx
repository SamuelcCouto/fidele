"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import s from "./status.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro não tratado:", error);
  }, [error]);

  return (
    <main className={s.main}>
      <h1 className={s.title}>
        Algo deu <em>errado</em>
      </h1>
      <p className={s.text}>
        Tivemos um problema para carregar esta página. Tente novamente — se
        continuar, é só chamar a gente no WhatsApp.
      </p>
      <div className={s.actions}>
        <Button variant="solid" onClick={reset}>
          Tentar novamente
        </Button>
      </div>
    </main>
  );
}
