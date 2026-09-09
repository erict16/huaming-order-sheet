# OLTC Selector UI + field matrix

App: `~/Github/oltc-selector` · stack **Next.js 15 + Tailwind v4** · engine `lib/` · UI `components/SelectorApp.tsx`

## Interaction contract (Eric — strong preference)

1. **Idle first.** Right pane = “还没选型” until the user clicks **选型 / Select**.
2. **Explicit run.** `selectOltc` runs on submit only (short spinner ~250–300 ms is fine).
3. **Stale on edit.** Changing any field after a run marks result stale → banner “参数已改，请再点重新选型”; do **not** auto-replace the model.
4. **Enter animation.** Result card uses calm rise/fade (`result-enter`); respect `prefers-reduced-motion`.
5. **Progressive disclosure.** Main grid = duty fields only; mounting / medium / phases / vacuum / selector / across-tap BIL under **更多选项**.
6. **Short copy.** One-line page blurb; tips under fields optional and ≤1 line. No ranking essays. Run **humanizer** on UI strings (no AI marketing tone).
7. **Few examples.** ≤3 chips that **load inputs only** (clear prior result). Prefer user still clicks 选型.

## Primary fields (first paint)

| Field | Control | Notes |
|-------|---------|--------|
| Through-current Iᵤ | number | Duty A; ceil tip only if rounds up |
| Um | **dropdown** | Catalogue kV only |
| OLTC connection | Y / D / any | **Not** Dyn11 |
| Regulation | reversing W / coarse-fine G / linear 0 | Change-over type |
| ± steps **or** positions | dropdown | Linear → positions only (hide ±) |
| Max step voltage Ust | **dropdown** | Common bins |

## More options (collapsed)

Mounting, medium, prefer vacuum, phases, selector grade (combined path only), across-tap BIL/PF.

## Never as selection inputs

| Removed | Why |
|---------|-----|
| 日切换次数 | Not type-designation |
| Pitch / mid as required | Auto from positions (`tapCode.ts`) |
| MDU / CMA7 on form | Copy model **without** drive by default |

## Combined vs compound

- **组合式 combined:** may include grade letter after Um (`72.5C`, `170D`).
- **复合式 compound (CV/CV2/…):** **no** grade letter; never offer B–DE for that result.

Engine: `SeriesDef.usesSelectorSize` + `structure: "combined" | "compound"`.

## Branding

| OK | Not OK |
|----|--------|
| OLTC Selector / 有载开关选型 | 华明 / Huaming on chrome |
| “Engineering confirmation” / 工程确认 | “须华明工程确认” |

## Engine fixtures (smoke)

- UE HWV: `HWVIII-400Y/72.5-10193W`, empty selectorSize
- SHZV: contains `170D`, tap `12233W`
- CV2 path: no grade letter when CV2 wins
- Training + 2025 sales fixtures in `lib/engine.test.ts`

## Dev

```bash
lsof -ti :3000 | xargs kill -9 2>/dev/null   # TypeBooks
cd ~/Github/oltc-selector && npm run dev       # :5173
npm test && npm run build
```
