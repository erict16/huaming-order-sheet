import { describe, expect, it } from "vitest";
import { APP_VERSION, defaultExportFormat, resolveExportPlan } from "./excel";
import { getSheet } from "./schema";

describe("export plan", () => {
  it("bumps the patch version", () => {
    expect(APP_VERSION).toBe("1.2.1");
  });

  it("lets the user choose Word or official xlsm on OLTC / CMA7 / SHM-D", () => {
    const oltc = getSheet("oltc")!;
    expect(defaultExportFormat(oltc)).toBe("word");
    expect(resolveExportPlan(oltc, "word")).toEqual({
      kind: "word",
      file: "oltc-order-sheet.docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    expect(resolveExportPlan(oltc, "excel")).toEqual({
      kind: "xlsm",
      file: "in-tank-oltc-v1.2.xlsm",
    });
    expect(resolveExportPlan(getSheet("cma7")!, "excel")).toEqual({
      kind: "xlsm",
      file: "cma7-order-specification-v1.2.xlsm",
    });
    expect(resolveExportPlan(getSheet("shm-d")!, "excel")).toEqual({
      kind: "xlsm",
      file: "shm-d-order-specification-v1.2.xlsm",
    });
  });

  it("falls back to generic xlsx when there is no official workbook", () => {
    expect(resolveExportPlan(getSheet("octc")!, "excel")).toEqual({ kind: "xlsx" });
    expect(resolveExportPlan(getSheet("octc")!, "word")).toEqual({ kind: "xlsx" });
  });
});
