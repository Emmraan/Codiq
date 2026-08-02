import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SOURCE = join(ROOT, "node_modules", "monaco-editor", "min", "vs");
const DEST = join(ROOT, "public", "vs");

if (!existsSync(SOURCE)) {
  console.error(`[setup-monaco] source not found: ${SOURCE}`);
  console.error("[setup-monaco] run `pnpm install` first, then retry.");
  process.exit(1);
}

rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });
cpSync(SOURCE, DEST, { recursive: true });
console.log("[setup-monaco] self-hosted Monaco assets copied to public/vs");
