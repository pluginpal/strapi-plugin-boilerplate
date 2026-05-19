import { intro, outro, cancel, isCancel, log, spinner, note } from "@clack/prompts";
import pc from "picocolors";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, basename } from "node:path";
import { parseCliArgs, HELP_TEXT } from "./cli-args.js";
import { DEFAULT_TEMPLATE_REF } from "./constants.js";
import { fetchTemplate } from "./fetch.js";
import { readGitDefaults } from "./defaults.js";
import { defaultAnswers, runPrompts } from "./prompts.js";
import { applyTransforms } from "./transform/index.js";
import { hasPnpm, initGit, installDependencies } from "./post-scaffold.js";

function readPkgVersion(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const pkgPath = resolve(here, "..", "package.json");
  const raw = readFileSync(pkgPath, "utf8");
  return (JSON.parse(raw) as { version: string }).version;
}

function isUsableDir(dir: string): boolean {
  if (!existsSync(dir)) return true;
  return readdirSync(dir).length === 0;
}

async function main(): Promise<void> {
  const flags = parseCliArgs(process.argv.slice(2));

  if (flags.help) {
    process.stdout.write(`${HELP_TEXT}\n`);
    return;
  }
  if (flags.version) {
    process.stdout.write(`${readPkgVersion()}\n`);
    return;
  }

  intro(pc.bgCyan(pc.black(" strapi-plugin-factory ")));

  const ref = flags.ref ?? DEFAULT_TEMPLATE_REF;
  const initialDir = flags.dir ?? ".";
  const targetDir = resolve(process.cwd(), initialDir);
  const initialPluginName =
    flags.dir && flags.dir !== "." ? basename(flags.dir) : undefined;

  if (!flags.force && !isUsableDir(targetDir)) {
    log.error(
      `Target directory is not empty: ${pc.cyan(targetDir)}\n  Use ${pc.cyan("--force")} to overwrite.`,
    );
    process.exit(1);
  }

  log.info(`Template: ${pc.cyan(`pluginpal/strapi-plugin-boilerplate#${ref}`)}`);
  log.info(`Target:   ${pc.cyan(targetDir)}`);

  const gitDefaults = await readGitDefaults();
  const answers = flags.yes
    ? defaultAnswers(initialPluginName, gitDefaults)
    : await runPrompts({ initialPluginName, gitDefaults });

  const packageName = answers.npmScope
    ? `@${answers.npmScope}/${answers.pluginName}`
    : answers.pluginName;

  note(
    `Plugin: ${pc.cyan(answers.pluginName)} (${answers.displayName})\n` +
      `Package: ${pc.cyan(packageName)}\n` +
      `License: ${answers.license}\n` +
      `Git init: ${answers.initGit ? "yes" : "no"} • Install deps: ${answers.installDeps ? "yes" : "no"}`,
    "Summary",
  );

  if (flags.dryRun) {
    log.warn("Running in --dry-run mode. No files will be written.");
    outro(pc.green("Dry run complete."));
    return;
  }

  const fetchSpin = spinner();
  fetchSpin.start("Fetching template");
  try {
    await fetchTemplate({
      ref,
      dir: targetDir,
      force: flags.noCache,
      forceClean: flags.force,
    });
    fetchSpin.stop("Template fetched");
  } catch (err) {
    fetchSpin.stop("Fetch failed");
    throw err;
  }

  const transformSpin = spinner();
  transformSpin.start("Applying your answers");
  let result;
  try {
    result = applyTransforms(targetDir, answers);
    transformSpin.stop(
      `Patched ${result.filesPatched.length} files, removed ${result.filesRemoved.length} obsolete paths`,
    );
  } catch (err) {
    transformSpin.stop("Transform failed");
    throw err;
  }

  if (answers.initGit) {
    const gitSpin = spinner();
    gitSpin.start("Initializing git repository");
    try {
      await initGit(targetDir);
      gitSpin.stop("Git initialized");
    } catch (err) {
      gitSpin.stop("Git init failed (continuing)");
      log.warn(err instanceof Error ? err.message : String(err));
    }
  }

  if (answers.installDeps) {
    if (!(await hasPnpm())) {
      log.warn(
        `${pc.yellow("pnpm not found")} on PATH. Skipping install — run ${pc.cyan("pnpm install")} manually after installing pnpm.`,
      );
    } else {
      log.step("Installing dependencies with pnpm…");
      try {
        await installDependencies(targetDir);
      } catch (err) {
        log.error(
          `Install failed: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
  }

  const cdHint = targetDir === process.cwd() ? "" : `  cd ${pc.cyan(initialDir)}\n`;
  outro(
    `${pc.green("All set!")}\n\n${cdHint}  ${pc.cyan("pnpm dev")}     start the playground\n  ${pc.cyan("pnpm build")}   build the plugin\n  ${pc.cyan("pnpm lint")}    run linters`,
  );
}

main().catch((err: unknown) => {
  if (isCancel(err)) {
    cancel("Operation cancelled.");
    process.exit(130);
  }
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`\n${pc.red("Error:")} ${message}\n`);
  process.exit(1);
});
