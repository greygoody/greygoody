import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(
  await readFile(path.join(root, "design", "tokens.json"), "utf8"),
);

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function render(themeName) {
  const theme = tokens.themes[themeName];
  const copy = tokens.copy;
  const stack = copy.stack
    .map((item, index) => {
      const x = 72 + index * 174;
      return `<text x="${x}" y="316" font-family="${xml(tokens.typography.mono)}" font-size="13" letter-spacing="1.1" fill="${theme.muted}">${xml(item)}</text>`;
    })
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 344" role="img" aria-labelledby="title description">
  <title id="title">${xml(copy.headline)}</title>
  <desc id="description">${xml(copy.statement)} ${xml(copy.objective)}</desc>
  <rect width="1200" height="344" rx="18" fill="${theme.background}"/>
  <line x1="72" y1="94" x2="1128" y2="94" stroke="${theme.line}"/>
  <text x="72" y="64" font-family="${xml(tokens.typography.mono)}" font-size="13" font-weight="600" letter-spacing="2.4" fill="${theme.accent}">${xml(copy.identity)}</text>
  <text x="72" y="156" font-family="${xml(tokens.typography.sans)}" font-size="44" font-weight="650" letter-spacing="-1.2" fill="${theme.foreground}">${xml(copy.headline)}</text>
  <text x="72" y="198" font-family="${xml(tokens.typography.sans)}" font-size="20" font-weight="400" fill="${theme.muted}">${xml(copy.statement)}</text>
  <text x="72" y="252" font-family="${xml(tokens.typography.mono)}" font-size="12" font-weight="600" letter-spacing="1.5" fill="${theme.muted}">${xml(copy.objectiveLabel)}</text>
  <text x="284" y="252" font-family="${xml(tokens.typography.sans)}" font-size="18" font-weight="550" fill="${theme.foreground}">${xml(copy.objective)}</text>
  <line x1="72" y1="278" x2="1128" y2="278" stroke="${theme.line}"/>
  ${stack}
</svg>\n`;
}

await mkdir(path.join(root, "assets"), { recursive: true });
for (const themeName of Object.keys(tokens.themes)) {
  await writeFile(
    path.join(root, "assets", `profile-${themeName}.svg`),
    render(themeName),
  );
}

console.log(`Rendered ${Object.keys(tokens.themes).length} profile assets.`);
