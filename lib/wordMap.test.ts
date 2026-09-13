import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import { fillDocx, readLegacyCheckboxes, readSdtTexts } from "./fillDocx";
import { cma7SdtValues, oltcCheckValues, oltcSdtValues } from "./wordMap";

const template = path.join(process.cwd(), "public/templates/oltc-order-sheet.docx");

describe("oltcSdtValues", () => {
  it("maps family, 出轴 pipes, QJ4G and 10193 positions", () => {
    const v = oltcSdtValues({
      family: "CM2",
      phases: "III",
      buyer: "EEMC",
      country: "Vietnam",
      oltc_current_a: "500",
      oltc_um_kv: "72.5",
      oltc_connection: "Y",
      oltc_selector_grade: "B",
      tap_code: "10193W",
      oltc_tap_positions: "19",
      oltc_tap_mid: "3",
      regulation: "reversing",
      pipe_q: "With bleeder, flange with groove",
      pipe_q_height: "181",
      pipe_s: "With bleeder, flange with groove*",
      pipe_r: "Without bleeder,flange without groove*",
      pipe_e2: "Blind flange on OLTC head*",
      protective_relay: "QJ4G-25,flange without groove,one N/O contact (oil flow)",
      mdu_model: "CMA7",
      potential_connection: "without",
    });
    expect(v[6]).toBe("CM2(Vacuum)");
    expect(v[55]).toBe("CM2");
    expect(v[57]).toBe("500");
    expect(v[59]).toBe("72.5");
    expect(v[63]).toBe("1");
    expect(v[64]).toBe("9a9b9c");
    expect(v[65]).toBe("17");
    expect(v[66]).toBe("With bleeder, flange with groove");
    expect(v[67]).toBe("181");
    expect(v[74]).toContain("QJ4G-25");
    expect(v[8]).toBe("CMA7");
    expect(v[1]).toBeUndefined();
  });

  it("writes catalogue RAL and custom paint / vector group", () => {
    const ral = oltcSdtValues({ paint: "RAL5015", vector_group: "Dyn11" });
    expect(ral[87]).toBe("RAL 5015");
    expect(ral[10]).toBe("Dyn11");
    expect(oltcSdtValues({ paint: "ANSI70" })[87]).toBe("ANSI 70");
    expect(oltcSdtValues({ paint: "RAL7033" })[87]).toBe("RAL 7033");
    expect(oltcSdtValues({ application: "network" })[9]).toBe("Network");
    expect(oltcSdtValues({ vector_group: "YNd11yn12" })[10]).toBe("YNd11yn12");
    const other = oltcSdtValues({
      paint: "other",
      paint_other: "C5 RAL 9006",
      vector_group: "other",
      vector_group_other: "YNyn6",
    });
    expect(other[87]).toBe("C5 RAL 9006");
    expect(other[10]).toBe("YNyn6");
    expect(oltcSdtValues({ paint: "other" })[87]).toBeUndefined();
  });

  it("maps SHZVG into Word family head and row", () => {
    const v = oltcSdtValues({
      family: "SHZVG",
      phases: "III",
      oltc_current_a: "1500",
      oltc_um_kv: "72.5",
      oltc_connection: "Y",
      oltc_selector_grade: "C",
      tap_code: "10193W",
    });
    expect(v[6]).toBe("SHZVG(Vacuum)");
    expect(v[55]).toBe("SHZVG");
    expect(oltcSdtValues({ family: "SHZV" })[6]).toBe("SHZV(Vacuum）");
  });

  it("does not write 报价单号 over the Revision 00 SDT", () => {
    const v = oltcSdtValues({ order_no: "HM-Q-2026-001", designer_name: "Li" });
    expect(v[0]).toBe("Li");
    expect(v[1]).toBeUndefined();
  });

  it("puts kVA / HV / current / steps in the Word boxes next to those labels", () => {
    const v = oltcSdtValues({
      family: "CM2",
      phases: "III",
      rated_power_mva: "25",
      hv_kv: "66",
      plus_minus: "8",
      oltc_current_a: "500",
      step_voltage_v: "1250",
      oltc_um_kv: "72.5",
      oltc_connection: "Y",
      oltc_tap_positions: "19",
      oltc_tap_mid: "3",
      regulation: "reversing",
    });
    expect(v[15]).toBeUndefined();
    expect(v[16]).toBe("25000");
    expect(v[19]).toBe("66");
    expect(v[21]).toBe("19");
    expect(v[22]).toBe("-8");
    expect(v[23]).toBe("+8");
    expect(v[25]).toBe("500");
    expect(v[27]).toBe("1250");
  });

  it("round-trips three-winding HV/MV/LV and YNd11yn12 on the OLTC Word map", () => {
    const v = oltcSdtValues({
      hv_kv: "115",
      mv_kv: "22",
      lv_kv: "10.5",
      vector_group: "YNd11yn12",
    });
    expect(v[10]).toBe("YNd11yn12");
    expect(v[19]).toBe("115");
    expect(v[53]).toContain("MV 22 kV");
    expect(v[53]).toContain("LV 10.5 kV");
  });

  it("ticks Constant step voltage, In-neutral, supporting flange Without", () => {
    const c = oltcCheckValues({
      family: "CV",
      oltc_connection: "Y",
      tap_winding: "star_neutral",
      ust_mode: "constant",
      step_voltage_v: "202",
      flange_type: "bell",
      support_flange: "without",
      overload_mode: "iec",
      capacity_mode: "constant",
    });
    expect(c).toHaveLength(40);
    expect(c[7]).toBe(true);
    expect(c[8]).toBe(false);
    expect(c[9]).toBe(true);
    expect(c[21]).toBe(true);
    expect(c[22]).toBe(false);
  });
});

