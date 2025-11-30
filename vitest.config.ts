/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["src/anime/**/*.ts"],
      reporter: ["lcov", "text", "html"],
    },
  },
});
