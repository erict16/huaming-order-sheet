import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { defaultExportFormat, resolveExportPlan } from "./excel";
import { excelTemplateFor, TEMPLATE_FILE } from "./osCells";
import { getSheet, SHEET_IDS, SHEETS } from "./schema";
import { WORD_TEMPLATE } from "./wordMap";

const templates = path.join(process.cwd(), "public/templates");

describe("export plan", () => {
  it("gives every sheet a Word or Excel plan", () => {
    expect(SHEET_IDS).toEqual(["oltc", "octc", "dry", "cma7", "shm-d", "hwv"]);
    expect(SHEETS).toHaveLength(6);
    for (const sheet of SHEETS) {
      const word = resolveExportPlan(sheet, "word");
      const excel = resolveExportPlan(sheet, "excel");
      expect(["word", "xlsm", "xlsx"], sheet.id).toContain(word.kind);
      expect(["word", "xlsm", "xlsx"], sheet.id).toContain(excel.kind);
      expect(word.kind, sheet.id).toBe("word");
      expect(WORD_TEMPLATE[sheet.id], sheet.id).toBeTruthy();
      expect(defaultExportFormat(sheet), sheet.id).toBe("word");
    }
  });

  it("keeps dry / HWV / OCTC Word templates on disk", () => {
    for (const id of ["dry", "hwv", "octc"] as const) {
      const word = WORD_TEMPLATE[id];
      expect(word.file.endsWith(".docx"), id).toBe(true);
      expect(existsSync(path.join(templates, word.file)), word.file).toBe(true);
      expect(resolveExportPlan(getSheet(id)!, "word")).toEqual({
        kind: "word",
        file: word.file,
        mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      expect(excelTemplateFor(id)).toBeUndefined();
      expect(resolveExportPlan(getSheet(id)!, "excel")).toEqual({ kind: "xlsx" });
    }
  });

  it("keeps official xlsm for OLTC / CMA7 / SHM-D on disk", () => {
    expect(TEMPLATE_FILE).toEqual({
      oltc: "in-tank-oltc-v1.2.xlsm",
      cma7: "cma7-order-specification-v1.2.xlsm",
      "shm-d": "shm-d-order-specification-v1.2.xlsm",
    });
    for (const id of ["oltc", "cma7", "shm-d"] as const) {
      const file = TEMPLATE_FILE[id];
      expect(file.endsWith(".xlsm"), id).toBe(true);
      expect(existsSync(path.join(templates, file)), file).toBe(true);
      expect(excelTemplateFor(id)).toBe(file);
      expect(resolveExportPlan(getSheet(id)!, "excel")).toEqual({ kind: "xlsm", file });
    }
  });

  it("exports SHM-D Word as the 2025.3 .doc, not a fillable docx", () => {
    const word = WORD_TEMPLATE["shm-d"];
    expect(word.file).toBe("shm-d-order-sheet.doc");
    expect(word.file.endsWith(".docx")).toBe(false);
    expect(word.mime).toBe("application/msword");
    expect(existsSync(path.join(templates, word.file)), word.file).toBe(true);
    expect(resolveExportPlan(getSheet("shm-d")!, "word")).toEqual({
      kind: "word",
      file: "shm-d-order-sheet.doc",
      mime: "application/msword",
    });
  });

  it("ships every WORD_TEMPLATE file under public/templates", () => {
    for (const [id, word] of Object.entries(WORD_TEMPLATE)) {
      expect(existsSync(path.join(templates, word.file)), `${id}:${word.file}`).toBe(true);
    }
  });
});
