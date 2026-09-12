# 华明订货技术规范书（网页版）

把华明 **Order Sheet / 订货技术规范书** 做成浏览器里填的表：中文默认，可切 English / Русский / Tiếng Việt。

线上：https://erict16.github.io/huaming-order-sheet/

空白项按常规。数据只存在当前浏览器，点「保存」即可。

## 海外销售怎么用

1. 打开上面的网页。右上角切语言。
2. 先选一张订货单（有载 / HWV / 无励磁 / 干式 / CMA7 / SHM-D）。开关电气附件填开关单；电机电源、加热、位置传送到 **CMA7** 或 **SHM-D**。
3. 可选「按真实订单起单」：8 份 OneDrive 真单，一键填规格和工程名。**不带买方、设计人电话**——联系人自己填（导出前那一步，可空）。
4. 按步骤填。没填的按常规供货。型号在页里自动拼，不是浮层。
5. 最后一步核对。选 **Word**（官方订货表，有模板时默认）或 **Excel**（有载 / CMA7 / SHM-D 填官方 xlsm；其余是可读 xlsx），再下载。

## 六张订货单

| 网页 | 对应规格表 | 填写要点 |
|---|---|---|
| **有载 OLTC** | In-tank OLTC Order Specification-V1.2.xlsm | 先选系列。型号按 `CM2III-500Y/72.5B-10193W` 自动拼。出轴、电位电阻、Q/S/R/E2、QJ4/QJ4G/QJ6、防爆盖按出图清单勾。机构电气到 CMA7 / SHM-D 单。 |
| **HWV / HWDK** | HWV （HWDK） Order Specifications-2023-8.doc | 外附油箱真空有载。型号如 `HWVIII-400Y/72.5-10193W`，没有 B/C/D。HWDK 常配 SHM-X。电机电源仍到机构单。 |
| **无励磁 OCTC** | OCTC Order Specifications-2011-7-25.doc | 笼式 WSL/WDL、鼓式 WSG/WDG/WLG。型号如 `WSLII-600D/72.5-6x5A`。导出官方 Word。 |
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

GitHub Pages：CI 设置 `NEXT_PUBLIC_BASE_PATH=/huaming-order-sheet`。线上 https://erict16.github.io/huaming-order-sheet/ 。

官方模板在 `public/templates/*.xlsm`。分接代码与 `oltc-selector/lib/tapCode.ts` 保持同一套图。
