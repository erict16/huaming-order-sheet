# Agent instructions

Huaming ORDER SHEET web app (Next.js static export → GitHub Pages).

## Product
- Chinese default + English toggle. Shared OS template; family only toggles conditional fields.
- Excel/Word export client-side. Public form first; no auth unless Eric asks.

## Agents
- Type designation is inline (`TypePlate`). No floating type panel.
- Presets prefill spec only; they strip buyer / designer contact (`PRESET_CONTACT_KEYS`).
- Palette is navy `#00428C` / steel `#0071A9`. Do not restyle.
- Tests: `npm test && npm run typecheck`. After UI/schema changes also `npm run build`.
- Static export: CI sets `NEXT_PUBLIC_BASE_PATH=/huaming-order-sheet`. Live: https://erict16.github.io/huaming-order-sheet/

## Cursor Cloud specific instructions

- Environment install: `npm ci && npm test && npm run typecheck` (see `.cursor/environment.json`).
- After substantive UI/schema changes, also run `npm run build`.
- Push to `main` for solo Eric unless he asks for a PR.
- Do not commit secrets; use Cursor Dashboard Secrets if needed.
- Prefer Huaming domain facts from Eric’s grok-skills when selecting fields/labels; do not modify the grok-skills repo unless he explicitly asks.
- Do not vendor `.cursor/skills` from grok-skills.
