import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import { fillDocx, readLegacyCheckboxes, readSdtTexts } from "./fillDocx";
import { cma7CheckValues, cma7SdtValues, CMA7_CHECKBOX_COUNT } from "./cma7Map";

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
    expect(texts[13]).toBe("2-pole auto-cut");
    expect(texts[17]).toBe("10");
    const boxes = readLegacyCheckboxes(xml);
    expect(boxes).toHaveLength(69);
    expect(boxes[0]).toBe(true);
    expect(boxes[21]).toBe(true);
    expect(boxes[31]).toBe(true);
    expect(xml).toContain('w:checked w:val="1"');
  });
});
