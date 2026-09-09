# Form E & CIPL — quick reference

## Terms

- **CIPL**: CI (Commercial Invoice) + PL (Packing List)
- **Form E / COO Form E**: China–ASEAN preferential certificate of origin (not ordinary CO)
- **HMSG… / HO… / HMP…**: common Huaming trade invoice number prefixes (Singapore / overseas / Shanghai patterns vary by beneficiary)

## Form E file cues (from ops)

- `FORME HMSG26-xxx.pdf`, `FORME HMSG26-xxx R1.pdf`
- `各页证书打印E.pdf` (customs print pages; check 非有效证书 watermark)
- `预览证书-….pdf` (preview — confirm before customer final)
- Cert no. pattern: `E` + digits (e.g. `E266076323030048`)
- Verification site text: `origin.customs.gov.cn`
- Origin criterion example: `"PE"`
- Third-party operator block often names **Huaming Power Equipment Singapore PTE. LTD.** when trade beneficiary is Singapore

## Ordinary CO (rejected when Form E required)

- Generic “Certificate of Origin” draft without Form E layout / E-number series
- Customer pushback example (Sanaky): *COO not OK, let's apply Form E format (please refer previous time)*

## Goods name — OCTC vs OLTC

| Correct family | Commercial wording example |
|----------------|----------------------------|
| OCTC / de-energized / off-circuit (e.g. WSL…) | **DE-ENERGIZED TAP CHANGER** + full type |
| OLTC / on-load (e.g. CV, CM, HWV, SHZV…) | On-load tap changer / OLTC + full type |

Revise **CI + PL + Form E** together when name changes. Keep invoice revision suffix (**R1**, **R2**).

## Vietnam Sanaky thread pattern (2026)

- PO: `BSHV-HUAMING/2605/02`, serial `E-W260035`
- Buyer: Branch of Song Hong Viet / Sanaky purchasing (`trunglt@…`, `dungpt@…`)
- Huaming Cc: Anthony Phua + Li Qian (Kimmy); Eric sends or shares thread
- Logistics internal: Eric 出 SHSG 内部合同 + 开关编号给沈丽玲；她出**报关**发票箱单。客户 CI/PL 和客户合同 **不发给她**（见 SKILL.md 内部合同节）
- Air: Unitex etc. on separate booking thread; don’t mix 报关-only attachments into customer Form E reply

## Pre-send PDF check

```text
- Invoice no. matches PL and Form E invoice reference
- PO no. correct
- DE-ENERGIZED vs On Load as required
- No replacement-character / mojibake in extracted text
- Attachment filenames ASCII-safe for SMTP (rename 各页证书打印E → FORME … R1.pdf for outbound if needed)
```
