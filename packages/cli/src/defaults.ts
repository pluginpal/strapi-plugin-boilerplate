import { execa } from "execa";
import type { GitDefaults } from "./types.js";

export async function readGitDefaults(): Promise<GitDefaults> {
  const [name, email] = await Promise.all([
    safeGitConfig("user.name"),
    safeGitConfig("user.email"),
  ]);
  return { authorName: name, authorEmail: email };
}

async function safeGitConfig(key: string): Promise<string> {
  try {
    const { stdout } = await execa("git", ["config", "--get", key], {
      reject: false,
    });
    return stdout.trim();
  } catch {
    return "";
  }
}

export function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .filter((word) => word.length > 0)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function isValidPluginName(value: string): true | string {
  if (!value || value.length === 0) return "Plugin name is required";
  if (!/^[a-z][a-z0-9-]*$/.test(value)) {
    return "Must be lowercase kebab-case (e.g. my-plugin)";
  }
  if (value.length > 50) return "Must be 50 characters or fewer";
  return true;
}

export function isValidNpmScope(value: string): true | string {
  if (value === "") return true;
  if (value.startsWith("@")) return "Omit the leading @";
  if (!/^[a-z0-9][a-z0-9-]*$/.test(value)) {
    return "Scope must be lowercase, may contain digits and hyphens";
  }
  return true;
}

export function isValidEmail(value: string): true | string {
  if (value === "") return true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Not a valid email";
  }
  return true;
}
