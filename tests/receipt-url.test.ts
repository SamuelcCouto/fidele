import { describe, expect, it } from "vitest";
import { safeReceiptUrl } from "@/lib/receipt-url";

describe("safeReceiptUrl", () => {
  it.each([
    "https://infinitepay.io/recibo/1",
    "https://comprovante.infinitepay.io/1",
    "https://infinitepay.com.br/recibo/1",
    "https://app.infinitepay.com.br/recibo/1",
  ])("aceita %s", (url) => {
    expect(safeReceiptUrl(url)).toBe(new URL(url).toString());
  });

  it.each([
    // O ponto em `.${host}` é o que impede este: sem ele, passaria.
    ["https://infinitepay.io.site-do-golpe.com/x", "domínio que só começa igual"],
    ["https://golpe.com/infinitepay.io", "domínio no caminho"],
    ["http://comprovante.infinitepay.io/x", "sem https"],
    ["javascript:alert(1)", "esquema javascript"],
    ["data:text/html,<script>alert(1)</script>", "esquema data"],
    ["//comprovante.infinitepay.io/x", "protocolo relativo"],
    ["não é uma url", "texto solto"],
    ["", "vazio"],
  ])("recusa %s (%s)", (url) => {
    expect(safeReceiptUrl(url)).toBeNull();
  });

  it("recusa ausência de valor", () => {
    expect(safeReceiptUrl(undefined)).toBeNull();
  });
});
