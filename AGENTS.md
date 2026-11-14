# Agent instructions

Instructions for AI coding agents (Claude Code, Cursor, Codex, Copilot, …) working in this repository.
`CLAUDE.md` imports this file, so it is the single source of truth for every agent.

## What this repo is

A pnpm + Turborepo monorepo for one Strapi v5 plugin:

| Path | What it is |
| --- | --- |
| `plugins/<plugin>/` | The plugin itself (`admin/` + `server/`). There is exactly one folder under `plugins/`; its name changes when `pnpm rename-plugin` runs, so never hard-code it. |
| `apps/playground/` | A full Strapi v5 app with the plugin installed. It is the fixture app for integration and E2E tests. |
| `packages/dev-utils/` | Test harness and CLIs: `setupStrapi`/`stopStrapi`, `createPlaywrightConfig`, `with-db`, `dev-strapi`, `rename-plugin`. |
| `.claude/brain/` | What agents and maintainers have learned about this repo. See [The brain](#the-brain). |

## Commands (run from the repo root)

```bash
pnpm install
pnpm build              # build every package and the plugin
pnpm dev                # playground + plugin watch (SQLite); dev:postgres / dev:mysql need Docker
pnpm lint               # Biome lint + format
pnpm lint:ts            # TypeScript check, admin + server
pnpm test:integration   # Vitest + Supertest against a real Strapi (SQLite)
pnpm test:e2e           # Playwright against the playground (SQLite)
pnpm changeset          # describe a change to the published plugin
```

## Conventions

- **Strapi v5 only.** Server code uses the Document Service API (`strapi.documents(uid)`) and the v5
  factories; never `entityService` or v4 patterns.
- **Admin UI uses `@strapi/design-system` v2 and `@strapi/icons`**: no raw HTML controls, no other
  icon set. Text goes through `react-intl` with keys from `getTranslation()`; strings live in
  `admin/src/translations/en.json`.
- **Use `PLUGIN_ID`** from `admin/src/pluginId.ts` rather than writing the plugin's name in new code
  (see `.claude/brain/practices/rename-plugin-rewrites-a-fixed-file-list.md`).
- **Biome** formats and lints everything. A pre-commit hook runs Biome and the TypeScript check on
  staged files; do not bypass it.
- **Changesets:** a change that affects the published plugin needs a changeset (`pnpm changeset`).
  Changes to `apps/playground`, `packages/dev-utils` or repo tooling do not.

## Skills and references

These are maintained outside this repo and referenced, not copied. Use the one that fits the task.

| Task | Use |
| --- | --- |
| Server or admin plugin code | `strapi-plugin-dev` skill ([strapi-skills](https://github.com/ayhid/strapi-skills)) |
| Admin screens: settings pages, tables, forms, modals | `strapi-ui-design` skill, plus the [Strapi Design System](https://claude.ai/artifact/DGS9jjvAL6zT3NKEfNBQgc) for the visual language (`strapi-design-system` skill in Claude Code) |
| Planning, writing, fixing or reviewing tests | `strapi-plugin-testing` skill |
| Review before a PR | `strapi-reviewer` and `strapi-ui-reviewer` agents; `/strapi-skills:verify`, `/strapi-skills:ui-audit` |
| Adding a content type, admin screen or CM panel | `/strapi-skills:add-content-type`, `/strapi-skills:ui-component`, `/strapi-skills:add-cm-panel` |
| A fact worth keeping, or a term that misled | `brain-remember` skill (`.claude/skills/brain-remember/SKILL.md`) |
| Something went wrong and should not happen again | `brain-retro` skill (`.claude/skills/brain-retro/SKILL.md`) |

**Do not run `/strapi-skills:scaffold-plugin`:** the plugin is already scaffolded. To rename it,
use `pnpm rename-plugin`.

**Getting the skills:** Claude Code offers to install them when the folder is trusted (see
`CLAUDE.md`). Other agents can install them with `npx skills add ayhid/strapi-skills` or read the
`SKILL.md` files on GitHub. Agents without the skills should still follow the conventions above.

### How strapi-skills maps onto this repo

The skills describe a generic plugin layout. Here:

- **Fixture app:** `apps/playground`. Its config and content types are what integration tests run against.
- **Harness:** `setupStrapi()` / `stopStrapi()` from `@pluginpal/dev-utils`, which boot the
  playground with an isolated database. See `plugins/<plugin>/server/test/example.test.ts`.
- **Integration tests:** `server/test/**/*.test.ts`, the only pattern `vitest.config.ts` includes.
  Pure unit tests need their own include pattern (and ideally their own Vitest project) so they run
  without booting Strapi.
- **E2E tests:** `admin/test/*.spec.ts`, Playwright via `createPlaywrightConfig()`, logged in by
  `admin/test/setup/auth.setup.ts`.
- **Admin data fetching:** the plugin's peer dependencies list `react-query` v3, while
  `strapi-plugin-dev` recommends `@tanstack/react-query` v5 with its own `QueryClient`. Pick one on
  purpose when adding data fetching, and record the choice in the brain.
- **fullstack-standards** (the rule checker strapi-skills pairs with) is not enabled here. It is
  opt-in because it blocks edits that break its layering rules; see its
  [README](https://github.com/ayhid/fullstack-standards) to turn it on, pointing its roots at
  `plugins/<plugin>/admin/src` and `plugins/<plugin>`.

## The brain

`.claude/brain/` holds what has been learned about working on this repo, committed so every agent and
contributor starts from it:

- `.claude/brain/GLOSSARY.md`: terms that mean something specific here. Use its words.
- `.claude/brain/practices/`: checked facts, one per file, indexed in `.claude/brain/practices/INDEX.md`. **Before
  re-deriving how something in this repo works, read the index.** For a `volatile` entry, run its
  `recheck` first.
- `.claude/brain/RETRO-LOG.md`: what went wrong and the change that fixed it.

Add to it through the `brain-remember` and `brain-retro` skills (other agents: follow
`.claude/brain/README.md`). Never put secrets, tokens, hostnames or personal data in it.
