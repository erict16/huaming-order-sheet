---
name: huaming-workflow
description: >
  Use for Eric Tan's full Huaming overseas sales workflow: OLTC selection, quotation
  (QS Qu-ET), sales confirmation, CI/PL/Form E shipping docs, Vietnam commission /
  赵珊 finance pack, customer email, and Huaming Hub docs site. Triggers: 华明, Huaming,
  报价, QS, Qu-ET, 选型, OLTC, OCTC, Form E, CI/PL, CIPL, Sanaky, United Energy, export,
  海外销售, 客户邮件, 发货资料, 佣金, 赵珊, 越南价格表, HLG, 延保.
  Load this first for multi-step Huaming jobs; it routes to specialist child skills.
metadata:
  short-description: "Huaming overseas sales end-to-end workflow (route + enforce)"
  version: "2.1.0-grok"
---

# Huaming workflow (Grok hub)

**Grok-local:** `~/.grok/skills/huaming-workflow/`

End-to-end playbook for **Eric Tan** · Southeast Regional Sales · `eric.tan@huaming.com`.

This skill is the **router + discipline layer**. Deep detail lives in child skills — load them when the stage needs depth.

## When to use

- Any multi-step Huaming overseas job (select → quote → order → ship → mail)
- Unclear which Huaming skill to open
- “帮我跟这个客户单” / PO / Sanaky / United Energy / Wilson / HLG

**Not for:** pure coding of `oltc-selector` UI chrome (use `huaming-oltc-selection` + **ui-ux-pro-max**); pure design of `huaming-hub` site (use project `design.md` + **ui-ux-pro-max**; optional `web-design-guidelines`).

## Child skills (always prefer these paths)

| Stage | Skill | Path |
|-------|--------|------|
| Type string / 选型 | `huaming-oltc-selection` | `~/.grok/skills/huaming-oltc-selection/` |
| Qu-ET 报价 / RFQ | `huaming-quotation` | `~/.grok/skills/huaming-quotation/` |
| After PO / SC / CI-PL | `huaming-overseas-sales` | `~/.grok/skills/huaming-overseas-sales/` |
| Customer mail tone + recipients | `huaming-export-comms` | `~/.grok/skills/huaming-export-comms/` |
| Shipping docs Form E / CIPL | `huaming-export-docs-email` | `~/.grok/skills/huaming-export-docs-email/` |
| Mailbox / calendar | `use-spark` | `~/.grok/skills/use-spark/` |
| Prose polish | `humanizer` | short English customer body |
| Docs site for buyers | repo `~/Github/huaming-hub` | EN default + PDF table |

Also: Grok bundled `docx` / `pdf` for document edits; `xlsx` via openpyxl/LibreOffice when needed.

## Pipeline map

```
Inquiry / transformer data
        │
        ▼
[1] SELECT  ── huaming-oltc-selection ──▶ type string (no price on shared UI)
        │
        ▼
[2] PRICE   ── huaming-quotation ──▶ list×coeff×FX worksheet + Qu-ETxxxxxx.docx
        │
        ▼
[3] SEND QS ── huaming-export-comms + qq-email ──▶ short draft → Eric approves → send
        │
        ▼
[4] PO / SC ── huaming-overseas-sales ──▶ Sales Confirmation + OS folder
        │
        ▼
[5] SHIP    ── huaming-export-docs-email ──▶ CI+PL+Form E set (customer clearance pack)
        │
        ▼
[6] FINANCE ── 赵珊财务包 + 新加坡 ERP + 李倩核佣金
        │      （越南价/佣金：references/vietnam-price-and-commission.md）
        ▼
[7] CLOSE   ── archive under OS/… ; optional hub PDF links for buyer
```

Jump in mid-pipeline when Eric already has the stage (e.g. “只回邮件” → stages 3 or 5 only).

## Global discipline (every stage)

1. **Paths live** — always `ls`/`find` OneDrive; never invent PO folder names.
2. **Numbers show work** — price = list × coeff × FX with sheet/column cited.
3. **Draft before send** — show To/Cc/Subject/body/attachments; send only on 发 / send / 发吧.
4. **Market recipients** — follow **this thread**, not a global Cc dump (AU ≠ VN).
5. **English short** — `Looking forward to your feedback.` · never bare `Please check and confirm.`
6. **Form E ≠ plain CO** for ASEAN preference claims.
7. **报关 CI/PL ≠ 国外清关** — do not forward 玲玲 “仅报关” set as customer pack. 给沈丽玲：内部合同 + 开关编号，不要客户合同/客户 CI/PL（`huaming-export-docs-email`）。
8. **OLTC ≠ OCTC** goods name must match model family (WSL de-energized ≠ on-load wording).
9. **FTN 超大附件** — scan HTML for `ftnExs_download` before saying “no attachment”.
10. **After meaningful batch** — commit code/docs if in git repos; do not wait to be asked (Eric pref).

## Canonical paths

```
ONEDRIVE = ~/Library/CloudStorage/OneDrive-上海华明电力设备制造有限公司

QS/                              # Qu-ET quotes + Base Price List 2025.xlsx + 模板.docx
OS/<Country>/<Customer>/<PO>/    # project files; Shipment/ for customer-facing docs
Attachments/Techincal Brochure/  # product PDFs
Attachments/Sales Order Sheet/   # order xlsm

# Apps
~/Github/oltc-selector           # type designation UI (no price)
~/Github/huaming-hub             # buyer docs hub (EN default, /zh Chinese)
```

## Stage cards

### 1 · Select type

Load `huaming-oltc-selection`.

