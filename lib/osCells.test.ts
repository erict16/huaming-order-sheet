import { describe, expect, it } from "vitest";
import { cma7Cells, oltcCells, shmDCells } from "./osCells";
import { deriveValues } from "./derive";

const oltc = deriveValues(
  {},
  {
    family: "CM2",
    phases: "III",
    buyer: "EEMC",
    country: "Vietnam",
    quantity: "1",
    oltc_current_a: "500",
    oltc_um_kv: "72.5",
    oltc_connection: "Y",
    oltc_selector_grade: "B",
    regulation: "reversing",
    plus_minus: "8",
    oltc_tap_mid: "3",
    oltc_tap_positions: "19",
    oltc_tap_pitch: "10",
    tap_code: "10193W",
    top_gear: "right",
    flange_type: "bell",
    potential_connection: "without",
    protective_relay: "QJ4G",
    relay_flange_groove: "without",
    pressure_relief: "burst",
    pipe_q: "with",
    pipe_q_bleeder: "with",
    pipe_q_groove: "with",
    pipe_q_height: "0",
    pipe_s: "with",
    pipe_r: "with",
    pipe_e2: "without",
    drive_shaft_horizontal_mm: "2000",
    drive_shaft_vertical_mm: "2000",
    mdu_model: "CMA7",
    rated_power_mva: "25",
    frequency_hz: "50",
  },
);

describe("oltcCells", () => {
  const cells = oltcCells(oltc);

  it("writes family, current, Um, grade, tap geometry", () => {
    expect(cells.H16).toBe("CM2");
    expect(cells.C78).toBe("CM2");
    expect(cells.I78).toBe(500);
    expect(cells.N78).toBe(72.5);
    expect(cells.Q78).toBe("B");
    expect(cells.K78).toBe("Y");
    expect(cells.T78).toBe(10);
    expect(cells.W78).toBe(19);
    expect(cells.Z78).toBe(3);
    expect(cells.H29).toBe("1. Reversing");
  });

  it("writes 出轴 / 钟罩 / 防爆盖 / QJ4G / 法兰不带槽", () => {
    expect(cells.H104).toBe("Right output");
    expect(cells.AH78).toBe("1. Bell");
    expect(cells.H96).toBe("1. Rupture disc only");
    expect(cells.H134).toBe("Without");
    expect(cells.AB134).toBe("one NO contact");
    expect(cells.H138).toBe("2. Without groove");
  });

  it("writes Q/S/R/E2 and 2000 mm shafts", () => {
    expect(cells.H149).toBe("1. With(std.)");
    expect(cells.O149).toBe("2. With");
    expect(cells.H152).toBe("1. Without（std.）");
    expect(cells.H158).toBe(1);
    expect(cells.Z158).toBe(1);
  });

  it("writes 档位 1 / 9a9b9c", () => {
    expect(String(cells.H80)).toContain("( 1 )");
    expect(String(cells.Q80)).toContain("9a9b9c");
    expect(String(cells.Q80)).toContain("9b");
  });

  it("converts MVA to kVA", () => {
    expect(cells.I21).toBe(25000);
  });

  it("does not invent motor voltage on the OLTC sheet", () => {
    expect(cells.H22).toBeUndefined();
  });

  it("writes 报价单号 to S13", () => {
    expect(oltcCells({ ...oltc, order_no: "HM-Q-2026-001" }).S13).toBe("HM-Q-2026-001");
  });

  it("combines country code and phone on Z5 without doubling +", () => {
    expect(oltcCells({ designer_phone_cc: "+86", designer_phone: "13800138000" }).Z5).toBe("+86 13800138000");
    expect(oltcCells({ designer_phone_cc: "86", designer_phone: "13800138000" }).Z5).toBe("+86 13800138000");
    expect(oltcCells({ designer_phone_cc: "++86", designer_phone: "+86 13800138000" }).Z5).toBe("+86 13800138000");
    expect(oltcCells({ designer_phone: "13800138000" }).Z5).toBe("13800138000");
    expect(oltcCells({ designer_phone_cc: "other", designer_phone_cc_other: "+353", designer_phone: "861234567" }).Z5).toBe("+353 861234567");
  });

  it("writes commercial lead-time or custom calendar date to H14", () => {
    expect(oltcCells({ delivery_date: "90 days after PO" }).H14).toBe("90 days after PO");
    expect(oltcCells({ delivery_date: "TBC" }).H14).toBe("TBC");
    expect(oltcCells({ delivery_date: "custom", delivery_date_custom: "2026-12-01" }).H14).toBe("2026-12-01");
    expect(oltcCells({ delivery_date: "2026-06-15" }).H14).toBe("2026-06-15");
  });

  it("writes HV/MV/LV into Excel H23 for a three-winding transformer", () => {
    const cells = oltcCells({ ...oltc, hv_kv: "115", mv_kv: "22", lv_kv: "10.5", vector_group: "YNd11yn12" });
    expect(cells.H23).toBe("HV(115) kV\nMV(22) kV\nLV(10.5) kV");
    expect(cells.O23).toBe("YNd11yn12");
  });

  it("writes catalogue RAL and custom paint_other / vector_group_other", () => {
    expect(oltcCells({ ...oltc, paint: "RAL5012" }).H167).toBe("RAL5012");
    expect(oltcCells({ ...oltc, paint: "other" }).H167).toBeUndefined();
    expect(oltcCells({ ...oltc, paint: "other", paint_other: "C5 RAL 9005" }).H167).toBe("C5 RAL 9005");
    expect(oltcCells({ ...oltc, paint: "ANSI70" }).H167).toBe("ANSI 70");
    expect(oltcCells({ ...oltc, vector_group: "YNd11" }).O23).toBe("YNd11");
    expect(oltcCells({ ...oltc, vector_group: "other", vector_group_other: "YNyn6" }).O23).toBe("YNyn6");
  });

  it("writes I / Imax, Network, autotransformer and C4-H", () => {
    const cells = oltcCells({
      ...oltc,
      application: "network",
      tx_kind: "auto",
      through_current_a: "300",
      imax_a: "300",
      corrosive_class: "C4-H",
    });
    expect(cells.Z12).toBe("Network");
    expect(cells.H17).toBe("2. Auto transformer");
    expect(cells.I28).toBe(300);
    expect(cells.Z28).toBe(300);
    expect(cells.H168).toBe("C4-H");
  });
});

