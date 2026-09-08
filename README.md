# 华明订货技术规范书（网页版）

把华明五类 **Order Sheet / 订货技术规范书** 做成浏览器里填的表：中文默认，可切 English / Русский / Tiếng Việt。填完在本机下载 Excel。静态站点，可部署 GitHub Pages。

## 五张订货单

| 网页 | 对应规格表 | 填写要点 |
|---|---|---|
| **有载 OLTC** | OLTC order sheet | 先选系列（CM/CMD/CV/CV2/CM2/SHZV…），再填变压器与开关额定。型号按 `CM2III-500Y/72.5B-10193W` 自动拼。组合式才有 B/C/D/DE；复合式 CV/CV2/SV 没有这级字母。分接代码遵循 P = 2×(±N)+中间档，常用 ±8 中间 3 → **10193W**。 |
| **无励磁 OCTC** | OCTC Order Specifications | 笼式 WSL/WDL、鼓式 WSG/WDG/WLG。型号如 `WSLIV-800Y/170-6x5B`。Y 常用 IV，D 常用 II。可选手轮或 CMA7。 |
| **干式 CZ** | Dry Type order sheet | 室内干变真空有载。单相结构；三相通常 **3×CZI** 一台机构联动。无油、无滤油机。电流 500/600 A，Um 40.5/72.5。 |
| **CMA7** | CMA7 order sheet | 传统电动机构。必须写所配开关型号和档位数，否则行程对不上。电机/控制电源、频率、加热、位置传送。 |
| **SHM-D** | SHM-D MDU & Controller | 数字机构 SHM-D / SHM-DL，可配控制器与 Modbus / IEC 61850。 |

未填项按 **常规配置** 供货。

## 使用

```bash
npm install
npm run dev        # http://127.0.0.1:3000
npm run build      # 静态导出到 ./out
npm run lint
npm run typecheck
```

GitHub Pages：CI 设置 `NEXT_PUBLIC_BASE_PATH=/huaming-order-sheet`。

## 导出

Excel 三张表：

1. **Order Sheet** — 中/英/俄/越标签 + 值（给人看）
2. **Flat** — 稳定字段键，一行一张订单（给工程/导入）
3. **Meta** — 版本与导出时间

数据只存在当前浏览器 `localStorage`，不会上传。
