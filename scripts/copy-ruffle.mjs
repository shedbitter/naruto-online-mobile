import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = join(projectRoot, "public", "vendor", "ruffle");

let entry;
try {
  entry = require.resolve("@ruffle-rs/ruffle");
} catch (error) {
  console.error("Não foi possível localizar @ruffle-rs/ruffle. Execute npm install novamente.");
  throw error;
}

const packageDirectory = dirname(entry);
let sourceDirectory = packageDirectory;
if (!readdirSync(sourceDirectory).some((file) => file.endsWith(".wasm"))) {
  // Some package versions place the runtime in a dist/ subdirectory.
  const nestedDirectory = join(packageDirectory, "dist");
  if (existsSync(nestedDirectory)) sourceDirectory = nestedDirectory;
}

const runtimeFiles = readdirSync(sourceDirectory).filter((file) =>
  file === "ruffle.js" || /^core.*\.js$/.test(file) || file.endsWith(".wasm") || /^.*worker.*\.js$/.test(file),
);
if (!runtimeFiles.some((file) => file === "ruffle.js") || !runtimeFiles.some((file) => file.endsWith(".wasm"))) {
  throw new Error(`Os ficheiros estáticos do Ruffle não foram encontrados em ${sourceDirectory}.`);
}

const licenseFiles = readdirSync(packageDirectory).filter((name) => /^LICENSE(_.*)?$/i.test(name));
const packageVersion = JSON.parse(readFileSync(join(packageDirectory, "package.json"), "utf8")).version;
const stampDirectory = join(projectRoot, "node_modules", ".cache");
const stampFile = join(stampDirectory, "ruffle-version");
const runtimeOutputFiles = [...runtimeFiles, ...licenseFiles];
let preparedVersion = "";
try {
  preparedVersion = readFileSync(stampFile, "utf8").trim();
} catch {
  // The first install has no copy stamp yet.
}

const outputIsComplete = runtimeOutputFiles.every((file) => existsSync(join(outputDirectory, file)));
if (preparedVersion !== packageVersion || !outputIsComplete) {
  rmSync(outputDirectory, { recursive: true, force: true });
  mkdirSync(outputDirectory, { recursive: true });
  for (const file of runtimeFiles) {
    cpSync(join(sourceDirectory, file), join(outputDirectory, file));
  }
  for (const file of licenseFiles) {
    cpSync(join(packageDirectory, file), join(outputDirectory, file));
  }
  mkdirSync(stampDirectory, { recursive: true });
  writeFileSync(stampFile, `${packageVersion}\n`);
}

console.log(`Runtime Ruffle ${packageVersion} preparado (${runtimeFiles.length} ficheiros).`);
