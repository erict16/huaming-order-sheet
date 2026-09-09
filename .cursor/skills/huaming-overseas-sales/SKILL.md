---
name: huaming-overseas-sales
description: >
  Use when Eric Tan needs Huaming overseas commercial pricing or order docs:
  Quotation Sheet Qu-ET, Base Price List × country coefficient, Sales Confirmation,
  CI/PL commercial set, FX/AUD/USD worksheet. Triggers: 报价, QS, Qu-ET, 系数,
  Base Price List, 销售确认, SC, FOB, AUD, 计价. Pair with huaming-workflow for full deal;
  use huaming-export-comms for the customer email send.
metadata:
  short-description: "Huaming QS pricing + SC + CI/PL calc"
  version: "1.1.0-grok"
---

> **Grok-local:** `~/.grok/skills/huaming-overseas-sales/`


> **Grok-local install:** `~/.grok/skills/huaming-overseas-sales/`


# Huaming Overseas Sales (Eric Tan)

## Overview

Workflows for Shanghai Huaming Power Equipment overseas sales: **price quotations (Qu-ET…)**, **sales/order confirmations**, **CI/PL**, technical-commercial packaging, and path conventions under Eric’s OneDrive.

Primary actor: **Eric Tan** (`eric.tan@huaming.com`), Southeast Regional Sales.

## When to Use

- Draft / revise **Quotation Sheet** (`Qu-ETxxxxxx`)
- Price from **Base Price List** + **country/customer coefficient**
- **Sales Confirmation** / order confirmation after PO
- **Commercial Invoice (CI)** / **Packing List (PL)**
- File into `OS/<Country>/<Customer>/…` and mirror under `QS/`
- Australia / Vietnam / Indonesia / Myanmar / Taiwan markets

Don’t use for: pure engineering drawing work with no commercial output; domestic China sales processes outside this tree.

## Canonical Paths (macOS)

```
ONEDRIVE = ~/Library/CloudStorage/OneDrive-上海华明电力设备制造有限公司

QS/                              # quotations + price list + template
  a. Base Price List 2025.xlsx   # list prices RMB FOB + Coefficient sheet
  a. 模板.docx                   # blank quotation template
  Qu-ET2600xx-….docx             # Eric’s issued quotes (sequence)

OS/                              # order / project files by market
  Australia|Vietnam|Indonesia|Myanmar|Malaysia|Korea|Thailand|…
  a.CQ.docx                      # (if present) CQ-related
  <Country>/<Customer>/<PO or project>/

Attachments/
  Techincal Brochure/            # HWV, CM, CV2, SHZV… technical data PDFs
  Sales Order Sheet/             # CMA7 / In-tank OLTC / SHM-D order specs (.xlsm)
```

**Always resolve live paths with `ls`/`find`** — OneDrive folder names and PO folders change.

## Quotation numbering

- Pattern: `Qu-ET` + `YY` + serial → e.g. `Qu-ET260012`
- Next number = max existing `Qu-ET26*` in `QS/` + 1
- Filename: `Qu-ETxxxxxx-<MODEL>-<Customer>.docx`
- Save to **both** `QS/` and the project folder under `OS/…`

## Price calculation (mandatory discipline)

### Formula

```
list_rmb     = Base Price List sheet for product family (RMB, FOB Shanghai, standard set)
coeff        = Coefficient sheet [Market/Customer, product family column]
sell_rmb     = list_rmb × coeff
sell_usd     = sell_rmb / FX_RMB_USD
sell_local   = sell_usd / FX_USD_LOCAL   # e.g. AUD
```

Round local currency to a commercial figure (nearest 50/100) and **show the worksheet** to the user.

### FX defaults (from list + reverse-eng)

| Item | Default | Source |
|------|---------|--------|
| RMB→USD | **7.0** | Base Price List Coefficient remarks |
| USD→AUD | **~0.69** | Reverse-engineered from Qu-ET260011 (Wilson) |
| Re-check | If market moved a lot, ask Eric before locking |

### Coefficient sheet columns (header row)

| Col | Family |
|-----|--------|
| C | CV |
| D | CM |
| E | CMD |
| F | CV2 |
| G | CM2 |
| H | SHZV |
| I | CZ |
| J | CVT |
| K | SY |
| L | WSL/WDL |
| M | WSL-D |
| N | WG |
| O | Accessories |

