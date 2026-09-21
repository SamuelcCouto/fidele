"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatPhone, isValidPhone } from "@/lib/phone";
import type { CustomerInput } from "@/types/checkout";
import s from "./customer-details.module.css";

interface CustomerForm {
  name: string;
  phone: string;
  street: string;
  number: string;
  complement: string;
}

const EMPTY_FORM: CustomerForm = {
  name: "",
  phone: "",
  street: "",
  number: "",
  complement: "",
};

interface CustomerDetailsProps {
  /** `null` enquanto o formulário não tiver os campos obrigatórios preenchidos. */
  onChange: (customer: CustomerInput | null) => void;
}

/**
 * Nome, WhatsApp e endereço de quem compra — é o que falta para a ordem de
 * separação sair completa. Bairro, cidade e UF já vêm do CEP; pedir de novo
 * só criaria chance de divergir.
 */
export function CustomerDetails({ onChange }: CustomerDetailsProps) {
  const [form, setForm] = useState<CustomerForm>(EMPTY_FORM);

  const update = (patch: Partial<CustomerForm>) => {
    const next = { ...form, ...patch };
    setForm(next);
    onChange(toCustomer(next));
  };

  return (
    <div className={s.wrap}>
      <p className={s.label}>Seus dados para entrega</p>

      <input
        className={s.input}
        type="text"
        placeholder="Nome completo"
        autoComplete="name"
        value={form.name}
        onChange={(event) => update({ name: event.target.value })}
      />

      <input
        className={s.input}
        type="tel"
        inputMode="numeric"
        placeholder="WhatsApp com DDD"
        autoComplete="tel"
        value={formatPhone(form.phone)}
        onChange={(event) => update({ phone: event.target.value })}
      />

      <div className={s.row}>
        <input
          className={s.input}
          type="text"
          placeholder="Rua"
          autoComplete="address-line1"
          value={form.street}
          onChange={(event) => update({ street: event.target.value })}
        />

        <input
          className={cn(s.input, s.number)}
          type="text"
          placeholder="Número"
          autoComplete="off"
          value={form.number}
          onChange={(event) => update({ number: event.target.value })}
        />
      </div>

      <input
        className={s.input}
        type="text"
        placeholder="Complemento (opcional)"
        autoComplete="address-line2"
        value={form.complement}
        onChange={(event) => update({ complement: event.target.value })}
      />
    </div>
  );
}

function toCustomer(form: CustomerForm): CustomerInput | null {
  const name = form.name.trim();
  const street = form.street.trim();
  const number = form.number.trim();
  const complement = form.complement.trim();

  if (name.length < 2 || street.length < 2 || number.length < 1) return null;
  if (!isValidPhone(form.phone)) return null;

  return {
    name,
    phone: form.phone,
    street,
    number,
    complement: complement || undefined,
  };
}
