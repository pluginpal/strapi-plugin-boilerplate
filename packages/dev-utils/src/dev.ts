import { type ChildProcess, spawn } from "node:child_process";
import { existsSync, watch } from "node:fs";
import { createConnection } from "node:net";
import { resolve } from "node:path";

// process.cwd() is the app directory (e.g. apps/playground) where dev-strapi is invoked
const playgroundDir = process.cwd();
const packagesDir = resolve(playgroundDir, "../../packages");
const pluginsDir = resolve(playgroundDir, "../../plugins");
const strapiBin = resolve(playgroundDir, "node_modules/.bin/strapi");
const STRAPI_PORT = process.env.PORT ? Number(process.env.PORT) : 1337;

let strapiProcess: ChildProcess | null = null;
let intentionalKill = false;
let strapiReady = false;

function waitForPort(port: number): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      const socket = createConnection(port, "localhost");
      socket.once("connect", () => {
        socket.destroy();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        setTimeout(check, 500);
      });
    };
    check();
  });
}

function startStrapi(): void {
  intentionalKill = false;
  strapiReady = false;

  // Strip NODE_PATH set by tsx so Strapi resolves its own modules cleanly
  const { NODE_PATH: _np, ...strapiEnv } = process.env;

  strapiProcess = spawn(strapiBin, ["develop"], {
    cwd: playgroundDir,
    stdio: "inherit",
    env: strapiEnv,
  });

  waitForPort(STRAPI_PORT).then(() => {
    strapiReady = true;
  });

  strapiProcess.on("close", (code) => {
    if (!intentionalKill) {
      process.exit(code ?? 0);
    }
  });
}

function restartStrapi(filename: string): void {
  if (!strapiProcess || !strapiReady) return;
  console.log(`\n[dev] Package changed (${filename}), restarting Strapi...\n`);
  const proc = strapiProcess;
  strapiProcess = null;
  intentionalKill = true;
  proc.kill("SIGTERM");
  proc.once("close", () => setTimeout(startStrapi, 300));
}

process.on("SIGINT", () => {
  intentionalKill = true;
  if (strapiProcess) strapiProcess.kill("SIGTERM");
  process.exit(0);
});

startStrapi();

for (const dir of [packagesDir, pluginsDir]) {
  if (existsSync(dir)) {
    watch(dir, { recursive: true }, (_, filename) => {
      if (!filename?.includes("dist") || filename.includes("dist/admin")) return;
      if (!/\.(js|mjs|cjs)$/.test(filename)) return;
      restartStrapi(filename);
    });
  }
}