**HWV / HWDK have no dedicated coefficient column.** Practice:

- **Australia**: use **SHZV column Australia = 1.3** (only AU cell filled historically) unless Eric specifies otherwise. **AU must price above Vietnam HWV** (see benchmarks).
- **Vietnam (2026-09):** 报价/佣金/HLG 以 `huaming-workflow/references/vietnam-price-and-commission.md` 为准（越南表优先；OLTC 1.1 内含 20%；OCTC 2.8 内含 12%）。下面两笔 HLG HWV 成交是历史实单，**不再当默认系数**：
  - `0907.HLG-HM/2026`: HWVIII-400Y/72.5-10191W+SHM-D = **USD 29,239** FOB → 当时 ≈ **0.91** (list 225k ÷7)
  - `2506.HLG-HM/2026`: HWVIII-400D/72.5-10191W+SHM-D = **USD 32,858** FOB → 当时 ≈ **0.92** (list 250k)
  - Path: `OS/Vietnam/HLG/EVN Retrofit/`
- **EEMC**: no HWV folder found (mostly CV2/CM2/SHZV/WSL); don’t invent EEMC HWV comps.
- **Retrofit (ALL)** row: CV 1.6, CM 1.15, CV2/CM2 1.3, SHZV 1.2 — only if Eric wants retrofit policy instead of market column
- **Indonesia Others ~1.1**: Bambangdjaja HWVIII-400Y/40.5-18353W+CMA7 → CNY 222,750 = 202,500 × 1.10

### What list price includes

Standard OLTC set (per Coefficient remarks + quote boilerplate):

- Main body (diverter + selector / selector switch)
- Motor drive unit (CMA7 or SHM-D as specified)
- Standard mounting flange
- Bevel gear, shafts & enclosure
- Protective relay QJ series
- Remote position indicator + std cable

**HWV list price already includes MDU** (do not add CMA7 25,000 again) — confirmed via Bambang SC.

### Extra charges (RMB list → same coeff or Accessories coeff)

See sheets `额外收费`, `TC Additional charge`, `MDU & AVR`:

- Special paint / C5 paint, tie-in resistor, PRV, cold climate PT100, extra position signals, SHM-KX AVR, etc.
- Apply **Accessories** coefficient (col O) when pricing extras alone, or fold into package per Eric.

### Special / retrofit design

Price list notice: *special design and retrofit should be quoted case-by-case*. Transition flange / intermediate tank for replacement of Ferranti/ABB/MR is **not** in standard list — exclude or separate line “TBD after site dimensions”.

## Quotation document structure

Clone latest similar market quote (preferred) or `QS/a. 模板.docx`.

### Font / format (mandatory) — match **Anthony Phua** QS style

Gold samples: `QS/Anthony/QS2602110-….pdf`, `OS/.../QS2607196-R1-….pdf`, `OS/.../QS260186-R0-….pdf`.

| Element | Font | Size |
|---------|------|------|
| Title “Quotation Sheet” | Arial Bold | **18 pt** |
| Section heads (auto-numbered 1–6) | Arial Bold | **12 pt** |
| Body / tables | Arial | **10 pt** |
| Model / Transformer lines | Arial Bold | **10 pt** |
| Email in General data | Arial Italic | **10 pt** |

**Structure (Anthony):** letterhead logo + company → title → Inquiry/Transformer/Model → General data table → **1. price** (bullets in model cell) → *Remarks a/b/c* → **2. OLTC tech data** (full 8 rows) → **3. MDU** → **4–6 delivery/payment/warranty**. Target **2 pages**.

**Critical pitfalls when editing Eric `Qu-ET*.docx` templates:**
1. Section paras already have Word **list numbering** (`numPr`). Text must be `"The price of OLTC…"` **not** `"1. The price…"` or PDF shows `1. 1. …`.
2. **Never** `cell.text =` without re-applying Arial — clears rPr.
3. Merged cells: set content **once per unique cell id**; writing 3× creates empty bullets / doubled email.
4. Export PDF via Word: `save as … file format 17` (wdFormatPDF). Copy docx to `/tmp` first if Chinese paths misbehave.
5. Verify PDF text for doubled numbers, doubled email, stray `l`/empty `•` rows before delivery.

