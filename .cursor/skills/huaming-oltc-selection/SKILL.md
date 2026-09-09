---
name: huaming-oltc-selection
description: >
  Use when selecting Huaming OLTC/OCTC type designation from transformer parameters,
  or working on ~/Github/oltc-selector. Triggers: 选型, type designation, model string,
  CV2, CM2, SHZV, HWV, WSL, Um, Iu, 调压方式. No prices on shared UI. After model chosen,
  hand off to huaming-overseas-sales for QS.
metadata:
  short-description: "Huaming OLTC type designation + selector app"
  version: "1.2.0-grok"
---

> **Grok-local:** `~/.grok/skills/huaming-oltc-selection/`


> **Grok-local install:** `~/.grok/skills/huaming-oltc-selection/`


# Huaming OLTC selection (选型)

Turn transformer parameters into a **precise commercial type string**. For Eric, colleagues, or customers. **No prices** on shared pages.

`huaming-overseas-sales` owns QS/coeff/email (may be curator-locked if manually authored). This skill owns **type designation + oltc-selector app**.

## When to use

- 选型 / select OLTC / type designation / model string
- Build or fix `~/Github/oltc-selector`

## App

| | |
|--|--|
| Repo | `~/Github/oltc-selector` |
| Stack | **Next.js 15** + Tailwind v4 · engine in `lib/` |
| Dev | `npm run dev` → http://127.0.0.1:5173 |
| Test | `npm test` (vitest on `lib/**/*.test.ts`) |
| Engine | `lib/engine.ts`, `catalog.ts`, `tapCode.ts` |
| UI | `components/SelectorApp.tsx` · `app/` |

### Form field semantics (do not mix)

| Field | Meaning |
|-------|---------|
| **调压方式** | Tap-winding change-over: **线性 0** / **正反 W** / **粗细 G** — brochure Fig. basic connection of tap winding |
| **开关连接方式** | OLTC application point: **Y 星点** / **D 角形·线端·任意** — **not** transformer Dyn11 |
| **± 级数** | Only for W/G; **linear hides ±**, uses positions only |
| **Um / Ust** | Catalogue **dropdowns** only |

## App UI rules (Eric 2026-07+)

| Do | Don't |
|----|--------|
| Brand: **OLTC Selector / 有载开关选型** | 华明 / Huaming on page chrome |
| **Primary fields only** first paint: Iᵤ, Um↓, OLTC Y/D, regulation 0/W/G, ±N/pos, Ust↓ | Open mounting/medium/phases/BIL/selector on main grid |
| Rest under **更多选项** (collapsed) | Hint paragraph under every control |
| **Empty result until user clicks 选型** | Live model on the right before submit |
| After submit: model + short why + **enter animation** | Pre-filled answer that feels already selected |
| Dirty form → stale banner + **重新选型** (no auto-refresh) | Silently rewrite model while user edits |
| ≤3 example chips (load inputs only) | 5+ presets + ranking essays on page |
| Copy: plain 白话 / humanizer-short | AI-ish walls (“选型原则：…”) |
| Linear → positions only (no ±) | Show ± for linear |
| Selector grade **only** combined in-tank | B/C/D/DE for CV/CV2 or HWV |
| MDU off form; copy without drive | Default `+CMA7` on string |
| One-line engineering disclaimer after result | “须华明工程确认” on chrome |
| Dev `:5173`; kill TypeBooks `:3000` when switching | Leave TypeBooks on preview |

**Interaction:** 填参数 → 点「选型」→ 右侧才出型号（spinner → result-enter）. Details: `references/ui-selection-rules.md`.

## Ranking (critical)

**Minimum adequate — not SHZV-by-default.**  
Training: `docs/training/选型案例-答案.docx`.  
**2025 sales only:** `docs/sales-2025-calibration.md` + `references/sales-2025-anchors.md` (ignore 2024).

