import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import { SHEET_DEFAULTS } from "./defaults";
import { fillDocx, readLegacyCheckboxes, readSdtTexts } from "./fillDocx";
import { cma7CheckValues, cma7SdtValues, CMA7_CHECKBOX_COUNT, CMA7_SDT_COUNT } from "./cma7Map";

const template = path.join(process.cwd(), "public/templates/cma7-order-sheet.docx");

const px360 = {
  matching_oltc: "CM2III-500Y/72.5B-18353W",
  buyer: "Bambangdjaja",
  country: "Indonesia",
  project: "PX-360",
  mdu_positions: "33",
  oltc_tap_positions: "33",
  oltc_tap_mid: "1",
  regulation: "reversing",
  pos_max: "1",
  pos_mid: "17A,17B,17C",
  pos_min: "33",
  motor_voltage: "380_3",
  motor_network: "3acn",
  frequency_hz: "50",
  control_from: "motor",
  control_voltage: "230_ac",
  control_network: "ac",
  control_protect: "2pole",
  heat_from: "motor",
  heater_kind: "hygrostat",
  cam_s20: "co",
  incomplete_s21: "co",
  resistor_sig: "1",
  resistor_ohm: "10",
  avr_model: "none",
};

describe("cma7CheckValues", () => {
  it("ticks official motor 3AC/N, 50 Hz, heater hygrostat, S20/S21 C/O", () => {
    const c = cma7CheckValues(px360);
    expect(c).toHaveLength(CMA7_CHECKBOX_COUNT);
    expect(c[0]).toBe(true);
    expect(c[4]).toBe(true);
    expect(c[6]).toBe(true);
    expect(c[12]).toBe(true);
    expect(c[21]).toBe(true);
    expect(c[31]).toBe(true);
    expect(c[33]).toBe(true);
    expect(c[49]).toBe(true);
    expect(c[61]).toBe(true);
    expect(c[64]).toBe(true);
    expect(c[67]).toBe(false);
    expect(c[68]).toBe(false);
  });

  it("ticks HMC-3C terminal, ET-SZ6 Without, and no 30 m cable", () => {
    const c = cma7CheckValues({ ...px360, avr_model: "hmc3c_term" });
    expect(c[61]).toBe(false);
    expect(c[63]).toBe(true);
    expect(c[64]).toBe(true);
    expect(c[65]).toBe(false);
    expect(c[67]).toBe(false);
    expect(c[68]).toBe(false);
  });

  it("ticks bottom-plate other, 0 Ω first, door right, padlock, lamp, socket, BCD, 4-20 mA", () => {
    const c = cma7CheckValues({
      ...px360,
      bottom_plate: "other",
      resistor_zero_first: "yes",
      door_hinge: "right",
      padlock: "yes",
      hand_lamp: "yes",
      socket_x10: "universal",
      bcd_qty: "1",
      ma_qty: "2",
    });
    expect(c[55]).toBe(false);
    expect(c[58]).toBe(true);
    expect(c[50]).toBe(true);
    expect(c[54]).toBe(true);
    expect(c[60]).toBe(true);
    expect(c[23]).toBe(true);
    expect(c[35]).toBe(true);
    expect(c[42]).toBe(true);
    expect(c[46]).toBe(true);
  });

  it("does not invent standard ticks when keys are empty", () => {
    const c = cma7CheckValues({});
    expect(c).toHaveLength(CMA7_CHECKBOX_COUNT);
    expect(c.every((x) => x === false)).toBe(true);
  });

  it("ticks sheet defaults only where those keys say so, not the printed standard-included block", () => {
    const c = cma7CheckValues(SHEET_DEFAULTS.cma7);
    expect(c[0]).toBe(true);
    expect(c[4]).toBe(true);
    expect(c[6]).toBe(true);
    expect(c[8]).toBe(true);
    expect(c[11]).toBe(true);
    expect(c[13]).toBe(true);
    expect(c[15]).toBe(true);
    expect(c[17]).toBe(true);
    expect(c[19]).toBe(true);
    expect(c[22]).toBe(true);
    expect(c[24]).toBe(true);
    expect(c[27]).toBe(true);
    expect(c[30]).toBe(true);
    expect(c[32]).toBe(true);
    expect(c[34]).toBe(true);
    expect(c[41]).toBe(true);
    expect(c[44]).toBe(true);
    expect(c[48]).toBe(true);
    expect(c[53]).toBe(true);
    expect(c[55]).toBe(true);
    expect(c[59]).toBe(true);
    expect(c[61]).toBe(true);
    expect(c[64]).toBe(true);
    expect(c[67]).toBe(false);
  });

  it("ticks custom aviation cable length, not the 30 m standard offer", () => {
    const c = cma7CheckValues({ avr_model: "hmc3c_air", avr_cable_m: "50" });
    expect(c[62]).toBe(true);
    expect(c[67]).toBe(false);
    expect(c[68]).toBe(true);
    const std = cma7CheckValues({ avr_model: "hmc3c_air", avr_cable_m: "30" });
    expect(std[67]).toBe(true);
    expect(std[68]).toBe(false);
    const empty = cma7CheckValues({ avr_model: "hmc3c_air" });
    expect(empty[67]).toBe(false);
    expect(empty[68]).toBe(false);
  });
});

