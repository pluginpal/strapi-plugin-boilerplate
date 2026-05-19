import pc from "picocolors";

const ART = [
  "███████╗██████╗ ███████╗",
  "██╔════╝██╔══██╗██╔════╝",
  "███████╗██████╔╝█████╗  ",
  "╚════██║██╔═══╝ ██╔══╝  ",
  "███████║██║     ██║     ",
  "╚══════╝╚═╝     ╚═╝     ",
];

const TITLE = "Strapi Plugin Factory";
const FEATURES = [
  "npx-installable scaffolder",
  "Interactive @clack prompts",
  "pnpm + Turbo + Vitest",
  "Biome + Playwright ready",
];

const ART_WIDTH = 24;
const LEFT_PAD = 3;
const GAP = 4;
const RIGHT_WIDTH = 32;
const INNER_WIDTH = LEFT_PAD + ART_WIDTH + GAP + RIGHT_WIDTH;

const purple = pc.magenta;
const dim = pc.dim;

const ANSI_RE = /\x1b\[[0-9;]*m/g;
function visibleLength(str: string): number {
  return str.replace(ANSI_RE, "").length;
}
function padVisibleEnd(str: string, width: number): string {
  const pad = width - visibleLength(str);
  return pad > 0 ? str + " ".repeat(pad) : str;
}

function row(left: string, right: string): string {
  const leftColored = purple(pc.bold(padVisibleEnd(left, ART_WIDTH)));
  const rightPadded = padVisibleEnd(right, RIGHT_WIDTH);
  return `${dim(purple("│"))} ${" ".repeat(LEFT_PAD)}${leftColored}${" ".repeat(GAP)}${rightPadded} ${dim(purple("│"))}`;
}

function plainRow(): string {
  return `${dim(purple("│"))} ${" ".repeat(INNER_WIDTH)} ${dim(purple("│"))}`;
}

export function renderBanner(version: string): string {
  const top = `${dim(purple("╭"))}${dim(purple("─".repeat(INNER_WIDTH + 2)))}${dim(purple("╮"))}`;
  const bottom = `${dim(purple("╰"))}${dim(purple("─".repeat(INNER_WIDTH + 2)))}${dim(purple("╯"))}`;

  const titleLine = `${pc.bold(TITLE)}  ${dim(`v${version}`)}`;

  const rightLines = [
    titleLine,
    "",
    ...FEATURES.map((f) => `${purple("◆")} ${f}`),
  ];

  while (rightLines.length < ART.length) rightLines.push("");
  while (rightLines.length > ART.length) rightLines.pop();

  const lines: string[] = [top, plainRow()];
  for (let i = 0; i < ART.length; i += 1) {
    lines.push(row(ART[i] ?? "", rightLines[i] ?? ""));
  }
  lines.push(plainRow(), bottom);
  return lines.join("\n");
}

export function printBanner(version: string): void {
  process.stdout.write(`${renderBanner(version)}\n`);
}
