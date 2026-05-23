import * as esbuild from "esbuild";
import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const watch = process.argv.includes("--watch");
const outdir = "dist";

const entryPoints = {
  "service-worker": "src/background/service-worker.js",
  "content-script": "src/content/content-script.js",
  "popup": "src/popup/popup.js",
};

const buildOptions = {
  entryPoints,
  bundle: true,
  format: "iife",
  target: ["chrome114"],
  outdir,
  logLevel: "info",
  sourcemap: watch ? "inline" : false,
  minify: !watch,
};

async function copyStatic() {
  await mkdir(outdir, { recursive: true });
  // manifest
  await cp("manifest.json", path.join(outdir, "manifest.json"));
  // popup html+css
  await cp("src/popup/popup.html", path.join(outdir, "popup.html"));
  await cp("src/popup/popup.css", path.join(outdir, "popup.css"));
  // styles
  await cp("src/styles", path.join(outdir, "styles"), { recursive: true });
  // icons (if present)
  if (existsSync("icons")) {
    await cp("icons", path.join(outdir, "icons"), { recursive: true });
  }
}

await rm(outdir, { recursive: true, force: true });
await copyStatic();

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("[build] watching for changes…");
  // also re-copy static on a simple poll-free approach: user can re-run if static changes
} else {
  await esbuild.build(buildOptions);
  console.log("[build] done →", outdir);
}
