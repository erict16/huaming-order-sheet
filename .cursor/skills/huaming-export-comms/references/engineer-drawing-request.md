# 转发工程师出图（内部中文）

Eric 向工厂工程师要 **2D/3D / 二次图 / 评审** 时的固定格式。  
与客户英文邮件不同：极短中文 + **转发客户原邮** + Cc 李倩。

## Who → what（2026-09 定稿 · 按系列拆人）

开关外形一人、机构一人，**禁止合写一封**。To 只一个人。

| 产品 / 内容 | 工程师 | 邮箱 | 称呼 |
|-------------|--------|------|------|
| **CV2**、**W 无载**（WSL / WDL / WG）外形 2D+3D | 夏洁平 | `xiajieping@huaming.com` | 夏工 |
| **HWV**、**HWDK** 外形 2D+3D | 沈旭 | `shenxu@huaming.com` | 沈工 |
| **CM**、**CV**（不是 CV2）外形 2D+3D | 陈伟荣 | `chenweirong@huaming.com` | 陈工 |
| **SHZV**、**CMD**、**SHZVG** 外形 2D+3D | 王俊杰 | `wangjunjie@huaming.com` | 王工 |
| **CM2** 外形 2D+3D | 蔡坤 | `caikun@huaming.com` | 蔡工 |
| **电动机构** CMA7 / SHM-D / 二次图 / 评审 | 樊顺东 | `fanshundong@huaming.com` | 樊工 |

**Cc 固定：** `liqian@huaming.com`。客户不要进 To/Cc。Anthony 仅当原线程已有再抄。  
沈旭是出图工程师；**沈丽玲**是报关。AU 客户商业信仍不要抄沈旭。

系列对不上就停、问 Eric，不要猜。HWV 的机构仍单独给樊工。

## Envelope（硬规则）

1. **Subject = 转发客户原主题**  
   写成 `Fw: …` / `Fwd: …` 客户原主题，例如 `Fw: EEMC PO26-033. OLTC CV2-III-…`  
   **禁止**自编中文 subject（如「请出2D/3D图纸」当主标题）。
2. 客户 OS / 绕组图 / OD 随转发带上；不要另起一封空主题。
3. 正文 **只写中文短请求**；**不要写「OS在附件」**。签名用默认块。
4. **Draft-first**；Eric 说「发」再用 **qq-email** 发（不要 Spark）。

## 正文：CMA7 / 樊工（极短）

```text
樊工，

<国家+客户+项目>，N台 CMA7，有劳出个2D图。

非常感谢！
```

评审时：

```text
樊工

有劳评审一下这台MDU

感谢！
```

细节在附件 OS，**不要写「OS在附件」**，也**不要**在正文堆项目背景、序列号对账、油漆、交期说明。

## 正文：开关外形（夏/沈/陈/王/蔡 · 同一模版）

金样：夏工 sent UID **838**（EEMC）、**938**（MEE 奠边）。只换称呼和系列名，字段不另起一套。OS 未勾的项不写。

对齐 SANAKY / Cormidon / 蔡工外形修改类邮件：

```text
夏工，有劳出一台CV2的2D和3D图

型号：CV2III-350Y/72.5-10191W
出轴：右出轴
安装：钟罩式
档位：最大1，中间9，最小17

保护继电器：QJ4G-25，1对常开跳闸，法兰不带槽
压力释放：带防爆盖，不要压力释放阀
电位电阻：侧装（绕组图已附）

Q管：带放气阀，法兰带槽，管高 181 mm
S管：带放气阀，法兰不带槽，管高 181 mm
R管：带放气阀，法兰带槽，管高 181 mm
E2：头部盲板

水平传动轴：2000mm
竖直传动轴：2000mm

非常感谢！
```

### 一项一行写什么（从 OS 勾选抠，禁止瞎编）

