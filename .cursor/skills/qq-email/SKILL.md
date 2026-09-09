---
name: qq-email
description: >-
  Eric 腾讯企业邮（exmail IMAP/SMTP · Node qq-email）。收信、待办、发信 + 华明中/英语气。
  发信必须 safe_send + body-file；先草稿后发送。触发：查邮件、发邮件、回信、转发、收件箱。
---

# qq-email (pointer)

Canonical skill + scripts live in [erict16/grok-skills](https://github.com/erict16/grok-skills) at `skills/qq-email/` (Bot box: `~/.grok/skills/qq-email`). This repo vendors **SKILL.md only** so Cloud Agents discover the skill without copying `scripts/` or `node_modules`.

For send/receive/draft, use the grok-skills checkout or `~/.grok/skills/qq-email` (`safe_send.mjs`, `save_draft.mjs`, etc.). Do not invent a second mail stack here.

Huaming export wording still follows `huaming-export-comms` and `huaming-export-docs-email` in this tree.
