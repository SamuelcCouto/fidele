export type DeliveryStatus =
  /** CEP na área atendida — pode seguir para o pagamento. */
  | "deliverable"
  /** CEP existe, cidade fora da área. */
  | "out-of-area"
  /** Os oito dígitos não correspondem a nenhum endereço. */
  | "not-found"
  /** Não deu para consultar (ViaCEP fora do ar, timeout). */
  | "unavailable";

export interface DeliveryCheckRequest {
  /** Oito dígitos, sem máscara. */
  cep: string;
}

export interface DeliveryCheckResponse {
  status: DeliveryStatus;
  cep: string;
  city?: string;
  uf?: string;
}
