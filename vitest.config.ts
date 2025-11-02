import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["src/**/*.{test,spec}.ts?(x)", "src/**/__tests__/**/*.{ts,tsx}"],
    exclude: ["node_modules", "dist", "e2e", "e2e/**", ".{idea,git,cache,output,temp}/**"],
  },
});
