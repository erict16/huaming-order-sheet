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
  });
});

describe("cma7Cells", () => {
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
});

describe("shmDCells", () => {
  it("leaves 220-240 template when motor is unset", () => {
    const cells = shmDCells({ shm_model: "SHM-D", quantity: "1" });
    expect(cells.H16).toBe("SHM-D");
    expect(cells.H20).toBeUndefined();
  });
});