- Inputs: Iᵤ, Um, Y/D, regulation 0/W/G, positions, Ust, medium…
- Output: commercial type string e.g. `HWVIII-400Y/72.5-10193W+CMA7`
- Ranking: **minimum adequate** (CV2 → CM2 → SHZV…); never SHZV-by-default
- **电位电阻:** compact CV/CV2 **>15 kV** recovery voltage; combined CM/CM2/SHZV **>35 kV**. Not Um. Table in `huaming-oltc-selection` `references/type-designation.md`.
- Shared UI: **no prices**

### 2 · Quote (QS)

Load `huaming-quotation`.

```
list_rmb × coeff → sell_rmb → / FX → local currency (round commercial)
```

- Next `Qu-ET` = max in `QS/` + 1
- Save **both** `QS/` and `OS/...`
- Anthony/Arial QS structure; verify PDF (no doubled list numbers, UTF-8)
- HWV list **includes MDU** — do not double-count CMA7
- Warranty default 24/18. Extra years only if Eric names the job — `references/overseas-extended-warranty.md`

### 3 · Customer email (quote / commercial)

Load `huaming-export-comms` + **`use-spark`** (not himalaya unless Spark down).

```bash
spark accounts
spark search "customer or PO keyword"
spark thread <id>
spark draft --reply-to <id> --to "..." --cc "..." --subject "..." --body "..." --attach /path
# after Eric: spark action send <draft-id>
```

**AU utility (e.g. UE):** To end user · Cc `johnzhou@huaming.com`, `colin@huaming.com`, `liqian@huaming.com` · **no** 沈旭 on commercial.  
**VN Sanaky:** To `trunglt@sanaky.com.vn` · Cc `anthony.phua@huaming.com`, `dungpt@sanaky.com.vn`, `liqian@huaming.com`.

Body default: greeting → 1–2 lines → attach line → feedback close → Eric signature.

**Factory engineer 2D/3D (internal):** load export-comms + `references/engineer-drawing-request.md`.  
`spark draft --forward <customer-id> --to 夏工|樊工 --cc liqian@…` · short Chinese · OS-driven 一项一行 · 防爆盖 not 防爆膜 · no paint fluff.

Always give Eric the Spark **Link:** deep link for the draft.

### 4 · After PO

Load `huaming-overseas-sales`.

- File PO under `OS/...`
- Sales Confirmation (clone prior market SC)
- Order Spec xlsm + drawing approval loop

### 5 · Shipping docs

Load `huaming-export-docs-email` (+ comms for mail).

| Doc | Notes |
|-----|--------|
| CI + PL (CIPL) | Customer pack. Same goods name; revision R1/R2 together. **Not** sent to 沈丽玲 |
| 内部合同 SHSG | Eric clones `Attachments/Logistic Contract/Tempalte_SHSGHM260302.docx`. 报关给沈丽玲只附这个 + 开关编号 |
| Form E | ASEAN preference — not ordinary CO |
| CQ / test / AWB | As customer pack requires |

Customer pack often **HMSG…** / **ES-…** Singapore beneficiary — do not mix with 报关-only set. Detail: `huaming-export-docs-email`.

### 6 · Finance (赵珊 / 李倩)

Load `references/vietnam-price-and-commission.md`.

- **越南报价**：先越南价格表 2026（已含佣金）；表上没有的型号才用标准表 × 系数（OLTC 1.1 内含 20%；OCTC 2.8 内含 12%）。
- **佣金**：无载 12%、有载 20%，**跟 HMSG 采购价无关**。禁止用销售发票 − 内部合同。对不上 @李倩。
- **出货后赵珊要**：采购发票、销售发票、采购合同 SHSG、销售合同、提单、佣金金额；新加坡 ERP 采购/入库/应收 + 销售/出口/应付。称赵珊姐。
- 给沈丽玲的报关包仍只是内部合同 + 开关编号，不要和赵珊这套混。

### 7 · Buyer self-serve

Point buyers to **Huaming Hub**: https://erict16.github.io/huaming-hub/  
(English default; `/zh/` Chinese). Selector: https://erict16.github.io/oltc-selector/

## Quick routing phrases

| Eric says | Load |
|-----------|------|
| 选型 / model string / type designation | selection |
| 报价 / QS / Qu-ET / 系数 / AUD / 越南价格 | **huaming-quotation**（越南另见 `references/vietnam-price-and-commission.md`） |
| 延保 / 5 年质保 | **huaming-quotation** + `references/overseas-extended-warranty.md` |
| 佣金 / 赵珊 / 新加坡 ERP | **this skill** stage 6 + 同上 reference；邮件走 qq-email |
| 回客户 / 发邮件 / Cc | export-comms + use-spark |
| 出图 / 2D3D / 夏工 / 沈旭 / 陈伟荣 / 王俊杰 / 蔡坤 / 樊工 | export-comms → `references/engineer-drawing-request.md` + qq-email |
| Form E / 箱单 / 发票 / Sanaky 清关 | export-docs-email |
| 全流程跟单 | **this skill** end-to-end |

## Verification (before “done”)

- [ ] Stage-correct child skill(s) applied  
- [ ] Price worksheet OR “N/A this stage”  
- [ ] Paths exist on disk  
- [ ] If email: draft approved or explicit send; Spark link shared  
- [ ] If ship: Form E vs CO correct; goods name OCTC/OLTC correct  
- [ ] Open points listed for Eric (≤5)

## References (local)

- `references/form-e-and-cipl.md`
- `references/exmail-ftn-and-form-e.md`
- `references/vietnam-price-and-commission.md` — 越南三张价表、HLG、佣金、赵珊财务包
- `references/overseas-extended-warranty.md` — 海外延保（2025-02-19 签发）：默认 24/18；电力变按投运年限加价，>7 年不延保
- Child skills’ own `references/` for deep tables
