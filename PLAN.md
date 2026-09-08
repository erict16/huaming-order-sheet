# Huaming ORDER SHEET Web App — Plan

**Owner:** Eric Tan — Huaming (上海华明 / Shanghai Huaming Power Equipment) overseas sales, solo developer
**Repo:** [`erict16/huaming-order-sheet`](https://github.com/erict16/huaming-order-sheet)
**Status:** Living plan. v0 implementation is in progress in this same repo (see [§9 Milestones](#9-phased-milestones) and [§10 Implementation status](#10-implementation-status-v0)).

---

## 0. Problem statement

Today, Huaming's **ORDER SHEET** (Order Specifications / Спецификация заказа / Бланк заказа) is a multi-page PDF that a transformer maker or Eric fills in by hand to specify a tap changer order: the tap-changer family, the full type designation string, transformer data, mechanical/electrical options, motor drive unit, controller, and accessories.

Pain points with the PDF:

- Free-form and easy to fill inconsistently; fields that depend on the chosen family (e.g. selector insulation grade only applies to combined types) are not enforced.
- No validation of the type-designation string against Huaming's real option lists.
- Ops (order processing / engineering in China) then has to **re-key** the PDF into internal spreadsheets/ERP. That re-keying is slow and error-prone across languages (EN/RU/CN).

**Goal:** a web app where the customer/Eric fills in the order parameters in the browser, and **ops can export a clean, complete Excel** with **every** parameter in stable columns — ready to drop into internal tooling. The web form replaces the PDF as the point of capture; the Excel is the machine-friendly hand-off.

This is a different tool from [`erict16/oltc-selector`](https://github.com/erict16/oltc-selector), which only helps produce the **type string**. This app is the full **ORDER SHEET** capture + **Excel** export. The selector's taxonomy (families, option lists, tap-code decoder, model-string builder) is reused here as the domain library.

---

## 1. Full series / family map

The archive (`整合文件`, 2025 + 2026, ~1719 PDFs; aggregated counts in [`order-inventory.json`](./order-inventory.json)) organizes order sheets by **file-prefix → product family**. The table below is the authoritative taxonomy for this app. Categories and confidence come from Huaming's public technical data + the `oltc-selector` catalog; items marked **CONFIRM** are open questions for Eric (see [§8](#8-open-questions-for-eric-grill-list)).

### 1.1 File-prefix → family decode

The order-sheet PDF filenames encode the family in a short prefix (`E-<prefix><yy><seq>`). Mapping:

| File prefix | Family label (folder) | Example filename |
|---|---|---|
| `E-M` | CM | `E-M260001 …` |
| `E-CMD` | CMD | `E-CMD260001 …` |
| `E-V` | CV | `E-V260001-002 …` |
| `E-CVT` | CVT | `E-CVT260001 …` |
| `E-CM2` | VCM (vacuum CM) | `E-CM2260001-002 …` |
| `E-CV2` | VCV (vacuum CV) | `E-CV2260001-004 …` |
| `E-SHZV` | SHZV | `E-SHZV260001 …` |
| `E-SHZVG` | SHZVG | `E-SHZVG260001 …` |
| `E-HWV` | HWV | `E-HWV260001 …` |
| `E-HWDK` | HWDK | `E-HWDK250001-003 …` |
| `E-HMDK` / `XSDD…` | HMDK | `XSDD021574 KJT2025-17 IEC.pdf` |
| `E-CZ` | CZ | `E-CZ260001 …` |
| `E-S` | SY | `E-S260001-002 …` |
| `E-WG` | WG (drum DETC) | `E-WG260001 …` |
| `E-W` | WL / W□L (cage DETC) | `E-W260001 …` |
| `E-D` | MDU (motor drive unit orders) | `E-D260004 …` |
| `E-Y` | ZXJY (online oil filter) | `E-Y260001-002 …` |
| `E-…X` / `E-…F` (e.g. `E-CM2X`, `E-CV2F`, `E-SHZVF`, `E-SHZVX`) | 售后 aftersales: core (芯子) / oil chamber (油室) / spare parts (散件) | `E-CM2X250001 … 售后.pdf` |

### 1.2 Family → product category

| Family | Category | Medium / mechanism | Selector grade in type string? | v1? | Confidence |
|---|---|---|---|---|---|
| **CM** | OLTC | Oil, combined (diverter + selector), in-tank | Yes (B/C/D/DE) | **v1** | High |
| **CMD** | OLTC | Oil, combined, high-current in-tank | Yes | **v1** | High |
| **CV** | OLTC | Oil, compound (selector-switch, on-tank head) | No | **v1** | High |
| **SV** | OLTC | Oil, compound (500 A III variant of CV) | No | later | High |
| **CVT** | OLTC | Dry / air-insulated, vacuum, compound, low voltage | No | later | High |
| **VCM** (`CM2`) | OLTC | Oil + **vacuum** diverter, combined | Yes | later | High |
| **VCV** (`CV2`) | OLTC | Oil + **vacuum**, compound | No | later | High |
| **SHZV** | OLTC | Oil + **vacuum**, combined in-tank (neutral Y / single-phase) | Yes | later | High |
| **SHZVG** | OLTC | Vacuum combined, **high-current** line — **CONFIRM** whether "G" = coarse-fine vs a distinct high-current line | Yes | later | Medium |
| **HWV** | OLTC | **Vacuum**, external side-tank compartment | Usually no | later | High |
| **HWDK** | OLTC | **Vacuum**, reactive transition, on-tank (NA distribution) | — | later | High |
| **HMDK** | Step-voltage regulator | **Reactive** distribution SVR (~640 A, ~33 pos) — **not** main-power OLTC | — | later | High |
| **CZ** | OLTC | **Dry-type**, vacuum, combined (66 kV dry transformers) — **not OCTC** | — | later | High |
| **SY** (SYXZZ/SYJZZ/SYTZZ) | OLTC | Oil, **legacy** direct-switching (old 35 kV class), **different** naming e.g. `SYJZZ-200/35-9` — **not OCTC** | — | later | High |
| **WG** (WDG/WLG/WSG) | **OCTC / DETC** | Drum, in-tank, de-energized | n/a (own scheme) | later | High |
| **WL / W□L** (WSL/WLL/WDL) | **OCTC / DETC** | Cage, in-tank, de-energized | n/a (own scheme) | later | High |
| **ZXJY** (I / II / III) | **Accessory** | Online oil filter for OLTC oil compartment — **not a tap changer** | n/a | later | High |
| **MDU** | Motor drive unit | Drive + control; models CMA7, SHM-III, SHM-D / SHM-DL; controllers HMC-3C, SHM-K, ET-SZ6, HMK-2A | n/a | **v1** (as RANGE block) | High |
| **售后芯子+油室+散件** | Aftersales spares | Cores / oil chambers / parts (prefix `X`, `F`) | n/a | later | High |

**Important corrections to the seed brief** (please confirm, but the plan assumes these):

1. The brief lists **CZ, SY, ZXJY** as "OCTC-ish". Public Huaming docs say **CZ and SY are OLTC** (dry vacuum, and legacy oil direct-switching), and **ZXJY is an online oil filter accessory — not a tap changer at all**. The **actual OCTC / de-energized families are WG and WL/W□L**. → grill question [Q1](#8-open-questions-for-eric-grill-list).
2. In the type string `CMD III 1000 Y 72.5 C 10193W`, the trailing **`C` is the tap-selector insulation grade (B/C/D/DE), not "connection"**. Connection is the **`Y`/`D`** token. → affects field model.
3. `VCM`/`VCV` (folder + `CM2`/`CV2` file prefixes) are the vacuum lines; current Huaming literature calls them **CM2 / CV2**, older/order forms use **VCM / VCV**. The app treats them as one family with both display aliases.

### 1.3 Type-designation string model

Two equivalent spellings for the same fields:

| Style | Example |
|---|---|
| Spaced (brochure) | `CMD III 1000 Y 72.5 C 10193W` |
| Compact (OS / price list) | `CMDIII-1000Y/72.5C-10193W` |

Token decode (reused from `oltc-selector`):

```
CMD    III    1000    Y      72.5    C      10193      W
│      │      │       │      │       │      │          └ change-over: W=reversing, G=coarse/fine, (none)=linear
│      │      │       │      │       │      └ basic connection / tap-selector diagram code:
│      │      │       │      │       │          10 19 3 = pitch(10) · service positions(19) · mid positions(3)
│      │      │       │      │       └ tap-selector insulation grade: B / C / D / DE (combined families only)
│      │      │       │      └ Um — highest voltage for equipment (kV): 12,17.5,40.5,72.5,126,145,170,252,300,363
│      │      │       └ connection/application: Y=wye/neutral-point, D=delta/any winding
│      │      └ max rated through-current Ium (A): discrete catalog set 160…3000
│      └ phase count: I=single, II=two, III=three
└ family
```

Note: **P (positions) = 2 × (±N) + midPositions**; `10193W` → pitch 10, ±8, mid 3 → 19 positions, reversing. Compound families (CV/CV2/SV) usually **omit** the B/C/D grade letter. OCTC (WG, WL) use a **different** designation scheme (e.g. `WSLIV-600Y/72.5-6x5B`) and are handled as their own field group when built.

---

## 2. ORDER SHEET section model → app field model

Reference: real OS PDF **E-CMD260001 (OSXH, April 2022)** described in the brief, cross-checked against Huaming's public 订货技术规范书 structure. The app models the sheet as ordered **sections**; each section is a group of fields. Sections shared across families are defined once; family-specific sections are conditionally shown.

| # | Section | Scope | Key fields (v0 subset in **bold**) |
|---|---|---|---|
| A | **Order / designer contact** | shared | **Order no.**, **date**, **buyer / transformer maker**, **end user**, **country**, **project**, **quantity**, designer name, email, phone, Huaming product no., delivery date, currency/Incoterm |
| B | **GENERAL DATA** | shared | **Application** (power / furnace / rectifier / HVDC …), **phases (I/II/III)**, **frequency (50/60 Hz)**, **ambient temperature class**, altitude, seismic, insulating fluid (mineral / ester), standard (IEC 60214 / GB 10230 / IEEE) |
| C | **RANGE (family + drive selection)** | shared | **Tap-changer family** (checkbox/enum from §1.2), **MDU model** (CMA7 / SHM-III / SHM-D / SHM-DL / none), **controller** (HMC-3C / SHM-K / ET-SZ6 / HMK-2A / none), **oil filter** (ZXJY-I / II / III / none), protective relay (QJ4 / QJ6), rain cover |
| D | **TRANSFORMER DATA** (multi-page) | shared | **Rated power (kVA/MVA)**, **rated voltage HV/LV**, **tap range ±%**, **number of steps**, **regulated winding & connection**, **through-current I (A)**, max current, step voltage Ust (V), recovery voltage, flux/regulation mode (linear/reversing/coarse-fine), winding vector / tap diagram, potential bonding, overload profile |
| E | **ON-LOAD TAP CHANGER DATA** | family-specific | **Family**, **full type string** (auto-composed + editable), **phases**, **Ium (A)**, **Um (kV)**, **connection Y/D**, **selector grade** (combined only), **tap code** (pitch/positions/mid/change-over), Ust max/min, coarse-fine leakage reactance |
| F | Range / position definition | family-specific | max / mid / min position numbers, raise-voltage direction |
| G | Mechanical / mounting | family-specific | tank-top vs bell (钟罩式) flange, drive-shaft layout (horizontal/vertical lengths), head variant |
| H | Insulation data | family-specific | earth PF/LI withstand, internal distances a, a1, b, c1, c2, d |
| I | Accessories / special options | shared | pipe fittings (Q/S/R), pressure relief (burst disc vs PRV), terminal shields, paint (RAL7040), nameplate language (EN/RU/CN), oil sampling |
| J | Notes | shared | free text; footer default "unfilled = standard supply (常规配置)" |

**Design rule:** the field model is data-driven (a schema object), so the same rendering + Excel-export engine works for every family. Adding a family = adding its schema entry, not new UI code.

---

## 3. Form UX flow

Single-page, progressive, no login (static site). Steps as an accordion/stepper, all on one route so state is trivial to hold in React state / URL:

1. **Start** → pick tap-changer **family** (RANGE, section C) first, because it drives which later sections/fields appear. Show a one-line description + category badge (OLTC oil / OLTC vacuum / OCTC / MDU / accessory) so the user picks correctly.
2. **General data** (B) → application, phases, frequency, standard.
3. **Transformer data** (D) → the electrical inputs. As these are entered, the app **live-composes the suggested type string** and tap code using the `oltc-selector` logic, shown in a sticky summary panel.
4. **OLTC data** (E) → pre-filled from steps 1–3; user can override family-specific fields (Ium, Um, grade, tap code). Validation flags inconsistencies (e.g. current below catalog Ium, grade not offered for that Um).
5. **Mechanical / insulation / accessories** (F–I) → optional detailed sections; sensible defaults, "standard supply" if left blank.
6. **Review** → read-only rendering of the whole sheet grouped by section, with the composed type string highlighted, plus a validation summary (errors block export; warnings don't).
7. **Export** → **Download Excel (.xlsx)** button (client-side). Optional: "Copy type string", "Print / Save as PDF" (browser print stylesheet), "Share link" (state encoded in URL query for reload).

UX principles:

- **Family-aware conditional rendering:** only show fields that apply (e.g. selector grade hidden for CV/CV2; OCTC gets its own designation block).
- **Bilingual labels:** every field label carries EN + RU (and CN where useful), since orders span RU/TR/ID/BR/etc. markets. Label text lives in the schema.
- **Inline validation** against option lists; non-blocking warnings for unusual-but-legal combos.
- **Autosave** to `localStorage`; **shareable URL** for reload/hand-off.
- **Mobile-friendly** (Tailwind responsive), because reps fill these on the road.

---

## 4. Backend / Excel export (hard requirement)

**Deployment reality:** the app is a **static export** hosted on **GitHub Pages** — there is **no Node server**. Therefore Excel generation is **client-side** in the browser.

- **Library:** [SheetJS (`xlsx`)](https://sheetjs.com/) — generates a real `.xlsx` in the browser and triggers a download. (Alternative considered: `exceljs` for richer styling; SheetJS chosen for size + reliability of static export. Revisit if ops wants heavy formatting.)
- **Every parameter is exported.** The export walks the **same schema** used to render the form, so a field can never be on the form but missing from the Excel. Any family added later is automatically included.

### 4.1 Workbook layout (clear columns)

The Excel is designed for ops to read and to machine-ingest:

- **Sheet 1 — `Order Sheet` (human-readable):** grouped by section (A–J). Columns: `Section | Field (EN) | Field (RU) | Value | Unit`. Section header rows, frozen header, sensible column widths. This is the "clear Excel" a person reads.
- **Sheet 2 — `Flat` (machine-readable):** one row per order with **one column per field**, using stable `snake_case` keys as headers (e.g. `family`, `type_string`, `phases`, `ium_a`, `um_kv`, `connection`, `selector_grade`, `tap_code`, `rated_power_kva`, `hv_kv`, `lv_kv`, `tap_range_pct`, `steps`, `mdu_model`, `controller`, `oil_filter`, …). This is what a future ERP import or `pandas` reads; column order is fixed by the schema so appended orders align.
- **Sheet 3 — `Meta`:** app version, schema version, export timestamp, and the raw composed type string, so ops can trace which app build produced a sheet.

Filename convention: `HM-OS_<family>_<order-no-or-date>.xlsx`.

### 4.2 Why not a server

A server (Next.js route handler / Python `openpyxl`) would give nicer styling and let us archive submissions, but it breaks the "host on GitHub Pages, zero infra, Eric solo" constraint. If Huaming later wants **submission storage / an order database**, that's a v2 upgrade (see [§9](#9-phased-milestones)) — swap the static host for a small serverless API (Vercel / Cloudflare Workers) and keep the same schema + Excel engine.

---

## 5. Tech stack & hosting

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router)** with `output: 'export'` | Preferred; static export → GitHub Pages, no server needed |
| Language | **TypeScript** | Type-safe schema + type-string engine |
| Styling | **Tailwind CSS** | Fast, responsive, consistent |
| Excel | **SheetJS (`xlsx`)**, client-side | Works on static host; real `.xlsx` |
| Domain logic | Port of **`oltc-selector`** (`catalog`, `tapCode`, model-string builder) into `lib/` | Single source of truth for families/options |
| State | React state + `localStorage` + URL query | No backend; shareable/resumable |
| Hosting | **GitHub Pages** via **GitHub Actions** (static deploy to `gh-pages`/Pages artifact) | Free, in-repo, matches constraint |
| Base path | `basePath`/`assetPrefix = /huaming-order-sheet` in production | Pages serves under `/<repo>/` |
| Images | `images.unoptimized = true` | Required for static export |

Build gates (must pass before landing): **lint** (`next lint` / ESLint), **typecheck** (`tsc --noEmit`), **build**, **static export** produces `out/`.

---

## 6. Domain library (`lib/`) shape

- `lib/catalog.ts` — families, categories, Um list, current list, selector grades per Um, MDU/controller/filter option lists, market/country list. (Ported/trimmed from `oltc-selector`.)
- `lib/tapCode.ts` — encode/decode tap code `pitch·positions·mid·changeover` ↔ fields; `P = 2·(±N)+mid` helper.
- `lib/typeString.ts` — compose spaced + compact type strings from OLTC fields; validate against catalog.
- `lib/schema.ts` — the **section/field schema** (sections A–J, per-field: key, EN/RU label, input type, options, unit, applicability predicate by family). Drives form **and** Excel.
- `lib/excel.ts` — build the workbook (Sheets 1–3) from the schema + current values via SheetJS.

---

## 7. Validation rules (v0 → later)

- Family required; phases required; Um from list; through-current maps to next catalog Ium.
- Selector grade only valid/visible for combined families (CM/CMD/VCM/SHZV/SHZVG); hidden for CV/CV2/SV/CVT/HWV.
- Tap code consistency: `positions = 2·plusMinus + mid`.
- Warn (not block) on unusual combos (e.g. grade high for low Um). Business-rule specifics (exact allowed Ium per family, grade per Um) come from Eric / Huaming engineering — see open questions. **We do not invent business rules**; where a rule is unknown, the field is free/enum with a warning, not a hard block.

---

## 8. Open questions for Eric (grill list)

Answer these to lock the taxonomy and validation. Where blocked, the app stays permissive rather than inventing rules.

1. **OCTC vs OLTC categorization.** Confirm the corrected taxonomy: **WG and WL/W□L are the de-energized (OCTC/DETC) families**; **CZ (dry vacuum OLTC) and SY (legacy oil OLTC) are OLTC**; **ZXJY is an online oil filter accessory, not a tap changer.** The seed brief grouped CZ/SY/ZXJY as "OCTC-ish" — is that just archive-folder shorthand, or is there a real ordering reason to treat them together?
2. **v1 family priority.** Brief says "one primary family (CMD/CV/CM)". By order volume the biggest families are **CV/VCV (CV2)** and **CM/VCM (CM2)**. Should v0's fully-modeled family be **CMD** (the OSXH sample), or **CV** / **CM** (highest volume)? (v0 currently models the **CMD/CM/CV combined-and-compound shape**; confirm which is the reference.)
3. **SHZVG "G".** Is `SHZVG` a coarse-fine variant of SHZV, or a separate **high-current** vacuum line? Affects whether "G" is a change-over token or a family.
4. **63 vs 72.5 kV.** Export OS PDFs sometimes show `63`; catalog standard is `72.5` (same 66 kV class). Should the app **normalize to 72.5** and store the transformer Un separately, or preserve whatever the user types?
5. **Authoritative option lists.** Need Huaming's current tables for: allowed **Ium per family**, **selector grade per Um**, valid **tap codes** per family, and the **MDU/controller/filter compatibility** matrix (which drives pair with which OLTC). Is there a master price list / selection manual we can encode?
6. **Excel target format.** Does ops already have a spreadsheet/ERP template with fixed column headers we must match exactly? If yes, share it and we'll map the `Flat` sheet to those exact headers.
7. **Languages.** Which label languages are required — EN + RU minimum? Add CN, TR, PT (BR), ID? Any that must appear in the Excel itself?
8. **Aftersales & MDU-only orders.** Should aftersales (芯子/油室/散件) and **MDU-only / ZXJY-only** orders be first-class order types in the app, or out of scope for v1?
9. **Submission storage.** Is client-side Excel download enough for now, or does Huaming want submissions saved to a database / emailed / pushed to ERP (which would require adding a backend in v2)?
10. **Type-string authority.** Should the app allow a fully **manual** type-string override (engineering enters the final string), or must it always be composed/validated from fields?

---

## 9. Phased milestones

- **v0 (this PR) — landable static app.**
  - Next.js + Tailwind, static export, GitHub Pages via Actions.
  - Shared **GENERAL DATA** + **RANGE** (incl. MDU CMA7 / SHM-D / SHM-DL + controller + filter) + **TRANSFORMER DATA**.
  - One primary combined/compound family modeled end-to-end (CMD/CM/CV shape) with live type-string composition; other families selectable as **stubs**.
  - **Client-side Excel export of all fields** (Sheets: Order Sheet / Flat / Meta).
  - Lint + typecheck + build + export all green.
- **v1 — full OLTC coverage.** All OLTC families fully modeled (CM/CMD/CV/SV/CVT/VCM/VCV/SHZV/SHZVG/HWV/HWDK/CZ), full mechanical/insulation sections, complete validation from Eric's option tables, EN/RU (+ more) labels, print stylesheet.
- **v1.1 — OCTC + accessories.** WG, WL/W□L designation blocks; ZXJY oil-filter and MDU-only order types; aftersales spares order type.
- **v2 — backend (optional).** Submission storage + order DB + ERP/email hand-off + auth; swap static host for serverless; reuse same schema + Excel engine.

---

## 10. Implementation status (v0)

Tracked live as v0 is built in this repo. See the PR for the current state. High-level checklist:

- [ ] Next.js App Router + Tailwind scaffold with `output: 'export'` + `basePath` for Pages
- [ ] `lib/` domain library (catalog, tapCode, typeString, schema, excel)
- [ ] Form UI: RANGE → GENERAL → TRANSFORMER → OLTC → Review → Export
- [ ] Client-side `.xlsx` export of all fields (SheetJS)
- [ ] GitHub Actions workflow: build + static export + deploy to Pages
- [ ] lint / typecheck / build / export green

---

*This plan is intentionally opinionated where the domain is clear and explicitly defers to Eric where business rules are unknown (see [§8](#8-open-questions-for-eric-grill-list)). It does not invent allowed-value tables; those must come from Huaming.*