describe("cma7Cells", () => {
  it("writes 230 V 1-phase 60 Hz", () => {
    const cells = cma7Cells({
      matching_oltc: "CVIII-350D/40.5-18353W",
      mdu_positions: "33",
      frequency_hz: "60",
      motor_voltage: "230_1",
    });
    expect(cells.H20).toBe("3. Single-phase motor_AC");
    expect(cells.H21).toBe("2. frequency_60");
    expect(cells.H22).toBe(230);
  });

  it("writes 415 V 3-phase 50 Hz", () => {
    const cells = cma7Cells({
      matching_oltc: "CM2III-500Y/72.5B-10193W",
      mdu_positions: "19",
      oltc_tap_positions: "19",
      oltc_tap_mid: "3",
      regulation: "reversing",
      frequency_hz: "50",
      motor_voltage: "415_3",
      controller: "none",
    });
    expect(cells.H16).toBe("CMA7");
    expect(cells.H20).toBe("1. Three-phase motor_3ACN");
    expect(cells.H21).toBe("1. frequency_50");
    expect(cells.H22).toBe(415);
    expect(cells.Z16).toBe(19);
    expect(String(cells.A83)).toContain("CM2III-500Y/72.5B-10193W");
  });

  it("writes custom paint without inventing -std.", () => {
    expect(cma7Cells({ paint: "RAL7035" }).H75).toBe("RAL7035-std.");
    expect(cma7Cells({ paint: "other", paint_other: "C5" }).H75).toBe("C5");
  });
});

describe("shmDCells", () => {
  it("leaves 220-240 template when motor is unset", () => {
    const cells = shmDCells({ shm_model: "SHM-D", quantity: "1" });
    expect(cells.H16).toBe("SHM-D");
    expect(cells.H20).toBeUndefined();
  });

  it("writes paint_other when paint is 其他", () => {
    expect(shmDCells({ shm_model: "SHM-D", paint: "other", paint_other: "RAL 5017" }).H61).toBe("RAL 5017");
  });
});
