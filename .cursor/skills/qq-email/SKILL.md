---
name: qq-email
description: >-
  Eric 腾讯企业邮（exmail IMAP/SMTP · Node qq-email）。收信、待办、发信 + 华明中/英语气。
  发信必须 safe_send + body-file；先草稿后发送。触发：查邮件、发邮件、回信、转发、收件箱。
---

# qq-email（企业邮 · **日常主用**）

来源：WorkBuddy `~\.workbuddy\skills\qq-email`（已按 **腾讯企业邮 exmail** 改 host），
Grok 侧落点：`~\.grok\skills\qq-email`。

**默认走本 skill。** Himalaya / `huaming-mail` **保留备用**（勿删）；仅本栈失败或用户点名时切换。同会话勿双栈混发。

## 路径

```
Skill    : C:\Users\TYM\.grok\skills\qq-email
NODE     : C:\Users\TYM\AppData\Local\nodejs\node.exe
.env     : QQ_EMAIL_ACCOUNT / QQ_EMAIL_AUTH_CODE
           QQ_EMAIL_IMAP_HOST=imap.exmail.qq.com
           QQ_EMAIL_SMTP_HOST=smtp.exmail.qq.com
```

```powershell
$RT = "C:\Users\TYM\.grok\skills\qq-email"
$NODE = "C:\Users\TYM\AppData\Local\nodejs\node.exe"
```

脚本会自动读 skill 根目录 `.env`，无需再手动 `$env:QQ_EMAIL_*=...`。

## 硬规则

1. **先草稿进企业邮 Drafts**（`save_draft.mjs` IMAP APPEND）。仅 `safe_send --dry-run` 或本地预览文件 **不够**——用户必须在企业邮草稿箱能看见。
2. **三步确认（强制）**：① 会话里贴**全文**过内容 → ② 用户在企业邮 Drafts 看 **format** → ③ 用户说「发」才 SMTP。禁止只存 draft 不贴正文、或内容未在会话确认就催发。
3. 用户未说「发 / send / 可以发了 / 确认发送 / 直接发」→ **不 SMTP**
4. 唯一业务发信：`scripts/safe_send.mjs --body-file`（拒 body 过短 / Markdown 表 / 代码围栏；默认签 `signature.txt`）
5. **附件必查（强制）**：`save_draft` / `safe_send` 发前会 `inspect`（存在、大小、magic、docx 能抽出字、文件名必须 ASCII）。`safe_send` SMTP 之后必须回捞 **Sent Messages** 对附件 sha256；对不上就报 `sent_verify_FAIL`，**禁止当发出成功、禁止盲目重发**。只报 `accepted: smtp send ok` 不够。
6. **工程师附件**：Word / OS / 规范表必须另附一份 **PDF**（ASCII 文件名，如 `Nanyang-30MVA-CV2.pdf`）。腾讯企业邮会把 `Content-Type name` 改成 `=?gbk?B?...=`，Foxmail / 企业邮常把附件当文本打开 → 夏工说的「附件乱码」。PDF 躲过这一层。
8. 待办看 **INBOX + Sent Messages**（`--mailbox sent`）
9. Reply All：To=原 From，Cc=原 Cc（去掉自己）
10. 失败后先查 Sent，**禁止盲目重发**
11. 禁止 PowerShell 管道 / here-string 塞正文
12. **作者正文 = 纯文本**（无 MD 表 / `#` 标题 / 代码围栏）。发出去是 multipart HTML。新正文字体按语言自动选：正文有汉字 → 霞鹜文楷等宽（对方没装落到雅黑）；纯英文 → Arial。看的是 body，不看签名里的「谭又铭」。`--font zh|en` 可强制。历史区保持原字体。
13. **Subject** 只用线程原主题：`Re:` / `Fw: ` + **完整原主题**（禁止擅自加尾巴）
14. 用户说「起草都同步邮箱 draft」= 每次改稿都重新 `save_draft` 覆盖进 Drafts
15. **已回复旗（强制）**：`safe_send` 对 `Re:` / `Fw:` 自动匹配 INBOX 原信，写 `In-Reply-To` / `References`，SMTP 成功后 `UID STORE \Answered`。企业邮网页 / 微信「已回复」看的是这面旗，不是 Sent 对主题。优先 `--reply-uid <INBOX UID>`（`receive.js` 那列）。`--no-reply-flag` 才跳过。`save_draft` 只写回复头，**不**打旗。漏打可补：`mark_answered.mjs --uid <UID>`。
16. **回信带历史（默认开）**：`--reply-uid` 或 `Re:`/`Fw:` 找到原信后，脚本自动在签名下挂 Outlook 式引用（灰线 + From/Sent/To/Subject + 原文）。原信若是完整 HTML 文档，只抽 body，**原字体/颜色/排版保留**（CSS 限定在引用区，不污染新正文）。禁止再嵌一层 `<html>`。作者 body-file **只写新的几行**。会话里也只贴新正文；完整 format 看企业邮 Drafts。`--no-quote` 才不带历史。`--plain` 才纯文本。自测：`node scripts/quote_reply.test.mjs`。
## 收信

