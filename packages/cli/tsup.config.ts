import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  target: "node18",
  outDir: "dist",
  outExtension: () => ({ js: ".cjs" }),
  clean: true,
  shims: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  banner: { js: "#!/usr/bin/env node" },
});
