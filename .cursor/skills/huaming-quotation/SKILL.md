---
name: huaming-quotation
description: >
  Use when Eric Tan needs a Huaming overseas price quotation (Qu-ET Quotation Sheet):
  RFQ from email, Base Price List × country coefficient × FX, pricing worksheet,
  clone latest Qu-ET docx, save to QS + OS, draft the send mail. Triggers: 报价,
  做个报价, RFQ, Qu-ET, QS报价单, 系数, Base Price List, AUD报价, 越南价格, HLG, 佣金, 延保, 五年质保, /huaming-quotation.
  Not for Sales Confirmation, CI/PL, or type-only 选型 (use overseas-sales / oltc-selection).
metadata:
  short-description: "Huaming Qu-ET quotation (list × coeff × FX)"
  version: "1.0.2"
---

# Huaming quotation (Qu-ET)

Daily playbook for **Eric Tan** · `eric.tan@huaming.com`. Output is a **Quotation Sheet**, not an SC or shipping set.

Load this when the ask is 报价 / RFQ / Qu-ET.  
选型 only → `huaming-oltc-selection`. After PO / SC / CI-PL → `huaming-overseas-sales`. Mail I/O → `qq-email`.  
越南价 / HLG / 佣金 → 先读 `huaming-workflow/references/vietnam-price-and-commission.md`。  
延保 → `huaming-workflow/references/overseas-extended-warranty.md`。

## Do not

- Invent a list price or coefficient. If the row or market cell is missing, **stop and ask** (or write the estimate on the worksheet and flag it).
- Build a Qu-ET from scratch (`docx-js`). Clone the latest same-market quote.
- `cell.text =` on the template (strips Arial). Edit runs, or `replace_text.py`. Merged header cells: walk real `w:tr/w:tc`, not `row.cells[i]`.
- LibreOffice / `soffice` for PDF. Use **word-to-pdf** (desktop Word `ExportAsFixedFormat`).
- SMTP until Eric says **发**. Show To/Cc/Subject/body/attach in chat first.
- Quote HWV CMA7 as a second line — HWV list already includes the MDU.
- Extra warranty years on a QS unless Eric **names that project**. Default is always 24/18. RFQ asking for 5 years is not enough. Surcharge table: `huaming-workflow/references/overseas-extended-warranty.md`.

## Paths (resolve live — do not hard-code the garbled OneDrive name)

Windows:

```powershell
$od = (Get-ChildItem $env:USERPROFILE -Directory | Where-Object { $_.Name -like "OneDrive -*" } | Select-Object -First 1).FullName
```

macOS: `~/Library/CloudStorage/OneDrive-上海华明电力设备制造有限公司`

