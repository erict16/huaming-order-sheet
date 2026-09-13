import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import { fillWorkbook, hasVbaProject } from "./fillXlsm";
import { cma7Cells, oltcCells, shmDCells, TEMPLATE_FILE } from "./osCells";

function templatePath(file: string) {
  return path.join(process.cwd(), "public/templates", file);
}

describe("fillWorkbook official templates", () => {
  it("writes mapped OLTC cells and keeps the VBA project", () => {
    const file = templatePath(TEMPLATE_FILE.oltc);
    expect(existsSync(file), file).toBe(true);
    const buf = readFileSync(file);
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
      designer_phone_cc: "+86",
      designer_phone: "13800138000",
      delivery_date: "90 days after PO",
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
    expect(ws.Z5?.v).toBe("+86 13800138000");
    expect(ws.H14?.v).toBe("90 days after PO");
  });

  it("fills CMA7 Order Specification V1.2", () => {
    const file = templatePath(TEMPLATE_FILE.cma7);
    expect(existsSync(file), file).toBe(true);
    const buf = readFileSync(file);
    expect(hasVbaProject(buf)).toBe(true);
    const out = fillWorkbook(
      buf,
      cma7Cells({
        matching_oltc: "CM2III-500Y/72.5B-18353W",
        mdu_positions: "33",
        pos_max: "1",
        pos_mid: "17A,17B,17C",
        pos_min: "33",
        frequency_hz: "50",
        motor_voltage: "380_3",
        motor_network: "3acn",
        control_from: "motor",
        control_protect: "2pole",
        heater_kind: "hygrostat",
        cam_s20: "co",
        incomplete_s21: "co",
        bcd_qty: "1",
        avr_model: "none",
      }),
    );
    const ws = XLSX.read(out, { type: "array", bookVBA: true }).Sheets.Sheet1;
    expect(ws.H16?.v).toBe("CMA7");
    expect(ws.H20?.v).toBe("1. Three-phase motor_3ACN");
    expect(ws.H22?.v).toBe(380);
    expect(ws.H25?.v).toBe("1. Supply from motor circuit-std.");
    expect(ws.H27?.v).toBe("3. 2-pole miniature circuit breaker");
    expect(ws.H38?.v).toBe("Heater with Temperature and Humidity controller");
    expect(ws.H43?.v).toBe("1 C/O");
    expect(ws.H44?.v).toBe("1 C/O");
    expect(ws.H50?.v).toBe(1);
    expect(String(ws.P17?.v)).toContain("17A,17B,17C");
    expect(ws.H17?.v).toBe("Max. effective number of turns at position ( 1 )");
  });

  it("fills SHM-D Order Specification V1.2", () => {
    const file = templatePath(TEMPLATE_FILE["shm-d"]);
    expect(existsSync(file), file).toBe(true);
    const buf = readFileSync(file);
    expect(hasVbaProject(buf)).toBe(true);
    const out = fillWorkbook(buf, shmDCells({ shm_model: "SHM-D", quantity: "1" }));
    const ws = XLSX.read(out, { type: "array", bookVBA: true }).Sheets.Sheet1;
    expect(ws.H16?.v).toBe("SHM-D");
  });
});
