import { parseArgs } from "node:util";

export type CliFlags = {
  help: boolean;
  version: boolean;
  yes: boolean;
  dryRun: boolean;
  noCache: boolean;
  force: boolean;
  ref: string | undefined;
  dir: string | undefined;
};

export function parseCliArgs(argv: string[]): CliFlags {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
      yes: { type: "boolean", short: "y" },
      "dry-run": { type: "boolean" },
      "no-cache": { type: "boolean" },
      force: { type: "boolean" },
      ref: { type: "string" },
    },
  });

  return {
    help: Boolean(values.help),
    version: Boolean(values.version),
    yes: Boolean(values.yes),
    dryRun: Boolean(values["dry-run"]),
    noCache: Boolean(values["no-cache"]),
    force: Boolean(values.force),
    ref: typeof values.ref === "string" ? values.ref : undefined,
    dir: positionals[0],
  };
}

export const HELP_TEXT = `
strapi-plugin-factory — scaffold a Strapi v5 plugin

Usage:
  npx strapi-plugin-factory [dir] [options]

Arguments:
  dir              Target directory (default: ask)

Options:
  -h, --help       Show this help
  -v, --version    Show version
  -y, --yes        Skip prompts and use defaults
      --dry-run    Print actions without writing files
      --no-cache   Bypass giget's local template cache
      --force      Overwrite the target directory if non-empty
      --ref <ref>  Template git ref to fetch (default: main)
`.trim();
