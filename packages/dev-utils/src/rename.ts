import { existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Script lives at packages/dev-utils/src/rename.ts — three levels up is the repo root
const repoRoot = resolve(__dirname, "../../../");

type PluginInfo = {
  dir: string;
  pkg: Record<string, unknown> & {
    name?: string;
    description?: string;
    author?: string | { name?: string; email?: string };
    license?: string;
    repository?: { url?: string; directory?: string };
    strapi?: { kind?: string; name?: string; displayName?: string; description?: string };
  };
};

function findPlugin(): PluginInfo | null {
  const pluginsRoot = join(repoRoot, "plugins");
  if (!existsSync(pluginsRoot)) return null;
  for (const entry of readdirSync(pluginsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgPath = join(pluginsRoot, entry.name, "package.json");
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    if (pkg.strapi?.kind === "plugin") return { dir: entry.name, pkg };
  }
  return null;
}

function replaceAll(content: string, from: string, to: string): string {
  return content.split(from).join(to);
}

function updateFile(filePath: string, replacements: [string, string][]): void {
  if (!existsSync(filePath)) return;
  let content = readFileSync(filePath, "utf-8");
  for (const [from, to] of replacements) {
    if (from !== to) content = replaceAll(content, from, to);
  }
  writeFileSync(filePath, content, "utf-8");
}

function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function parseAuthor(author: unknown): { name: string; email: string } {
  if (!author) return { name: "", email: "" };
  if (typeof author === "object" && author !== null) {
    const a = author as { name?: string; email?: string };
    return { name: a.name ?? "", email: a.email ?? "" };
  }
  const match = String(author).match(/^(.+?)\s*<([^>]+)>/);
  return { name: match?.[1]?.trim() ?? String(author), email: match?.[2]?.trim() ?? "" };
}

function parseGitHub(url: unknown): { org: string; repo: string } {
  const match = String(url ?? "").match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  return { org: match?.[1] ?? "", repo: match?.[2] ?? "" };
}

async function main() {
  const plugin = findPlugin();
  if (!plugin) {
    console.error("Error: No Strapi plugin found in the plugins/ directory.");
    process.exit(1);
  }

  const { dir: currentDir, pkg } = plugin;
  const currentName = (pkg.strapi?.name ?? currentDir) as string;
  const currentDisplayName = (pkg.strapi?.displayName ?? toTitleCase(currentName)) as string;
  const currentDescription = (pkg.description ?? "") as string;
  const currentPkgName = (pkg.name ?? "") as string;
  const currentScope = currentPkgName.startsWith("@")
    ? currentPkgName.split("/")[0].slice(1)
    : "";
  const { name: currentAuthorName, email: currentAuthorEmail } = parseAuthor(pkg.author);
  const { org: currentGithubOrg, repo: currentGithubRepo } = parseGitHub(
    (pkg.repository as { url?: string })?.url,
  );
  const currentLicense = (pkg.license ?? "MIT") as string;

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  async function ask(label: string, defaultValue: string): Promise<string> {
    const hint = defaultValue ? ` (${defaultValue})` : "";
    const answer = await rl.question(`  ${label}${hint}: `);
    return answer.trim() || defaultValue;
  }

  console.log("\nRename Strapi Plugin\n");
  console.log(`Current plugin: ${currentPkgName} (plugins/${currentDir}/)\n`);
  console.log("Press Enter to keep the current value.\n");

  const pluginName = await ask("Plugin name (kebab-case Strapi ID)", currentName);
  const displayName = await ask("Display name", currentDisplayName);
  const description = await ask("Description", currentDescription);
  const npmScope = await ask("NPM scope (without @, leave empty for unscoped)", currentScope);
  const packageName = npmScope ? `@${npmScope}/${pluginName}` : pluginName;
  const authorName = await ask("Author name", currentAuthorName);
  const authorEmail = await ask("Author email", currentAuthorEmail);
  const githubOrg = await ask("GitHub org or username", currentGithubOrg);
  const githubRepo = await ask("GitHub repository name", currentGithubRepo);
  const license = await ask("License", currentLicense);

  rl.close();

  const githubUrl =
    githubOrg && githubRepo ? `https://github.com/${githubOrg}/${githubRepo}` : "";
  const authorString = authorEmail ? `${authorName} <${authorEmail}>` : authorName;

  console.log("\nApplying changes...");

  const pluginsRoot = join(repoRoot, "plugins");
  const pluginDir = join(pluginsRoot, currentDir);

  // 1. Update plugin package.json
  const pluginPkg = JSON.parse(readFileSync(join(pluginDir, "package.json"), "utf-8"));
  pluginPkg.name = packageName;
  pluginPkg.description = description;
  pluginPkg.author = authorString;
  pluginPkg.license = license;
  if (githubUrl) {
    pluginPkg.bugs = { url: `${githubUrl}/issues` };
    pluginPkg.homepage = githubUrl;
    pluginPkg.repository = {
      type: "git",
      url: `git+${githubUrl}.git`,
      directory: `plugins/${pluginName}`,
    };
  }
  if (pluginPkg.strapi) {
    pluginPkg.strapi.name = pluginName;
    pluginPkg.strapi.displayName = displayName;
    pluginPkg.strapi.description = description;
  }
  writeFileSync(
    join(pluginDir, "package.json"),
    `${JSON.stringify(pluginPkg, null, 2)}\n`,
    "utf-8",
  );
  console.log(`  - plugins/${currentDir}/package.json`);

  // Replacement pairs for source files: old name → new name
  const nameReplacements: [string, string][] = [[currentName, pluginName]];

  // 2. admin/src/pluginId.ts
  updateFile(join(pluginDir, "admin/src/pluginId.ts"), nameReplacements);
  console.log(`  - plugins/${currentDir}/admin/src/pluginId.ts`);

  // 3. server/src/controllers/controller.ts
  updateFile(join(pluginDir, "server/src/controllers/controller.ts"), nameReplacements);
  console.log(`  - plugins/${currentDir}/server/src/controllers/controller.ts`);

  // 4. server/test/example.test.ts
  updateFile(join(pluginDir, "server/test/example.test.ts"), nameReplacements);
  console.log(`  - plugins/${currentDir}/server/test/example.test.ts`);

  // 5. admin/test/example.spec.ts
  updateFile(join(pluginDir, "admin/test/example.spec.ts"), nameReplacements);
  console.log(`  - plugins/${currentDir}/admin/test/example.spec.ts`);

  // 6. Plugin README
  updateFile(join(pluginDir, "README.md"), [
    [currentPkgName, packageName],
    [currentName, pluginName],
    [currentDisplayName, displayName],
  ]);
  console.log(`  - plugins/${currentDir}/README.md`);

  // 7. apps/playground/package.json
  const playgroundPkgPath = join(repoRoot, "apps/playground/package.json");
  const playgroundPkg = JSON.parse(readFileSync(playgroundPkgPath, "utf-8"));
  if (
    playgroundPkg.dependencies &&
    currentPkgName in playgroundPkg.dependencies &&
    currentPkgName !== packageName
  ) {
    playgroundPkg.dependencies[packageName] = playgroundPkg.dependencies[currentPkgName];
    delete playgroundPkg.dependencies[currentPkgName];
  }
  writeFileSync(playgroundPkgPath, `${JSON.stringify(playgroundPkg, null, 2)}\n`, "utf-8");
  console.log("  - apps/playground/package.json");

  // 8. Root README.md — replace from most specific to least specific
  const readmeReplacements: [string, string][] = [];
  if (githubOrg && githubRepo && (currentGithubOrg || currentGithubRepo)) {
    readmeReplacements.push([
      `${currentGithubOrg}/${currentGithubRepo}`,
      `${githubOrg}/${githubRepo}`,
    ]);
  }
  if (currentPkgName !== packageName) {
    readmeReplacements.push([currentPkgName, packageName]);
  }
  readmeReplacements.push([currentName, pluginName]);
  updateFile(join(repoRoot, "README.md"), readmeReplacements);
  console.log("  - README.md");

  // 9. Rename plugin directory
  if (currentDir !== pluginName) {
    renameSync(pluginDir, join(pluginsRoot, pluginName));
    console.log(`  - Renamed plugins/${currentDir}/ → plugins/${pluginName}/`);
  }

  console.log("\nDone. Run the following to finish setup:\n");
  console.log("  pnpm install");
  console.log("  pnpm build\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
