---
name: huaming-export-comms
description: >
  Use when drafting or sending Huaming overseas customer emails (quote, docs, follow-up)
  or internal factory engineer drawing requests (2D/3D, CMA7, 评审) with correct To/Cc,
  short English customer tone or short Chinese engineer format, Eric signature, qq-email CLI.
  Triggers: 回客户, 发邮件, Cc John, Sanaky, United Energy, customer reply, draft email,
  出图, 2D/3D, 转发工程师, 夏工, 樊工, CMA7图纸, 要图纸.
  Always draft-first; use **qq-email** for mailbox I/O. Not for pure pricing math (overseas-sales).
metadata:
  short-description: "Huaming customer + engineer email + qq-email"
  version: "1.2.2-grok"
---

> **Grok-local:** `~/.grok/skills/huaming-export-comms/`


> **Grok-local install:** `~/.grok/skills/huaming-export-comms/`


# Huaming Export Comms (Eric Tan)

Companion to **huaming-overseas-sales** (pricing/QS). This skill covers **mailbox + customer replies + shipping document sets**.

Mailbox I/O: **`qq-email`** (`~/.grok/skills/qq-email`, source `~/.config/qq-email/env`). Do **not** use `use-spark`.

Primary: `eric.tan@huaming.com` · Tencent Exmail · IMAP/SMTP `imap.exmail.qq.com` / `smtp.exmail.qq.com:465`.

## When to use

- Draft / send customer commercial email (quote, CI/PL, Form E, delivery, drawings)
- **Forward internal engineer** for 2D/3D / CMA7 / 评审（夏工 / 樊工等）— see below + [references/engineer-drawing-request.md](./references/engineer-drawing-request.md)
- Distinguish **Form E** vs ordinary **CO**
- Pull thread context, attachments, or “did we already reply?”
- Vietnam Sanaky / ASEAN clearance docs; AU United Energy style quote emails

Pricing/coeff/QS docx → load **huaming-overseas-sales** instead (or as well).

## Draft-first / send discipline

1. **Always show draft + To/Cc/Subject/attachments** before send unless Eric already said「发」on a frozen draft.
2. After edits (“太啰嗦 / 删掉后面”), re-show short draft; do not re-expand.
3. On send: verify PDF text (no mojibake, correct goods name), include **Eric’s signature block**, set `In-Reply-To`/`References` when replying.
4. Never claim sent until SMTP accepted (`refused: {}`). MailMaster has **no CLI send** — on「发」, if no SMTP path, give frozen paste-ready body; do not claim sent.
5. **English customer mail → always pass `avoid-ai-writing` before show/send** (Eric 2026-08-09). Huaming short-shape alone is not enough; strip template/translation stiffness. Chinese engineer mail: 短白话（`rules/shuorenhua-zh.md`）；改稿才读 `shuorenhua`。

## Customer English email style (Eric preference)

**Keep short.** After drafting, run **`avoid-ai-writing`** (professional email voice). Default shape:

```text
Hi <Name>,

<1–2 lines context if needed>

Please find attached <what> for your reference.

Looking forward to your feedback.

Kind regards,
-----------------------------------
Eric Tan 谭又铭
Southeast Regional Sales
Shanghai Huaming Power Equipment Co., Ltd.
E: eric.tan@huaming.com
```

### Do / Don’t

| Do | Don’t |
|----|--------|
| `Looking forward to your feedback.` | `Please check and confirm.` (too hard / impolite to customer) |
| One clear ask or one attachment purpose | Long bullet “quotation summary” unless Eric asks |
| Match existing thread tone | Invent install/service promises — AU: “John will follow up on local service” |
| Re-attach only what is new or requested | Re-push drawings as “new” if John already sent them to customer |

If Eric says cut everything after a sentence → keep greeting + that sentence + feedback line + signature only.

## Recipients (follow **live thread**, not one global Cc)

| Market / case | To | Cc (typical) | Notes |
|---------------|-----|--------------|--------|
| **AU utility** (e.g. United Energy) | End user (e.g. `cameron.finlayson@ue.com.au`) | `johnzhou@huaming.com`, `colin@huaming.com`, `liqian@huaming.com` | Commercial path via John; do **not** Cc 沈旭 on customer commercial mail |
| **VN Sanaky** (BSHV…) | `trunglt@sanaky.com.vn` | `anthony.phua@huaming.com`, `dungpt@sanaky.com.vn`, `liqian@huaming.com` | **Not** AU john/colin set |
| Internal 报关（沈丽玲） | `shenliling@huaming.com` | thread Cc（常 李倩 ± 赵珺） | **只附内部合同 + 正文写开关编号。** 客户合同、客户 CI/PL 不要发她。见 `huaming-export-docs-email` |
| 新加坡财务包（赵珺） | `rose.zhao@huaming.com`（称赵珺姐） | `liqian@huaming.com` ± 沈丽玲 | 采购发票、销售发票、SHSG、销售合同、提单、佣金金额。佣金问李倩，禁止销售−采购。见 `huaming-workflow/references/vietnam-price-and-commission.md` |
| **工程师出图** | 见下表 | **`liqian@huaming.com` 必 Cc** | **转发**客户原邮；中文短正文 |