| 字段 | OS 来源 | 写法注意 |
|------|---------|----------|
| 型号 | OS designation | **以 OS 为准**。客户邮件/PO 和 OS 不一致时仍写 OS 型号，不要跟客户邮件改 |
| 出轴 | Arrangement of top gear unit R/L | 右出轴 / 左出轴 |
| 安装 | Flange for mounting | 钟罩式 = Bell-type；标准法兰 / 箱顶式按勾选 |
| 档位 | Max / Mid / Min positions | 最大…，中间…，最小…；10193 常 9A/9B/9C |
| 保护继电器 / 气体继电器 | Protective relay | QJ4-25 / QJ4G-25 / QJ6-25；触点（油流/气体报警）；法兰带/不带槽 |
| 压力释放 | Pressure relief device | 见下节 **用词** |
| 电位电阻 | Tie-in / potential resistor | OS 不带就写「不带」。不带则不要线圈排列图。只有 OS 要带才写侧装/筒式，并要绕组图 |
| Q/S/R/E2 | Pipe connection | 带/不带管、放气阀、法兰带/不带槽、盲板；**必须写管高**（OS 的 H=） |
| 传动轴 | Horizontal / Vertical drive shaft | 水平/竖直传动轴：NNmm |

### 不要写进正文（除非 Eric 点名）

- 油漆颜色（RAL…）— 出图邮件默认不写
- 项目故事、PO 解释、序列号对账、「其余以 OS 为准」「如有缺项随时告知」
- 客户英文套话、`Looking forward to your feedback`
- 硬翻 OS 英文专名却从未在你历史出图邮件出现的词（例：把 Terminal screen caps 写成「端子屏蔽罩」塞给夏工）

## 压力释放用词（Eric 原话）

| 含义 | 写 |
|------|-----|
| Rupture disk / burst cover | **防爆盖**（不是「防爆膜」） |
| Pressure relief valve | **压力释放阀** |
| 只要阀、不要盖 | `需要压力释放阀，不带防爆盖`（SANAKY 例） |
| 只要盖、不要阀 | `带防爆盖，不要压力释放阀` |
| 阀 + 信号触点 | 按 OS 写清触点（一对常开常闭等） |

## 发信（qq-email，不要 Spark）

先用 **himalaya**（account `exmail`）读客户来邮和附件；SEARCH 坏了就按 UID / 日期翻。

发信走 **qq-email**（`~/.grok/skills/qq-email`），**不要 Spark**。Draft-first：先给 Eric 看正文，他说「发」再 SMTP。

```bash
cd ~/.grok/skills/qq-email
source ~/.config/qq-email/env

# To 对应工程师一人，Cc 仅李倩。走 save_draft / safe_send，不要 send.js
# 夏工 xiajieping · 沈工 shenxu · 陈工 chenweirong · 王工 wangjunjie · 蔡工 caikun · 樊工 fanshundong
```

附件随转发带上（OS / 绕组图）。正文不要写「OS在附件」。

## 可读性

- 默认 **一项一行**（`字段：值`），方便工程师扫。
- 极简单机也可压成 2–3 句（Cormidon：`要求：- 箱顶式，左出轴…`），但字段多时优先一项一行。
- 两台机：先列型号，再 `1. 2. 3.` 写共同点/差异（SANAKY 两台 CV2 例）。

## 反例 → 正例

| 错 | 对 |
|----|-----|
| Subject：`EEMC PO… 请出2D/3D图纸` | `Fwd:` 客户原主题 |
| 正文写越南项目背景、序列号 264732 vs 234732 对账 | 删掉；附件里已有 |
| `压力释放：仅防爆膜` | `带防爆盖，不要压力释放阀` |
| `端子屏蔽罩：要带`（夏工出图习惯无此条） | 不写；工程师看 OS |
| `油漆：RAL 7032` | 不写 |
| CMA7 正文抄一整页 OS | `樊工，<国家+客户>，N台 CMA7，有劳出个2D图。` |

## Checklist before show draft

- [ ] Subject 用 `Fw:` 客户原主题；To **该系列**工程师一人；Cc 仅李倩  
- [ ] 中文短；无油漆/无项目废话  
- [ ] 开关外形从 **OS** 抄全：出轴、安装、档位、气体/保护继电器、压力释放、电位、Q/S/R/E2**含管高**、轴  
- [ ] 用词对齐 Eric 历史：防爆盖、压力释放阀、放气阀、法兰带槽  
- [ ] 型号以 **OS 为准**（不要跟客户邮件改 10193/10191 这类差）  
