---
name: brain-retro
description: Record what went wrong when an agent got something wrong on real work in this repo (wrong API, broken convention, a test that proved nothing, the person had to correct it) and propose the one change that would have prevented it. Use right after a correction or failure ("that went wrong", "don't do that again", "why did you do X"). Logs to .claude/brain/RETRO-LOG.md; does not make the fix itself without a yes.
---

# brain-retro

A failure on real work is the cheapest moment to improve the setup, because the cause is still in
view. Write it down, then propose the single smallest change that would have prevented it.

## Sequence

1. **Say what happened** in two lines: the task, what was done, what should have been done. Take it
   from the conversation. If the cause is unclear, ask rather than guess; a wrong cause produces a
   fix to the wrong thing.
2. **Pick one fix** from the table. Needing two changes for one failure means the cause is not
   pinned yet.
3. **Log a row** in `.claude/brain/RETRO-LOG.md` before proposing anything, so it is on record even if
   the fix is declined.
4. **Propose the change** in one or two lines: which file, what changes, why it would have caught
   this. Make it only on the person's yes.
5. **Update the row's Status:** `fixed YYYY-MM-DD`, `upstream: <link>`, `declined: <reason>`, or
   leave `open`.

## The fix table

| What went wrong | The one change |
| --- | --- |
| A fact about this repo was missing or wrong | A practice, through `brain-remember` |
| A word was misread | A glossary line, through `brain-remember` |
| A convention was missing or unclear | One line in `AGENTS.md` |
| A project skill in `.claude/skills/` misled | One edit to that skill |
| An external skill (strapi-skills) misled | A line under "How strapi-skills maps onto this repo" in `AGENTS.md`, plus an issue on its repository if it is wrong in general (drafted for the person; never filed without a yes) |
| The Design System artifact is wrong or missing something | Tell the person, so its owners can update it; note it in the row |

## Rules

- `RETRO-LOG.md` is history: never rewrite an old row except its Status.
- No secrets, tokens, hostnames or personal data in a row.
- Commit only when asked.
