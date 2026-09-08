# Huaming Order Sheet

Web app that replaces the Huaming **ORDER SHEET** (Order Specifications / Бланк заказа) PDF:
users fill tap-changer order parameters in the browser, and **ops export a clean Excel** with
every parameter. Static site (Next.js + Tailwind) hosted on GitHub Pages; Excel export runs
client-side (SheetJS).

## Plan

See **[PLAN.md](./PLAN.md)** for the full series/family map, form UX, Excel-export design,
stack, open questions for Eric, and phased milestones.

## Data

- [`order-inventory.json`](./order-inventory.json) — 2025/2026 order-sheet PDF counts by family
  prefix, aggregated from Eric's `整合文件` archive (~1719 PDFs).

## Status

v0 implementation in progress — see [PLAN.md §10](./PLAN.md#10-implementation-status-v0) and the open PR.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # static export to ./out (GitHub Pages artifact)
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Related: [`erict16/oltc-selector`](https://github.com/erict16/oltc-selector) — produces the tap-changer
type string only; this repo is the full ORDER SHEET capture + Excel export.
