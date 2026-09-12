import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SHEET_DEFAULTS } from "./defaults";
import { deriveValues } from "./derive";
import { countFormPlaceholders, fillFormTextDocx, readDocumentXml } from "./fillFormText";
import { HWV_FORMCHECKBOX_COUNT, HWV_FORMTEXT_COUNT, hwvFormValues } from "./hwvMap";
import { typeFromValues } from "./typeString";

const template = path.join(process.cwd(), "public/templates/hwv-hwdk-order-spec.docx");

function hwviii400() {
  return deriveValues(SHEET_DEFAULTS.hwv, {
    family: "HWV",
    phases: "III",
    buyer: "United Energy",
    country: "Australia",
    oltc_current_a: "400",
    oltc_um_kv: "72.5",
    oltc_connection: "Y",
    regulation: "reversing",
    plus_minus: "8",
    oltc_tap_mid: "3",
    mdu_model: "CMA7",
    oltc_selector_grade: "B",
  });
}

describe("hwvFormValues", () => {
  it("maps HWVIII-400Y/72.5-10193W (400 A, 72.5 kV, Y, reversing ±8, CMA7)", () => {
    const v = hwviii400();
    expect(typeFromValues("hwv", v).compact).toBe("HWVIII-400Y/72.5-10193W");
    expect(v.oltc_selector_grade).toBe("");
    expect(v.tap_code).toBe("10193W");
    expect(v.oltc_tap_positions).toBe("19");

    const { texts, checks } = hwvFormValues(v);
    expect(texts).toHaveLength(HWV_FORMTEXT_COUNT);
    expect(checks).toHaveLength(HWV_FORMCHECKBOX_COUNT);
    expect(texts[0]).toBe("United Energy");
    expect(texts[1]).toBe("Australia");
    expect(texts[20]).toBe("8");
    expect(texts[30]).toBe("HWV");
    expect(texts[31]).toBe("III");
    expect(texts[32]).toBe("400");
    expect(texts[33]).toBe("Y");
    expect(texts[34]).toBe("72.5");
    expect(texts[35]).toBe("10193W");
    expect(texts[36]).toBe("1");
    expect(texts[37]).toBe("9a9b9c");
    expect(texts[38]).toBe("17");
    expect(texts[39]).toBe("140");
    expect(texts[40]).toBe("350");
    expect(checks[0]).toBe(true);
    expect(checks[1]).toBe(false);
    expect(checks[2]).toBe(false);
    expect(checks[4]).toBe(true);
    expect(checks[5]).toBe(false);
    expect(checks[18]).toBe(true);
    expect(checks[21]).toBe(true);
    expect(checks[31]).toBe(true);
    expect(checks[42]).toBe(true);
    expect(checks[45]).toBe(true);
    expect(checks[62]).toBe(true);
    expect(checks[64]).toBe(true);
  });

  it("ticks HWDKIII + SHM-X and writes circulating current only for HWDK", () => {
    const v = deriveValues(SHEET_DEFAULTS.hwv, {
      family: "HWDK",
      phases: "III",
      oltc_current_a: "400",
      oltc_um_kv: "72.5",
      oltc_connection: "Y",
      circulating_a: "80",
      hwdk_basic: "17",
    });
    expect(v.mdu_model).toBe("SHM-X");
    expect(typeFromValues("hwv", v).compact).toContain("HWDKIII-400Y/72.5");
    const { texts, checks } = hwvFormValues(v);
    expect(checks[2]).toBe(true);
    expect(checks[0]).toBe(false);
    expect(checks[4]).toBe(false);
    expect(texts[25]).toBe("80");
    expect(texts[30]).toBe("HWDK");
    expect(checks[49]).toBe(true);
    expect(hwvFormValues(hwviii400()).texts[25]).toBeUndefined();
  });

  it("ticks Generator / Auto and writes I / Imax", () => {
    const v = deriveValues(SHEET_DEFAULTS.hwv, {
      family: "HWV",
      application: "generator",
      tx_kind: "auto",
      through_current_a: "125.5",
      imax_a: "149.4",
    });
    const { texts, checks } = hwvFormValues(v);
    expect(checks[13]).toBe(true);
    expect(checks[9]).toBe(false);
    expect(checks[16]).toBe(true);
    expect(checks[15]).toBe(false);
    expect(texts[23]).toBe("125.5");
    expect(texts[24]).toBe("149.4");
  });

  it("writes delivery date or lead time onto T02 via resolveDeliveryDate", () => {
    const { texts } = hwvFormValues(
      deriveValues(SHEET_DEFAULTS.hwv, {
        family: "HWV",
        delivery_date: "90 days after PO",
        destination_port: "Hai Phong",
      }),
    );
    expect(texts[2]).toBe("90 days after PO / Hai Phong");
    const cal = hwvFormValues({
      ...hwviii400(),
      delivery_date: "2026-06-15",
      destination_port: "Melbourne",
    });
    expect(cal.texts[2]).toBe("2026-06-15 / Melbourne");
    const lead = hwvFormValues({ ...hwviii400(), delivery_lead: "90 days after PO" });
    expect(lead.texts[2]).toBe("90 days after PO");
    expect(hwvFormValues({ delivery_date: "custom", delivery_date_custom: "2026-12-01" }).texts[2]).toBe(
      "2026-12-01",
    );
  });

  it("leaves transformer user / purchaser empty when the preset has no buyer", () => {
    const { texts } = hwvFormValues({ family: "HWV", phases: "III" });
    expect(texts[0]).toBeUndefined();
    expect(texts[5]).toBeUndefined();
  });

  it("maps Network onto the Power checkbox", () => {
    const v = deriveValues(SHEET_DEFAULTS.hwv, { family: "HWV", application: "network" });
    const { checks } = hwvFormValues(v);
    expect(checks[9]).toBe(true);
    expect(checks[13]).toBe(false);
    expect(checks[14]).toBe(false);
  });

  it("ticks HWVI, SHM-D, ET-SZ6 and remaining transformer boxes", () => {
    const v = deriveValues(SHEET_DEFAULTS.hwv, {
      family: "HWV",
      phases: "I",
      mdu_model: "SHM-D",
      controller: "ET-SZ6",
      application: "test",
      flux: "vfvv",
      overload_mode: "above",
      overload_pct: "20",
      overload_hours: "2",
      capacity_mode: "decreasing",
      rated_power_mva: "25",
      capacity_from_pos: "9",
      ust_mode: "variable",
      ust_max: "1500",
      ust_min: "800",
      recovery_voltage_kv: "12",
      potential_connection: "with",
      oltc_mounting: "bolts",
    });
    const { texts, checks } = hwvFormValues(v);
    expect(checks[1]).toBe(true);
    expect(checks[0]).toBe(false);
    expect(checks[5]).toBe(true);
    expect(checks[4]).toBe(false);
    expect(checks[7]).toBe(true);
    expect(checks[6]).toBe(false);
    expect(checks[14]).toBe(true);
    expect(texts[7]).toBe("Test transformer");
    expect(checks[32]).toBe(true);
    expect(checks[31]).toBe(false);
    expect(checks[30]).toBe(true);
    expect(texts[14]).toBe("20");
    expect(texts[15]).toBe("2");
    expect(checks[28]).toBe(true);
    expect(texts[12]).toBe("25");
    expect(texts[13]).toBe("9");
    expect(checks[43]).toBe(true);
    expect(texts[27]).toBe("1500");
    expect(texts[28]).toBe("800");
    expect(checks[44]).toBe(true);
    expect(texts[29]).toBe("12");
    expect(checks[46]).toBe(true);
    expect(checks[45]).toBe(false);
    expect(checks[67]).toBe(true);
    expect(checks[66]).toBe(false);
  });

  it("ticks HWDKI, SHM-K, QJ6, two C/O PRV, and paint/nameplate others", () => {
    const v = deriveValues(SHEET_DEFAULTS.hwv, {
      family: "HWDK",
      phases: "I",
      controller: "SHM-K",
      hwdk_basic: "33_reversing",
      protective_relay: "qj6",
      pressure_relief: "prv_two",
      paint: "RAL7035",
      nameplate_language: "zh",
    });
    const { texts, checks } = hwvFormValues(v);
    expect(checks[3]).toBe(true);
    expect(checks[2]).toBe(false);
    expect(checks[8]).toBe(true);
    expect(checks[51]).toBe(true);
    expect(checks[52]).toBe(true);
    expect(checks[55]).toBe(true);
    expect(checks[61]).toBe(true);
    expect(checks[63]).toBe(true);
    expect(checks[62]).toBe(false);
    expect(texts[48]).toBe("RAL 7035");
    expect(checks[65]).toBe(true);
    expect(checks[64]).toBe(false);
    expect(texts[49]).toBe("Chinese");
  });

  it("writes ambient others from min/max when the radio is other", () => {
    const { texts, checks } = hwvFormValues({
      ...hwviii400(),
      ambient_temp: "other",
      ambient_min: "45",
      ambient_max: "50",
    });
    expect(checks[26]).toBe(true);
    expect(checks[24]).toBe(false);
    expect(texts[10]).toBe("-45~+50");
  });

  it("ticks Word −25~+40 when other min/max are 25 / 40", () => {
    const { checks, texts } = hwvFormValues({
      ...hwviii400(),
      ambient_temp: "other",
      ambient_min: "25",
      ambient_max: "40",
    });
    expect(checks[24]).toBe(true);
    expect(checks[26]).toBe(false);
    expect(texts[10]).toBeUndefined();
  });

  it("puts leftover schema keys into remarks, not invented boxes", () => {
    const { texts, checks } = hwvFormValues({
      ...hwviii400(),
      project: "United Energy Wilson retrofit",
      corrosive_class: "C4-M",
      notes: "indoor",
    });
    expect(texts[50]).toContain("United Energy Wilson retrofit");
    expect(texts[50]).toContain("C4-M");
    expect(texts[50]).toContain("indoor");
    expect(checks[6]).toBe(false);
    expect(checks[7]).toBe(false);
    expect(checks[8]).toBe(false);
    expect(hwvFormValues({ ...hwviii400(), corrosive_class: "none" }).texts[50]).toBeUndefined();
  });

  it("does not invent HMC-3W; leftover controller goes to remarks", () => {
    const { texts, checks } = hwvFormValues({ ...hwviii400(), controller: "HMC-3W" });
    expect(checks[6]).toBe(false);
    expect(checks[7]).toBe(false);
    expect(checks[8]).toBe(false);
    expect(texts[50]).toBe("HMC-3W");
    const ticked = hwvFormValues({ ...hwviii400(), controller: "HMC-3C" });
    expect(ticked.checks[6]).toBe(true);
    expect(ticked.texts[50]).toBeUndefined();
  });

  it("does not write designer contact into transformer user or remarks", () => {
    const { texts } = hwvFormValues({
      family: "HWV",
      phases: "III",
      designer_name: "Li",
      designer_phone_cc: "+86",
      designer_phone: "13800138000",
    });
    expect(texts[0]).toBeUndefined();
    expect(texts[50]).toBeUndefined();
    expect(texts.filter((x) => x && String(x).includes("138"))).toEqual([]);
    expect(texts.filter((x) => x && String(x).includes("Li"))).toEqual([]);
  });

  it("writes SHM-X on HWV into remarks because the form has no SHM-X box", () => {
    const { texts, checks } = hwvFormValues({ ...hwviii400(), mdu_model: "SHM-X" });
    expect(checks[4]).toBe(false);
    expect(checks[5]).toBe(false);
    expect(texts[50]).toBe("SHM-X");
  });
});

describe("HWV Word fill", () => {
  it("writes the 10193W designation into the official form", async () => {
    const filled = await fillFormTextDocx(readFileSync(template), hwvFormValues(hwviii400()));
    const xml = await readDocumentXml(filled);
    expect(xml).toContain("10193W");
    expect(xml).toContain("United Energy");
    expect(xml).toContain("72.5");
    expect(xml).toContain("☒");
    const left = countFormPlaceholders(xml);
    expect(left.formtext).toBeLessThan(51);
    expect(left.formcheckbox).toBeLessThan(68);
  });
});
