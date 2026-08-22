import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "tests/**/*.test.ts",
      "packages/rules-engine/test/**/*.test.ts",
    ],
    exclude: [
      "node_modules",
      "dist",
      ".next",
      "firmware/**",
      "services/**",
    ],
    testTimeout: 10_000,
    hookTimeout: 10_000,
  },
  resolve: {
    alias: {
      "@smart-waste/contracts": path.resolve(
        __dirname,
        "packages/contracts/src/generated"
      ),
      "@smart-waste/rules": path.resolve(
        __dirname,
        "packages/rules-engine/src"
      ),
    },
  },
});
