import { readFileSync, writeFileSync, existsSync } from "node:fs";
import type { PluginAnswers } from "../types.js";

interface PluginPkg {
  name?: string;
  description?: string;
  author?: string;
  license?: string;
  bugs?: { url: string };
  homepage?: string;
  repository?: { type: string; url: string; directory: string };
  strapi?: {
    kind?: string;
    name?: string;
    displayName?: string;
    description?: string;
  };
  dependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  bin?: Record<string, string>;
  [key: string]: unknown;
}

export function buildPackageName(answers: PluginAnswers): string {
  return answers.npmScope
    ? `@${answers.npmScope}/${answers.pluginName}`
    : answers.pluginName;
}

export function buildAuthor(answers: PluginAnswers): string {
  if (!answers.authorName) return "";
  if (!answers.authorEmail) return answers.authorName;
  return `${answers.authorName} <${answers.authorEmail}>`;
}

export function buildGithubUrl(answers: PluginAnswers): string {
  if (!answers.githubOrg || !answers.githubRepo) return "";
  return `https://github.com/${answers.githubOrg}/${answers.githubRepo}`;
}

export function patchPluginPackageJson(
  filePath: string,
  answers: PluginAnswers,
): void {
  if (!existsSync(filePath)) {
    throw new Error(`Plugin package.json not found at ${filePath}`);
  }
  const pkg = readJson<PluginPkg>(filePath);
  const packageName = buildPackageName(answers);
  const author = buildAuthor(answers);
  const githubUrl = buildGithubUrl(answers);

  pkg.name = packageName;
  pkg.description = answers.description;
  pkg.license = answers.license;
  if (author) pkg.author = author;
  else delete pkg.author;

  if (githubUrl) {
    pkg.bugs = { url: `${githubUrl}/issues` };
    pkg.homepage = githubUrl;
    pkg.repository = {
      type: "git",
      url: `git+${githubUrl}.git`,
      directory: `plugins/${answers.pluginName}`,
    };
  } else {
    delete pkg.bugs;
    delete pkg.homepage;
    delete pkg.repository;
  }

  if (pkg.strapi) {
    pkg.strapi.name = answers.pluginName;
    pkg.strapi.displayName = answers.displayName;
    pkg.strapi.description = answers.description;
  }

  writeJson(filePath, pkg);
}

export function patchRootPackageJson(
  rootPkgPath: string,
  answers: PluginAnswers,
): void {
  if (!existsSync(rootPkgPath)) return;
  const pkg = readJson<PluginPkg>(rootPkgPath);
  pkg.name = answers.pluginName;
  if (pkg.scripts) delete pkg.scripts["rename-plugin"];
  writeJson(rootPkgPath, pkg);
}

export function removeRenamePluginBin(devUtilsPkgPath: string): void {
  if (!existsSync(devUtilsPkgPath)) return;
  const pkg = readJson<PluginPkg>(devUtilsPkgPath);
  if (pkg.bin) delete pkg.bin["rename-plugin"];
  writeJson(devUtilsPkgPath, pkg);
}

export function patchPlaygroundPackageJson(
  filePath: string,
  oldPackageName: string,
  answers: PluginAnswers,
): void {
  if (!existsSync(filePath)) return;
  const pkg = readJson<PluginPkg>(filePath);
  const newPackageName = buildPackageName(answers);
  if (
    pkg.dependencies &&
    oldPackageName in pkg.dependencies &&
    oldPackageName !== newPackageName
  ) {
    const version = pkg.dependencies[oldPackageName];
    if (version) {
      pkg.dependencies[newPackageName] = version;
      delete pkg.dependencies[oldPackageName];
    }
  }
  writeJson(filePath, pkg);
}

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

function writeJson(filePath: string, data: unknown): void {
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}
