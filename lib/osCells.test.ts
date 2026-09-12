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

  it("parses official Word pipe strings onto Excel Q/S/R/E2 dropdowns", () => {
    const cells = oltcCells({
      pipe_q: "With bleeder, flange with groove",
      pipe_s: "With bleeder, flange with groove*",
      pipe_r: "Without bleeder,flange without groove*",
      pipe_e2: "Blind flange on OLTC head*",
      pipe_q_height: "181",
    });
    expect(cells.H149).toBe("1. With(std.)");
    expect(cells.O149).toBe("2. With");
    expect(cells.V149).toBe("1. With groove(std.)");
    expect(cells.AC149).toBeUndefined();
    expect(cells.H150).toBe("1. With(std.)");
    expect(cells.O150).toBe("1. With(std.)");
    expect(cells.H151).toBe("1. With(std.)");
    expect(cells.O151).toBe("1. Without(std.)");
    expect(cells.V151).toBe("1. Without groove(std.)");
    expect(cells.H152).toBe("1. Without（std.）");
  });

  it("writes quantity as a number and skips empty designer/buyer cells", () => {
    expect(cells.H12).toBe(1);
    expect(cells.H170).toBe(1);
    expect(typeof cells.H12).toBe("number");
    const empty = oltcCells({ family: "CV" });
    expect(empty.H5).toBeUndefined();
    expect(empty.H6).toBeUndefined();
    expect(empty.Z5).toBeUndefined();
    expect(empty.H8).toBeUndefined();
    expect(empty.H12).toBeUndefined();
  });

  it("writes compact type into the Remark body A173, not the Remark label", () => {
    expect(String(cells.A173)).toContain("Type:");
    expect(cells.H172).toBeUndefined();
    expect(cells.A172).toBeUndefined();
  });

  it("writes 档位 1 / 9a9b9c", () => {
    expect(String(cells.H80)).toContain("( 1 )");
    expect(String(cells.Q80)).toContain("9a9b9c");
    expect(String(cells.Q80)).toContain("9b");
  });

  it("converts MVA to kVA on H21 when capacity is constant", () => {
    expect(cells.H21).toBe(25000);
    expect(cells.S21).toBeUndefined();
    expect(cells.AB21).toBeUndefined();
  });

  it("writes decreasing kVA to S21 / from-position to AB21 and skips H21", () => {
    const v = oltcCells({
      ...oltc,
      capacity_mode: "decreasing",
      rated_power_mva: "25",
      capacity_from_pos: "9",
    });
    expect(v.S21).toBe(25000);
    expect(v.AB21).toBe("9");
    expect(v.H21).toBeUndefined();
  });

  it("writes official H25 asymmetric steps and skips H24", () => {
    const v = oltcCells({
      ...oltc,
      range_shape: "asymmetric",
      range_minus: "20",
      range_plus: "6",
    });
    expect(v.H25).toBe("2. - ( 20 ) ~+( 6 ) steps");
    expect(v.H24).toBeUndefined();
  });

  it("writes variable Ust max/min onto S30 / AB30 and skips I30", () => {
    const v = oltcCells({
      ...oltc,
      ust_mode: "variable",
      ust_max_v: "1200",
      ust_min_v: "800",
      step_voltage_v: "950",
    });
    expect(v.S30).toBe(1200);
    expect(v.AB30).toBe(800);
    expect(v.I30).toBeUndefined();
  });

  it("keeps constant Ust on I30 and symmetric steps on H24", () => {
    const v = oltcCells({ ...oltc, ust_mode: "constant", step_voltage_v: "950" });
    expect(v.I30).toBe(950);
    expect(v.S30).toBeUndefined();
    expect(v.AB30).toBeUndefined();
    expect(v.H24).toBe("1. ±( 8 ) steps");
    expect(v.H25).toBeUndefined();
  });

  it("writes official H18 frequency and Z18 ambient ku strings", () => {
    expect(oltcCells({ ...oltc, frequency_hz: "50" }).H18).toBe("50Hz");
    expect(oltcCells({ ...oltc, frequency_hz: "60" }).H18).toBe("60Hz");
    expect(oltcCells({ ...oltc, frequency_hz: "other" }).H18).toBeUndefined();
    expect(oltcCells({ ...oltc }).Z18).toBeUndefined();
    expect(oltcCells({ ...oltc, ambient_band: "-25~50" }).Z18).toBe("-25~+55°C");
    expect(oltcCells({ ...oltc, ambient_band: "-45~50" }).Z18).toBe("-45~+55°C");
    expect(oltcCells({ ...oltc, ambient_band: "-60~50" }).Z18).toBe("-60~+55°C");
    expect(
      oltcCells({ ...oltc, ambient_band: "other", ambient_min: "0", ambient_max: "55" }).Z18,
    ).toBe("0~+55°C");
    expect(
      oltcCells({ ...oltc, ambient_band: "other", ambient_min: "25", ambient_max: "55" }).Z18,
    ).toBe("-25~+55°C");
    expect(
      oltcCells({ ...oltc, ambient_band: "other", ambient_min: "40", ambient_max: "40" }).Z18,
    ).toBeUndefined();
    expect(oltcCells({ ...oltc, ambient_temp: "Max +45 °C" }).Z18).toBeUndefined();
    expect(oltcCells({ ...oltc, ambient_temp: "-45~+55°C" }).Z18).toBe("-45~+55°C");
  });

  it("does not invent overload / flux / tap winding / temp sensor / rain cover when unset", () => {
    expect(cells.H22).toBeUndefined();
    expect(cells.H26).toBeUndefined();
    expect(cells.H27).toBeUndefined();
    expect(cells.H97).toBeUndefined();
    expect(cells.H117).toBeUndefined();
  });

  it("writes official 防雨罩 ku B261–B262 onto H117 and skips 出线盒", () => {
    expect(oltcCells({ ...oltc, rain_cover: "no" }).H117).toBe("1. 不配");
    expect(oltcCells({ ...oltc, rain_cover: "without" }).H117).toBe("1. 不配");
    expect(oltcCells({ ...oltc, rain_cover: "yes" }).H117).toBe("2. 配");
    expect(oltcCells({ ...oltc, rain_cover: "with" }).H117).toBe("2. 配");
    expect(oltcCells({ ...oltc, rain_cover: "yes" }).H146).toBeUndefined();
    expect(String(oltcCells({ ...oltc, rain_cover: "yes" }).A173 || "")).not.toMatch(/出线盒/);
  });

  it("writes official Overload / Magnetic flux / Regulated location / Temperature Sensor dropdowns", () => {
    expect(
      oltcCells({ ...oltc, overload_mode: "iec" }).H22,
    ).toBe("1. IEC 60076-7 / ANSI C57.92");
    expect(
      oltcCells({ ...oltc, overload_mode: "above", overload_pct: "150", overload_hours: "2" }).H22,
    ).toBe("2. >IEC 60076-7 / ANSI C57.92 ( 150 )% overload ( 2 )hours");
    expect(oltcCells({ ...oltc, flux: "cfvv" }).H26).toBe("1. Constant flux voltage regulation");
    expect(oltcCells({ ...oltc, flux: "vfvv" }).H26).toBe("2. Variable flux voltage regulation");
    expect(oltcCells({ ...oltc, flux: "combined" }).H26).toBe("3. Compound voltage regulation");
    expect(oltcCells({ ...oltc, tap_winding: "star_neutral" }).H27).toBe("1. Star,in neutral");
    expect(oltcCells({ ...oltc, tap_winding: "star_middle" }).H27).toBe("2. Star,in center");
    expect(oltcCells({ ...oltc, tap_winding: "star_end" }).H27).toBe("3. Star,at line end");
    expect(oltcCells({ ...oltc, tap_winding: "delta_end" }).H27).toBe("4. Delta,at line end");
    expect(oltcCells({ ...oltc, tap_winding: "delta_middle" }).H27).toBe("5. Delta, in center");
    expect(oltcCells({ ...oltc, tap_winding: "1plus2" }).H27).toBe("6. 1+2 phases");
    expect(oltcCells({ ...oltc, tap_winding: "linear_end" }).H27).toBeUndefined();
    expect(oltcCells({ ...oltc, tap_winding: "linear_middle" }).H27).toBeUndefined();
    expect(oltcCells({ ...oltc, temp_sensor: "without" }).H97).toBe("1. Without");
    expect(oltcCells({ ...oltc, temp_sensor: "with", temp_sensor_type: "PT100" }).H97).toBe("2. With PT100");
    expect(oltcCells({ ...oltc, temp_sensor: "with" }).H97).toBe("2. With PT100");
    expect(oltcCells({ ...oltc, temp_sensor: "with", temp_sensor_type: "BWTY" }).H97).toBe("3. With BWTY");
    expect(oltcCells({ ...oltc, temp_sensor: "with", temp_sensor_type: "other" }).H97).toBeUndefined();
  });

  it("ticks 154–158 shaft quantities for H1–H4 / V1–V4 and lists them in A173", () => {
    const cells = oltcCells({
      ...oltc,
      shaft_multi: "yes",
      h1: "800",
      h2: "800",
      h3: "1000",
      h4: "1800",
      v1: "2000",
      v2: "1200",
      drive_shaft_horizontal_mm: "2000",
      drive_shaft_vertical_mm: "2000",
    });
    expect(cells.H154).toBe(2);
    expect(cells.H155).toBe(1);
    expect(cells.H158).toBeUndefined();
    expect(cells.Z156).toBe(1);
    expect(cells.Z158).toBe(1);
    expect(String(cells.A173)).toContain("H1=800 mm");
    expect(String(cells.A173)).toContain("H2=800 mm");
    expect(String(cells.A173)).toContain("H4=1800 mm");
    expect(String(cells.A173)).toContain("V1=2000 mm");
    expect(String(cells.A173)).toContain("V2=1200 mm");
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

  it("writes destination_port to S14 交货地点", () => {
    expect(oltcCells({ destination_port: "Hai Phong" }).S14).toBe("Hai Phong");
    expect(oltcCells({}).S14).toBeUndefined();
    expect(oltcCells({ destination_port: "  " }).S14).toBeUndefined();
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
    expect(String(cells.AB17)).toContain("( 17 )");
    expect(String(cells.D83)).toContain("CM2III-500Y/72.5B-10193W");
    expect(cells.A83).toBeUndefined();
  });

  it("writes custom paint without inventing -std. except RAL7040", () => {
    expect(cma7Cells({ paint: "RAL7035" }).H75).toBe("RAL7035");
    expect(cma7Cells({ paint: "RAL7040" }).H75).toBe("RAL7040-std.");
    expect(cma7Cells({ paint: "other", paint_other: "C5" }).H75).toBe("C5");
  });

  it("writes min position, quantity number, 4-20mA qty, controller, N/O and resistor onto official cells", () => {
    const cells = cma7Cells({
      quantity: "2",
      pos_max: "1",
      pos_mid: "17A,17B,17C",
      pos_min: "33",
      ma_qty: "1",
      avr_model: "hmc3c_term",
      pos_no_type: "1bbm",
      resistor_sig: "1",
      resistor_ohm: "10",
      control_from: "separate",
      control_voltage: "230_ac",
      heat_protect: "2pole",
      corrosive_class: "C4-H",
      socket_x10: "universal",
    });
    expect(cells.AB17).toBe("Min. effective number of turns at position ( 33 )");
    expect(cells.H12).toBe(2);
    expect(cells.H78).toBe(2);
    expect(cells.H51).toBe(1);
    expect(cells.H61).toBe("HMC-3C(Terminal Type)");
    expect(cells.H52).toBe("2. With");
    expect(cells.H53).toBe(1);
    expect(cells.H55).toBe("2. With(same resistance)");
    expect(cells.H56).toBe("10Ω");
    expect(cells.V56).toBe(1);
    expect(cells.H26).toBe("230V AC");
    expect(cells.H36).toBe("3. 2-pole miniature circuit breaker");
    expect(cells.H76).toBe("C4-H");
    expect(cells.H47).toContain("With");
    expect(cells.H48).toBe("Universal");
  });

  it("leaves designer/buyer empty when the preset did not fill them", () => {
    const cells = cma7Cells({ matching_oltc: "CVIII-350D/40.5-10193W", quantity: "1" });
    expect(cells.H5).toBeUndefined();
    expect(cells.H6).toBeUndefined();
    expect(cells.Z5).toBeUndefined();
    expect(cells.H8).toBeUndefined();
    expect(cells.H12).toBe(1);
  });

  it("writes destination port, 220-240 as 220 V, different resistors, gland and other bottom", () => {
    const cells = cma7Cells({
      destination_port: "Surabaya",
      motor_voltage: "220_240",
      resistor_sig: "2",
      resistor_ohm: "10",
      resistor_ohm_2: "50",
      resistor_zero_first: "yes",
      bottom_plate: "gland",
    });
    expect(cells.Z14).toBe("Surabaya");
    expect(cells.H22).toBe(220);
    expect(cells.H55).toBe("3. With(different resistance)");
    expect(cells.H56).toBe("10Ω");
    expect(cells.V56).toBe(1);
    expect(cells.H58).toBe("50Ω");
    expect(cells.V58).toBe(1);
    expect(cells.H57).toBe("0Ω");
    expect(cells.H70).toBe("2xΦ50 hole-std.");
    expect(cells.H71).toBe("With");
    expect(cma7Cells({ bottom_plate: "other" }).H70).toContain("drawing provided by the customer");
  });
});

