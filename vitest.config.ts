/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ['test/setup.ts'],
    coverage: {
      include: ["src/**/*.ts"],
      reporter: ["lcov", "text", "html"],
    },
  },
});