### Header table

| Field | AU practice | Other |
|-------|-------------|--------|
| Inquiry from | End user / transformer OEM | Customer short name |
| Quotation No. | Qu-ETxxxxxx | same |
| Date / Valid Till | Issue date / +3 months | same |
| Quoted By | Eric Tan / eric.tan@huaming.com | |
| Beneficiary | **Huaming Power Equipment Singapore Co., Ltd.** (AU Wilson pattern) | Often **Shanghai Huaming…**; **Indonesia & ZTR → HUAMING OVERSEAS COMPANY LIMITED** (see Coefficient remarks) |
| Manufacturer | Shanghai Huaming Power Equipment Co., Ltd. | |

### Price table

Currency:

- **Australia**: AUD, FOB Shanghai (sometimes CIF line separate, e.g. Sydney ~AUD 750 on older quote)
- **Many Asian**: USD or RMB FOB Shanghai
- State Incoterm in the “The price of OLTC (Currency …)” line

### Tech data table (typical OLTC rows)

1. Rated through current (A)  
2. Phase  
3. Connection arrangement (Y/D)  
4. Regulation method (reversing / coarse-fine / linear)  
5. Step voltage (V) max.  
6. Step capacity (kVA) max.  
7. Operating positions  
8. Highest voltage for equipment Um  

### MDU block

CMA7 or SHM-D; motor/control/aux voltages **as required** — for Australia default suggest **415 V / 50 Hz motor, 240 V / 50 Hz control** unless customer specifies.

### Commercial boilerplate (keep unless instructed)

- Delivery: usually **5~6 weeks** after contract + OS; **retrofit 6~8 weeks**
- Payment: AU recent quotes **100% before shipment**; Indo SC may be **30 days after invoice**
- Warranty: **24 months after delivery / 18 months after commissioning**, whichever first; no consequential losses. Extra years: Eric names the job + surcharge — `huaming-workflow/references/overseas-extended-warranty.md`.

## Model string conventions

Examples:

- `SHZVIII-1000Y/170D-12233W+CMA7`
- `HWVIII-400Y/72.5-10193W+CMA7`
- `CV2III-350D-40.5-10193W+CMA7+SHM-KX`

Tap code: `10193W` ≈ 10 steps / 19 positions / reversing; `18353W` ≈ 18/35 reversing; `G` = coarse-fine family in list.

**If exact list row missing** (e.g. 10193W only 10193G listed): use same Ir/Um/price twin and note assumption on the pricing worksheet.

## Sales Confirmation (order confirmation)

Reference:  
`OS/Indonesia/Bambangdjaja/PO-26000549 HWVIII 400Y/Sales Confirmation PO26000549 BambangDjaja.docx`

Minimum fields:

- To (customer legal name)
- Order No. / PO
- OLTC Serial No. (E-… factory serial when issued)
- Product full type string + scope sentence
- Qty, Total amount + currency
- Delivery date at Huaming, Delivery terms, Payment terms
- Beneficiary bank block
- Manufacturer
- Drawing/OS approval rules remarks
- Confirmed by / date

## CI / PL (Commercial Invoice / Packing List)

When issuing shipping set:

1. Pull **final** model, qty, unit price, Incoterm, consignee, notify party from SC/PO  
2. CI: commercial description matching customs + HS if known; amount = SC; weight/dims from packing or logistics  
3. PL: packages, GW/NW, dimensions, marks  
4. Align beneficiary with SC (Singapore vs Shanghai vs Overseas Co.)  
5. Save under the PO folder; never invent weights — ask logistics or read prior shipment for same model  
6. **Singapore entity (ES- / HMSG-):** stamp **Eric Tan’s Singapore sign** via `qq-email/scripts/sign_singapore.py` (PNG: `qq-email/scripts/assets/Eric-Tan-Singapore.png`). Do **not** wait for 沈丽玲. (Eric, 2026-08-21: 从此以后直接盖我的新加坡签.)  
7. **CI/PL 对账表（强制）：** 每出一套 CI/PL，立刻在 `Attachments/a.CI-PL登记.xlsx` 补一行（**一行一台序列号**）。重量没过磅先写「重量来源」，等物流确认。不要另存副本。  
8. **沈丽玲报关：** 不要把客户 CI/PL 或客户合同发给她。内部合同（`SHSG` + YYYYMMDD）+ 开关编号，见 `huaming-export-docs-email`。

