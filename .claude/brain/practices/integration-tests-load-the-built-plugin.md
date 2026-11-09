---
id: integration-tests-load-the-built-plugin
tags: [testing, build, playground]
durability: durable
evidence: researched
verified: 2026-11-09
source: apps/playground/package.json (workspace dependency on the plugin); plugins/<plugin>/package.json exports (point at dist/); .github/workflows/tests.yml (runs pnpm build before every test job)
---
The playground, and so every integration and E2E test, loads the plugin from its built `dist/`, not from `src/`.

The playground depends on the plugin as a workspace package, and the plugin's `package.json`
`exports` for `./strapi-server` and `./strapi-admin` resolve to `dist/`. CI runs `pnpm build` before
any test job for this reason.

For the work: after changing plugin code, run `pnpm build` (or keep `pnpm dev` running, which
watches and rebuilds) before `pnpm test:integration` or `pnpm test:e2e`. A test that still sees old
behaviour after a source change is most likely running against a stale build.
