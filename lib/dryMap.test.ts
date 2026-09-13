import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import { SHEET_DEFAULTS } from "./defaults";
import { deriveValues } from "./derive";
import { fillDocx, readLegacyCheckboxes, readSdtTexts } from "./fillDocx";
import { DRY_CHECKBOX_COUNT, DRY_SDT_COUNT, dryCheckValues, drySdtValues } from "./dryMap";
import { applyPreset, getPreset } from "./presets";

const template = path.join(process.cwd(), "public/templates/dry-order-sheet.docx");

function bambang() {
  return applyPreset(getPreset("bambang-cz")!);
}

describe("drySdtValues", () => {
  it("maps 3×CZI-500/40.5-17 onto the CZ block, not the CVT block", () => {
    const v = drySdtValues(bambang());
    expect(v).toHaveLength(DRY_SDT_COUNT);
    expect(v[6]).toBe("CZ");
    expect(v[5]).toBe("Bambangdjaja 3×CZI-500");
    expect(v[4]).toBe("Indonesia");
    expect(v[8]).toBe("CMA7");
    expect(v[9]).toBe("Power plant");
    expect(v[12]).toBe("3-phase");
    expect(v[13]).toBe("50Hz");
    expect(v[53]).toBe("3x");
    expect(v[54]).toBe("500");
    expect(v[55]).toBe("40.5");
    expect(v[56]).toBe("17");
    expect(v[57]).toBe("1");
    expect(v[58]).toBeUndefined();
    expect(v[59]).toBe("17");
    expect(v[66]).toBe("English");
    expect(v[68]).toBe("English");
    expect(v[36]).toBeUndefined();
    expect(v[37]).toBeUndefined();
    expect(v[52]).toBeUndefined();
    expect(v[72]).toContain("三相干变");
  });

  it("does not invent buyer / designer / docs quantity when those keys are empty", () => {
    const v = drySdtValues({ family: "CZ", oltc_current_a: "500" });
    expect(v[0]).toBeUndefined();
    expect(v[3]).toBeUndefined();
    expect(v[49]).toBeUndefined();
    expect(v[69]).toBeUndefined();
    expect(v[1]).toBeUndefined();
    const preset = drySdtValues(bambang());
    expect(preset[0]).toBeUndefined();
    expect(preset[3]).toBeUndefined();
    expect(preset[49]).toBeUndefined();
    expect(preset[69]).toBeUndefined();
  });

  it("does not write a phone number into any SDT", () => {
    const v = drySdtValues({
      family: "CZ",
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

  it("writes official application / paint / nameplate strings", () => {
    expect(drySdtValues({ application: "network" })[9]).toBe("Network");
    expect(drySdtValues({ application: "test" })[9]).toBe("Test transformer");
    expect(drySdtValues({ application: "furnace" })[9]).toBe("Furnace");
    expect(drySdtValues({ paint: "RAL7040" })[64]).toBe("RAL 7040");
    expect(drySdtValues({ paint: "ANSI70" })[64]).toBe("ANSI 70");
    expect(drySdtValues({ paint: "other", paint_other: "C5 RAL 9006" })[64]).toBe("C5 RAL 9006");
    expect(drySdtValues({ paint: "other" })[64]).toBeUndefined();
    expect(drySdtValues({ nameplate_language: "ru" })[66]).toBe("Russian");
    expect(drySdtValues({ nameplate_language: "tr" })[66]).toBe("Turkish");
    expect(drySdtValues({ nameplate_language: "zh" })[66]).toBeUndefined();
  });

  it("puts kVA on the Constant box and MV/LV into CZ remarks", () => {
    const v = drySdtValues({
      rated_power_mva: "25",
      hv_kv: "33",
      mv_kv: "11",
      lv_kv: "0.4",
      capacity_mode: "constant",
    });
    expect(v[15]).toBe("25000");
    expect(v[16]).toBeUndefined();
    expect(v[18]).toBe("33");
    expect(v[72]).toContain("MV 11 kV");
    expect(v[72]).toContain("LV 0.4 kV");
    const twoWinding = drySdtValues({ hv_kv: "33", lv_kv: "0.4" });
    expect(twoWinding[72]).toBeUndefined();
  });

  it("writes reversing 17-pos as 1 / 8a8b8c / 15 and linear 9-pos as 1 / 9", () => {
    const rev = drySdtValues({ dry_positions: "17", regulation: "reversing" });
    expect(rev[57]).toBe("1");
    expect(rev[58]).toBe("8a8b8c");
    expect(rev[59]).toBe("15");
    const lin = drySdtValues({ dry_positions: "9", regulation: "linear" });
    expect(lin[57]).toBe("1");
    expect(lin[58]).toBeUndefined();
    expect(lin[59]).toBe("9");
  });

  it("maps 1× CZ columns and insulated shaft a", () => {
    const v = drySdtValues({
      unit_count: "1",
      phases: "I",
      drive_shaft_horizontal_mm: "1200",
    });
    expect(v[12]).toBe("1-phase");
    expect(v[53]).toBe("1x");
    expect(v[60]).toBe("1200");
  });

  it("puts non-1 quantity and delivery into remarks, not documentation copy counts", () => {
    const v = drySdtValues({
      quantity: "2",
      delivery_lead: "90 days after PO",
      notes: "indoor",
    });
    expect(v[49]).toBeUndefined();
    expect(v[69]).toBeUndefined();
    expect(v[72]).toContain("Quantity: 2");
    expect(v[72]).toContain("90 days after PO");
    expect(v[72]).toContain("indoor");
  });

  it("puts notes and non-1 quantity into remarks SDT 72", () => {
    const v = drySdtValues({ quantity: "4", notes: "special packing" });
    expect(v[72]).toContain("Quantity: 4");
    expect(v[72]).toContain("special packing");
    expect(v[49]).toBeUndefined();
    expect(v[69]).toBeUndefined();
    const one = drySdtValues({ quantity: "1", notes: "indoor" });
    expect(one[72]).toBe("indoor");
    expect(one[72]).not.toContain("Quantity");
  });

  it("writes provided insulation PF/BIL onto SDTs 28–35 and skips them on catalog", () => {
    const provided = drySdtValues({
      ins_fill: "provided",
      ins_earth_pf_kv: "90",
      ins_earth_li_kv: "250",
      ins_a_pf_kv: "45",
      ins_a_li_kv: "105",
      ins_a1_pf_kv: "35",
      ins_a1_li_kv: "75",
      ins_b_pf_kv: "90",
      ins_b_li_kv: "250",
    });
    expect(provided[28]).toBe("90");
    expect(provided[29]).toBe("250");
    expect(provided[30]).toBe("45");
    expect(provided[31]).toBe("105");
    expect(provided[32]).toBe("35");
    expect(provided[33]).toBe("75");
    expect(provided[34]).toBe("90");
    expect(provided[35]).toBe("250");
    const catalog = drySdtValues({
      ins_fill: "catalog",
      ins_earth_pf_kv: "90",
      ins_earth_li_kv: "250",
    });
    expect(catalog[28]).toBeUndefined();
    expect(catalog[29]).toBeUndefined();
  });

  it("writes variable Ust max/min onto SDTs 26–27", () => {
    const v = drySdtValues({ ust_mode: "variable", ust_max_v: "1200", ust_min_v: "800", step_voltage_v: "950" });
    expect(v[26]).toBe("1200");
    expect(v[27]).toBe("800");
    expect(v[25]).toBeUndefined();
  });

  it("maps leftover Type / range / current onto remaining transformer SDTs", () => {
    const v = drySdtValues({
      tx_kind: "separated",
      plus_minus: "8",
      step_percent: "1.25",
      through_current_a: "200",
      imax_a: "240",
    });
    expect(v[11]).toBe("Separate winding transformer");
    expect(v[20]).toBe("-8");
    expect(v[21]).toBe("+8");
    expect(v[22]).toBe("1.25");
    expect(v[23]).toBe("200");
    expect(v[24]).toBe("240");
    expect(v[36]).toBeUndefined();
    expect(v[54]).toBeUndefined();
    expect(drySdtValues({ tx_kind: "auto" })[11]).toBe("Auto-transformer");
    expect(drySdtValues({ tx_kind: "booster" })[11]).toBe("Booster transformer");
    expect(drySdtValues({ oltc_current_a: "500" })[23]).toBeUndefined();
    expect(drySdtValues({ oltc_current_a: "500" })[54]).toBe("500");
  });

  it("writes regulating range from tap_range_pct or asymmetric plus/minus", () => {
    const sym = drySdtValues({ tap_range_pct: "±8×1.25%" });
    expect(sym[20]).toBe("-8");
    expect(sym[21]).toBe("+8");
    const asym = drySdtValues({ range_minus: "6", range_plus: "10" });
    expect(asym[20]).toBe("-6");
    expect(asym[21]).toBe("+10");
  });

  it("puts leftover schema keys into remarks, not invented SDTs or CVT", () => {
    const v = drySdtValues({
      transformer_type: "DTTH-25000/33",
      order_no: "HM-Q-2026-001",
      destination_port: "Surabaya",
      standard: "IEEE C57.131",
      overload_mode: "above",
      overload_pct: "150",
      overload_hours: "2",
      controller: "HMC-3C",
      mdu_ip: "IP65",
      nameplate_language: "zh",
      notes: "indoor",
    });
    expect(v[1]).toBeUndefined();
    expect(v[49]).toBeUndefined();
    expect(v[52]).toBeUndefined();
    expect(v[63]).toBeUndefined();
    expect(v[66]).toBeUndefined();
    expect(v[67]).toBeUndefined();
    expect(v[69]).toBeUndefined();
    expect(v[70]).toBeUndefined();
    expect(v[72]).toContain("DTTH-25000/33");
    expect(v[72]).toContain("HM-Q-2026-001");
    expect(v[72]).toContain("Surabaya");
    expect(v[72]).toContain("IEEE C57.131");
    expect(v[72]).toContain("> IEC 60354 150% 2 h");
    expect(v[72]).toContain("HMC-3C");
    expect(v[72]).toContain("IP65");
    expect(v[72]).toContain("Nameplate: Chinese");
    expect(v[72]).toContain("indoor");
    expect(drySdtValues({ standard: "IEC 60214", controller: "none" })[72]).toBeUndefined();
    expect(drySdtValues({ nameplate_language: "vi" })[72]).toContain("Nameplate: Vietnamese");
    expect(drySdtValues({ nameplate_language: "id" })[72]).toContain("Nameplate: Indonesian");
  });
});

describe("dryCheckValues", () => {
  it("ticks −25～50, constant kVA, Y in-neutral, MDU right, supporting frame", () => {
    const c = dryCheckValues(
      deriveValues(SHEET_DEFAULTS.dry, {
        ambient_band: "-25~50",
        rated_power_mva: "10",
        capacity_mode: "constant",
        step_voltage_v: "950",
        oltc_connection: "Y",
        mdu_side: "right",
        dry_mount: "frame",
      }),
    );
    expect(c).toHaveLength(DRY_CHECKBOX_COUNT);
    expect(c[0]).toBe(true);
    expect(c[1]).toBe(false);
    expect(c[5]).toBe(true);
    expect(c[6]).toBe(false);
    expect(c[7]).toBe(true);
    expect(c[9]).toBe(true);
    expect(c[12]).toBe(false);
    expect(c[35]).toBe(true);
    expect(c[36]).toBe(false);
    expect(c[37]).toBe(true);
    expect(c[20]).toBe(false);
    expect(c[31]).toBe(false);
  });

  it("ticks delta line-end and MDU left, and does not tick frame for enclosure", () => {
    const c = dryCheckValues({
      oltc_connection: "D",
      mdu_side: "left",
      dry_mount: "enclosure",
    });
    expect(c[12]).toBe(true);
    expect(c[9]).toBe(false);
    expect(c[36]).toBe(true);
    expect(c[35]).toBe(false);
    expect(c[37]).toBe(false);
  });

  it("ticks catalog vs provided insulation from ins_fill, and leaves altitude and CZ terminals off", () => {
    const catalog = dryCheckValues({ ins_fill: "catalog" });
    expect(catalog[18]).toBe(true);
    expect(catalog[19]).toBe(false);
    expect(catalog[3]).toBe(false);
    expect(catalog[4]).toBe(false);
    expect(catalog[20]).toBe(false);
    expect(catalog[31]).toBe(false);
    expect(catalog[32]).toBe(false);
    expect(catalog[33]).toBe(false);
    expect(catalog[34]).toBe(false);

    const provided = dryCheckValues({ ins_fill: "provided" });
    expect(provided[19]).toBe(true);
    expect(provided[18]).toBe(false);

    const blank = dryCheckValues({ family: "CZ", oltc_current_a: "500" });
    expect(blank[18]).toBe(false);
    expect(blank[19]).toBe(false);
    expect(blank[3]).toBe(false);
    expect(blank[4]).toBe(false);
    expect(blank[31]).toBe(false);
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
      const c = dryCheckValues({ tap_winding: key });
      expect(c[i], key).toBe(true);
      for (const j of Object.values(idx)) {
        if (j !== i) expect(c[j], `${key} must not tick ${j}`).toBe(false);
      }
      expect(c[13]).toBe(false);
    }
  });

  it("ticks variable Ust from ust_mode and does not invent CVT ticks", () => {
    const c = dryCheckValues({
      family: "CZ",
      ust_mode: "variable",
      controller: "HMC-3C",
    });
    expect(c[8]).toBe(true);
    expect(c[7]).toBe(false);
    expect(c[20]).toBe(false);
    expect(c[24]).toBe(false);
    expect(c[27]).toBe(false);
    expect(c[29]).toBe(false);
  });

  it("does not invent altitude or CVT ticks for leftover keys", () => {
    const c = dryCheckValues({
      family: "CZ",
      controller: "HMC-3C",
      tx_kind: "separated",
      overload_mode: "above",
    });
    expect(c[3]).toBe(false);
    expect(c[4]).toBe(false);
    expect(c[13]).toBe(false);
    expect(c[20]).toBe(false);
    expect(c[23]).toBe(false);
    expect(c[31]).toBe(false);
    expect(c[38]).toBe(false);
  });
});

describe("dry Word fill", () => {
  it("writes CZ ratings onto the official dry-order-sheet.docx and leaves contacts blank", async () => {
    const buf = readFileSync(template);
    const blankZip = await JSZip.loadAsync(buf);
    const blankXml = await blankZip.file("word/document.xml")!.async("string");
    const blank = readSdtTexts(blankXml);
    expect(blank).toHaveLength(DRY_SDT_COUNT);
    expect(readLegacyCheckboxes(blankXml)).toHaveLength(DRY_CHECKBOX_COUNT);
    expect(blank[1]).toBe("00");
    expect(blank[6]).toBe("--Choose an item--");

    const values = bambang();
    const filled = await fillDocx(buf, drySdtValues(values), dryCheckValues(values));
    const zip = await JSZip.loadAsync(filled);
    const xml = await zip.file("word/document.xml")!.async("string");
    const texts = readSdtTexts(xml);
    expect(texts[0]).toBe("");
    expect(texts[1]).toBe("00");
    expect(texts[3]).toBe("");
    expect(texts[4]).toBe("Indonesia");
    expect(texts[6]).toBe("CZ");
    expect(texts[8]).toBe("CMA7");
    expect(texts[12]).toBe("3-phase");
    expect(texts[53]).toBe("3x");
    expect(texts[54]).toBe("500");
    expect(texts[55]).toBe("40.5");
    expect(texts[56]).toBe("17");
    expect(texts[49]).toBe("1");
    expect(texts[69]).toBe("1");
    expect(texts[36]).toBe("");
    expect(xml).not.toContain("13800138000");
    const boxes = readLegacyCheckboxes(xml);
    expect(boxes).toHaveLength(DRY_CHECKBOX_COUNT);
  });

  it("ticks provided insulation on the official dry-order-sheet.docx", async () => {
    const buf = readFileSync(template);
    const filled = await fillDocx(
      buf,
      drySdtValues({
        ins_fill: "provided",
        ins_earth_pf_kv: "90",
        ins_earth_li_kv: "250",
      }),
      dryCheckValues({ ins_fill: "provided" }),
    );
    const zip = await JSZip.loadAsync(filled);
    const xml = await zip.file("word/document.xml")!.async("string");
    const texts = readSdtTexts(xml);
    expect(texts[28]).toBe("90");
    expect(texts[29]).toBe("250");
    const boxes = readLegacyCheckboxes(xml);
    expect(boxes[19]).toBe(true);
    expect(boxes[18]).toBe(false);
    expect(boxes[3]).toBe(false);
    expect(boxes[31]).toBe(false);
  });
});
