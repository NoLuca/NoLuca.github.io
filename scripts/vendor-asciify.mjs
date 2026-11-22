// Copia in assets/vendor/asciify-engine/ i file del motore Asciify che servono al sito.
// Uso (dalla cartella del sito):  npm install  →  npm run vendor
// GitHub Pages non esegue npm: i file copiati vanno messi nel repository.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const src = "node_modules/asciify-engine/";
const dst = "assets/vendor/asciify-engine/";
const files = [
  "dist/studio.js", "dist/studio-worker.js",   // video e immagini (Studio)
  "dist/field.js", "dist/field-worker.js",     // campo di caratteri sulla GPU (teschio)
  "dist/model.js",                             // modelli 3D glTF/GLB
  "LICENSE", "THIRD_PARTY.md"
];
mkdirSync(dst, { recursive: true });
for (const f of files) cpSync(src + f, dst + f.replace("dist/", ""));
const { version } = JSON.parse(readFileSync(src + "package.json", "utf8"));
writeFileSync(dst + "VERSION", version + "\n");
console.log(`asciify-engine ${version}: ${files.length} file copiati in ${dst}`);
