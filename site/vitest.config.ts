import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Vitest config for `site/`.
 *
 * `environment: "node"` — the only suite today (`lib/valuation.test.ts`) is pure
 * math with no DOM. An agent adding component tests should add
 * `// @vitest-environment jsdom` at the top of that file rather than flipping
 * this global (jsdom is not installed).
 *
 * Run: `npx vitest run` from `site/`. package.json is intentionally untouched.
 */
export default defineConfig({
  resolve: {
    // Mirrors tsconfig.json `paths: { "@/*": ["./*"] }`.
    alias: [{ find: /^@\//, replacement: fileURLToPath(new URL("./", import.meta.url)) }],
  },
  test: {
    environment: "node",
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**", "public/**", "scripts/**/fixtures/**"],
  },
});
