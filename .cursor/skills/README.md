# Cloud Agent skills (Huaming)

Copied from [erict16/grok-skills](https://github.com/erict16/grok-skills) so Cursor Cloud Agents on **huaming-order-sheet** load Huaming domain playbooks.

**Source:** `erict16/grok-skills` `main` @ `fa6d193ddcc6c880600265671201fdfad60cb1de`  
That repo has no `.cursor/skills/` tree yet (and no open PR adding one). These folders were copied from `skills/huaming-*` and `skills/qq-email/SKILL.md`.

## Skills

| Skill | Role |
|-------|------|
| `huaming-workflow` | Router + end-to-end overseas sales discipline (`SKILL.md` + `references/`) |
| `huaming-quotation` | Qu-ET quotation (list × coeff × FX) |
| `huaming-overseas-sales` | Sales confirmation, CI/PL, commercial calc |
| `huaming-oltc-selection` | Type designation / 选型 (no prices on shared UI) |
| `huaming-export-comms` | Customer + factory-engineer email |
| `huaming-export-docs-email` | Form E / CIPL shipping packs |
| `qq-email` | Tencent Exmail IMAP/SMTP playbook (`SKILL.md` only; skip `node_modules` / scripts) |

Do not treat this directory as app code. Refresh from grok-skills when those playbooks change.

**Note:** The signed 2025-02-19 warranty scan (`overseas-extended-warranty-2025-02-19.png`) stays in grok-skills. The transcribed table is in `huaming-workflow/references/overseas-extended-warranty.md`.
