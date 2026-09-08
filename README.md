# 华明订货技术规范书（网页版）

把华明 **Order Sheet / 订货技术规范书** 做成浏览器里填的表：中文默认，可切 English / Русский / Tiếng Việt。

有载、CMA7 下载的是官方 **Word 订货规范书**（老版本 OS）。空白项按常规。数据只存在当前浏览器，点「保存」即可。

## 五张订货单

| 网页 | 对应规格表 | 填写要点 |
|---|---|---|
| **有载 OLTC** | In-tank OLTC Order Specification-V1.2.xlsm | 先选系列。型号按 `CM2III-500Y/72.5B-10193W` 自动拼。出轴、电位电阻、Q/S/R/E2、QJ4/QJ4G/QJ6、防爆盖按出图清单勾。机构电气到 CMA7 / SHM-D 单。 |
| **无励磁 OCTC** | OCTC Order Specifications | 笼式 WSL/WDL、鼓式 WSG/WDG/WLG。 |
| **干式 CZ** | Dry Type order sheet | 室内干变真空有载。三相通常 **3×CZI**。 |
| **CMA7** | CMA7 Order Specification-V1.2.xlsm | 必须写所配开关型号和档位数。电机可到 415 V。 |
| **SHM-D** | SHM-D Order Specification-V1.2.xlsm | 标配电源按官方表 220–240 V，不要默认成 380 V。 |

未填项按 **常规配置** 供货（官方表上的 std.）。

## 使用

```bash
npm install
npm run dev        # http://127.0.0.1:3000
npm test
npm run build      # 静态导出到 ./out
npm run lint
npm run typecheck
```

GitHub Pages：CI 设置 `NEXT_PUBLIC_BASE_PATH=/huaming-order-sheet`。

官方模板在 `public/templates/*.xlsm`。分接代码与 `oltc-selector/lib/tapCode.ts` 保持同一套图。
