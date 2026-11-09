import { existsSync, readdirSync, readFileSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import type { PluginAnswers } from "../types.js";
import { replaceInFile } from "./files.js";
import type { Replacement } from "./files.js";
import {
  buildPackageName,
  patchPlaygroundPackageJson,
  patchPluginPackageJson,
  patchRootPackageJson,
  removeRenamePluginBin,
} from "./package-json.js";

interface PluginInfo {
  dir: string;
  pluginName: string;
  packageName: string;
  displayName: string;
  githubOrg: string;
  githubRepo: string;
}

export interface TransformResult {
  pluginDirRenamedTo: string;
  filesPatched: string[];
  filesRemoved: string[];
}

export function applyTransforms(
  repoRoot: string,
  answers: PluginAnswers,
): TransformResult {
  const info = readPluginInfo(repoRoot);
  const patched: string[] = [];
  const removed: string[] = [];

  const pluginDirPath = join(repoRoot, "plugins", info.dir);
  const pluginPkgPath = join(pluginDirPath, "package.json");
  patchPluginPackageJson(pluginPkgPath, answers);
  patched.push(relativeTo(repoRoot, pluginPkgPath));

  const playgroundPkgPath = join(repoRoot, "apps/playground/package.json");
  if (existsSync(playgroundPkgPath)) {
    patchPlaygroundPackageJson(playgroundPkgPath, info.packageName, answers);
    patched.push(relativeTo(repoRoot, playgroundPkgPath));
  }

  const newPackageName = buildPackageName(answers);

  const sourceReplacements: Replacement[] = [
    [info.pluginName, answers.pluginName],
  ];

  const sourceFiles = [
    join(pluginDirPath, "admin/src/pluginId.ts"),
    join(pluginDirPath, "server/src/controllers/controller.ts"),
    join(pluginDirPath, "server/test/example.test.ts"),
    join(pluginDirPath, "admin/test/example.spec.ts"),
  ];
  for (const file of sourceFiles) {
    if (replaceInFile(file, sourceReplacements)) {
      patched.push(relativeTo(repoRoot, file));
    }
  }

  const pluginReadme = join(pluginDirPath, "README.md");
  if (
    replaceInFile(pluginReadme, [
      [info.packageName, newPackageName],
      [info.displayName, answers.displayName],
      [info.pluginName, answers.pluginName],
    ])
  ) {
    patched.push(relativeTo(repoRoot, pluginReadme));
  }

  const rootReadmeReplacements: Replacement[] = [];
  if (
    info.githubOrg &&
    info.githubRepo &&
    answers.githubOrg &&
    answers.githubRepo
  ) {
    rootReadmeReplacements.push([
      `${info.githubOrg}/${info.githubRepo}`,
      `${answers.githubOrg}/${answers.githubRepo}`,
    ]);
  }
  if (info.packageName !== newPackageName) {
    rootReadmeReplacements.push([info.packageName, newPackageName]);
  }
  rootReadmeReplacements.push([info.displayName, answers.displayName]);
  rootReadmeReplacements.push([info.pluginName, answers.pluginName]);

  const rootReadme = join(repoRoot, "README.md");
  if (replaceInFile(rootReadme, rootReadmeReplacements)) {
    patched.push("README.md");
  }

  const rootPkgPath = join(repoRoot, "package.json");
  patchRootPackageJson(rootPkgPath, answers);
  patched.push("package.json");

  removeRenamePluginBin(join(repoRoot, "packages/dev-utils/package.json"));
  patched.push("packages/dev-utils/package.json");

  const obsoletePaths = [
    "packages/cli",
    "packages/dev-utils/src/rename.ts",
    "packages/dev-utils/bin/rename-plugin.sh",
  ];
  for (const rel of obsoletePaths) {
    const abs = join(repoRoot, rel);
    if (existsSync(abs)) {
      rmSync(abs, { recursive: true, force: true });
      removed.push(rel);
    }
  }

  let pluginDirRenamedTo = info.dir;
  if (info.dir !== answers.pluginName) {
    const target = join(repoRoot, "plugins", answers.pluginName);
    renameSync(pluginDirPath, target);
    pluginDirRenamedTo = answers.pluginName;
  }

  return {
    pluginDirRenamedTo,
    filesPatched: patched,
    filesRemoved: removed,
  };
}

function readPluginInfo(repoRoot: string): PluginInfo {
  const pluginsRoot = join(repoRoot, "plugins");
  if (!existsSync(pluginsRoot)) {
    throw new Error(`Fetched template has no plugins/ directory at ${pluginsRoot}`);
  }
  for (const entry of readdirSync(pluginsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgPath = join(pluginsRoot, entry.name, "package.json");
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as {
      name?: string;
      strapi?: { kind?: string; name?: string; displayName?: string };
      repository?: { url?: string };
    };
    if (pkg.strapi?.kind !== "plugin") continue;
    const repoUrl = pkg.repository?.url ?? "";
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
    return {
      dir: entry.name,
      pluginName: pkg.strapi?.name ?? entry.name,
      packageName: pkg.name ?? entry.name,
      displayName: pkg.strapi?.displayName ?? entry.name,
      githubOrg: match?.[1] ?? "",
      githubRepo: match?.[2] ?? "",
    };
  }
  throw new Error("No Strapi plugin (strapi.kind === 'plugin') found under plugins/");
}

function relativeTo(root: string, absPath: string): string {
  return absPath.startsWith(`${root}/`) ? absPath.slice(root.length + 1) : absPath;
}
