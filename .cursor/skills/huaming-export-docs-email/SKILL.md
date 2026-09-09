---
name: huaming-export-docs-email
description: >
  Use for Huaming post-order shipping document packs: Commercial Invoice, Packing List
  (CIPL), Form E vs ordinary CO, CQ/test reports, customer clearance vs 报关-only,
  and the Shanghai–Singapore internal PO for 沈丽玲. Triggers: Form E, CIPL, 箱单,
  发票, 产地证, 清关, 内部合同, SHSG, 沈丽玲报关, Sanaky BSHV, HMSG. Pair with
  export-comms / qq-email to mail; overseas-sales for pricing on CI.
metadata:
  short-description: "Huaming Form E / CI / PL shipping packs"
  version: "1.2.0-grok"
---

> **Grok-local:** `~/.grok/skills/huaming-export-docs-email/`


> **Grok-local install:** `~/.grok/skills/huaming-export-docs-email/`


# Huaming export docs & customer email (Eric Tan)

Companion to **huaming-overseas-sales** (pricing/QS/SC). Use this skill for **post-order shipping document** threads and **customer-facing email** tone/recipients.

Primary mailbox: `eric.tan@huaming.com` (Tencent Exmail).

## When to use

- Customer asks for **Invoice / Packing list / Form E / CO / CQ / test report / AWB**
- Revise **CIPL** (= CI + PL) after goods-name or data corrections
- Draft or send replies on PO threads (e.g. `BSHV-HUAMING/…`, `E-W…`)
- Decide **Form E vs ordinary CO**
- 沈丽玲要报关资料 / 内部合同 / `SHSG…` 采购订单

Do **not** use for pure Qu-ET pricing (see `huaming-overseas-sales`).

## Paths

```
ONEDRIVE = ~/Library/CloudStorage/OneDrive-上海华明电力设备制造有限公司
OS/<Country>/<Customer>/<PO or E-serial>/
  Shipment/          # optional: archive customer-facing CI PL Form E
```

Always `ls`/`find` live folders. Logistics often emails PDFs before they land in OneDrive.

## Form E vs ordinary CO

| | Ordinary CO | **Form E (COO Form E)** |
|--|-------------|-------------------------|
| Role | General certificate of origin | **China–ASEAN preferential** origin |
| VN / ASEAN buyers | Often rejected if they asked Form E | Common requirement for clearance + preference |
| Markers | Generic CO | Cert no. often **`E…`**, criterion e.g. **PE**, `origin.customs.gov.cn` |
| Wording | “COO” alone is ambiguous | **“COO Form E” / “Form E format” = Form E**, not plain CO |

**Pitfall:** First draft was plain CO → Sanaky: *COO not OK, apply Form E format (refer previous)*. Do not re-send plain CO after that.

If PDF shows watermark **「非有效证书」**, flag for Eric/logistics before treating as final official if unclear.

## Goods description (CI + PL + Form E together)

- **OLTC / on-load** ≠ **OCTC / de-energized (off-circuit) tap changer**
- Customer will bounce wrong commercial name (e.g. “On Load” on a **WSL** de-energized job)
- When correcting name, revise **CI + PL + Form E** as one set (same invoice no. R1/R2)

## Internal 报关 vs customer clearance

两套不要混。

| 套 | 谁做 | 给谁 |
|----|------|------|
| **客户清关** CI/PL / 客户合同 | Eric（新加坡主体盖 Eric 新加坡签） | 客户、货代订舱。**不要发给沈丽玲** |
| **报关** | 沈丽玲自己做报关发票箱单 | 出口报关。她邮件里的「仅报关、勿外发」那套也 **不要**当客户清关件外发 |

客户合同是 Eric↔客户的，不是报关件。

### 上海–新加坡内部合同（Eric 自己做）

沈丽玲报关要的是 **内部合同 + 开关编号**。模板 Eric 出，不要向她要，也不要用客户合同顶替。

**模板：** `Attachments/Logistic Contract/Tempalte_SHSGHM260302.docx`（PURCHASE ORDER / 採購訂單）

- P.O.#：`SHSG` + `YYYYMMDD`（样张 `SHSG20260301`）
- Supplier：Shanghai Huaming, 977 Tongpu。Invoice to：Huaming Power Equipment Singapore PTE. LTD.
- Consignee 保持样张：`AS CUSTOMER PO REQUIRED` / 根據華明海外有限公司提供最終客戶合同要求
- 货表一行一票：ITEM# = 新加坡发票号（`ES26-…` / `HMSG26-…`）；描述写型号 + `S/N E-W…`；数量、**内部单价**、金额
- 类别行：OCTC / WSL → **OFF CIRCUIT TAP CHANGER**；OLTC → **ON LOAD TAP CHANGER**
- 内部单价：抄最近一张 SHSG 里**同型号**的单价，**不要**用客户 CI 价。抄不到就停、问 Eric
- 交期 / INCOTERM / 付款：照模板（AS CUSTOMER’S ORDER REQUIRED，FOB OR FCA OR EXW CHINA，T/T 60 days）
- 存：`Attachments/Logistic Contract/SHSGYYYYMMDD.docx` + 该单 `OS/…/Shipment/`。PDF 走 **word-to-pdf**（本机 Word）
- 买方签字：盖 Eric 英文花签 `Attachments/Activity/Eric Tan_Signature.png`（Eric Tan + Singapore 公司名）。卖方保留上海公章。