```powershell
# Inbox 最近 N 条
& $NODE "$RT\scripts\receive.js" --limit 20

# 最近 N 天
& $NODE "$RT\scripts\receive.js" --days 7 --limit 30

# 已发送
& $NODE "$RT\scripts\receive.js" --mailbox sent --limit 15
```

输出含 **UID**（取正文用）。

## 正文

```powershell
& $NODE "$RT\scripts\get-body.js" --uid 12345
& $NODE "$RT\scripts\get-body.js" --uid 12345 --mailbox sent
```

stdout = 纯正文；meta 在 stderr。

## 草稿（必须 · 用户可见）

```powershell
& $NODE "$RT\scripts\save_draft.mjs" `
  --to a@b.com --cc c@d.com `
  --subject "Re: exact original subject" `
  --body-file C:\path\body.txt `
  --reply-uid 12345
# 可选：--attach path。Re: 主题无 --reply-uid 时自动找 INBOX 原信写回复头 + 引用原文。
# 不要历史：--no-quote    只要纯文本：--plain    字体默认 auto（汉字文楷 / 英文 Arial）
```

改稿后再次执行 → 草稿箱多一封新草稿（旧的可让用户删）。

## 发信（必须）

1. 写 UTF-8 body 文件（无签名块；签名自动追加）
2. 先 `save_draft` 让用户在草稿箱预览；用户确认「发」后再 SMTP
3. 可选 dry-run 自检：`--dry-run`（**不能替代** Drafts）

```powershell
& $NODE "$RT\scripts\safe_send.mjs" `
  --to a@b.com --cc c@d.com `
  --subject "Re: exact original subject" `
  --body-file C:\path\body.txt `
  --reply-uid 12345
# 高重要性：--high-importance  或  --priority high
# 不要历史：--no-quote    只要纯文本：--plain    字体默认 auto（汉字文楷 / 英文 Arial）
# 附件：--attach path 可重复，或 --attachments a.pdf,b.docx
# stdout 必须有 replied_flag: ok（新信 / --no-reply-flag 除外）
```

补打已回复（已 SMTP、INBOX 还没旗）：

```powershell
& $NODE "$RT\scripts\mark_answered.mjs" --uid 12345
```

`scripts/send.js` 仅保留为最小直发（CLI 正文）；**业务邮件一律走 safe_send**。

单独复查已发附件（不 SMTP）：

```powershell
& $NODE "$RT\scripts\verify_sent.mjs" `
  --subject "完整原主题" `
  --attach C:\path\file.pdf --attach C:\path\file.docx
```

stdout 必须有 `sent_verify: ok`。出现 `verify_gbk_on_wire: true` 时，这封还要补 PDF。

