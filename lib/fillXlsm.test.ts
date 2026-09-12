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
    expect(ws.A172?.v).toBe("Remark");
  });

  it("writes OLTC overload / flux / tap winding / temp sensor onto official H22 H26 H27 H97", () => {
    const file = templatePath(TEMPLATE_FILE.oltc);
    const buf = readFileSync(file);
    expect(hasVbaProject(buf)).toBe(true);
    const cells = oltcCells({
      family: "CM2",
      overload_mode: "above",
      overload_pct: "120",
      overload_hours: "4",
      flux: "vfvv",
      tap_winding: "delta_end",
      temp_sensor: "with",
      temp_sensor_type: "PT100",
      shaft_multi: "yes",
      h1: "1000",
      v1: "1500",
    });
    const out = fillWorkbook(buf, cells);
    expect(hasVbaProject(out)).toBe(true);
    const ws = XLSX.read(out, { type: "array", bookVBA: true }).Sheets.Sheet1;
    expect(ws.H22?.v).toBe("2. >IEC 60076-7 / ANSI C57.92 ( 120 )% overload ( 4 )hours");
    expect(ws.H26?.v).toBe("2. Variable flux voltage regulation");
    expect(ws.H27?.v).toBe("4. Delta,at line end");
    expect(ws.H97?.v).toBe("2. With PT100");
    expect(ws.H155?.v).toBe(1);
    expect(ws.Z157?.v).toBe(1);
    expect(String(ws.A173?.v)).toContain("H1=1000 mm");
    expect(String(ws.A173?.v)).toContain("V1=1500 mm");
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
        avr_model: "hmc3c_air",
        avr_cable_m: "50",
        padlock: "yes",
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
    expect(ws.AB17?.v).toBe("Min. effective number of turns at position ( 33 )");
    expect(ws.H61?.v).toBe("HMC-3C(Terminal Type)");
    expect(ws.H65?.v).toBe("2. 配");
    expect(ws.V66?.v).toBe(50);
    expect(ws.V67?.v).toBe(50);
    expect(ws.AB66?.f).toMatch(/CEILING\(V66/);
    expect(ws.H73?.v).toBe("With");
    expect(String(ws.D83?.v)).toContain("CM2III-500Y/72.5B-18353W");
    expect(ws.A83?.v).toBe("Remark");
  });

  it("does not stamp empty designer/buyer onto the official CMA7 xlsm", () => {
    const file = templatePath(TEMPLATE_FILE.cma7);
    const buf = readFileSync(file);
    const out = fillWorkbook(buf, cma7Cells({ matching_oltc: "CVIII-350D/40.5", quantity: "3" }));
    const ws = XLSX.read(out, { type: "array", bookVBA: true }).Sheets.Sheet1;
    expect(ws.H5?.v).toBeUndefined();
    expect(ws.H6?.v).toBeUndefined();
    expect(ws.Z5?.v).toBeUndefined();
    expect(ws.H8?.v).toBeUndefined();
    expect(ws.H12?.v).toBe(3);
    expect(ws.H78?.v).toBe(3);
    expect(ws.H78?.t).toBe("n");
  });

  it("writes OLTC rain_cover onto official H117 ku 不配/配", () => {
    const file = templatePath(TEMPLATE_FILE.oltc);
    const buf = readFileSync(file);
    expect(hasVbaProject(buf)).toBe(true);
    const blank = XLSX.read(buf, { type: "array", bookVBA: true }).Sheets.Sheet1;
    expect(blank.A117?.v).toBe("不锈钢防雨罩");
    expect(blank.H117?.v).toBe("1. 不配");
    const noBuf = fillWorkbook(buf, oltcCells({ rain_cover: "no" }));
    expect(hasVbaProject(noBuf)).toBe(true);
    expect(XLSX.read(noBuf, { type: "array", bookVBA: true }).Sheets.Sheet1.H117?.v).toBe("1. 不配");
    const yes = XLSX.read(fillWorkbook(buf, oltcCells({ rain_cover: "yes" })), {
      type: "array",
      bookVBA: true,
    }).Sheets.Sheet1;
    expect(yes.H117?.v).toBe("2. 配");
    expect(yes.H146?.v).toBe("1. 不配");
  });

  it("writes OLTC constant/decreasing kVA, asymmetric steps, and variable Ust onto official cells", () => {
    const file = templatePath(TEMPLATE_FILE.oltc);
    const buf = readFileSync(file);
    expect(hasVbaProject(buf)).toBe(true);
    const blank = XLSX.read(buf, { type: "array", bookVBA: true }).Sheets.Sheet1;
    expect(blank.A21?.v).toBe("Rated power**");
    expect(String(blank.H21?.v).trim()).toBe("Constant");
    expect(blank.S21?.v).toBe("Variable");
    expect(blank.AB21?.v).toBe("kVA~");
    expect(blank.H25?.v).toBe("2. - (\u2002\u2002\u2002\u2002\u2002) ~+(\u2002\u2002\u2002) steps");
    expect(blank.S30?.v).toBe("Variable \xa0Ust max.=");
    expect(blank.AB30?.v).toBe("V");
    const constant = XLSX.read(
      fillWorkbook(buf, oltcCells({ rated_power_mva: "25", capacity_mode: "constant" })),
      { type: "array", bookVBA: true },
    ).Sheets.Sheet1;
    expect(constant.H21?.v).toBe(25000);
    expect(constant.S21?.v).toBe("Variable");
    expect(constant.AB21?.v).toBe("kVA~");
    const variable = XLSX.read(
      fillWorkbook(
        buf,
        oltcCells({
          capacity_mode: "decreasing",
          rated_power_mva: "40",
          capacity_from_pos: "9",
          range_shape: "asymmetric",
          range_minus: "20",
          range_plus: "6",
          ust_mode: "variable",
          ust_max_v: "1200",
          ust_min_v: "800",
        }),
      ),
      { type: "array", bookVBA: true },
    ).Sheets.Sheet1;
    expect(variable.S21?.v).toBe(40000);
    expect(variable.AB21?.v).toBe("9");
    expect(String(variable.H21?.v).trim()).toBe("Constant");
    expect(variable.H25?.v).toBe("2. - ( 20 ) ~+( 6 ) steps");
    expect(variable.H24?.v).toBe("1. ±(\u2002 ) steps");
    expect(variable.S30?.v).toBe(1200);
    expect(variable.AB30?.v).toBe(800);
    expect(hasVbaProject(fillWorkbook(buf, oltcCells({ ust_mode: "variable", ust_max_v: "1200" })))).toBe(
      true,
    );
  });

  it("writes OLTC HV / LV / MV side onto official AD23", () => {
    const file = templatePath(TEMPLATE_FILE.oltc);
    const buf = readFileSync(file);
    expect(hasVbaProject(buf)).toBe(true);
    const blank = XLSX.read(buf, { type: "array", bookVBA: true }).Sheets.Sheet1;
    expect(blank.AD23?.v).toBe("HV side");
    const filled = (side: "hv" | "lv" | "mv") =>
      XLSX.read(fillWorkbook(buf, oltcCells({ oltc_side: side })), { type: "array", bookVBA: true }).Sheets.Sheet1;
    expect(filled("hv").AD23?.v).toBe("HV side");
    expect(filled("lv").AD23?.v).toBe("LV side");
    expect(filled("mv").AD23?.v).toBe("MV side");
  });

  it("fills SHM-D Order Specification V1.2", () => {
    const file = templatePath(TEMPLATE_FILE["shm-d"]);
    expect(existsSync(file), file).toBe(true);
    const buf = readFileSync(file);
    expect(hasVbaProject(buf)).toBe(true);
    const blank = XLSX.read(buf, { type: "array", bookVBA: true }).Sheets.Sheet1;
    expect(blank.A63?.v).toBe("Language of documentation");
    expect(blank.Z53?.f).toMatch(/CEILING\(H53/);
    const out = fillWorkbook(
      buf,
      shmDCells({
        shm_model: "SHM-D",
        quantity: "1",
        nameplate_language: "pt",
        fiber_length_m: "80",
      }),
    );
    expect(hasVbaProject(out)).toBe(true);
    const ws = XLSX.read(out, { type: "array", bookVBA: true }).Sheets.Sheet1;
    expect(ws.H16?.v).toBe("SHM-D");
    expect(ws.H63?.v).toBe("Portuguese");
    expect(ws.H53?.v).toBe(80);
    expect(ws.Z53?.f).toMatch(/CEILING\(H53/);
  });
});
