import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { fillWorkbook, hasVbaProject } from "./fillXlsm";
import { oltcCells } from "./osCells";

const template = path.join(process.cwd(), "public/templates/in-tank-oltc-v1.2.xlsm");

describe.skipIf(!existsSync(template))("fillWorkbook official template", () => {
  it("writes mapped cells and keeps the VBA project", () => {
    const buf = readFileSync(template);
    expect(hasVbaProject(buf)).toBe(true);
    const cells = oltcCells({
      family: "CM2",
      phases: "III",
      oltc_current_a: "500",
      oltc_um_kv: "72.5",
      oltc_connection: "Y",
      oltc_selector_grade: "B",
      regulation: "reversing",
      plus_minus: "8",
      oltc_tap_mid: "3",
      oltc_tap_positions: "19",
      oltc_tap_pitch: "10",
      top_gear: "right",
      protective_relay: "QJ4G",
      relay_flange_groove: "without",
      pressure_relief: "burst",
      mdu_model: "CMA7",
    });
    const out = fillWorkbook(buf, cells);
    expect(hasVbaProject(out)).toBe(true);
    const wb = XLSX.read(out, { type: "array", bookVBA: true });
    const ws = wb.Sheets.Sheet1;
    expect(ws.C78?.v).toBe("CM2");
    expect(ws.I78?.v).toBe(500);
    expect(ws.H104?.v).toBe("Right output");
    expect(ws.H96?.v).toBe("1. Rupture disc only");
    expect(ws.AB134?.v).toBe("one NO contact");
  });
});
