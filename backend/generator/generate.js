#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const [, , , name] = process.argv;

if (!name) {
  console.log("❌ uso: ng g item");
  process.exit(1);
}

const Name = name.charAt(0).toUpperCase() + name.slice(1);

// ----------------------------
// PATH OUTPUT
// ----------------------------
const apiPath = path.join(process.cwd(), "src", "api");
const basePath = path.join(apiPath, name);

// crea solo se non esiste già
if (!fs.existsSync(apiPath)) {
  fs.mkdirSync(apiPath, { recursive: true });
}

if (fs.existsSync(basePath)) {
  console.error(`❌ Folder already exists: ${basePath}`);
  process.exit(1);
}

fs.mkdirSync(basePath, { recursive: true });

// ----------------------------
// TEMPLATES
// ----------------------------
const templatesPath = path.join(__dirname, "templates");

const files = [
  "controller.ts.tpl",
  "service.ts.tpl",
  "router.ts.tpl",
  "model.ts.tpl",
  "entity.ts.tpl",
  "dto.ts.tpl"
];

// ----------------------------
// SAFE REPLACE
// ----------------------------
function replace(content) {
  return content
    .replace(/{{name}}/g, name)
    .replace(/{{Name}}/g, Name);
}

// ----------------------------
// GENERATION
// ----------------------------
for (const file of files) {
  const templatePath = path.join(templatesPath, file);

  if (!fs.existsSync(templatePath)) {
    console.warn(`⚠ missing template: ${file}`);
    continue;
  }

  const template = fs.readFileSync(templatePath, "utf8");
  const output = replace(template);

  const outFile = file.replace(".ts.tpl", ".ts");

  const finalPath = path.join(basePath, `${name}.${outFile}`);

  fs.writeFileSync(finalPath, output, "utf8");

  console.log(`✔ created ${finalPath}`);
}

console.log(`\n✅ Entity "${name}" generated successfully`);