# OLTC type designation detail

## Earth insulation (Um → PF / LI)

| Um kV | PF | LI |
|------|-----|-----|
| 12 | 35 | 75 |
| 17.5 | 45 | 105 |
| 40.5 | 90 | 250 |
| 72.5 | 140 | 350 |
| 126 | 230 | 550 |
| 145 | 275 | 650 |
| 170 | 325 | 750 |
| 252 | 460 | 1050 |
| 300 | 480 | 1100 |
| 363 | 510 | 1175 |

Selector sizes B→DE raise internal a/b withstand (SHZV Table 4-2).

**Auto grade floor by Um** (training calc sheet + HOW TO SELECT; across-tap only raises):

| Um kV | Default grade |
|------:|:-------------:|
| ≤72.5 | B |
| 126 / 145 | C |
| 170 / 252 | D |
| ≥300 | DE |

Across-tap a-distance (LI/PF) can bump B→C→D→DE. Example: Um 72.5 + across BIL 285 → **C**.

## Catalogue currents (brochure + Base Price List 2025)

**Do not invent ratings.** Full note: `~/Github/oltc-selector/docs/catalog-source.md`.

| Family | III Iᵤ (A) | Um (kV) | Grade letter? |
|--------|------------|---------|----------------|
| **CV2** | **350, 600 only** | 40.5 / 72.5 / 126 / 145 | No |
| CV | 350 (I: 350/700) | 40.5 / 72.5 | No |
| **SV** | **500** | 40.5 / 72.5 | No |
| CM / CM2 | III/II **500, 600**; I +800/1200/1500 | 72.5 / 126 / 170 / 252 | Yes |
| SHZV | III 400/600/1000 | 72.5…252 (+300/363 brochure) | Yes |
| CMD | III 400/600/1000 | 72.5…252 | Yes |
| HWV | 400 / **800** / 1000 | 17.5 / 40.5 / 72.5 | No |
| CVT | 160 / 200 | **12** | No |
| CZ | 500 / 600 | 40.5 / 72.5 | No |

- **CV2-500 does not exist.** 500 A oil compound = **SV**; CM/CM2 III also uses 500/600.
- CV2 positions: 12 without CO / 23 with CO; step voltage 2000 V (10 ct) / 1500 V (12 ct).

## Common tap codes

| Code | Meaning |
|------|---------|
| 10193W | 10 pitch, 19 pos, mid 3, reversing |
| 10191W | mid 1 reversing |
| 12233W | 12 pitch, 23 pos, mid 3, W |
| 18353W | 18 pitch, 35 pos, mid 3, W |
| 10193G | coarse-fine |

## App fixtures

1. **UE HWV:** on_tank, vacuum, III, Y, 400 A, 72.5 kV, rev, 19 pos mid3 pitch10 → `HWVIII-400Y/72.5-10193W`
2. **SHZV 170D:** in_tank, III Y 1000 A 170 size D pitch12 pos23 mid3 → `…/170D-12233W`
3. **CV2:** in_tank vacuum compound 350 A 40.5 → `CV2III-350Y/40.5-10193W` (no grade)

## Portfolio

选型 is demand-first work tool (real PDFs + daily pain). Same lane: email-desk, sc-generator-pro, dwg-converter-pro. TypeBooks = garden only.

## Sources

- OneDrive `Attachments/Techincal Brochure/` — CV2 HM0.154.4101/5601, SHZV, HWV, CM/CM2/CMD, CV&SV, CVT, CZ
- `QS/a. Base Price List 2025.xlsx` — commercial model headers only (not public prices)
- Repo extracts: `oltc-selector/docs/brochure-extracts/`, `docs/catalog-source.md`
