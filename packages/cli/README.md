# strapi-plugin-factory

Interactive scaffolder for [Strapi v5](https://strapi.io) plugins, built on top of [strapi-plugin-boilerplate](https://github.com/pluginpal/strapi-plugin-boilerplate).

```bash
npx strapi-plugin-factory my-plugin
```

The CLI asks a few questions, fetches the boilerplate from GitHub, applies your answers, and installs dependencies. No `git clone`, no manual find/replace.

## Status

Work in progress on the `feat/cli` branch. The skeleton runs but the interactive flow is not yet wired — see the open phases in the branch's PR description.

## Flags

| Flag | Description |
| --- | --- |
| `-h`, `--help` | Show help |
| `-v`, `--version` | Show version |
| `-y`, `--yes` | Skip prompts, use defaults |
| `--dry-run` | Print planned actions without writing |
| `--ref <ref>` | Template git ref to fetch (default: `main`) |

## License

MIT