## 新加坡签（合同 / Appendix）

客户合同、Appendix 要盖 **Eric 新加坡签** 时，只走这一条，禁止往 Word 表里插图（会拆标题、多出一页），禁止在 OneDrive 上直接开 Word。

```powershell
python "$RT\scripts\sign_singapore.py" "C:\path\APPENDIX.docx"
python "$RT\scripts\sign_singapore.py" "C:\path\file.pdf" --date "28 August, 2026" --out "C:\path\file-signed.pdf"
```

- 图章：`scripts/assets/Eric-Tan-Singapore.png`（花签 + Huaming Power Equipment Singapore Pte. Ltd.）
- docx 先拷到 `%TEMP%` 用 Word 出 PDF，再按 `FOR THE SELLER` / `REPRESENTATIVE OF THE SELLER` 盖上去
- 默认写出旁边的 `*-signed.pdf`；看一眼卖方页再 `save_draft`
- `--replace "old=new"` 改 PDF 上的字（交期等）

## 服务器（企业邮）

| 协议 | Host | Port |
|------|------|------|
| IMAP | `imap.exmail.qq.com`（env 可覆盖） | 993 SSL |
| SMTP | `smtp.exmail.qq.com`（env 可覆盖） | 465 SSL |

邮箱别名：`inbox`→INBOX，`sent`→`Sent Messages`，`trash`→`Deleted Messages`。

## 语气（华明 · 强制）

- **极短**：直白、信息密度高；先结论。客户英文常 3–6 行；对内中文像同事说话。
- 中文对内/国内；英文对国际客户（用户原文语言优先）
- **有劳**层级：对内可「有劳…」；**勿对客户滥用**；对内工程师**少用「有劳尽快」**（假客气）
- Fw：完整原主题 + 必要上下文一两句
- 不要在 body 里再写 Kind regards / Eric Tan（签名文件负责）
- 用户嫌长/不礼貌/不像人话 → 立刻缩短、改软，勿辩解
- **赵珺**称「赵珺姐」。佣金数字未核过不要当事实写进给她的信。

### Subject

- Reply：`Re:` + **完整原主题**
- Fw：`Fw: ` + **完整原主题**
- 用户未指定 subject → 只沿用线程主题，**禁止**加「— 有劳出个 3D 图」之类尾巴

### 工程师要图类（分人 · 强制模版）

**拆信**：按系列找人，开关外形和机构 **禁止**合写一封。Cc 通常 Kimmy。明细：`huaming-export-comms/references/engineer-drawing-request.md`。

| 系列 | To |
|------|-----|
| CV2、W 无载（WSL/WDL/WG） | 夏工 `xiajieping@huaming.com` |
| HWV、HWDK | 沈工 `shenxu@huaming.com` |
| CM、CV | 陈工 `chenweirong@huaming.com` |
| SHZV、CMD、SHZVG | 王工 `wangjunjie@huaming.com` |
| CM2 | 蔡工 `caikun@huaming.com` |
| 电动机构 CMA7/SHM-D | 樊工 `fanshundong@huaming.com` |

**油漆色不写**。中文少夹英文：`order sheet`→**OS**；RPRR→**压力突变继电器**；tie-in→**电位电阻**。禁止 Markdown 表进 body。未定项不瞎写。开关外形用下面夏工模版，只换称呼。

#### 夏工（首次要 2D/3D · 模版 = EEMC sent UID 838 / MEE QS2608213）

结构固定、说人话；**不写**额定/最大电流、级电压（OS 里有、与出图无关）。OS 已填的轴长可写；出轴/钟罩/继电器等 OS 未勾清的**不编**。