Memory rule still applies: AU commercial Cc john+colin+liqian; never dump 沈旭 on customer quote mail.

## 转发工程师出图（内部 · 必读）

完整细则：[references/engineer-drawing-request.md](./references/engineer-drawing-request.md)

### 收件人

| 内容 | To |
|------|-----|
| **CV2**、**W 无载**（WSL/WDL/WG）外形 | 夏洁平 `xiajieping@huaming.com` |
| **HWV**、**HWDK** 外形 | 沈旭 `shenxu@huaming.com` |
| **CM**、**CV** 外形 | 陈伟荣 `chenweirong@huaming.com` |
| **SHZV**、**CMD**、**SHZVG** 外形 | 王俊杰 `wangjunjie@huaming.com` |
| **CM2** 外形 | 蔡坤 `caikun@huaming.com` |
| **电动机构** CMA7 / SHM-D / 二次 / 评审 | 樊顺东 `fanshundong@huaming.com` |

**Cc：** 始终 `liqian@huaming.com`。客户不要进工程师邮件 To/Cc。

### 格式铁律

1. Subject 保持客户原主题（`Fw: …` / `Fwd: …`）。**禁止**自编「请出2D/3D」类中文 subject。发信走 **qq-email**，draft-first。
2. 正文 **极短中文**。附件跟着转发即可，**不要写「OS在附件」**。不写项目故事、序列号对账、「如有缺项」。
3. **开关外形**（夏/沈/陈/王/蔡，按系列）从 **OS 勾选**抠「一项一行」，**以 OS 为准**：型号、出轴、安装、档位、保护继电器、压力释放、电位电阻、Q/S/R/E2（**管高**）、传动轴。未勾不写。
4. **电位电阻不带** 就写「不带」。不要向客户/工程师要线圈排列图，除非 OS 明确要带电位电阻。
5. **CMA7 / 樊工** 一句：`有劳出个2D图` + 非常感谢。不要堆 OS、不要说附件。
6. **用词：** 压力释放用 **防爆盖**（不是防爆膜）+ **压力释放阀**。
7. **默认不写：** 油漆颜色、非历史用词。To 一人，Cc 仅李倩。

### 夏工正文骨架（示例）

```text
夏工，

越南 MEE 奠边 Dien Bien 1 光伏有个项目，有劳出两台 CV2 的 2D 和 3D 图。

型号：CV2III-350Y/72.5-10191W
安装：钟罩式
档位：最大 1，中间 10，最小 19

保护继电器：QJ4-25，1对常开油流 + 1对常开气体报警，法兰带槽
压力释放：不带
电位电阻：不带

Q管：带放气阀，法兰带槽，管高 181 mm
S管：带放气阀，法兰不带槽，管高 181 mm
R管：带放气阀，法兰带槽，管高 181 mm
E2：头部盲板

水平传动轴：2000 mm
竖直传动轴：2000 mm

非常感谢！
```

### 樊工正文骨架

```text
樊工，

越南 MEE 奠边 Dien Bien 1，2台 CMA7，有劳出个2D图。

非常感谢！
```

## Form E vs ordinary CO (critical)

| | Ordinary CO | **Form E** (China–ASEAN preferential COO) |
|--|-------------|-------------------------------------------|
| Use | General origin | **ASEAN tariff preference** (e.g. Vietnam Sanaky) |
| Client language | “COO” / “CO” | Often **“COO Form E”** / “Form E format” — still means **Form E** |
| Cert no. | varies | Often **`E…`** (e.g. `E266076323030048`) |
| Origin criterion | — | e.g. **PE** |
| Verify | — | `origin.customs.gov.cn` |
| Files | “COO …pdf” | `FORME …pdf`, `各页证书打印E.pdf`, preview 预览证书 |

**Pitfalls**

1. Customer rejects plain COO → reissue **Form E**, do not argue naming.
2. Eric may say “出个 CO 草稿” internally while customer asked Form E — align to **customer** requirement.
3. `各页证书打印E.pdf` may show **「非有效证书」** watermark (customs print/preview). Flag to Eric before calling it final stamp copy; still may be what logistics issued as R1.
4. Goods description must match CI/PL (e.g. **DE-ENERGIZED TAP CHANGER** / OCTC, not On-Load / OLTC when product is WSL OCTC).

## CI / PL / Form E revision loop

