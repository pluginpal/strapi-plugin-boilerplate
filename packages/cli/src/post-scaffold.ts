import { execa } from "execa";

export async function initGit(cwd: string): Promise<void> {
  await execa("git", ["init"], { cwd, stdio: "ignore" });
  await execa("git", ["add", "."], { cwd, stdio: "ignore" });
}

export async function installDependencies(cwd: string): Promise<void> {
  await execa("pnpm", ["install"], { cwd, stdio: "inherit" });
}

export async function hasPnpm(): Promise<boolean> {
  try {
    await execa("pnpm", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
