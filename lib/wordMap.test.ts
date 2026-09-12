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

  it("writes H1–H4 / V1–V4 onto Word SDTs 78–85", () => {
    const single = oltcSdtValues({
      drive_shaft_horizontal_mm: "2000",
      drive_shaft_vertical_mm: "1500",
    });
    expect(single[78]).toBe("2000");
    expect(single[82]).toBe("1500");
    const multi = oltcSdtValues({
      drive_shaft_horizontal_mm: "2000",
      drive_shaft_vertical_mm: "1500",
      h1: "800",
      h2: "1000",
      h3: "1200",
      h4: "1500",
      v1: "800",
      v2: "1000",
      v3: "1200",
      v4: "2000",
    });
    expect(multi[78]).toBe("800");
    expect(multi[79]).toBe("1000");
    expect(multi[80]).toBe("1200");
    expect(multi[81]).toBe("1500");
    expect(multi[82]).toBe("800");
    expect(multi[83]).toBe("1000");
    expect(multi[84]).toBe("1200");
    expect(multi[85]).toBe("2000");
  });

  it("keeps LV out of Word remarks on a two-winding transformer", () => {
    const v = oltcSdtValues({ hv_kv: "66", lv_kv: "11" });
    expect(v[19]).toBe("66");
    expect(v[53]).toBeUndefined();
  });

  it("does not invent 3x / quantity / designer when those keys are empty", () => {
    const v = oltcSdtValues({ family: "CV" });
    expect(v[0]).toBeUndefined();
    expect(v[3]).toBeUndefined();
    expect(v[54]).toBeUndefined();
    expect(v[92]).toBeUndefined();
  });

  it("leaves designer / buyer / end-user Word boxes empty when contact is blank", () => {
    const v = oltcSdtValues({
      family: "CV2",
      designer_name: "",
      designer_phone: "",
      designer_email: "",
      buyer: "",
      end_user: "",
      quantity: "",
    });
    expect(v[0]).toBeUndefined();
    expect(v[3]).toBeUndefined();
    expect(v[7]).toBeUndefined();
    expect(v[92]).toBeUndefined();
  });

  it("puts MV / LV and notes into Word remarks only when MV is filled", () => {
    const three = oltcSdtValues({
      hv_kv: "115",
      mv_kv: "22",
      lv_kv: "10.5",
      notes: "tertiary on MV",
    });
    expect(three[19]).toBe("115");
    expect(three[53]).toContain("MV 22 kV");
    expect(three[53]).toContain("LV 10.5 kV");
    expect(three[53]).toContain("tertiary on MV");
    expect(three[95]).toBeUndefined();

    const mvOnly = oltcSdtValues({ hv_kv: "115", mv_kv: "22" });
    expect(mvOnly[53]).toBe("MV 22 kV");
    expect(mvOnly[53]).not.toMatch(/LV/);

    const two = oltcSdtValues({ hv_kv: "66", lv_kv: "11", notes: "keep on 95" });
    expect(two[53]).toBeUndefined();
    expect(two[95]).toBe("keep on 95");
    expect(oltcSdtValues({ hv_kv: "66" })[95]).toBeUndefined();
  });

  it("puts leftover oil_filter into remarks, not an invented checkbox", () => {
    expect(oltcSdtValues({ oil_filter: "none" })[95]).toBeUndefined();
    expect(oltcSdtValues({ oil_filter: "" })[95]).toBeUndefined();
    expect(oltcSdtValues({})[95]).toBeUndefined();

    const two = oltcSdtValues({ oil_filter: "ZXJY-I", notes: "indoor" });
    expect(two[53]).toBeUndefined();
    expect(two[95]).toBe("ZXJY-I\nindoor");

    const three = oltcSdtValues({
      hv_kv: "115",
      mv_kv: "22",
      lv_kv: "10.5",
      oil_filter: "ZXJY-II",
    });
    expect(three[53]).toContain("MV 22 kV");
    expect(three[53]).toContain("LV 10.5 kV");
    expect(three[53]).toContain("ZXJY-II");
    expect(three[95]).toBeUndefined();

    const boxes = oltcCheckValues({ oil_filter: "ZXJY-III" });
    expect(boxes[13]).toBe(false);
    expect(boxes[26]).toBe(false);
    expect(boxes[38]).toBe(false);
    expect(boxes[39]).toBe(false);
  });

  it("keeps HV in SDT 19 and puts OLTC on LV in remarks (no side SDT)", () => {
    const lv = oltcSdtValues({ hv_kv: "66", lv_kv: "11", oltc_side: "lv" });
    expect(lv[19]).toBe("66");
    expect(lv[20]).toBe("11");
    expect(lv[53]).toBeUndefined();
    expect(lv[95]).toBe("OLTC on LV");

    const hv = oltcSdtValues({ hv_kv: "66", lv_kv: "11", oltc_side: "hv" });
    expect(hv[19]).toBe("66");
    expect(hv[20]).toBe("66");
    expect(hv[95]).toBeUndefined();

    const withNotes = oltcSdtValues({
      hv_kv: "66",
      lv_kv: "11",
      oltc_side: "lv",
      notes: "keep on 95",
    });
    expect(withNotes[95]).toBe("OLTC on LV\nkeep on 95");

    const three = oltcSdtValues({
      hv_kv: "115",
      mv_kv: "22",
      lv_kv: "10.5",
      oltc_side: "lv",
      notes: "tertiary",
    });
    expect(three[19]).toBe("115");
    expect(three[20]).toBe("10.5");
    expect(three[53]).toContain("MV 22 kV");
    expect(three[53]).toContain("LV 10.5 kV");
    expect(three[53]).toContain("OLTC on LV");
    expect(three[53]).toContain("tertiary");
    expect(three[95]).toBeUndefined();
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
    expect(c[0]).toBe(true);
    expect(c[1]).toBe(false);
    expect(c[7]).toBe(true);
    expect(c[8]).toBe(false);
    expect(c[9]).toBe(true);
    expect(c[21]).toBe(true);
    expect(c[22]).toBe(false);
    expect(c[36]).toBe(true);
    expect(c[37]).toBe(false);
    expect(c[34]).toBe(true);
    expect(c[35]).toBe(false);
  });

  it("ticks >IEC overload, delta-end winding, flange With, temp With", () => {
    const c = oltcCheckValues({
      family: "CM2",
      overload_mode: "above",
      tap_winding: "delta_end",
      support_flange: "with",
      temp_sensor: "with",
      top_gear: "left",
      pressure_relief: "prv_50",
    });
    expect(c[1]).toBe(true);
    expect(c[0]).toBe(false);
    expect(c[12]).toBe(true);
    expect(c[9]).toBe(false);
    expect(c[22]).toBe(true);
    expect(c[21]).toBe(false);
    expect(c[37]).toBe(true);
    expect(c[36]).toBe(false);
    expect(c[35]).toBe(true);
    expect(c[34]).toBe(false);
    expect(c[25]).toBe(true);
    expect(c[24]).toBe(false);
  });

  it("ticks each tap-winding diagram from the official Word labels", () => {
    const idx: Record<string, number> = {
      star_neutral: 9,
      star_middle: 10,
      star_end: 11,
      delta_end: 12,
      delta_middle: 14,
      "1plus2": 15,
      linear_end: 16,
      linear_middle: 17,
    };
    for (const [key, i] of Object.entries(idx)) {
      const c = oltcCheckValues({ tap_winding: key });
      expect(c[i], key).toBe(true);
      for (const j of Object.values(idx)) {
        if (j !== i) expect(c[j], `${key} must not tick ${j}`).toBe(false);
      }
      expect(c[13]).toBe(false);
    }
    expect(oltcCheckValues({ support_flange: "special" })[23]).toBe(true);
    expect(oltcCheckValues({ family: "CV2", top_gear: "right" })[24]).toBe(true);
  });

  it("writes flux / oltc_side as SDTs, not checkboxes", () => {
    const cfvv = oltcSdtValues({ flux: "cfvv", oltc_side: "lv", hv_kv: "66", lv_kv: "11" });
    expect(cfvv[14]).toBe("Constant");
    expect(cfvv[20]).toBe("11");
    expect(oltcSdtValues({ flux: "vfvv" })[14]).toBe("Variable");
    expect(oltcSdtValues({ flux: "combined" })[14]).toBeUndefined();
    expect(oltcSdtValues({ oltc_side: "hv", hv_kv: "66", lv_kv: "11" })[20]).toBe("66");
    expect(oltcSdtValues({ oltc_side: "mv", hv_kv: "115", mv_kv: "22" })[20]).toBe("22");
    expect(oltcSdtValues({ temp_sensor: "with" })[77]).toBe("PT100 (WZP-441type)");
    const boxes = oltcCheckValues({ flux: "cfvv", oltc_side: "lv" });
    expect(boxes.some(Boolean)).toBe(true);
    expect(boxes[13]).toBe(false);
    expect(boxes[26]).toBe(false);
    expect(boxes[38]).toBe(false);
    expect(boxes[39]).toBe(false);
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
    expect(boxes[32]).toBe(true);
    expect(xml).toContain('w:checked w:val="1"');
  });

  it("ticks overload / winding / flange / temp sensor on the official Word OS", async () => {
    const values = {
      family: "CV2",
      overload_mode: "above",
      flux: "cfvv",
      tap_winding: "delta_end",
      support_flange: "with",
      temp_sensor: "with",
      temp_sensor_type: "PT100",
      oltc_side: "lv",
      hv_kv: "66",
      lv_kv: "11",
      top_gear: "left",
      pressure_relief: "prv_50",
    };
    const filled = await fillDocx(readFileSync(template), oltcSdtValues(values), oltcCheckValues(values));
    const xml = await (await JSZip.loadAsync(filled)).file("word/document.xml")!.async("string");
    const boxes = readLegacyCheckboxes(xml);
    const texts = readSdtTexts(xml);
    expect(boxes).toHaveLength(40);
    expect(boxes[1]).toBe(true);
    expect(boxes[0]).toBe(false);
    expect(boxes[12]).toBe(true);
    expect(boxes[9]).toBe(false);
    expect(boxes[22]).toBe(true);
    expect(boxes[21]).toBe(false);
    expect(boxes[25]).toBe(true);
    expect(boxes[37]).toBe(true);
    expect(boxes[36]).toBe(false);
    expect(boxes[35]).toBe(true);
    expect(boxes[34]).toBe(false);
    expect(boxes[13]).toBe(false);
    expect(boxes[38]).toBe(false);
    expect(texts[14]).toBe("Constant");
    expect(texts[20]).toBe("11");
    expect(texts[77]).toBe("PT100 (WZP-441type)");
  });

  it("does not stamp empty designer / buyer over the official Word OS", async () => {
    const buf = readFileSync(template);
    const zip0 = await JSZip.loadAsync(buf);
    const before = readSdtTexts(await zip0.file("word/document.xml")!.async("string"));
    const filled = await fillDocx(
      buf,
      oltcSdtValues({ family: "CV", designer_name: "", buyer: "", end_user: "", quantity: "" }),
    );
    const after = readSdtTexts(await (await JSZip.loadAsync(filled)).file("word/document.xml")!.async("string"));
    expect(after[0]).toBe(before[0]);
    expect(after[3]).toBe(before[3]);
    expect(after[7]).toBe(before[7]);
    expect(after[1]).toBe(before[1]);
  });

  it("writes three-winding MV remarks into the official Word OS", async () => {
    const filled = await fillDocx(
      readFileSync(template),
      oltcSdtValues({
        hv_kv: "115",
        mv_kv: "22",
        lv_kv: "10.5",
        vector_group: "YNd11yn12",
        notes: "EVN Tiên Yên tertiary",
      }),
    );
    const xml = await (await JSZip.loadAsync(filled)).file("word/document.xml")!.async("string");
    const texts = readSdtTexts(xml);
    expect(texts[10]).toBe("YNd11yn12");
    expect(texts[19]).toBe("115");
    expect(texts[53]).toContain("MV 22 kV");
    expect(texts[53]).toContain("LV 10.5 kV");
    expect(texts[53]).toContain("EVN Tiên Yên tertiary");
  });

  it("writes leftover oil_filter into official Word remarks", async () => {
    const filled = await fillDocx(
      readFileSync(template),
      oltcSdtValues({ oil_filter: "ZXJY-I" }),
      oltcCheckValues({ oil_filter: "ZXJY-I" }),
    );
    const xml = await (await JSZip.loadAsync(filled)).file("word/document.xml")!.async("string");
    const texts = readSdtTexts(xml);
    const boxes = readLegacyCheckboxes(xml);
    expect(texts[95]).toBe("ZXJY-I");
    expect(boxes[13]).toBe(false);
    expect(boxes[38]).toBe(false);
    expect(boxes[39]).toBe(false);
  });

  it("writes OLTC on LV into official Word remarks and leaves HV in SDT 19", async () => {
    const filled = await fillDocx(
      readFileSync(template),
      oltcSdtValues({ hv_kv: "66", lv_kv: "11", oltc_side: "lv" }),
    );
    const xml = await (await JSZip.loadAsync(filled)).file("word/document.xml")!.async("string");
    const texts = readSdtTexts(xml);
    expect(texts[19]).toBe("66");
    expect(texts[20]).toBe("11");
    expect(texts[95]).toBe("OLTC on LV");
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

  it("does not invent quantity or designer when those keys are empty", () => {
    const v = cma7SdtValues({ matching_oltc: "CVIII-350D/40.5" });
    expect(v[0]).toBeUndefined();
    expect(v[3]).toBeUndefined();
    expect(v[26]).toBeUndefined();
  });
});
