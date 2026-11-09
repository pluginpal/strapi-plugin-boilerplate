@AGENTS.md

## Claude Code

- **Plugins:** `.claude/settings.json` registers the `strapi-skills` marketplace and enables its
  plugin, so Claude Code offers to install it once you trust this folder. If it is missing, run
  `/plugin marketplace add ayhid/strapi-skills` then `/plugin install strapi-skills@strapi-skills`.
- **strapi-skills' prompt hook** only recognises a Strapi plugin when Claude is started inside
  `plugins/<plugin>/`. Started from the repo root, the skills still load from their descriptions;
  name them when one should apply and has not.
- **Design system:** the `strapi-design-system` skill reads the Strapi Design System artifact with
  the Artifact tool. Use it for the look and feel; production code still imports
  `@strapi/design-system`.
- **Brain:** loaded into every session below. Write to it with `brain-remember` and `brain-retro`.

@.claude/brain/GLOSSARY.md
@.claude/brain/practices/INDEX.md
