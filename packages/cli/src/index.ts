import { intro, outro, cancel, isCancel, log, spinner } from "@clack/prompts";
import pc from "picocolors";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { parseCliArgs, HELP_TEXT } from "./cli-args.js";
import { DEFAULT_TEMPLATE_REF } from "./constants.js";
import { fetchTemplate } from "./fetch.js";

function readPkgVersion(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const pkgPath = resolve(here, "..", "package.json");
  const raw = readFileSync(pkgPath, "utf8");
  return (JSON.parse(raw) as { version: string }).version;
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
  const targetDir = resolve(process.cwd(), flags.dir ?? ".");

  log.info(
    `Template: ${pc.cyan(`pluginpal/strapi-plugin-boilerplate#${ref}`)}`,
  );
  log.info(`Target:   ${pc.cyan(targetDir)}`);

  if (flags.dryRun) {
    log.warn("Running in --dry-run mode. No files will be written.");
    outro(pc.green("Dry run complete."));
    return;
  }

  const s = spinner();
  s.start("Fetching template");
  try {
    const result = await fetchTemplate({
      ref,
      dir: targetDir,
      force: flags.noCache,
      forceClean: flags.force,
    });
    s.stop(`Fetched ${pc.dim(result.source)}`);
  } catch (err) {
    s.stop("Fetch failed");
    throw err;
  }

  log.step(pc.dim("Transform + install steps land in upcoming phases."));
  outro(pc.green(`Done. Template extracted to ${pc.cyan(targetDir)}.`));
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