1. Filter electrically eligible (Iᵤ ceil, Um, Ust, positions, step capacity, across-tap for compound).
2. **Family rank dominates** (CV2 → CM2 → SHZV → SHZVG). Never let SHZV-400 beat CV2/CM2 just because the current label matches exactly.
3. Prefer **CM2** over **SHZV** when CM2 current/Um fit; compound first when eligible.
4. **Never prefer 3× over a covering single III.** Base price: SHZVIII-1000 ≈ ¥219k vs 3×CM2I-800 ≈ ¥522k. Path: CM2 III → SHZV-1000 → SHZVG-1300/1500 → only then 3×.
5. Mild preference for smallest catalogue I / Um; ~97% Ium headroom bumps one step (case 2: 490→600).
6. Selector grade floor by Um: **≤72.5→B, 126/145→C, 170/252→D, ≥300→DE**. Across-tap a-distance only raises (72.5+BIL285→C). 72.5 still allows DE if requested (2025 shipments).

### 2025 catalogue anchors

| Family | III Iᵤ | Notes |
|--------|--------|--------|
| CV2 | **350, 600 only** | No 500 in 2025 |
| CV | 350 | Top oil compound volume |
| CM2/CM | 500, 600 | |
| SHZV | 400/600/1000 | |
| **SHZVG** | 1300/1500 | After SHZV max |
| CMD I | +**1200** | CMDI-1200 volume |

Fixtures: case1/2/5/7 + `sales2025Cv2_145`, `sales2025Cm2_500`, `sales2025Shzvg`.

## Workflow

1. Collect mounting, medium, phases, Y/D, Iᵤ, Um (**dropdown**), step V, regulation, ±N/pos (**dropdown**); optional earth + **across-tap** BIL/PF; selector grade only if combined.
2. Primary output = **model without MDU** · label “最低满足”.
3. No prices; no 华明 brand chrome.
4. App UI: empty result until **选型**; progressive disclosure; short copy.
5. `npm test` before done (training + **2025 sales** fixtures).

## Pitfalls

1. Forcing HWV `72.5B` when commercial uses bare `72.5`.
2. ±8 when intending `10193W` — use ±9 or positions=19.
3. Selector-grade UI or size letters on **compound** CV/CV2.
4. Pitch/mid or MDU as required selection fields.
5. Prices / coefficients / 华明 chrome on shared page.
6. Output treated as final OS without engineering note.
7. TypeBooks still on `:3000` when user asked for oltc-selector.
8. **Inventing CV2-500** — **2025 sales** confirm 350/600 only; SV is oil 500 A.
9. CM/CM2 III 800/1000 — not in catalogue; use SHZV/CMD or single-phase.
10. **Ranking SHZV first** when CV2/CM2 already fit — violates minimum-adequate (also: do not overweight exact-current match).
19. **Selector grade always B** for combined — wrong; use Um floor (126→C, 170→D, 252→D not DE).
20. **Single-phase model with Y/D** after current (`3xCM2I-800D/…`) — strip connection; D after Um is size.
11. Free-typing Um instead of catalogue dropdown steps.
12. Calibrating on **2024** rows — use **2025** only.
13. Offering 3×CM2 when **SHZVG** covers Iᵤ>1000 as a single III unit.
14. **Showing a model before 选型** — idle empty first; newcomers think work is already done.
15. **Auto-recompute on every keystroke** — explicit submit + stale when inputs change.
16. **Cluttered first paint** — progressive disclosure; short copy only.
17. Inventing currents from unfiltered multi-year lists (e.g. CV2-250/500) — year-filter **2025**.
18. Mixing **调压方式** with **开关连接** or Dyn11.

## References

- `references/type-designation.md` — earth table, fixtures, portfolio note
- `references/ui-selection-rules.md` — submit/idle UX, form matrix, branding
- `references/sales-2025-anchors.md` — condensed 2025 shipment axes
- Repo `docs/sales-2025-calibration.md` — full 2025 notes
- Repo `docs/catalog-source.md` — brochure + price-list axes
- Repo `docs/training/` — 选型案例-答案 + calculation xlsx
