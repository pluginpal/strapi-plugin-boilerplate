# Glossary

Terms that mean something specific in this repo. Loaded into every Claude session: keep it short,
one line per term, alphabetical. Add a term through the `brain-remember` skill.

Format: **term**: what it means here. Avoid: other words for it. Not: what it is easily taken for.

**admin route**: a server route under `server/src/routes/admin`, called from the admin panel with an admin JWT. Not: a page in the admin UI.
**content-API route**: a server route under `server/src/routes/content-api`, served under `/api/...` and authorised by API tokens or users-permissions. Avoid: public route.
**document**: a Strapi v5 entry addressed by `documentId` through `strapi.documents(uid)`. Avoid: entity. Not: the numeric `id`, which differs per locale and draft/published version.
**playground**: the Strapi app in `apps/playground` that runs the plugin for development and tests. Avoid: example app. Not: a sandbox you can change freely: tests depend on it.
**plugin ID**: the plugin's Strapi name (`strapi.name` in its `package.json`), exported as `PLUGIN_ID` from `admin/src/pluginId.ts`. Not: the npm package name.