**给沈丽玲的报关邮件只附内部合同**（docx + ASCII 名 PDF）。正文写清开关编号 `E-W…`。

**不要给她：** 客户合同、客户 CI/PL（`ES-` / `HMSG-` / `HO-` 新加坡或海外套）。

Draft 走 **qq-email**；To 通常 `shenliling@huaming.com`，Cc 跟原线程（常 `liqian@huaming.com` ± `rose.zhao@huaming.com`）。

### 赵珺财务包（不是报关）

出货后赵珺要的是另一套：采购发票、销售发票、采购合同 SHSG、销售合同、提单、佣金金额 + 新加坡 ERP。称赵珺姐。佣金按李倩（越南无载 12% / 有载 20%，跟 HMSG 采购价无关），不要把销售−内部合同当佣金。细则：`huaming-workflow/references/vietnam-price-and-commission.md`。

## Email — style (Eric corrections)

1. **Draft first**; send only on explicit “发吧” / send.
2. **Concise** English — few short paragraphs; no long thread recap.
3. Close with **`Looking forward to your feedback.`**  
   Avoid bare **`Please check and confirm.`** (Eric: too abrupt / impolite).
4. Always include signature:

```text
Kind regards,
-----------------------------------
Eric Tan 谭又铭
Southeast Regional Sales
Shanghai Huaming Power Equipment Co., Ltd.
E: eric.tan@huaming.com
```

5. Before SMTP: PDF text check (no mojibake; correct goods name; R-revision filenames); body UTF-8; signature present.

### Minimal revised-docs body template

```text
Dear Mr/Ms <Name>,

Please find the revised CI, PL and Form E attached.

Goods description corrected to: <exact commercial name>.

Looking forward to your feedback.

Kind regards,
-----------------------------------
Eric Tan 谭又铭
Southeast Regional Sales
Shanghai Huaming Power Equipment Co., Ltd.
E: eric.tan@huaming.com
```

Drop the middle sentence if nothing was “corrected” — just attach and looking-forward line.

## Recipients (default; override with live thread)

| Channel | To | Cc |
|---------|----|-----|
| **Australia** | Customer / as John directs | `johnzhou@huaming.com`, `colin@huaming.com`, `liqian@huaming.com` |
| **Vietnam Sanaky** (Song Hong Viet / BSHV) | Buyer (e.g. `trunglt@sanaky.com.vn`) | `anthony.phua@huaming.com`, peer purchasing (e.g. `dungpt@sanaky.com.vn`), `liqian@huaming.com` |
| External commercial | Customer | **Not** internal-only ops (e.g. 沈旭) unless Eric says so |

Set **In-Reply-To / References** to the customer’s Message-ID.

## Mail access

- Prefer thread continuity via IMAP + SMTP Exmail when use-spark MCP OAuth is missing:
  - IMAP SSL `imap.exmail.qq.com:993`
  - SMTP SSL `smtp.exmail.qq.com:465`
- Exmail **IMAP SEARCH** flaky → fetch recent headers, **filter client-side**
- Never echo mailbox passwords in chat replies

## Workflow — reply with revised CIPL + Form E

1. Locate thread + PO folder (`E-…`, customer PO).
2. Pull **latest** logistics PDFs (R1+), not stale first send.
3. Confirm Form E (not plain CO) + goods name + invoice no.
4. Copy into `…/Shipment/` when useful.
5. Show Eric: To / Cc / Subject / attachment list / short body.
6. On approve: send; report Message-ID and refused={}.

## Pitfalls

1. Verbose customer mail — Eric will ask to shorten.  
2. “Please check and confirm” as sole CTA — prefer looking-forward.  
3. AU Cc list on a VN Sanaky thread (use Anthony + local + 李倩).  
4. Plain CO when customer said Form E / COO Form E.  
5. Claiming sent after draft-only.  
6. Sending 报关-only CI/PL as customer clearance pack.  
7. Assertion on raw MIME bytes for signature text — body may be encoded; verify decoded payload.  
8. 把客户合同或客户 CI/PL 发给沈丽玲 — 她只要内部合同 + 开关编号。  
9. 内部合同用客户 CI 价，或向沈丽玲要模板。

## References

- `references/form-e-and-cipl.md` — markers, Sanaky pattern, filename cues
