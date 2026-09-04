import { z } from "zod";

const VIACEP_BASE = "https://viacep.com.br/ws";

/** A consulta acontece enquanto o cliente espera: melhor falhar do que travar. */
const TIMEOUT_MS = 6_000;

/** Só os dígitos. Aceita "74473-813", "74473813" ou com espaços sobrando. */
export function cepDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 8);
}

/** Máscara de exibição: "74473813" -> "74473-813" */
export function formatCep(value: string): string {
  const digits = cepDigits(value);
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
}

export function isCompleteCep(value: string): boolean {
  return cepDigits(value).length === 8;
}

export interface CepAddress {
  cep: string;
  city: string;
  uf: string;
  neighborhood?: string;
}

/** Consulta indisponível — diferente de "CEP não existe", que devolve null. */
export class CepLookupError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "CepLookupError";
  }
}

/**
 * O ViaCEP sinaliza CEP inexistente com um campo `erro` que ora vem booleano
 * (`true`), ora vem string (`"true"`) — comprovado consultando a API. Por isso
 * o schema aceita os dois e a checagem é por presença, não por igualdade.
 */
const viaCepSchema = z.object({
  erro: z.union([z.boolean(), z.string()]).optional(),
  cep: z.string().optional(),
  localidade: z.string().optional(),
  uf: z.string().optional(),
  bairro: z.string().optional(),
});

/**
 * Resolve o CEP em cidade/UF.
 *
 * @returns o endereço, ou `null` quando o CEP não existe.
 * @throws {CepLookupError} quando não foi possível consultar.
 */
export async function lookupCep(value: string): Promise<CepAddress | null> {
  const digits = cepDigits(value);

  if (digits.length !== 8) {
    throw new CepLookupError(`CEP com ${digits.length} dígitos.`);
  }

  let response: Response;
  try {
    response = await fetch(`${VIACEP_BASE}/${digits}/json/`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // Endereço de CEP praticamente não muda: um dia de cache poupa a
      // consulta externa em cada abertura de carrinho.
      next: { revalidate: 86_400 },
    });
  } catch (cause) {
    throw new CepLookupError("ViaCEP inacessível.", { cause });
  }

  if (!response.ok) {
    throw new CepLookupError(`ViaCEP respondeu ${response.status}.`);
  }

  const raw: unknown = await response.json().catch(() => null);
  const parsed = viaCepSchema.safeParse(raw);

  if (!parsed.success) {
    throw new CepLookupError("Resposta do ViaCEP fora do contrato.");
  }

  if (parsed.data.erro !== undefined) return null;

  const { localidade, uf, bairro } = parsed.data;

  // Um 200 sem cidade não é "CEP inexistente", é contrato quebrado: tratar
  // como inexistente recusaria um cliente válido sem motivo.
  if (!localidade || !uf) {
    throw new CepLookupError("ViaCEP devolveu endereço sem cidade ou UF.");
  }

  return { cep: digits, city: localidade, uf, neighborhood: bairro };
}