1. Logistics (沈丽玲) issues draft → Eric/Kimmy → customer check.
2. Customer revision example (Sanaky E-W260035): fix description **De-energized Tap Changer not On Load Tap Changer** on **Invoice + Packing list + Form E**.
3. R1 files: `COMMERCIAL INVOICE … R1.pdf`, `PACKING LIST … R1.pdf`, Form E print/PDF.
4. Save under project `OS/.../Shipment/` (or Invoice folder).
5. Reply customer with **revised set only** + short body; Cc per thread.

Internal: 报关用 CI/PL ≠ 外发清关 CI/PL (Singapore beneficiary HMSG… vs factory 报关套).

## Exmail access pattern

- Mail I/O: **qq-email** + himalaya（account `exmail`）。不要 Spark。
- Exmail **IMAP SEARCH** unreliable → fetch recent seq ranges and **filter client-side**.
- Folders: `INBOX`, `Sent Messages`.
- SMTP SSL **465**; include signature UTF-8; attach PDFs as `application/pdf`.

### 超大附件 (FTN) — do not miss

Tencent **超大附件** are **not** MIME `attachment` parts.

Symptoms of a false “no attachment”:

- `BODYSTRUCTURE` = only `multipart/alternative` (text/plain + html)
- Raw size tens of KB while sibling mail is tens of MB
- Body/HTML contains: `从腾讯企业邮箱发来的超大附件`, `ftnExs_download`, filename + size + 到期日期

**Always** scan plain + HTML for:

- `HWVIII-…zip` / filename + `(65.38M` style size
- `http://mail.qq.com/cgi-bin/ftnExs_download?...`

Tell Eric the **filename + size + expiry**; direct curl without login gets HTML share page — download in webmail/client if automation fails.

### Drawing packages (example)

Same engineer, two mails on UE HWV:

| Mail | Package | Meaning |
|------|---------|---------|
| 7/22 MIME zip | `HWVIII-10193W**标准型**.zip` ~19MB | Standard conservator tank Y/D + wiring |
| 7/24 FTN zip | `HWVIII-10193W**非标型**.zip` ~65MB | **Non-standard** — **not** a duplicate |

Never report “no second attachment” without FTN scan. Never treat 标准/非标 as identical by subject alone.

## Australia quote email (UE pattern)

Customer often already has drawings via **John**, not Eric’s Sent to `ue.com.au`.

Before attaching drawings again: check whether John already wrote *Please find the attached drawing* and customer confirmed conservator.

Minimal quote reply after Eric cuts detail:

```text
Hi Cameron,

Thank you for confirming that the transformer is fitted with a conservator.

Please find attached our quotation Qu-ET260012 for your reference.

Looking forward to your feedback.

Kind regards,
-----------------------------------
Eric Tan 谭又铭
...
```

Attachment: quote PDF. Optional outline only if Eric asks.

Open commercial points (install partner, intermediate tank, electrical data) → John/Colin unless Eric wants them in the body.

## Vietnam Sanaky shipping example paths

```
OS/Vietnam/SANAKY/E-W260035 BSHV-HUAMING260502/
  Shipment/COMMERCIAL INVOICE HMSG26-073 R1.pdf
  Shipment/PACKING LIST HMSG26-073 R1.pdf
  Shipment/FORME HMSG26-073 R1.pdf   # from 各页证书打印E
```

Invoice series may be **HMSG…** (Singapore beneficiary) for foreign set.

## Verification before send

- [ ] To/Cc match **this thread’s market**（客户）或 **工程师 + Cc 李倩**（出图）
- [ ] 工程师信：已 `--forward` 客户原邮；正文中文短；无油漆废话
- [ ] 开关外形：出轴/安装/档位/继电器/防爆盖或压力释放阀/管/轴已从 OS 勾选写出
- [ ] Body short; feedback close（客户）; signature present; UTF-8 OK
- [ ] **English body passed `avoid-ai-writing`** (no report/template tone)
- [ ] Attachments open; goods name correct (OCTC vs OLTC)
- [ ] Form E vs CO correct type
- [ ] FTN checked if “empty” internal drawing mail
- [ ] Not sending 报关-only CI/PL to overseas customer
- [ ] Eric approved draft (or explicit 发)

## Pitfalls

1. MIME-only attachment scan → miss **FTN 超大附件**.
2. AU Cc list on Vietnam mail (or reverse).
3. `Please check and confirm` to customers.
4. Padding quote emails with full commercial bullets after Eric asked for short.
5. Calling plain CO “done” when customer demanded **Form E**.
6. Assuming second engineer mail with no text = no files.
7. Re-sending outline drawings as if newly requested when already with customer via John.
8. 工程师出图自编中文 subject、写成长说明文、写油漆/序列号对账。
9. 「防爆膜」——应用 **防爆盖**；勿硬造「端子屏蔽罩」等非习惯译名。
10. 不读 OS 勾选就猜出轴/管/继电器。
