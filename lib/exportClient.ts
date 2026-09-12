/**
 * Client-safe export entry. Dynamic-imports `./excel` so xlsx / jszip / xmldom
 * stay out of the wizard's initial chunk.
 *
 * Parent: switch OrderWizard from `@/lib/excel` to `@/lib/exportClient`.
 * Do not statically import `./excel` from a client component.
 */

import type { OrderValues, SheetDef } from "./types";
import { WORD_TEMPLATE } from "./wordMap";

export type ExportFormat = "word" | "excel";

export function defaultExportFormat(sheet: SheetDef): ExportFormat {
  if (sheet.id === "shm-d") return "excel";
  return WORD_TEMPLATE[sheet.id] ? "word" : "excel";
}

export function hasWordExport(sheet: SheetDef): boolean {
  return Boolean(WORD_TEMPLATE[sheet.id]);
}

export async function exportOrderSheet(
  sheet: SheetDef,
  values: OrderValues,
  format: ExportFormat = defaultExportFormat(sheet),
): Promise<void> {
  const { exportOrderSheet: run } = await import("./excel");
  return run(sheet, values, format);
}