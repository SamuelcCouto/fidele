import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/checkout/route";
import { resetRateLimit } from "@/lib/rate-limit";

const LINK = "https://checkout.infinitepay.io/loja?lenc=abc";

function json(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body } as unknown as Response;
}

interface Cenario {
  city?: string;
  uf?: string;
  cepExiste?: boolean;
  cepFalha?: boolean;
  linkFalha?: boolean;
}

function mockRede({
  city = "Goiânia",
  uf = "GO",
  cepExiste = true,
  cepFalha = false,
  linkFalha = false,
}: Cenario = {}) {
  const fetchMock = vi.fn(async (url: string | URL, _init?: RequestInit) => {
    const href = String(url);

    if (href.includes("viacep")) {
      if (cepFalha) throw new Error("ViaCEP fora do ar");
      return json(cepExiste ? { localidade: city, uf } : { erro: true });
    }

    if (href.includes("infinitepay")) {
      return linkFalha ? json({}, false, 500) : json({ url: LINK });
    }

    throw new Error(`URL inesperada no teste: ${href}`);
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

let ipSeq = 0;

function post(body: unknown) {
  // Um IP por chamada: o limitador guarda estado entre casos.
  ipSeq += 1;
  return POST(
    new Request("https://loja.test/api/checkout", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": `198.51.100.${ipSeq}`,
      },
      body: JSON.stringify(body),
    }),
  );
}

function postComIp(ip: string, body: unknown = PEDIDO_VALIDO) {
  return POST(
    new Request("https://loja.test/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    }),
  );
}

const PEDIDO_VALIDO = {
  items: [{ id: "marco", size: "P", color: "Branco", quantity: 2 }],
  cep: "74473813",
};

type FetchMock = ReturnType<typeof mockRede>;

/** Corpo JSON enviado à InfinitePay na criação do link. */
function corpoEnviado(fetchMock: FetchMock) {
  const chamada = fetchMock.mock.calls.find(([url]) =>
    String(url).includes("infinitepay"),
  );

  if (!chamada?.[1]?.body) {
    throw new Error("A InfinitePay não chegou a ser chamada.");
  }

  return JSON.parse(String(chamada[1].body));
}

function criouCobranca(fetchMock: FetchMock): boolean {
  return fetchMock.mock.calls.some(([url]) =>
    String(url).includes("infinitepay"),
  );
}

beforeEach(() => {
  vi.unstubAllGlobals();
  resetRateLimit();
  process.env.INFINITEPAY_HANDLE = "loja-de-teste";
  ipSeq += 100;
});

describe("POST /api/checkout — caminho feliz", () => {
  it("devolve a URL do checkout e um identificador de pedido", async () => {
    mockRede();
    const response = await post(PEDIDO_VALIDO);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      checkoutUrl: LINK,
      orderNsu: expect.any(String),
    });
  });

  it("manda cor e tamanho na descrição — é o que a loja lê para separar", async () => {
    const fetchMock = mockRede();
    await post(PEDIDO_VALIDO);

    expect(corpoEnviado(fetchMock).items).toEqual([
      {
        quantity: 2,
        price: 11500,
        description: "Camisa Marco 23 — Branco — Tam P",
      },
    ]);
  });

  it("não anuncia webhook quando a loja não é publicamente alcançável", async () => {
    const fetchMock = mockRede();
    await post(PEDIDO_VALIDO);
    expect(corpoEnviado(fetchMock).webhook_url).toBeUndefined();
  });
});

describe("POST /api/checkout — adulteração", () => {
  // O teste que mais importa: o preço tem de vir do catálogo, sempre.
  it("ignora preço enviado pelo cliente", async () => {
    const fetchMock = mockRede();
    await post({
      items: [
        {
          id: "marco",
          size: "P",
          color: "Branco",
          quantity: 1,
          price: 1,
          priceInCents: 1,
        },
      ],
      cep: "74473813",
    });

    expect(corpoEnviado(fetchMock).items[0].price).toBe(11500);
  });

  it.each([
    [
      "produto inexistente",
      { id: "camisa-falsa", size: "P", color: "Branco", quantity: 1 },
    ],
    [
      "chave herdada do Object",
      { id: "__proto__", size: "P", color: "Branco", quantity: 1 },
    ],
    [
      "tamanho fora do enum",
      { id: "marco", size: "XG", color: "Branco", quantity: 1 },
    ],
    [
      "tamanho que o produto não tem",
      { id: "marco", size: "GG", color: "Branco", quantity: 1 },
    ],
    ["cor inventada", { id: "marco", size: "P", color: "Verde", quantity: 1 }],
    [
      "cor de outro produto",
      { id: "marco", size: "P", color: "Terracota", quantity: 1 },
    ],
    ["quantidade zero", { id: "marco", size: "P", color: "Branco", quantity: 0 }],
    [
      "quantidade negativa",
      { id: "marco", size: "P", color: "Branco", quantity: -1 },
    ],
    [
      "quantidade fracionada",
      { id: "marco", size: "P", color: "Branco", quantity: 1.5 },
    ],
    [
      "quantidade acima do teto",
      { id: "marco", size: "P", color: "Branco", quantity: 21 },
    ],
    [
      "id gigante",
      { id: "A".repeat(500), size: "P", color: "Branco", quantity: 1 },
    ],
  ])("recusa %s sem criar cobrança", async (_caso, item) => {
    const fetchMock = mockRede();
    const response = await post({ items: [item], cep: "74473813" });

    expect(response.status).toBe(400);
    expect(criouCobranca(fetchMock)).toBe(false);
  });

  it("recusa carrinho vazio", async () => {
    mockRede();
    expect((await post({ items: [], cep: "74473813" })).status).toBe(400);
  });

  it("recusa corpo que não é JSON", async () => {
    mockRede();
    const response = await POST(
      new Request("https://loja.test/api/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "198.51.100.250",
        },
        body: "nao sou json",
      }),
    );
    expect(response.status).toBe(400);
  });
});

