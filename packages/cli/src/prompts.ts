import { text, select, confirm, isCancel, cancel } from "@clack/prompts";
import type { GitDefaults, PluginAnswers } from "./types.js";
import {
  isValidEmail,
  isValidNpmScope,
  isValidPluginName,
  toTitleCase,
} from "./defaults.js";

interface PromptOptions {
  initialPluginName?: string;
  gitDefaults: GitDefaults;
}

export async function runPrompts({
  initialPluginName,
  gitDefaults,
}: PromptOptions): Promise<PluginAnswers> {
  const pluginName = await ask(
    text({
      message: "Plugin name (kebab-case Strapi ID)",
      placeholder: "my-plugin",
      initialValue: initialPluginName,
      validate: (value) => {
        const result = isValidPluginName(value);
        return result === true ? undefined : result;
      },
    }),
  );

  const displayName = await ask(
    text({
      message: "Display name",
      placeholder: toTitleCase(pluginName),
      initialValue: toTitleCase(pluginName),
    }),
  );

  const description = await ask(
    text({
      message: "Description",
      placeholder: "A Strapi v5 plugin",
      defaultValue: "A Strapi v5 plugin",
    }),
  );

  const npmScope = await ask(
    text({
      message: "NPM scope (without @, leave empty for unscoped)",
      placeholder: "",
      defaultValue: "",
      validate: (value) => {
        const result = isValidNpmScope(value);
        return result === true ? undefined : result;
      },
    }),
  );

  const authorName = await ask(
    text({
      message: "Author name",
      placeholder: gitDefaults.authorName,
      defaultValue: gitDefaults.authorName,
    }),
  );

  const authorEmail = await ask(
    text({
      message: "Author email",
      placeholder: gitDefaults.authorEmail,
      defaultValue: gitDefaults.authorEmail,
      validate: (value) => {
        const result = isValidEmail(value);
        return result === true ? undefined : result;
      },
    }),
  );

  const githubOrg = await ask(
    text({
      message: "GitHub org or username",
      placeholder: "",
      defaultValue: "",
    }),
  );

  const githubRepo = await ask(
    text({
      message: "GitHub repository name",
      placeholder: pluginName,
      defaultValue: pluginName,
    }),
  );

  const license = await ask(
    select({
      message: "License",
      initialValue: "MIT",
      options: [
        { value: "MIT", label: "MIT" },
        { value: "Apache-2.0", label: "Apache-2.0" },
        { value: "ISC", label: "ISC" },
        { value: "UNLICENSED", label: "UNLICENSED (private)" },
      ],
    }),
  );

  const initGit = await ask(
    confirm({
      message: "Initialize a git repository?",
      initialValue: true,
    }),
  );

  const installDeps = await ask(
    confirm({
      message: "Install dependencies with pnpm?",
      initialValue: true,
    }),
  );

  return {
    pluginName,
    displayName,
    description,
    npmScope,
    authorName,
    authorEmail,
    githubOrg,
    githubRepo,
    license,
    initGit,
    installDeps,
  };
}

async function ask<T>(promise: Promise<T | symbol>): Promise<T> {
  const value = await promise;
  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(130);
  }
  return value as T;
}

export function defaultAnswers(
  initialPluginName: string | undefined,
  gitDefaults: GitDefaults,
): PluginAnswers {
  const pluginName = initialPluginName ?? "my-plugin";
  return {
    pluginName,
    displayName: toTitleCase(pluginName),
    description: "A Strapi v5 plugin",
    npmScope: "",
    authorName: gitDefaults.authorName,
    authorEmail: gitDefaults.authorEmail,
    githubOrg: "",
    githubRepo: pluginName,
    license: "MIT",
    initGit: true,
    installDeps: true,
  };
}