describe("cma7SdtValues", () => {
  it("writes official protection dropdown strings", () => {
    const two = cma7SdtValues({ control_protect: "2pole", heat_protect: "1pole" });
    expect(two).toHaveLength(CMA7_SDT_COUNT);
    expect(two[13]).toBe("2-pole, auto-cut, without signal");
    expect(two[15]).toBe("1-pole, auto-cut, without signal");
    expect(cma7SdtValues({ control_protect: "without" })[13]).toBeUndefined();
  });

  it("does not write order quantity into documentation copy counts", () => {
    const v = cma7SdtValues({ quantity: "2", notes: "indoor" });
    expect(v[26]).toBeUndefined();
    expect(v[28]).toBeUndefined();
    expect(v[1]).toBeUndefined();
    expect(v[24]).toBeUndefined();
    expect(v[27]).toBeUndefined();
    expect(v[29]).toContain("Quantity: 2");
    expect(v[29]).toContain("indoor");
    const one = cma7SdtValues({ quantity: "1", notes: "indoor" });
    expect(one[26]).toBeUndefined();
    expect(one[29]).toBe("indoor");
    expect(one[29]).not.toContain("Quantity");
  });

  it("puts leftover schema keys into remarks, not invented SDTs", () => {
    const v = cma7SdtValues({
      matching_oltc: "CVIII-350D/40.5",
      destination_port: "Surabaya",
      delivery_lead: "90 days after PO",
      order_no: "HM-Q-2026-001",
      mdu_ip: "IP65",
      parallel: "yes",
      mdu_side: "right",
      nameplate_language: "zh",
    });
    expect(v[23]).toBeUndefined();
    expect(v[25]).toBeUndefined();
    expect(v[29]).toContain("OLTC: CVIII-350D/40.5");
    expect(v[29]).toContain("Surabaya");
    expect(v[29]).toContain("90 days after PO");
    expect(v[29]).toContain("HM-Q-2026-001");
    expect(v[29]).toContain("IP65");
    expect(v[29]).toContain("Parallel operation");
    expect(v[29]).toContain("MDU on the right");
    expect(v[29]).toContain("Nameplate: Chinese");
    expect(v[31]).toBeUndefined();
  });

  it("writes nameplate/docs languages that exist on the official lists", () => {
    expect(cma7SdtValues({ nameplate_language: "en" })[23]).toBe("English");
    expect(cma7SdtValues({ nameplate_language: "en" })[25]).toBe("English");
    expect(cma7SdtValues({ nameplate_language: "ru" })[23]).toBe("Russian");
    expect(cma7SdtValues({ nameplate_language: "tr" })[23]).toBe("Turkish");
    expect(cma7SdtValues({ nameplate_language: "pt" })[23]).toBe("Portuguese");
    expect(cma7SdtValues({ nameplate_language: "vi" })[23]).toBeUndefined();
    expect(cma7SdtValues({ nameplate_language: "vi" })[29]).toContain("Nameplate: Vietnamese");
  });

  it("skips corrosive none and writes C4-M", () => {
    expect(cma7SdtValues({ corrosive_class: "none" })[22]).toBeUndefined();
    expect(cma7SdtValues({ corrosive_class: "C4-M" })[22]).toBe("C4-M");
  });

  it("does not write a phone number into any SDT", () => {
    const v = cma7SdtValues({
      designer_name: "Li",
      designer_phone_cc: "+86",
      designer_phone: "13800138000",
      buyer: "Trafoindo",
    });
    expect(v[0]).toBe("Li");
    expect(v[3]).toBe("Trafoindo");
    expect(v.filter((x) => x && String(x).includes("138"))).toEqual([]);
    expect(v.filter((x) => x && String(x).includes("+86"))).toEqual([]);
  });

  it("does not invent quantity or designer when those keys are empty", () => {
    const v = cma7SdtValues({ matching_oltc: "CVIII-350D/40.5" });
    expect(v[0]).toBeUndefined();
    expect(v[3]).toBeUndefined();
    expect(v[26]).toBeUndefined();
  });
});

