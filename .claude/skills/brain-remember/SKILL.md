---
name: brain-remember
description: Save one fact about this repo to .claude/brain/practices/ (with how well it is known and how to re-check it), or one term to .claude/brain/GLOSSARY.md, so the next session does not have to work it out again. Use when work just established something a second occurrence would need ("remember that", "write that down", "note this for next time"), when a stored fact turned out wrong or stale, or when a word caused confusion. Not for rules about how to work (those go in AGENTS.md or a skill) and not for failures (use brain-retro).
---

# brain-remember

A practice is one fact this repo's maintainers or agents have worked out, kept with how well it is
known, when it was last confirmed and how to confirm it again. A fact stored at a higher confidence
than anyone saw it hold is worse than no entry, because the next session trusts it.

The format is in `.claude/brain/README.md`. Read it before writing.

## 1. Two gates

Write nothing unless both hold:

1. **A second occurrence would go faster with it.** If nobody would need it next time, write none.
2. **It is a fact, not a rule.** "Integration tests load the plugin from its built `dist/`" is a
   fact. "Always build before testing" is a rule; it belongs in `AGENTS.md` or a skill. Say so,
   propose that edit instead, and stop.

**A term is not a practice.** When a word misled (two words for one thing, or a word read as
something it is not here), add one line to `.claude/brain/GLOSSARY.md` in its format, in alphabetical
order. Every session loads that file, so keep it short.

## 2. Set the evidence honestly

Take the lowest level that is true:

- `researched`: read from code, docs or someone's statement; nobody watched it happen. **Reading
  code is `researched`.**
- `reproduced`: observed running, by you or in output you can cite. Add `reproduced-by`.
- `reliable`: held on two or more separate occasions, with two or more `source` entries.

Use `durability: volatile` when it can change under you (a version, a dependency's behaviour, a CI
setting), with a `recheck` that only reads. Otherwise `durable`.

## 3. Check for an existing entry

Read `.claude/brain/practices/INDEX.md` and search the folder (`grep -ril <term> .claude/brain/practices`). If the
fact is already there, update that entry instead of adding one. If an existing entry is now wrong,
write the new one and set `superseded-by: <new-id>` on the old one. Never delete an entry.

## 4. Write the entry and index it

- Write `.claude/brain/practices/<id>.md` with the frontmatter from `.claude/brain/README.md`. The body starts with
  the point in one sentence, then the specifics, then what it means for the work.
- Add one line to `.claude/brain/practices/INDEX.md`: `- [<id>](<id>.md): <the first sentence>`. Remove
  the line of a superseded entry.
- No secrets, tokens, hostnames, customer names or personal data: the brain is committed and may be
  public.

## Done when

- Both gates held, or you said why this is not a practice and where it belongs instead.
- `evidence` is the lowest true level, with `reproduced-by`, `recheck` and `source` to match.
- `INDEX.md` lists the entry; nothing was deleted.
- You told the person what was saved, in one line. Commit only when asked.
