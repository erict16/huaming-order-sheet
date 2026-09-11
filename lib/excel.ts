import * as XLSX from "xlsx";
import { fillDocx } from "./fillDocx";
import { fillFormTextDocx } from "./fillFormText";
import { fillWorkbook } from "./fillXlsm";
import { hwvFormValues } from "./hwvMap";
import { cellsForSheet, excelTemplateFor } from "./osCells";
import { allFields } from "./schema";
import { t } from "./copy";
import { typeFromValues } from "./typeString";
import type { Lang, OrderValues, SheetDef } from "./types";
import { cma7SdtValues, oltcSdtValues, WORD_TEMPLATE } from "./wordMap";

export const APP_VERSION = "1.2.1";
export const SCHEMA_VERSION = "3";

export type ExportFormat = "word" | "excel";

export type ExportPlan =
  | { kind: "word"; file: string; mime: string }
  | { kind: "xlsm"; file: string }
  | { kind: "xlsx" };

const LANGS: Lang[] = ["zh", "en", "ru", "vi"];

const XLSM_MIME = "application/vnd.ms-excel.sheet.macroEnabled.12";

function fileStem(sheet: SheetDef, values: OrderValues): string {
  const { compact } = typeFromValues(sheet.id, values);
  const ref = values.project || values.order_date || new Date().toISOString().slice(0, 10);
  const stem = (compact || sheet.id).slice(0, 48);
  return `${stem}_${ref}`.replace(/[^A-Za-z0-9._×x+-]+/g, "-");
}

export function templateUrl(file: string): string {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
  return `${base}/templates/${file}`;
}

export function defaultExportFormat(sheet: SheetDef): ExportFormat {
  return WORD_TEMPLATE[sheet.id] ? "word" : "excel";
}

export function hasWordExport(sheet: SheetDef): boolean {
  return Boolean(WORD_TEMPLATE[sheet.id]);
}

export function resolveExportPlan(sheet: SheetDef, format: ExportFormat): ExportPlan {
  if (format === "word") {
    const word = WORD_TEMPLATE[sheet.id];
    if (word) return { kind: "word", file: word.file, mime: word.mime };
  }
  const xlsm = excelTemplateFor(sheet.id);
  if (xlsm) return { kind: "xlsm", file: xlsm };
  return { kind: "xlsx" };
}

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

function downloadBuf(buf: ArrayBuffer, filename: string, mime: string) {
  const blob = new Blob([buf], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function fetchTemplate(file: string): Promise<ArrayBuffer> {
  const res = await fetch(templateUrl(file));
  if (!res.ok) throw new Error(`Template ${file} missing (${res.status})`);
  return res.arrayBuffer();
}

export async function exportOrderSheet(
  sheet: SheetDef,
  values: OrderValues,
  format: ExportFormat = defaultExportFormat(sheet),
): Promise<void> {
  const safe = fileStem(sheet, values);
  const plan = resolveExportPlan(sheet, format);

  if (plan.kind === "word") {
    const template = await fetchTemplate(plan.file);
    if (sheet.id === "oltc") {
      const filled = await fillDocx(template, oltcSdtValues(values));
      downloadBuf(filled, `HM-OS_${safe}.docx`, plan.mime);
      return;
    }
    if (sheet.id === "cma7") {
      const filled = await fillDocx(template, cma7SdtValues(values));
      downloadBuf(filled, `HM-OS_${safe}.docx`, plan.mime);
      return;
    }
    if (sheet.id === "hwv") {
      const filled = await fillFormTextDocx(template, hwvFormValues(values));
      downloadBuf(filled, `HM-OS_${safe}.docx`, plan.mime);
      return;
    }
    downloadBuf(template, `HM-OS_${safe}.${plan.file.split(".").pop()}`, plan.mime);
    return;
  }

  if (plan.kind === "xlsm") {
    const template = await fetchTemplate(plan.file);
    const cells = cellsForSheet(sheet.id, values);
    if (!cells) throw new Error(`No Excel cell map for ${sheet.id}`);
    const filled = fillWorkbook(template, cells);
    downloadBuf(filled, `HM-OS_${safe}.xlsm`, XLSM_MIME);
    return;
  }

  const wb = buildWorkbook(sheet, values);
  XLSX.writeFile(wb, `HM-OS_${safe}.xlsx`);
}

/** @deprecated use exportOrderSheet */
export function exportExcel(sheet: SheetDef, values: OrderValues): void {
  void exportOrderSheet(sheet, values);
}
