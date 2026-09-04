"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { DELIVERY_AREA_LABEL } from "@/config/delivery";
import { whatsappUrlWithText } from "@/config/site";
import { cepDigits, formatCep } from "@/lib/cep";
import type { DeliveryCheckRequest, DeliveryCheckResponse } from "@/types/delivery";
import s from "./delivery-check.module.css";

interface DeliveryCheckProps {
  /** Recebe o resultado a cada consulta, ou null enquanto não há um. */
  onResult: (result: DeliveryCheckResponse | null) => void;
}

export function DeliveryCheck({ onResult }: DeliveryCheckProps) {
  const [value, setValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<DeliveryCheckResponse | null>(null);

  // Sem isto, cada tecla depois do oitavo dígito dispararia a consulta de novo.
  const lastChecked = useRef("");

  const check = async (cep: string) => {
    if (lastChecked.current === cep) return;
    lastChecked.current = cep;

    setIsChecking(true);
    const payload: DeliveryCheckRequest = { cep };

    try {
      const response = await fetch("/api/entrega", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Consulta respondeu ${response.status}`);

      const data = (await response.json()) as DeliveryCheckResponse;
      setResult(data);
      onResult(data);
    } catch (cause) {
      console.error("Erro ao consultar o CEP:", cause);
      // A rota já devolve "unavailable" quando o ViaCEP falha; cair aqui é a
      // própria loja fora do ar. Para o cliente, o desfecho é o mesmo.
      const fallback: DeliveryCheckResponse = { status: "unavailable", cep };
      setResult(fallback);
      onResult(fallback);
    } finally {
      setIsChecking(false);
    }
  };

  const handleChange = (raw: string) => {
    setValue(formatCep(raw));
    setResult(null);
    onResult(null);

    const digits = cepDigits(raw);

    if (digits.length === 8) {
      void check(digits);
    } else {
      // Apagou um dígito: o CEP anterior pode ser consultado de novo.
      lastChecked.current = "";
    }
  };

  return (
    <div className={s.wrap}>
      <label className={s.label} htmlFor="cep">
        Onde você quer receber?
      </label>

      <input
        id="cep"
        name="cep"
        className={s.input}
        type="text"
        inputMode="numeric"
        autoComplete="postal-code"
        placeholder="Digite seu CEP"
        maxLength={9}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        aria-describedby="cep-status"
      />

      <p id="cep-status" role="status" aria-live="polite" className={s.message}>
        {isChecking && <span className={s.info}>Verificando…</span>}

        {!isChecking && result?.status === "deliverable" && (
          <span className={s.ok}>
            ✓ Entregamos em {result.city}. Pode finalizar!
          </span>
        )}

        {!isChecking && result?.status === "out-of-area" && (
          <span className={s.info}>
            Ainda não entregamos em {result.city}/{result.uf}. Hoje atendemos{" "}
            {DELIVERY_AREA_LABEL} — mas fala com a gente, dá para combinar.
          </span>
        )}

        {!isChecking && result?.status === "not-found" && (
          <span className={s.bad}>
            Não encontramos esse CEP. Confira os números.
          </span>
        )}

        {!isChecking && result?.status === "unavailable" && (
          <span className={s.info}>
            Não conseguimos verificar seu CEP agora. Chama a gente que a gente
            resolve.
          </span>
        )}
      </p>

      {!isChecking &&
        (result?.status === "out-of-area" ||
          result?.status === "unavailable") && (
          <div className={s.action}>
            <a
              href={whatsappUrlWithText(
                result.status === "out-of-area"
                  ? `Olá! Quero comprar na FIDÈLE, mas meu CEP é ${formatCep(result.cep)} (${result.city}/${result.uf}) e o site diz que ainda não há entrega aqui. Dá para combinar o envio?`
                  : `Olá! Quero comprar na FIDÈLE, mas o site não conseguiu verificar meu CEP ${formatCep(result.cep)}. Podem me ajudar?`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" fullWidth>
                Falar no WhatsApp
              </Button>
            </a>
          </div>
        )}
    </div>
  );
}

/**
 * Só este desfecho libera o pagamento. É type guard para quem chama poder ler
 * o `cep` já confirmado sem repetir a checagem.
 */
export function canCheckout(
  result: DeliveryCheckResponse | null,
): result is DeliveryCheckResponse & { status: "deliverable" } {
  return result?.status === "deliverable";
}
