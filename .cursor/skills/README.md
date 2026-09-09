# Cursor Cloud Agent skills

Source: private [`erict16/grok-skills`](https://github.com/erict16/grok-skills) (canonical Grok playbooks in `skills/` → `~/.grok/skills` on the Bot box).

Copied from branch [`cursor/cursor-skills-huaming-pack-5d67`](https://github.com/erict16/grok-skills/tree/cursor/cursor-skills-huaming-pack-5d67) at `547bb0bf7551a90dcd7fa72a34d9188d022aa336` ([PR #1](https://github.com/erict16/grok-skills/pull/1); use `main` after that PR merges).

This tree is a **sync copy** so Cursor Cloud Agents on `huaming-order-sheet` load Huaming playbooks from `.cursor/skills/<name>/SKILL.md`. Canonical edits stay in `grok-skills`; re-copy here when those playbooks change.

Included:

- `huaming-workflow` (`SKILL.md` + `references/`)
- `huaming-quotation` (`SKILL.md`)
- `huaming-overseas-sales` (`SKILL.md`)
- `huaming-oltc-selection` (`SKILL.md` + `references/`)
- `huaming-export-comms` (`SKILL.md` + `references/`)
- `huaming-export-docs-email` (`SKILL.md` + `references/`)
- `qq-email` (`SKILL.md` only; no `scripts/`, no `node_modules`)
