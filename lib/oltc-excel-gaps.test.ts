import { describe, expect, it } from "vitest";
import { cellsForSheet, excelTemplateFor, oltcCells, TEMPLATE_FILE } from "./osCells";

describe("oltc Excel gaps", () => {
  it("ticks official 800–2000 mm shaft qty cells and skips unknown lengths", () => {
    const rows: Record<string, number> = {
      "800": 154,
      "1000": 155,
      "1200": 156,
      "1500": 157,
      "2000": 158,
    };
    for (const [mm, row] of Object.entries(rows)) {
      const cells = oltcCells({
        drive_shaft_horizontal_mm: mm,
        drive_shaft_vertical_mm: mm,
      });
      expect(cells[`H${row}`], `H${mm}`).toBe(1);
      expect(cells[`Z${row}`], `Z${mm}`).toBe(1);
    }
    const skip = oltcCells({ drive_shaft_horizontal_mm: "1810", drive_shaft_vertical_mm: "900" });
    for (const row of [154, 155, 156, 157, 158]) {
      expect(skip[`H${row}`]).toBeUndefined();
      expect(skip[`Z${row}`]).toBeUndefined();
    }
  });

  it("maps only oltc / cma7 / shm-d onto official xlsm", () => {
    expect(cellsForSheet("oltc", { family: "CV" })).toBeTruthy();
    expect(cellsForSheet("cma7", { matching_oltc: "CVIII-350D/40.5" })).toBeTruthy();
    expect(cellsForSheet("shm-d", { shm_model: "SHM-D" })).toBeTruthy();
    expect(cellsForSheet("dry", { family: "CZ" })).toBeNull();
    expect(cellsForSheet("hwv", { family: "HWV" })).toBeNull();
    expect(cellsForSheet("octc", { family: "WSL" })).toBeNull();
    expect(excelTemplateFor("oltc")).toBe(TEMPLATE_FILE.oltc);
    expect(excelTemplateFor("cma7")).toBe(TEMPLATE_FILE.cma7);
    expect(excelTemplateFor("shm-d")).toBe(TEMPLATE_FILE["shm-d"]);
    expect(excelTemplateFor("dry")).toBeUndefined();
    expect(excelTemplateFor("hwv")).toBeUndefined();
    expect(excelTemplateFor("octc")).toBeUndefined();
  });

  it("skips empty designer / buyer cells and writes delivery_lead to H14", () => {
    const empty = oltcCells({ family: "CV2", designer_name: "", buyer: "", designer_phone: "" });
    expect(empty.H5).toBeUndefined();
    expect(empty.H6).toBeUndefined();
    expect(empty.Z5).toBeUndefined();
    expect(empty.H8).toBeUndefined();
    expect(oltcCells({ oltc_side: "lv" }).AD23).toBe("LV side");
    expect(oltcCells({ oltc_side: "hv" }).AD23).toBe("HV side");
    expect(oltcCells({ oltc_side: "mv" }).AD23).toBe("MV side");
    expect(oltcCells({ delivery_lead: "90 days after PO" }).H14).toBe("90 days after PO");
    expect(oltcCells({ delivery_date: "custom", delivery_date_custom: "2026-12-01" }).H14).toBe(
      "2026-12-01",
    );
  });
});