describe("fillDocx", () => {
  it("writes SDT text into the official Word OS", async () => {
    const buf = readFileSync(template);
    const values = {
      family: "CV2",
      phases: "III",
      buyer: "Trafoindo",
      rated_power_mva: "25",
      oltc_current_a: "350",
      oltc_um_kv: "72.5",
      oltc_connection: "Y",
      tap_code: "10193W",
      oltc_tap_positions: "19",
      oltc_tap_mid: "3",
      regulation: "reversing",
      tap_winding: "star_neutral",
      ust_mode: "constant",
      step_voltage_v: "202",
      pipe_q: "Without bleeder,flange with groove*",
      pipe_q_height: "181",
      protective_relay: "QJ4G-25,flange without groove,one N/O contact (oil flow)",
    };
    const filled = await fillDocx(buf, oltcSdtValues(values), oltcCheckValues(values));
    const zip = await JSZip.loadAsync(filled);
    const xml = await zip.file("word/document.xml")!.async("string");
    const texts = readSdtTexts(xml);
    expect(texts[6]).toBe("CV2(Vacuum)");
    expect(texts[3]).toBe("Trafoindo");
    expect(texts[16]).toBe("25000");
    expect(texts[25]).toBe("350");
    expect(texts[27]).toBe("202");
    expect(texts[66]).toContain("Without bleeder");
    expect(texts[74]).toContain("QJ4G-25");
    expect(xml).toContain("w:sdt");
    const boxes = readLegacyCheckboxes(xml);
    expect(boxes).toHaveLength(40);
    expect(boxes[7]).toBe(true);
    expect(boxes[9]).toBe(true);
    expect(xml).toContain('w:checked w:val="1"');
  });
});

describe("cma7SdtValues", () => {
  it("writes 1 / 9a9b9c / 17 into max/mid/min, not the drawing-number box", () => {
    const v = cma7SdtValues({
      matching_oltc: "CM2III-500Y/72.5B-10193W",
      oltc_tap_positions: "19",
      oltc_tap_mid: "3",
      regulation: "reversing",
    });
    expect(v[6]).toBeUndefined();
    expect(v[7]).toBe("1");
    expect(v[8]).toBe("9a9b9c");
    expect(v[9]).toBe("17");
    expect(v[29]).toContain("CM2III-500Y/72.5B-10193W");
  });

  it("writes custom CMA7 paint", () => {
    expect(cma7SdtValues({ paint: "RAL9002" })[21]).toBe("RAL 9002");
    expect(cma7SdtValues({ paint: "other", paint_other: "C5" })[21]).toBe("C5");
  });
});
