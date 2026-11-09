# Practices

Checked facts about this repo, one per file. Read the entry before relying on it; run its `recheck`
first when it is `volatile`. Add or update entries through the `brain-remember` skill.

- [integration-tests-load-the-built-plugin](integration-tests-load-the-built-plugin.md): The playground, and so every integration and E2E test, loads the plugin from its built `dist/`, not from `src/`.
- [rename-plugin-rewrites-a-fixed-file-list](rename-plugin-rewrites-a-fixed-file-list.md): `pnpm rename-plugin` rewrites the old plugin name in a fixed list of files only, so a new file that spells out the name keeps the old one.
