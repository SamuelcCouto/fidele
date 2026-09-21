/** Só os dígitos, com DDD. Aceita "(62) 99221-0708", "62992210708" etc. */
export function phoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

/** Celular (11) ou fixo (10) brasileiro, sempre com DDD. */
export function isValidPhone(value: string): boolean {
  const digits = phoneDigits(value);
  return digits.length === 10 || digits.length === 11;
}

/** Máscara de exibição: "62992210708" -> "(62) 99221-0708" */
export function formatPhone(value: string): string {
  const digits = phoneDigits(value);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

  const splitAt = digits.length > 10 ? 7 : 6;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, splitAt)}-${digits.slice(splitAt)}`;
}
