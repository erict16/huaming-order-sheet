import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SHEET_DEFAULTS } from "./defaults";
import { deriveValues } from "./derive";
import { countFormPlaceholders, fillFormTextDocx, readDocumentXml } from "./fillFormText";
import { OCTC_FORMCHECKBOX_COUNT, OCTC_FORMTEXT_COUNT, octcFormValues } from "./octcMap";
import { applyPreset, getPreset } from "./presets";
import { typeFromValues } from "./typeString";

const template = path.join(process.cwd(), "public/templates/octc-order-spec.docx");

function meeWsl() {
  return applyPreset(getPreset("mee-wsl")!);
}

describe("octcFormValues", () => {
  it("maps MEE EVN NPC WSLII-600D/72.5-6x5A (3-ph, D, 600 A, 72.5 kV, 6×5A, handwheel)", () => {
    const v = meeWsl();
    expect(typeFromValues("octc", v).compact).toBe("WSLII-600D/72.5-6x5A");
    expect(v.family).toBe("WSL");
    expect(v.octc_series).toBe("II");
    expect(v.current_a).toBe("600");
    expect(v.connection).toBe("D");
    expect(v.um_kv).toBe("72.5");
    expect(v.octc_contact).toBe("6x5");
    expect(v.octc_size).toBe("A");
    expect(v.octc_drive).toBe("handwheel");
    expect(v.buyer).toBe("");
    expect(v.designer_name).toBe("");

    const { texts, checks } = octcFormValues(v);
    expect(texts).toHaveLength(OCTC_FORMTEXT_COUNT);
    expect(checks).toHaveLength(OCTC_FORMCHECKBOX_COUNT);
    expect(texts[0]).toBeUndefined();
    expect(texts[1]).toBeUndefined();
    expect(texts[2]).toBeUndefined();
    expect(texts[4]).toBeUndefined();
    expect(texts[5]).toBe("EVN NPC");
    expect(texts[6]).toBe("Vietnam");
    expect(texts[10]).toBe("1");
    expect(texts[18]).toBe("40");
    expect(texts[21]).toBe("38.5");
    expect(texts[41]).toBe("WSL");
    expect(texts[42]).toBe("3");
    expect(texts[43]).toBe("II");
    expect(texts[44]).toBe("600");
    expect(texts[45]).toBe("D");
    expect(texts[46]).toBe("72.5");
    expect(texts[47]).toBe("6x5A");
    expect(texts[48]).toBeUndefined();
    expect(texts[49]).toBe("1");
    expect(texts[50]).toBe("3");
    expect(texts[51]).toBe("5");
    expect(texts[33]).toBeUndefined();
    expect(texts[34]).toBeUndefined();
    expect(checks[0]).toBe(true);
    expect(checks[9]).toBe(true);
    expect(checks[12]).toBe(true);
    expect(checks[20]).toBe(true);
    expect(checks[24]).toBe(false);
    expect(checks[25]).toBe(true);
    expect(checks[40]).toBe(true);
    expect(checks[41]).toBe(false);
    expect(checks[46]).toBe(true);
    expect(checks[47]).toBe(false);
    expect(checks[51]).toBe(true);
    expect(checks[64]).toBe(false);
    expect(texts[63]).toContain("钟罩");
  });

  it("maps Network onto the Power checkbox", () => {
    const { checks } = octcFormValues({ ...meeWsl(), application: "network" });
    expect(checks[0]).toBe(true);
    expect(checks[1]).toBe(false);
    expect(checks[5]).toBe(false);
  });

  it("fills designer T00–T02 when values are present", () => {
    const { texts } = octcFormValues({
      ...meeWsl(),
      designer_name: "Li",
      designer_phone_cc: "+86",
      designer_phone: "13800138000",
      designer_email: "li@huaming.com",
    });
    expect(texts[0]).toBe("Li");
    expect(texts[1]).toBe("+86 13800138000");
    expect(texts[2]).toBe("li@huaming.com");
  });

  it("ticks WSL/WDL handwheel, notes CMA7 on cage, ticks CMA7 on drum", () => {
    const cma7Cage = octcFormValues(
      deriveValues(SHEET_DEFAULTS.octc, {
        family: "WSL",
        octc_series: "II",
        current_a: "600",
        connection: "D",
        um_kv: "72.5",
        octc_positions: "5",
        octc_contact: "6x5",
        octc_size: "A",
        octc_drive: "CMA7",
      }),
    );
    expect(cma7Cage.checks[51]).toBe(false);
    expect(cma7Cage.checks[55]).toBe(false);
    expect(cma7Cage.checks[64]).toBe(false);
    expect(cma7Cage.texts[63]).toMatch(/CMA7/);

    const cma7Drum = octcFormValues(
      deriveValues(SHEET_DEFAULTS.octc, {
        family: "WSG",
        octc_series: "II",
        current_a: "600",
        connection: "D",
        um_kv: "40.5",
        octc_drive: "CMA7",
      }),
    );
    expect(cma7Drum.checks[51]).toBe(false);
    expect(cma7Drum.checks[58]).toBe(false);
    expect(cma7Drum.checks[64]).toBe(true);
    expect(cma7Drum.checks[45]).toBe(true);
  });

  it("does not tick HMC-3W or CMA9 from wizard HMC-3C / CMA7; controller goes to remarks", () => {
    const cage = octcFormValues({
      ...meeWsl(),
      octc_drive: "CMA7",
      controller: "HMC-3C",
    });
    expect(cage.checks[51]).toBe(false);
    expect(cage.checks[52]).toBe(false);
    expect(cage.checks[55]).toBe(false);
    expect(cage.checks[56]).toBe(false);
    expect(cage.checks[64]).toBe(false);
    expect(cage.checks[65]).toBe(false);
    expect(cage.texts[63]).toMatch(/CMA7/);
    expect(cage.texts[63]).toContain("HMC-3C");

    const drum = octcFormValues(
      deriveValues(SHEET_DEFAULTS.octc, {
        family: "WSG",
        octc_series: "II",
        current_a: "600",
        connection: "D",
        um_kv: "40.5",
        octc_drive: "CMA7",
        controller: "ET-SZ6",
      }),
    );
    expect(drum.checks[64]).toBe(true);
    expect(drum.checks[65]).toBe(false);
    expect(drum.texts[63]).toContain("ET-SZ6");
  });

  it("ticks HMC-3W next to handwheel only when controller is HMC-3W", () => {
    const { checks } = octcFormValues({ ...meeWsl(), controller: "HMC-3W" });
    expect(checks[51]).toBe(true);
    expect(checks[52]).toBe(true);
    expect(checks[55]).toBe(false);
    expect(checks[59]).toBe(false);
    expect(checks[65]).toBe(false);
  });

  it("ticks C66 when rain_cover is yes", () => {
    const on = octcFormValues({ ...meeWsl(), rain_cover: "yes" });
    expect(on.checks[66]).toBe(true);
    expect(octcFormValues(meeWsl()).checks[66]).toBe(false);
    expect(octcFormValues({ ...meeWsl(), rain_cover: "no" }).checks[66]).toBe(false);
  });

  it("writes OLTC ambient_band onto Others, not the Word −25~+40 box", () => {
    const { texts, checks } = octcFormValues({ ...meeWsl(), ambient_band: "-25~50" });
    expect(checks[15]).toBe(false);
    expect(checks[16]).toBe(false);
    expect(checks[17]).toBe(true);
    expect(texts[15]).toBe("-25~+50");
  });

  it("ticks Word −40~+40 when other ambient min/max are 40 / 40", () => {
    const { texts, checks } = octcFormValues({
      ...meeWsl(),
      ambient_band: "other",
      ambient_min: "40",
      ambient_max: "40",
    });
    expect(checks[16]).toBe(true);
    expect(checks[15]).toBe(false);
    expect(checks[17]).toBe(false);
    expect(texts[15]).toBeUndefined();
  });

  it("puts MV/LV into remarks when MV is filled, and phases II onto Others", () => {
    const { texts, checks } = octcFormValues({
      ...meeWsl(),
      mv_kv: "20",
      lv_kv: "10",
      phases: "II",
    });
    expect(texts[63]).toContain("MV 20 kV");
    expect(texts[63]).toContain("LV 10 kV");
    expect(texts[63]).toContain("钟罩");
    expect(checks[9]).toBe(false);
    expect(checks[11]).toBe(true);
    expect(texts[13]).toBe("2");
    expect(texts[42]).toBe("2");
  });
});

describe("OCTC Word fill", () => {
  it("counts 64 FORMTEXT and 69 FORMCHECKBOX on the committed 2011 template", async () => {
    const xml = await readDocumentXml(readFileSync(template));
    expect(countFormPlaceholders(xml)).toEqual({ formtext: 64, formcheckbox: 69 });
    expect(xml).not.toContain("w:sdt");
  });

  it("writes the 6x5A designation into the official form", async () => {
    const filled = await fillFormTextDocx(readFileSync(template), octcFormValues(meeWsl()));
    const xml = await readDocumentXml(filled);
    expect(xml).toContain("6x5A");
    expect(xml).toContain("EVN NPC");
    expect(xml).toContain("72.5");
    expect(xml).toContain("Vietnam");
    expect(xml).toContain("☒");
    const left = countFormPlaceholders(xml);
    expect(left.formtext).toBeLessThan(64);
    expect(left.formcheckbox).toBeLessThan(69);
  });
});
