import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // O mesmo alias do tsconfig, para os testes importarem como o app importa.
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
