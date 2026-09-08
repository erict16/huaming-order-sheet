# Huaming Order Sheet

Web app that replaces the Huaming **ORDER SHEET** (订货技术规范书) PDF:
users fill tap-changer order parameters in the browser, and **ops export a clean Excel** with
every parameter. Static site (Next.js + Tailwind) hosted on GitHub Pages; Excel export runs
client-side (SheetJS).

**UI language:** Chinese by default, toggle to English. No Russian UI.

Live: https://erict16.github.io/huaming-order-sheet/

## Plan

See **[PLAN.md](./PLAN.md)** for the full series/family map, form UX, Excel-export design,
stack, open questions for Eric, and phased milestones.

## Data

- [`order-inventory.json`](./order-inventory.json) — 2025/2026 order-sheet PDF counts by family
  prefix, aggregated from Eric's `整合文件` archive (~1719 PDFs).

## Status

v0 implementation in progress — see [PLAN.md §10](./PLAN.md#10-implementation-status-v0).
GitHub Pages redeploys from `main` after merge.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # static export to ./out (GitHub Pages artifact)
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run smoke      # type-string + Excel sheet checks
```

Related: [`erict16/oltc-selector`](https://github.com/erict16/oltc-selector) — produces the tap-changer
type string only; this repo is the full ORDER SHEET capture + Excel export.
