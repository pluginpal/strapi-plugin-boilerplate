# The brain

What has been learned about working on this repo, written down so the next session (human or AI)
starts from it instead of working it out again. It is plain Markdown, committed with the code, and
read by any agent through `AGENTS.md` (Claude Code also loads the glossary and the practice index
into every session through `CLAUDE.md`). It sits in `.claude/` to keep the repo root clean, but
it is not Claude-only: every agent reads and writes it the same way.

The idea and the formats are adapted from
[derrickmehaffy/brain-template](https://github.com/derrickmehaffy/brain-template), trimmed to what
fits inside a plugin repo: no harness, no hooks, nothing to install.

| File | Holds | Written by |
| --- | --- | --- |
| `GLOSSARY.md` | Terms that mean something specific here, and words to avoid | `brain-remember` |
| `practices/<id>.md` | One checked fact each, with evidence and how to re-check it | `brain-remember` |
| `practices/INDEX.md` | One line per practice; loaded into every Claude session | `brain-remember` |
| `RETRO-LOG.md` | What went wrong, and the change that fixed it | `brain-retro` |

Rules about how to work belong in `AGENTS.md`, not here. The brain holds facts and history.

## When to write

- **"Remember that"**, or a fact took real effort to find and will be needed again: a practice.
- **A word caused confusion:** a glossary line.
- **An agent got something wrong and was corrected:** a retro row, and the one fix it points to.

Never write secrets, tokens, hostnames, customer names or personal data. Plugin repos are often
public.

## Practice format

File `practices/<id>.md`, where `id` is kebab-case and equals the file name:

```markdown
---
id: integration-tests-load-the-built-plugin
tags: [testing, build]
durability: durable            # or volatile: can change under you (versions, settings)
evidence: researched           # researched | reproduced | reliable
verified: 2026-11-09           # the last day someone actually confirmed it
source: apps/playground/package.json; .github/workflows/tests.yml
recheck: <read-only command or URL>       # required when volatile
reproduced-by: <how>, YYYY-MM-DD          # required at reproduced and reliable
superseded-by: <id>                       # only on an entry a newer one replaced
---
The point in one sentence (the index shows it).

The specifics, then what it means for the work.
```

- **evidence:** `researched` means read from code, docs or a statement; nobody watched it happen
  (reading code is `researched`). `reproduced` means observed running. `reliable` means held on
  two or more occasions, with two or more sources. Always take the lowest true level.
- **verified:** only move it on a day you actually re-checked the fact.
- **Retire, never delete:** set `superseded-by` on the old entry and drop it from the index.

## Glossary format

One line per term, alphabetical:
`**term**: what it means here. Avoid: other words for it. Not: what it is easily taken for.`

## Want more?

For personal routines across several repos, gates that make sure a skill really ran, and a
pre-commit privacy guard, wrap this repo in a full brain made from
[brain-template](https://github.com/derrickmehaffy/brain-template) (its "single project" shape:
the brain is the outer folder and this repo is cloned inside it). The two do not conflict: this
folder stays the project's shared, committed knowledge, and the outer brain holds your own.
