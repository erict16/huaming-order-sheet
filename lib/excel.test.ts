import { describe, expect, it } from "vitest";
import { APP_VERSION, defaultExportFormat, resolveExportPlan } from "./excel";
import { getSheet } from "./schema";

describe("export plan", () => {
  it("bumps the patch version", () => {
    expect(APP_VERSION).toBe("1.2.2");
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
    expect(resolveExportPlan(getSheet("dry")!, "excel")).toEqual({ kind: "xlsx" });
  });

  it("exports OCTC as the official 2011 Word OS", () => {
    const octc = getSheet("octc")!;
    expect(defaultExportFormat(octc)).toBe("word");
    expect(resolveExportPlan(octc, "word")).toEqual({
      kind: "word",
      file: "octc-order-spec.docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    expect(resolveExportPlan(octc, "excel")).toEqual({ kind: "xlsx" });
  });

  it("exports HWV/HWDK as the official 2023-8 Word OS only", () => {
    const hwv = getSheet("hwv")!;
    expect(defaultExportFormat(hwv)).toBe("word");
    expect(resolveExportPlan(hwv, "word")).toEqual({
      kind: "word",
      file: "hwv-hwdk-order-spec.docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    expect(resolveExportPlan(hwv, "excel")).toEqual({ kind: "xlsx" });
  });
});