describe("POST /api/checkout — área de entrega", () => {
  it("recusa cidade fora da área e não chega a criar cobrança", async () => {
    const fetchMock = mockRede({ city: "São Paulo", uf: "SP" });
    const response = await post(PEDIDO_VALIDO);

    expect(response.status).toBe(422);
    expect(criouCobranca(fetchMock)).toBe(false);
  });

  it("recusa CEP inexistente", async () => {
    mockRede({ cepExiste: false });
    expect((await post(PEDIDO_VALIDO)).status).toBe(400);
  });

  // Sem confirmar a cidade não dá para cobrar: seria vender entrega que talvez
  // não exista. O 503 diz ao carrinho para oferecer o WhatsApp.
  it("recusa quando não consegue verificar o CEP", async () => {
    mockRede({ cepFalha: true });
    expect((await post(PEDIDO_VALIDO)).status).toBe(503);
  });

  it("recusa pedido sem CEP", async () => {
    mockRede();
    expect((await post({ items: PEDIDO_VALIDO.items })).status).toBe(400);
  });
});

describe("POST /api/checkout — limitador por IP", () => {
  it("bloqueia a partir da sexta tentativa no mesmo minuto", async () => {
    mockRede();

    for (let i = 0; i < 5; i++) {
      expect((await postComIp("203.0.113.77")).status, `tentativa ${i + 1}`).toBe(
        200,
      );
    }

    const bloqueada = await postComIp("203.0.113.77");
    expect(bloqueada.status).toBe(429);
    expect(Number(bloqueada.headers.get("Retry-After"))).toBeGreaterThan(0);
  });

  it("um IP bloqueado não afeta outro", async () => {
    mockRede();
    for (let i = 0; i < 6; i++) await postComIp("203.0.113.88");
    expect((await postComIp("203.0.113.99")).status).toBe(200);
  });
});

describe("POST /api/checkout — CSRF", () => {
  function postBruto(headers: Record<string, string>) {
    return POST(
      new Request("https://loja.test/api/checkout", {
        method: "POST",
        headers: { "x-forwarded-for": "198.51.100.240", ...headers },
        body: JSON.stringify(PEDIDO_VALIDO),
      }),
    );
  }

  // Formulário cross-site só consegue mandar estes três tipos. Aceitar
  // qualquer um deles é o que tornava a rota forjável de fora.
  it.each([
    "text/plain",
    "application/x-www-form-urlencoded",
    "multipart/form-data",
  ])("recusa Content-Type %s com 415", async (contentType) => {
    const fetchMock = mockRede();
    const response = await postBruto({ "content-type": contentType });

    expect(response.status).toBe(415);
    expect(criouCobranca(fetchMock)).toBe(false);
  });

  it("recusa requisição sem Content-Type", async () => {
    const fetchMock = mockRede();
    expect((await postBruto({})).status).toBe(415);
    expect(criouCobranca(fetchMock)).toBe(false);
  });

  it("recusa Origin de outro site", async () => {
    const fetchMock = mockRede();
    const response = await postBruto({
      "content-type": "application/json",
      origin: "https://site-do-atacante.com",
    });

    expect(response.status).toBe(403);
    expect(criouCobranca(fetchMock)).toBe(false);
  });

  it("recusa Origin nulo, que é o de iframe em sandbox", async () => {
    mockRede();
    const response = await postBruto({
      "content-type": "application/json",
      origin: "null",
    });
    expect(response.status).toBe(403);
  });

  it("aceita Origin da própria loja", async () => {
    mockRede();
    const response = await postBruto({
      "content-type": "application/json",
      origin: "https://loja.test",
      host: "loja.test",
    });
    expect(response.status).toBe(200);
  });

  // curl e servidor a servidor não mandam Origin, e sem navegador não existe
  // CSRF: não há sessão de vítima para usar.
  it("aceita requisição sem Origin", async () => {
    mockRede();
    const response = await postBruto({ "content-type": "application/json" });
    expect(response.status).toBe(200);
  });

  it("aceita Content-Type com charset", async () => {
    mockRede();
    const response = await postBruto({
      "content-type": "application/json; charset=utf-8",
    });
    expect(response.status).toBe(200);
  });
});

describe("POST /api/checkout — falha da InfinitePay", () => {
  it("devolve erro genérico ao cliente, sem detalhe de integração", async () => {
    mockRede({ linkFalha: true });
    const response = await post(PEDIDO_VALIDO);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Falha ao gerar o pagamento.",
    });
  });

  // Sem esta trava, uma resposta inesperada da API viraria redirecionamento
  // aberto: o comprador sairia da loja para onde o corpo mandasse.
  it("não redireciona para URL fora do domínio da InfinitePay", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL, _init?: RequestInit) => {
        const href = String(url);
        if (href.includes("viacep")) {
          return json({ localidade: "Goiânia", uf: "GO" });
        }
        return json({ url: "https://site-do-golpe.example.com/pagar" });
      }),
    );

    const response = await post(PEDIDO_VALIDO);
    expect(response.status).toBe(500);
  });

  it("falha quando o handle não está configurado", async () => {
    mockRede();
    delete process.env.INFINITEPAY_HANDLE;
    expect((await post(PEDIDO_VALIDO)).status).toBe(500);
  });
});