| What | Where |
|------|--------|
| Quotes + list + blank | `$od\QS\` |
| Price list | `QS\a. Base Price List 2025.xlsx` |
| Blank template | `QS\a. 模板.docx` (prefer cloning a live Qu-ET) |
| Issued quotes | `QS\Qu-ET26xxxx-….docx` |
| Project files | `$od\OS\<Country>\<Customer>\<Project>\` |
| Brochures | `$od\Attachments\Techincal Brochure\` |

## Numbering

- `Qu-ET` + `YY` + serial. Next = max `Qu-ET26*` in `QS\` + 1.
- Filename: `Qu-ETxxxxxx-<MODEL>-<Customer>.docx`
- Save **both** `QS\` and `OS\<Country>\<Customer>\<Project>\`. Also drop PDF + `pricing-worksheet-Qu-ETxxxxxx.txt` in the project folder.

## Price

```
list_rmb   = Base Price List, product-family sheet, exact Ir / Y|D / Um / 10…W|G row
coeff      = Coefficient sheet [Market or customer, family column]
sell_rmb   = list_rmb × coeff
sell_usd   = sell_rmb / 7.0
sell_local = sell_usd / FX_USD_LOCAL     # AUD: 0.69
```

Round local currency to nearest 50 (AUD) or a clean commercial figure. **Always show the worksheet** (list cell + coeff cell + FX + raw + rounded).

### Coefficient columns (header row)

C CV · D CM · E CMD · F CV2 · G CM2 · H SHZV · I CZ · J CVT · K SY · L WSL/WDL · M WSL-D · N WG · O Accessories

`A / B` pairs (e.g. `1.4 / 0.95`): use the **first** number unless Eric says otherwise.

**Vietnam (2026-09 手稿 + 李倩):** 先用越南价格表 2026（已含佣金）。表上没有的型号才用标准表：OLTC **1.1**（内含 20% 佣金）、OCTC **2.8**（内含 12%）。HLG 自买非改造：减掉佣金。改造整机且 HLG 买：**1.3**、不付佣金。细则：`huaming-workflow/references/vietnam-price-and-commission.md`。不要用销售发票减内部合同当佣金。旧 HLG 成交倒推 ~0.91 **不再当默认**。

**Australia:** only **H34 = 1.3** (SHZV) is filled. Use **1.3** for AU vacuum (CV2 / CM2 / SHZV / HWV) unless Eric overrides. HWV has no own column.

**FX:** RMB→USD **7.0** (list remarks). USD→AUD **0.69** (Wilson Qu-ET260011 reverse-eng). If the market has moved a lot, ask before locking.

List price = standard set: body + CMA7/SHM-D + flange + bevel/shafts + QJ + RPI + std cable. Extra (tie-in, PRD, AVR, paint, PT100) from sheets `额外收费` / `TC Additional charge` / `MDU & AVR` — same coeff or Accessories col O.

## Fill the Qu-ET

Clone the latest same-market quote (AU Wilson → newest `Qu-ET*Wilson*.docx`). Fallback: `QS\a. 模板.docx`.

| Field | AU (Wilson / UE) | Other |
|-------|------------------|--------|
| Inquiry from | OEM / end user | customer short name |
| Date / Valid | issue date / +3 months | same |
| Quoted By | Eric Tan / eric.tan@huaming.com | |
| Currency | **AUD, FOB Shanghai** | USD or RMB FOB SH |
| Beneficiary | **Huaming Power Equipment Singapore Co., Ltd.** | Shanghai Huaming… · Indo/ZTR → HUAMING OVERSEAS COMPANY LIMITED |
| Delivery | **5~6 weeks** after contract + OS (retrofit **6~8**) | same |
| Payment | **100% before shipment** | follow last quote for that market |
| Warranty | **24 months after delivery / 18 months after commissioning**, whichever first; no consequential losses. Extra years: Eric names the job + surcharge in `overseas-extended-warranty.md`. | same |

AU MDU default: motor **415 V / 50 Hz**, control **240 V / 50 Hz**, unless the RFQ says otherwise. Wilson-typical extras in the model cell: BCD + 2×4-20mA + resistor position.

Tech table: Ir, phase, Y/D, reversing/linear/G, Ust max, Pst max, positions, Um. Brochure owns Ust/Pst — do not invent. CV2 10-contact: Ust 2000 V; Pst = Ust × Ir / 1000.

Section headings already have Word list numbering. Body text is `The price of OLTC…`, not `1. The price…`.

## RFQ → quote (do this)

1. Pull the **latest** RFQ mail (`qq-email` `receive.js` / `get-body.js`). Read the whole thread, not just the subject.
2. Identify customer, country, end user, qty, new vs retrofit, transformer data, type string.
3. Confirm or build the commercial model (`huaming-oltc-selection` if the type is not already given).
4. Open the price list. Cite sheet + model row + RMB.
5. Cite coeff (market + column). Apply FX. Write the worksheet.
6. Create `OS\…\<Project>\` if needed. Clone Qu-ET. Fill. Export PDF via **word-to-pdf** (desktop Word).
7. In chat: **price first**, then worksheet, paths, open points (≤5).
8. Draft the mail (do not send). AU commercial usually **through 晓东 / John Zhou** (`johnzhou@huaming.com`) to the end user; greet **晓东**, not 周工. Cc Kimmy (`liqian@huaming.com`) ± Colin. Subject = `Re:` / `Fw: ` + full original subject.

**Wilson (AU OEM) coeff history** — reverse-eng at RMB/USD 7.0, USD/AUD 0.69:

| Qu-ET | Model | AUD | implied k |
|-------|--------|-----|-----------|
| 005 Mar | SHZVIII-1000Y/170D | 57,800 | ~1.01 (early, treat as old) |
| 006 Apr | SHZVIII-1000Y/72.5C | 63,200 | **1.30** |
| 007 Apr | SHZVIII-600Y/72.5C | 56,600 | **1.35** |
| 011 Jun | SHZVIII-1000Y/170D | 74,500 | **1.30** |
| 013 Jul | SHZVGIII-1500 | 128,150 | **1.30** |

Default Wilson = **1.30**. Same-amp 600A last time was **1.35**. Anthony CV2-600 to VN this month ~**1.35–1.41**. Do not price AU OEM *below* that USD.

## Open points (typical — only list what is actually open)

- Um assumed from system voltage (e.g. 66 kV → 72.5)
- Positions on nameplate vs 10193W catalogue 19
- MDU voltages
- Retrofit flange / intermediate tank = exclude or TBD
- Natural ester / special paint / tie-in not in the RFQ

## Done when

- Next free `Qu-ET` used
- Worksheet numbers trace to list × coeff × FX
- Docx + PDF in `QS\` and the OS project folder
- Eric has seen the price and the draft mail
- No SMTP unless he said 发
