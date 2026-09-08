// Client-side Excel (.xlsx) export via SheetJS. Runs entirely in the browser so
// it works on a static GitHub Pages host with no server. Walks the same schema
// used to render the form, so every applicable field is exported.

import * as XLSX from "xlsx";
import { getFamily } from "./catalog";
import { allApplicableFields, OrderValues, SECTIONS } from "./schema";
import { composeCompact, composeSpaced, TypeStringFields } from "./typeString";

export const APP_VERSION = "0.2.0";
export const SCHEMA_VERSION = "2";

function typeFields(values: OrderValues): TypeStringFields {
  return {
    family: values.family ?? "",
    phases: values.phases ?? "",
    currentA: values.oltc_current_a ? Number(values.oltc_current_a) : "",
    connection: values.oltc_connection ?? "",
    umKv: values.oltc_um_kv ? Number(values.oltc_um_kv) : "",
    selectorGrade: values.oltc_selector_grade ?? "",
    tapCode: buildTapCode(values),
  };
}

export function buildTapCode(values: OrderValues): string {
  const pitch = values.oltc_tap_pitch;
  const positions = values.oltc_tap_positions;
  const mid = values.oltc_tap_mid;
  if (!pitch || !positions || !mid) return "";
  let co = "";
  if (values.regulation === "reversing") co = "W";
  else if (values.regulation === "coarse_fine") co = "G";
  return `${pitch}${positions}${mid}${co}`;
}

function typeStrings(values: OrderValues): { spaced: string; compact: string } {
  const f = typeFields(values);
  if (!f.family) return { spaced: "", compact: "" };
  return { spaced: composeSpaced(f), compact: composeCompact(f) };
}

export function buildWorkbook(values: OrderValues): XLSX.WorkBook {
  const family = values.family ?? "";
  const fam = getFamily(family);
  const { spaced, compact } = typeStrings(values);

  // Sheet 1 — human-readable, grouped by section.
  const readableRows: (string | number)[][] = [];
  readableRows.push(["Section", "Field (ZH)", "Field (EN)", "Value", "Unit"]);
  for (const section of SECTIONS) {
    const fields = allApplicableFields(family)
      .filter((x) => x.section.id === section.id)
      .map((x) => x.field);
    if (fields.length === 0) continue;
    readableRows.push([`— ${section.titleZh} / ${section.titleEn} —`, "", "", "", ""]);
    for (const field of fields) {
      readableRows.push([
        section.titleZh,
        field.labelZh,
        field.labelEn,
        values[field.key] ?? "",
        field.unit ?? "",
      ]);
    }
  }
  // One type-designation row (compact order-sheet spelling).
  readableRows.push(["— 型号 / Type designation —", "", "", "", ""]);
  readableRows.push(["型号", "型号", "Type designation", compact || spaced, ""]);
  const ws1 = XLSX.utils.aoa_to_sheet(readableRows);
  ws1["!cols"] = [{ wch: 28 }, { wch: 34 }, { wch: 30 }, { wch: 26 }, { wch: 8 }];
  ws1["!freeze"] = { xSplit: 0, ySplit: 1 };

  // Sheet 2 — machine-readable flat row: one column per field.
  const flatHeaders: string[] = ["type_string_spaced", "type_string_compact"];
  const flatValues: (string | number)[] = [spaced, compact];
  for (const { field } of allApplicableFields(family)) {
    flatHeaders.push(field.key);
    flatValues.push(values[field.key] ?? "");
  }
  const ws2 = XLSX.utils.aoa_to_sheet([flatHeaders, flatValues]);
  ws2["!cols"] = flatHeaders.map(() => ({ wch: 18 }));

  // Sheet 3 — meta / provenance.
  const meta: (string | number)[][] = [
    ["Key", "Value"],
    ["app_version", APP_VERSION],
    ["schema_version", SCHEMA_VERSION],
    ["exported_at", new Date().toISOString()],
    ["family", family],
    ["family_category", fam?.category ?? ""],
    ["type_string_spaced", spaced],
    ["type_string_compact", compact],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(meta);
  ws3["!cols"] = [{ wch: 20 }, { wch: 40 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, "Order Sheet");
  XLSX.utils.book_append_sheet(wb, ws2, "Flat");
  XLSX.utils.book_append_sheet(wb, ws3, "Meta");
  return wb;
}

export function exportExcel(values: OrderValues): void {
  const wb = buildWorkbook(values);
  const family = values.family || "OS";
  const ref = values.order_no || values.order_date || new Date().toISOString().slice(0, 10);
  const safe = `${family}_${ref}`.replace(/[^A-Za-z0-9_-]+/g, "-");
  XLSX.writeFile(wb, `HM-OS_${safe}.xlsx`);
}
