import Link from "next/link";
import { Button } from "@/components/ui/button";
import s from "./status.module.css";

export default function NotFound() {
  return (
    <main className={s.main}>
      <h1 className={s.title}>
        Página não <em>encontrada</em>
      </h1>
      <p className={s.text}>
        Essa peça saiu de cena ou o endereço está errado. Que tal dar uma olhada
        na vitrine?
      </p>
      <div className={s.actions}>
        <Link href="/#produtos">
          <Button variant="solid">Ver todos os produtos</Button>
        </Link>
      </div>
    </main>
  );
}
