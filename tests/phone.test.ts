import { describe, expect, it } from "vitest";
import { formatPhone, isValidPhone, phoneDigits } from "@/lib/phone";

describe("phoneDigits", () => {
  it("remove tudo que não é dígito", () => {
    expect(phoneDigits("(62) 99221-0708")).toBe("62992210708");
  });

  it("corta em 11 dígitos", () => {
    expect(phoneDigits("629922107089999")).toBe("62992210708");
  });
});

describe("isValidPhone", () => {
  it("aceita celular com 11 dígitos", () => {
    expect(isValidPhone("62992210708")).toBe(true);
  });

  it("aceita fixo com 10 dígitos", () => {
    expect(isValidPhone("6232210708")).toBe(true);
  });

  it("recusa menos de 10 dígitos", () => {
    expect(isValidPhone("629921070")).toBe(false);
  });

  // phoneDigits trunca em 11 (mesma lógica de cepDigits): dígitos extras são
  // descartados, não motivo de recusa.
  it("ignora dígitos além do 11º", () => {
    expect(isValidPhone("629922107089")).toBe(true);
  });

  it("ignora máscara ao validar", () => {
    expect(isValidPhone("(62) 99221-0708")).toBe(true);
  });

  it("recusa texto sem dígito nenhum", () => {
    expect(isValidPhone("abc")).toBe(false);
  });
});

describe("formatPhone", () => {
  it("formata celular completo", () => {
    expect(formatPhone("62992210708")).toBe("(62) 99221-0708");
  });

  it("formata fixo completo", () => {
    expect(formatPhone("6232210708")).toBe("(62) 3221-0708");
  });

  it("formata progressivamente enquanto o usuário digita", () => {
    expect(formatPhone("6")).toBe("6");
    expect(formatPhone("62")).toBe("62");
    expect(formatPhone("629")).toBe("(62) 9");
    expect(formatPhone("629922")).toBe("(62) 9922");
    expect(formatPhone("6299221070")).toBe("(62) 9922-1070");
  });
});
