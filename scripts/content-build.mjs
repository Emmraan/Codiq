/**
 * Launcher for the content pipeline.
 *
 * Bundles `scripts/build-content.mts` with esbuild and runs it with Node.
 * tsx is unsuitable here: it resolves bare ESM-only dependencies (e.g.
 * `estree-walker`, pulled in by `@mdx-js/mdx`) through Node's CJS resolver,
 * which lacks the `"import"` exports condition.
 */

import { build } from "esbuild";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = path.join(ROOT, "lib", "generated", ".cache");
const BUNDLE_PATH = path.join(CACHE_DIR, "build-content.cjs");

mkdirSync(CACHE_DIR, { recursive: true });

process.env.CODIQ_ROOT = ROOT;

await build({
  entryPoints: [path.join(ROOT, "scripts", "build-content.mts")],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node22",
  outfile: BUNDLE_PATH,
  alias: { "@": ROOT },
  external: ["esbuild"],
  logLevel: "warning",
});

createRequire(import.meta.url)(BUNDLE_PATH);