If no prior CI template in-tree, draft from last shipment under same customer and flag gaps.

## Email / mailbox

- Enterprise mail: `eric.tan@huaming.com` (Tencent Exmail; access via **Spark Desktop + `use-spark` skill**)
- Do **not** default to himalaya/IMAP scripts when Spark is available
- AU channel often: John Zhou (`johnzhou@huaming.com`), Colin (`colin@huaming.com`), Li Qian (`liqian@huaming.com`)
- Quote delivery: usually through local rep (John) to end user for AU utilities
- Full tone/recipients: load `huaming-export-comms`; orchestrator: `huaming-workflow`

## Standard workflow — Price Quotation

1. **Identify** customer, country, end user, transformer data, OLTC type, retrofit vs new.
2. **Locate** project folder under `OS/` or create `OS/<Country>/<Customer>/<Project>/`.
3. **Open** `QS/a. Base Price List 2025.xlsx` → product sheet + Coefficient.
4. **Pick** list row; note missing-row assumptions.
5. **Apply** coeff + FX; produce **pricing worksheet** (txt or reply section).
6. **Clone** nearest prior Qu-ET docx (same market/currency) or template.
7. **Fill** header, model, price, tech data, MDU, delivery/payment/warranty.
8. **Save** to `QS/` + project folder; optional PDF via **word-to-pdf** (desktop Word).
9. **List open points** (Y/D, voltages, flange, installation, Incoterm upgrade).
10. **Done when**: worksheet + docx paths given to Eric; numbers traceable to list×coeff×FX.

## Standard workflow — After PO

1. File PO under project folder.  
2. Issue **Sales Confirmation** (clone Bambang or prior).  
3. Drive **Order Specification** (Sales Order Sheet xlsm) + drawing approval.  
4. On shipment: **CI + PL** (+ BL/AWB as provided).  
5. Keep serial `E-…` consistent across SC/CI/nameplate.

## Australia-specific notes

- Beneficiary: **Huaming Power Equipment Singapore Co., Ltd.** on recent Wilson quotes  
- Currency: **AUD**  
- Coeff: **1.3** on SHZV column for Australia  
- Contacts: Wilson Transformer, Tyree, United Energy / Transgrid channel via John Zhou  
- UE HWV project path:  
  `OS/Australia/Transgrid/United Energy HWV OLTC Enquiry/`

## Common Pitfalls

1. **Double-counting CMA7** on HWV — list already includes MDU.  
2. **Wrong beneficiary** — Indonesia/ZTR need Overseas Co.; AU often Singapore.  
3. **Using USD FX 7 without documenting** — always show worksheet.  
4. **Assuming IMAP SEARCH works on Exmail** — it often returns all mails; filter client-side.  
5. **Quoting standard flange for retrofit** — transition piece must be explicit exclude/extra.  
6. **Y vs D** and **conservator vs non-conservator** drawings differ — confirm before firm SC.  
7. **Coefficient “A / B” pairs** (e.g. `1.4 / 0.95`) — first number is typical sell multiplier; second is floor/internal — **use the first** for customer price unless Eric says otherwise.  
8. **Editing OneDrive files** while sync paused — verify file size/mtime after save.

## Verification Checklist

- [ ] Qu number is next free `Qu-ET…`  
- [ ] list_rmb cell cited (sheet + model string)  
- [ ] coeff cited (market + column)  
- [ ] FX and rounded sell currency shown  
- [ ] Scope include/exclude explicit for retrofit extras  
- [ ] Beneficiary matches market rule  
- [ ] Saved under `QS/` and `OS/...`  
- [ ] Open technical/commercial points listed for Eric  

## One-shot: United Energy style HWV quote

```
Model: HWVIII-400Y/72.5-10193W+CMA7
list = 225000 (HWV sheet 400Y/72.5-18353W or 10193G twin)
coeff = 1.3 (Australia)
sell_rmb = 292500
usd = 292500/7
aud ≈ usd/0.69 → round AUD 60500 FOB Shanghai
```
