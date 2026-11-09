import { existsSync, readFileSync, writeFileSync } from "node:fs";

export type Replacement = readonly [from: string, to: string];

export function replaceInFile(
  filePath: string,
  replacements: readonly Replacement[],
): boolean {
  if (!existsSync(filePath)) return false;
  const original = readFileSync(filePath, "utf-8");
  let updated = original;
  for (const [from, to] of replacements) {
    if (from && from !== to) {
      updated = updated.split(from).join(to);
    }
  }
  if (updated !== original) {
    writeFileSync(filePath, updated, "utf-8");
    return true;
  }
  return false;
}
