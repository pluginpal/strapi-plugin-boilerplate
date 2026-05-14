# Strapi Plugin Boilerplate

A production-ready starter template for building Strapi v5 plugins. Clone this repo, rename the plugin, and start building — the development environment, test infrastructure, linting, and CI pipeline are already wired up.

---

## What's included

### Monorepo structure

```
apps/
  playground/          # Full Strapi v5 app with the plugin installed
packages/
  dev-utils/           # Shared test utilities (setupStrapi, Playwright config, DB helpers)
plugins/
  plugin-boilerplate/  # The plugin itself (admin + server)
```

Managed with **pnpm workspaces** and **Turborepo**. Strapi and Playwright versions are pinned in the workspace catalog so all packages stay in sync.

### The plugin

The plugin ships with a minimal but complete scaffold:

**Server**
- A service (`services/service.ts`) with a `getWelcomeMessage()` method
- A controller (`controllers/controller.ts`) that calls the service and returns the response
- A content-API route (`GET /api/plugin-boilerplate`) wired to the controller
- Empty stubs for admin routes, content-types, policies, middlewares, bootstrap, register, and destroy

**Admin**
- A menu link that registers the plugin in the Strapi sidebar
- A `HomePage` component rendered at `/admin/plugins/plugin-boilerplate`
- An `Initializer` component that marks the plugin as ready on mount
- i18n setup via `react-intl` with a `translations/en.json` file ready to populate
- A `getTranslation` helper that namespaces keys under the plugin ID

### Testing

Two test layers are included out of the box:

**Integration tests** (Vitest + Supertest) — `server/test/example.test.ts`
- Starts a real Strapi instance using `setupStrapi()` from dev-utils
- Creates an API token programmatically for authenticated requests
- Tests the content-API endpoint over HTTP
- Tests the service method directly

**E2E tests** (Playwright) — `admin/test/example.spec.ts`
- Starts the playground app automatically (or reuses a running instance)
- Authenticates as an admin user via `admin/test/setup/auth.setup.ts`
- Navigates to the plugin's admin page and checks the rendered UI

### Dev utilities (`packages/dev-utils`)

A shared internal package used by both test layers:

| Export | What it does |
|---|---|
| `setupStrapi()` | Boots a Strapi instance from the playground for integration tests |
| `stopStrapi()` | Tears the instance down and cleans up |
| `createPlaywrightConfig(options)` | Returns a full Playwright config with webServer, auth projects, and DB setup |
| `registerAuthSetup(authFilePath)` | Registers the Playwright auth setup test (login + save session) |
| `dev-strapi` (bin) | Starts the playground in dev mode and restarts Strapi automatically whenever compiled plugin output changes |
| `with-db` (bin) | Wraps a command with an ephemeral DB — SQLite file or Postgres/MySQL database — and cleans it up on exit |
| `rename-plugin` (bin) | Interactive CLI that renames the plugin across the entire repo in one command |

### Linting

**Biome** handles both formatting and linting across the entire monorepo. It replaces ESLint and Prettier with a single fast tool. Config lives in `biome.json` at the root.

**lint-staged** runs automatically on every commit via a Husky `pre-commit` hook. It checks only the files you've staged:

- `*.{ts,tsx,js,json,...}` — Biome lint + format (`pnpm run lint`)
- `*.{ts,tsx,...}` — TypeScript type-check (`pnpm run lint:ts:server`)

### CI

GitHub Actions runs the full matrix on every push and PR to `main`/`develop`:

- **Node versions:** 22 and 24
- **Databases:** SQLite, Postgres, MySQL (run in parallel)
- **Jobs:** lint → TypeScript check → integration tests → E2E tests
- **Caching:** `node_modules`, built `dist`, and Playwright browser cache are all cached between runs
- **Artifacts:** Playwright HTML reports are uploaded on failure (30-day retention)

---

## Getting started

### Prerequisites

- Node.js >= 22
- pnpm >= 10.18.1

### Install dependencies

```bash
pnpm install
```

### Start developing

```bash
pnpm dev              # SQLite (default)
pnpm dev:postgres     # Postgres (requires Docker)
pnpm dev:mysql        # MySQL (requires Docker)
```

This starts the playground Strapi app with file-watching. Changes to the plugin's `server/src` or `admin/src` are picked up automatically.

### Rename the plugin

Run the interactive rename command from the repo root:

```bash
pnpm rename-plugin
```

It will prompt you for:

| Prompt | Example |
|---|---|
| Plugin name (kebab-case Strapi ID) | `my-awesome-plugin` |
| Display name | `My Awesome Plugin` |
| Description | `A Strapi plugin that does X` |
| NPM scope (without @) | `my-org` |
| Author name | `Jane Doe` |
| Author email | `jane@example.com` |
| GitHub org or username | `my-org` |
| GitHub repository name | `strapi-plugin-my-awesome-plugin` |
| License | `MIT` |

Press Enter to keep any current value. When finished, the command updates all references across the repo (package names, plugin IDs, route paths, test URLs, README) and renames the `plugins/` directory. Then run:

```bash
pnpm install
pnpm build
```

---

## Running tests

All test commands are run from the repo root.

### Integration tests

Tests the server-side code (controllers, services, routes) against a real Strapi instance.

```bash
pnpm test:integration           # SQLite
pnpm test:integration:postgres  # Postgres (requires Docker)
pnpm test:integration:mysql     # MySQL (requires Docker)
```

### E2E tests

Tests the admin UI end-to-end in a real browser. Playwright starts the playground automatically if it isn't already running.

```bash
pnpm test:e2e           # SQLite
pnpm test:e2e:postgres  # Postgres (requires Docker)
pnpm test:e2e:mysql     # MySQL (requires Docker)
```

---

## Other commands

```bash
pnpm build       # Build all packages and the plugin
pnpm lint        # Lint and format with Biome
pnpm lint:ts     # TypeScript type-check (admin + server)
```

---

## Plugin structure reference

```
plugins/plugin-boilerplate/
├── admin/
│   ├── src/
│   │   ├── index.ts                  # Plugin registration (menu link, lazy page load)
│   │   ├── pluginId.ts               # PLUGIN_ID constant
│   │   ├── pages/
│   │   │   ├── App.tsx               # Route wrapper
│   │   │   └── HomePage.tsx          # Main plugin page
│   │   ├── components/
│   │   │   ├── Initializer.tsx       # Marks plugin ready on mount
│   │   │   └── PluginIcon.tsx        # Sidebar icon
│   │   ├── utils/getTranslation.ts   # i18n key helper
│   │   └── translations/en.json      # English strings
│   └── test/
│       ├── setup/auth.setup.ts       # Playwright auth setup
│       └── example.spec.ts           # E2E tests
├── server/
│   ├── src/
│   │   ├── index.ts                  # Plugin export (lifecycle + features)
│   │   ├── bootstrap.ts              # Startup hook
│   │   ├── register.ts               # Register hook
│   │   ├── destroy.ts                # Teardown hook
│   │   ├── config/index.ts           # Plugin config schema
│   │   ├── controllers/controller.ts # Request handler
│   │   ├── services/service.ts       # Business logic
│   │   ├── routes/
│   │   │   ├── content-api/index.ts  # Public API routes
│   │   │   └── admin/index.ts        # Admin panel routes
│   │   ├── content-types/index.ts    # Custom content types
│   │   ├── policies/index.ts         # Custom policies
│   │   └── middlewares/index.ts      # Custom middlewares
│   └── test/
│       └── example.test.ts           # Integration tests
├── playwright.config.ts
└── vitest.config.ts
```