```
夏工，

越南 {客户/项目一句}，有劳出一台 {系列} 的 2D 和 3D 图。

型号：{完整型号}
档位：最大 {n}，中间 {n}，最小 {n}
电位电阻：{不带 / 侧装 / …}（复合式 CV/CV2 恢复电压 >15kV 要配；组合式 CM/CM2/SHZV >35kV 要配。OS 勾 Without 但恢复电压空着 → 先问，不要默认不带）
{有则写} 保护继电器：…
{有则写} 压力释放：…

Q 管：…
S 管：…
R 管：…
E2：…

水平传动轴：{mm}
竖直传动轴：{mm}

{特殊说明一句，如有：产品按 600 做，图纸和铭牌按 500 出——招标时报的是 500。}

OS 在附件，非常感谢！
```

#### 樊工（机构 · 极短）

只短请求 + 附 OS（常 OLTC+MDU 两份），**不要**堆管/电流/档位细则：

```
樊工，

越南 {客户} 有个项目，有劳出个机构图纸。OS 在附件，谢谢！
```

#### 改图 / 客户退图（先看懂再写）

**起草前**：扫全线程（含已发出二次图/外形图），弄清报价→出图→合同→投产走到哪，再写。看不懂客户痛点就不要起草。

正文写**客户要改什么**（哪张图、缺哪个接点、今天要跟**终端客户**定图），不写自己对接点/端子的猜测（例：不要把「Q1 OFF 是不是电机跳闸」写进正文）。

- **禁止自造译名**：用客户原文或华明 OS 已有名称（incomplete tap change → **调档未完成**）。禁止把 out-of-step 译成「失步」。
- 称 **终端客户**，不要单独写「终端」。
- 仍拆人：二次图/机构 → 樊工；开关外形/3D 按系列（夏/沈/陈/王/蔡）。Cc Kimmy。
- 客气、短；用户要高重要性用 `--high-importance`。

```
樊工，

越南 {客户} 这单，二次图 {图号} 有劳改一下。

客户今天要跟终端客户定图，说{第 n 页/输出接点}和他们规范对不上。
规范要：{客户点名的接点，人话}。{缺的那项}如果没有，麻烦补上。

示意图在附件。他们今天要定图，非常感谢！
```

### 客户确认类

- 短、礼貌；二选一用 **A / B**，避免长技术段落。
- 可先 Thank you for your reply；需要时用户会要求 **高重要性**（`--high-importance`）。

## 分诊提示

1. Owner filter：Anthony / Kimmy / Grace / Yolanda / 沈丽玲 主责 → 归「他人」，勿塞进 Eric 立刻要做
2. Eric 急件：明确点名 Eric / Eric 亲口承诺截止 / 无人可顶
3. 摘要分：**Eric 必须做** / **他人跟进** / **已闭环**
4. 查某项目 OS/图纸：**扫全线程附件**（含转发工程师），勿只看本地夹或最近十几封
5. **SHM-KX**：勿默认必须单独 OS；以该单附件为准（历史有单独 KX OS 的，也有只写在 CMA7/MDU 备注里的）
6. **赵珺财务包**（`rose.zhao@huaming.com`，称 **赵珺姐**）：出货后她要采购发票、销售发票、采购合同 SHSG、销售合同、提单、佣金金额，并做新加坡 ERP。佣金按李倩（越南无载 12% / 有载 20%，跟 HMSG 采购价无关）。禁止用销售发票减内部合同。对不上 @李倩。细则：`huaming-workflow/references/vietnam-price-and-commission.md`
## 备用栈（保留）

| 路径 | 角色 |
|------|------|
| `~\.grok\skills\huaming-mail` | 备用 skill 入口 |
| `C:\Users\TYM\App\huaming-mail` | Himalaya runtime（safe_send / triage / get-body） |
| `C:\Users\TYM\App\himalaya` + `~\.config\himalaya` | Himalaya 二进制与配置 |

失败排查（本栈）：先确认 `.env` 授权码与 exmail host，再测 `receive.js --limit 3`。仍不行再切备用 Himalaya。勿另装第二套主脑。
