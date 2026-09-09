# 2025 sales anchors (catalogue calibration)

**Source of truth year: 2025 only.** Do not calibrate currents/Um from 2024 or multi-year dumps without filtering Year=2025.

Primary file: OneDrive `Attachments/Excel/Sales/HM reference list -2019-2025.xlsx` → sheet `2019-2025 `, filter Year=2025.  
Also: `直接出口数据.xlsx` / `间接出口数据.xlsx` 2025 columns.  
Repo write-up: `docs/sales-2025-calibration.md`.

## Volume order (2025 reference qty, approximate)

CV ≫ CV2 ≈ CM2 ≈ CM > SHZV ≫ CMD / SV / CZ / SHZVG / HWV / CVT

**Implication:** minimum-adequate ≠ default SHZV. Small duty → CV2/CV; mid → CM2/CM; high III Iᵤ → SHZV then SHZVG.

## III currents that shipped (2025)

| Family | III Iᵤ | Notes |
|--------|--------|--------|
| CV | 350 | Oil compound volume leader |
| **CV2** | **350, 600 only** | **No 500 / no 250** in 2025 rows |
| SV | 500 | Oil compound 500 A |
| CM / CM2 | 500, 600 | |
| SHZV | 400, 600, 1000 | |
| **SHZVG** | **1300, 1500** | When > SHZV 1000 |
| HWV | 400, 800, 1000 | On-tank |
| CVT | 160 | Dry 12 kV |
| CZ | often 3×I-500 | Dry |

## Other 2025 realities

- **CMD I 1200** appears in shipments (e.g. CMDI-1200) — keep in catalogue even if some price-list sheets omit it.
- **72.5DE** ships (e.g. CM2…/72.5DE) — allow DE at 72.5; auto still picks smallest grade.
- CV2 **Um 145** is real volume (`CV2III-600D/145-…`).
- Top taps: `10193W`, `10191W`, `12233W`, linear `10090` / `10070`.

## Ranking knobs that matched 2025 + training cases

- Strong penalty for Iᵤ and Um overshoot (tighter catalogue fit beats “compound glamour” when CV2-600 would overshoot vs CM2-500).
- Multi-unit OK vs one SHZV tier up (case 7: 3×CM2I-800); if Iᵤ>1000 prefer **SHZVG** single III over 3×CM2.
- ~97% of Ium headroom → bump one step (case 2: ~490 → 600).

## Do not

- Invent CV2-500 from older Spec sheets without year filter.
- Prefer SHZV when CV2/CM2 already fit.
- Use 2024 indirect export lists as the primary axis.