describe("shmDCells", () => {
  it("leaves 220-240 template when motor is unset", () => {
    const cells = shmDCells({ shm_model: "SHM-D", quantity: "1" });
    expect(cells.H16).toBe("SHM-D");
    expect(cells.H20).toBeUndefined();
    expect(cells.H12).toBe(1);
    expect(cells.H64).toBe(1);
    expect(cells.H5).toBeUndefined();
    expect(cells.H8).toBeUndefined();
  });

  it("writes paint_other when paint is 其他", () => {
    expect(shmDCells({ shm_model: "SHM-D", paint: "other", paint_other: "RAL 5017" }).H61).toBe("RAL 5017");
    expect(shmDCells({ shm_model: "SHM-D", paint: "RAL7035" }).H61).toBe("RAL7035");
  });

  it("writes min position into AB17 and remarks into E67", () => {
    const cells = shmDCells({
      shm_model: "SHM-D",
      mdu_positions: "19",
      oltc_tap_positions: "19",
      oltc_tap_mid: "3",
      regulation: "reversing",
      matching_oltc: "CVIII-350D/40.5-10193W",
    });
    expect(String(cells.AB17)).toContain("( 17 )");
    expect(String(cells.E67)).toContain("CVIII-350D/40.5-10193W");
    expect(cells.A67).toBeUndefined();
  });

  it("writes explicit positions and CMA7-style extras onto official SHM-D cells", () => {
    const cells = shmDCells({
      shm_model: "SHM-D",
      destination_port: "Hai Phong",
      pos_max: "1",
      pos_mid: "9a9b9c",
      pos_min: "17",
      motor_voltage: "220_240",
      control_from: "separate",
      control_voltage: "230_ac",
      control_protect: "2pole",
      heat_from: "motor",
      hand_lamp: "yes",
      socket_x10: "other",
      socket_country: "British",
      emergency_stop: "yes",
      bcd_qty: "1",
      ma_qty: "2",
      resistor_sig: "1",
      resistor_ohm: "10",
      fiber_length_m: "80",
      door_hinge: "right",
      padlock: "yes",
    });
    expect(cells.Z14).toBe("Hai Phong");
    expect(cells.H17).toBe("Max. effective number of turns at position ( 1 )");
    expect(cells.P17).toBe("Mid-position(s) ( 9a9b9c )");
    expect(cells.AB17).toBe("Min. effective number of turns at position ( 17 )");
    expect(cells.H20).toBeUndefined();
    expect(cells.H23).toBe("2. Separate from motor circuit");
    expect(cells.H24).toBe("230V AC");
    expect(cells.H25).toBe("2-pole miniature circuit breaker without signal output");
    expect(cells.H29).toBe("1. Supply from motor circuit-std.");
    expect(cells.H34).toBe("With-std.");
    expect(cells.H37).toBe("British");
    expect(cells.H38).toBe("With");
    expect(cells.H40).toBe(1);
    expect(cells.H41).toBe(2);
    expect(cells.H43).toBe("2. With-Same resistances");
    expect(cells.H44).toBe("10Ω");
    expect(cells.H53).toBe(80);
    expect(cells.H55).toBe("Right-hand");
    expect(cells.H59).toBe("With");
  });

  it("does not invent SHM-D without-hand-lamp or without-socket (ku has no Without)", () => {
    const cells = shmDCells({ shm_model: "SHM-D", hand_lamp: "no", socket_x10: "without" });
    expect(cells.H34).toBeUndefined();
    expect(cells.H37).toBeUndefined();
    expect(cells.H38).toBeUndefined();
  });
});