describe("cma7 Word fill", () => {
  it("writes positions and checks w:checked on the official CMA7 Word OS", async () => {
    const filled = await fillDocx(readFileSync(template), cma7SdtValues(px360), cma7CheckValues(px360));
    const zip = await JSZip.loadAsync(filled);
    const xml = await zip.file("word/document.xml")!.async("string");
    const texts = readSdtTexts(xml);
    expect(texts[7]).toBe("1");
    expect(texts[8]).toBe("17A,17B,17C");
    expect(texts[9]).toBe("33");
    expect(texts[11]).toBe("380");
    expect(texts[13]).toBe("2-pole, auto-cut, without signal");
    expect(texts[17]).toBe("10");
    const boxes = readLegacyCheckboxes(xml);
    expect(boxes).toHaveLength(69);
    expect(boxes[0]).toBe(true);
    expect(boxes[21]).toBe(true);
    expect(boxes[31]).toBe(true);
    expect(xml).toContain('w:checked w:val="1"');
  });

  it("writes drawing no, 220-240 V, 2nd/3rd Ω and bottom-plate other", async () => {
    const values = {
      ...px360,
      drawing_no: "HM-CMA7-360",
      motor_voltage: "220_240",
      resistor_ohm_2: "50",
      resistor_ohm_3: "100",
      bottom_plate: "other",
      bottom_plate_other: "3xM25",
      control_voltage: "same",
    };
    const filled = await fillDocx(readFileSync(template), cma7SdtValues(values), cma7CheckValues(values));
    const zip = await JSZip.loadAsync(filled);
    const xml = await zip.file("word/document.xml")!.async("string");
    const texts = readSdtTexts(xml);
    expect(texts[6]).toBe("HM-CMA7-360");
    expect(texts[11]).toBe("220-240");
    expect(texts[12]).toBe("220-240");
    expect(texts[18]).toBe("50");
    expect(texts[19]).toBe("100");
    expect(texts[20]).toBe("3xM25");
    const boxes = readLegacyCheckboxes(xml);
    expect(boxes[58]).toBe(true);
    expect(boxes[55]).toBe(false);
  });

  it("leaves documentation copy count at template 1 and keeps revision empty", async () => {
    const values = { ...px360, quantity: "3", nameplate_language: "en" };
    const filled = await fillDocx(readFileSync(template), cma7SdtValues(values), cma7CheckValues(values));
    const zip = await JSZip.loadAsync(filled);
    const xml = await zip.file("word/document.xml")!.async("string");
    const texts = readSdtTexts(xml);
    expect(texts[1]).toBe("00");
    expect(texts[23]).toBe("English");
    expect(texts[25]).toBe("English");
    expect(texts[26]).toBe("1");
    expect(texts[29]).toContain("Quantity: 3");
  });
});
