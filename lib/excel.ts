import * as XLSX from "xlsx";
import { allFields } from "./schema";
import { t } from "./copy";
import { typeFromValues } from "./typeString";
import type { Lang, OrderValues, SheetDef } from "./types";

export const APP_VERSION = "1.0.0";
export const SCHEMA_VERSION = "2";

const LANGS: Lang[] = ["zh", "en", "ru", "vi"];

export function buildWorkbook(sheet: SheetDef, values: OrderValues): XLSX.WorkBook {
  const { spaced, compact } = typeFromValues(sheet.id, values);

  const readable: (string | number)[][] = [[
    "Section ZH", "Section EN", "Field ZH", "Field EN", "Field RU", "Field VI", "Value", "Unit", "Key",
  ]];
  for (const { section, field } of allFields(sheet, values)) {
    readable.push([
      t(section.title, "zh"),
      t(section.title, "en"),
      t(field.label, "zh"),
      t(field.label, "en"),
      t(field.label, "ru"),
      t(field.label, "vi"),
      values[field.key] ?? "",
      field.unit ?? "",
      field.key,
    ]);
  }
  readable.push(["型号 / Type", "Type designation", "完整空格写法", "Spaced", "Через пробел", "Cách", spaced, "", "type_spaced"]);
  readable.push(["型号 / Type", "Type designation", "紧凑写法", "Compact", "Компактно", "Gọn", compact, "", "type_compact"]);
  const ws1 = XLSX.utils.aoa_to_sheet(readable);
  ws1["!cols"] = [22, 24, 28, 28, 28, 28, 32, 8, 22].map((wch) => ({ wch }));
  ws1["!freeze"] = { xSplit: 0, ySplit: 1 };

  const headers = ["sheet_id", "type_spaced", "type_compact"];
  const row: (string | number)[] = [sheet.id, spaced, compact];
  for (const { field } of allFields(sheet, values)) {
    headers.push(field.key);
    row.push(values[field.key] ?? "");
  }
  const ws2 = XLSX.utils.aoa_to_sheet([headers, row]);
  ws2["!cols"] = headers.map(() => ({ wch: 18 }));

  const meta = [
    ["Key", "Value"],
    ["app_version", APP_VERSION],
    ["schema_version", SCHEMA_VERSION],
    ["sheet_id", sheet.id],
    ["sheet_title_zh", t(sheet.meta.title, "zh")],
    ["exported_at", new Date().toISOString()],
    ["type_spaced", spaced],
    ["type_compact", compact],
    ["languages", LANGS.join(",")],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(meta);
  ws3["!cols"] = [{ wch: 22 }, { wch: 48 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, "Order Sheet");
  XLSX.utils.book_append_sheet(wb, ws2, "Flat");
  XLSX.utils.book_append_sheet(wb, ws3, "Meta");
  return wb;
}

export function exportExcel(sheet: SheetDef, values: OrderValues): void {
  const wb = buildWorkbook(sheet, values);
  const { compact } = typeFromValues(sheet.id, values);
  const ref = values.order_no || values.order_date || new Date().toISOString().slice(0, 10);
  const stem = (compact || sheet.id).slice(0, 48);
  const safe = `${stem}_${ref}`.replace(/[^A-Za-z0-9._×x+-]+/g, "-");
  XLSX.writeFile(wb, `HM-OS_${safe}.xlsx`);
}
