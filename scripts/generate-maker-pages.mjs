import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const makersJsonPath = path.join(repoRoot, "docs", "data", "makers.json");
const templatePath = path.join(repoRoot, "docs", "makers", "templates", "maker-page.template.html");

const makersRaw = await readFile(makersJsonPath, "utf8");
const makersData = JSON.parse(makersRaw);
const template = await readFile(templatePath, "utf8");

for (const maker of makersData.makers || []) {
  const pagePath = path.join(repoRoot, "docs", "makers", `${maker.key}.html`);
  const pageHtml = template
    .replaceAll("__MAKER_KEY__", maker.key)
    .replaceAll("__MAKER_NAME__", maker.name_ja);

  await writeFile(pagePath, pageHtml, "utf8");
  console.log(`generated: ${path.relative(repoRoot, pagePath)}`);
}
