# Exmail FTN + Form E quick reference

## Detect FTN 超大附件

```text
Body markers:
  从腾讯企业邮箱发来的超大附件
  HWVIII-….zip (65.38M, YYYY年MM月DD日 … 到期)
  http://mail.qq.com/cgi-bin/ftnExs_download?t=exs_ftn_download&k=…

IMAP traps:
  BODYSTRUCTURE only ALTERNATIVE → still may have FTN in HTML
  RFC822.SIZE ~30KB vs prior MIME zip ~25MB
```

Compare two drawing mails by **filename 标准型 vs 非标型** and size, not by subject alone.

## Form E identity checks

- Cert no. starts with **E** (electronic Form E style)
- Origin criterion e.g. **PE**
- HS e.g. **8504.90** for tap-changer parts
- Verification host: origin.customs.gov.cn
- Print PDF may watermark **非有效证书** — confirm with logistics before promising “official stamped”

## Goods description (OCTC)

WSL / de-energized products:

- Correct: **DE-ENERGIZED TAP CHANGER** (+ full type e.g. WSLII-600D/72.5-12*11C WITH HAND WHEEL)
- Wrong for OCTC: On Load / On-load / OLTC wording on CI/PL/Form E

Sanaky feedback pattern: Invoice + Packing + Form E must all flip together (R1).

## SMTP send checklist (Exmail)

- Host: smtp.exmail.qq.com:465 SSL
- From: eric.tan@huaming.com
- Signature block with 谭又铭
- Threading: In-Reply-To + References from customer Message-ID
- Verify decoded body contains Chinese name before sendmail
