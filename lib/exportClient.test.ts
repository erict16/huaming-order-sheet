import { describe, expect, it } from "vitest";
import {
  defaultExportFormat as fromExcel,
  hasWordExport as excelHasWord,
} from "./excel";
import { defaultExportFormat, hasWordExport } from "./exportClient";
import { getSheet, SHEET_IDS } from "./schema";

describe("exportClient light helpers", () => {
  it("matches excel.ts for every sheet (parent can swap the wizard import)", () => {
    for (const id of SHEET_IDS) {
      const sheet = getSheet(id)!;
      expect(defaultExportFormat(sheet)).toBe(fromExcel(sheet));
      expect(hasWordExport(sheet)).toBe(excelHasWord(sheet));
    }
  });

  it("defaults SHM-D to excel because the 2025.3 .doc is not fillable", () => {
    expect(defaultExportFormat(getSheet("shm-d")!)).toBe("excel");
    expect(hasWordExport(getSheet("shm-d")!)).toBe(true);
  });
});
