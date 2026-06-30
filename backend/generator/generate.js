#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const [, , name] = process.argv;

if (!name) {
  console.log("❌ uso: ng g item");
  process.exit(1);
}

const Name = name.charAt(0).toUpperCase() + name.slice(1);

// ----------------------------
// BACKEND
// ----------------------------
const apiPath = path.join(process.cwd(), "src", "api");
const basePath = path.join(apiPath, name);

if (!fs.existsSync(apiPath)) {
  fs.mkdirSync(apiPath, { recursive: true });
}

if (fs.existsSync(basePath)) {
  console.error(`❌ Backend folder already exists: ${basePath}`);
  process.exit(1);
}

fs.mkdirSync(basePath, { recursive: true });

const templatesPath = path.join(__dirname, "templates");

const files = [
  "controller.ts.tpl",
  "service.ts.tpl",
  "router.ts.tpl",
  "model.ts.tpl",
  "entity.ts.tpl",
  "dto.ts.tpl"
];

function replace(content) {
  return content
    .replace(/{{name}}/g, name)
    .replace(/{{Name}}/g, Name);
}

for (const file of files) {
  const templatePath = path.join(templatesPath, file);

  if (!fs.existsSync(templatePath)) {
    console.warn(`⚠ missing backend template: ${file}`);
    continue;
  }

  const template = fs.readFileSync(templatePath, "utf8");
  const output = replace(template);

  const outFile = file.replace(".ts.tpl", ".ts");
  const finalPath = path.join(basePath, `${name}.${outFile}`);

  fs.writeFileSync(finalPath, output, "utf8");
  console.log(`✔ created ${finalPath}`);
}

// ----------------------------
// UPDATE BACKEND ROUTES.TS
// ----------------------------
const routesPath = path.join(process.cwd(), 'src/api/routes.ts');
let backendRoutes = fs.readFileSync(routesPath, 'utf-8');

const routerImport = `import ${name}Router from "./${name}/${name}.router";`;
const routerUse = `router.use('/${name}s', ${name}Router);`;

if (!backendRoutes.includes(routerImport)) {
  const lines = backendRoutes.split('\n');
  const lastImportIdx = lines.map((l, i) => ({ l, i })).filter(x => x.l.startsWith('import ')).pop()?.i || 0;
  lines.splice(lastImportIdx + 1, 0, routerImport);
  backendRoutes = lines.join('\n');
}

if (!backendRoutes.includes(routerUse)) {
  const marker = `router.use(isAuthenticated);`;
  const markerIdx = backendRoutes.indexOf(marker);
  if (markerIdx !== -1) {
    const afterMarker = backendRoutes.slice(markerIdx + marker.length);
    const insertIdx = markerIdx + marker.length;
    backendRoutes = backendRoutes.slice(0, insertIdx) + `\n${routerUse}` + afterMarker;
  }
}

fs.writeFileSync(routesPath, backendRoutes);

console.log('✅ Backend routes aggiornato');

console.log(`\n✅ Entity "${name}" generated successfully`);