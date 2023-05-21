import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["source/execute.ts"],
	platform: "node",
	format: "esm",
	target: "esnext",
	skipNodeModulesBundle: true,
	clean: true,
	splitting: false,
	keepNames: true,
	sourcemap: true,
});
