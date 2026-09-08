import * as XLSX from "xlsx";
import type { CellWrites } from "./osCells";

export function applyCells(wb: XLSX.WorkBook, cells: CellWrites, sheetName = "Sheet1"): void {
  const ws = wb.Sheets[sheetName];
  if (!ws) throw new Error(`Sheet ${sheetName} missing`);
  for (const [addr, value] of Object.entries(cells)) {
    if (value === "" || value == null) continue;
    const prev = ws[addr] as XLSX.CellObject | undefined;
    const next: XLSX.CellObject =
      typeof value === "number"
        ? { t: "n", v: value }
        : { t: "s", v: String(value) };
    if (prev?.z) next.z = prev.z;
    ws[addr] = next;
  }
}

export function fillWorkbook(template: ArrayBuffer | Uint8Array, cells: CellWrites): ArrayBuffer {
  const wb = XLSX.read(template, { type: "array", bookVBA: true });
  applyCells(wb, cells);
  const out = XLSX.write(wb, { type: "array", bookType: "xlsm", bookVBA: true });
  return out as ArrayBuffer;
}

export function hasVbaProject(buf: ArrayBuffer | Uint8Array): boolean {
  const wb = XLSX.read(buf, { type: "array", bookVBA: true });
  return Boolean((wb as unknown as { vbaraw?: unknown }).vbaraw);
}
