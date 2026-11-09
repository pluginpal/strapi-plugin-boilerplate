---
id: rename-plugin-rewrites-a-fixed-file-list
tags: [rename, tooling]
durability: volatile
evidence: researched
verified: 2026-11-09
source: packages/dev-utils/src/rename.ts
recheck: grep -n "updateFile(" packages/dev-utils/src/rename.ts
---
`pnpm rename-plugin` rewrites the old plugin name in a fixed list of files only, so a new file that spells out the name keeps the old one.

It rewrites the plugin's `package.json`, `admin/src/pluginId.ts`, `server/src/controllers/controller.ts`,
the two example tests, the plugin README, the playground's `package.json`, the root `README.md` and
`.changeset/config.json`, then renames the folder under `plugins/`. Nothing else is searched.

For the work: import `PLUGIN_ID` from `admin/src/pluginId.ts` instead of writing the plugin name,
and refer to the plugin folder as `plugins/<plugin>/` in docs. If a file must contain the name, add
it to `rename.ts`.
