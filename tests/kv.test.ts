import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { kvGet, kvSet, KvError } from "@/lib/kv";

function json(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body, text: async () => "" } as unknown as Response;
}

beforeEach(() => {
  vi.unstubAllGlobals();
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("kvSet / kvGet", () => {
  it("recusa sem as credenciais configuradas", async () => {
    await expect(kvGet("x")).rejects.toBeInstanceOf(KvError);
    await expect(kvSet("x", "y", 60)).rejects.toBeInstanceOf(KvError);
  });

  it("manda o comando certo para o endpoint do Upstash", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://upstash.test";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token-secreto";

    const fetchMock = vi.fn(async () => json({ result: "OK" }));
    vi.stubGlobal("fetch", fetchMock);

    await kvSet("pedido:1", "conteudo", 604_800);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://upstash.test");
    expect(init.headers).toMatchObject({ Authorization: "Bearer token-secreto" });
    expect(JSON.parse(String(init.body))).toEqual([
      "SET",
      "pedido:1",
      "conteudo",
      "EX",
      604_800,
    ]);
  });

  it("devolve o valor salvo", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://upstash.test";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token-secreto";
    vi.stubGlobal("fetch", vi.fn(async () => json({ result: "conteudo" })));

    expect(await kvGet("pedido:1")).toBe("conteudo");
  });

  it("devolve null quando a chave não existe", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://upstash.test";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token-secreto";
    vi.stubGlobal("fetch", vi.fn(async () => json({ result: null })));

    expect(await kvGet("pedido:inexistente")).toBeNull();
  });

  it("propaga erro quando o Upstash responde mal", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://upstash.test";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token-secreto";
    vi.stubGlobal("fetch", vi.fn(async () => json({}, false, 500)));

    await expect(kvGet("pedido:1")).rejects.toBeInstanceOf(KvError);
  });
});
