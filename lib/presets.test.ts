import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TEMPLATE_FILE } from "./osCells";
import { applyPreset, getPreset, ORDER_PRESETS, PRESET_CONTACT_KEYS } from "./presets";

describe("ORDER_PRESETS", () => {
  it("has five named families from the 2025 inventory", () => {
    expect(ORDER_PRESETS.map((p) => p.family)).toEqual(["CM2", "SHZV", "CV", "CM", "CV2"]);
    expect(ORDER_PRESETS.map((p) => p.id)).toEqual(["cm2", "shzv", "cv", "cm", "cv2"]);
    expect(ORDER_PRESETS.every((p) => p.sheetId === "oltc")).toBe(true);
    expect(ORDER_PRESETS.map((p) => p.values.project)).toEqual([
      "模板-CM2",
      "模板-SHZV",
      "模板-CV",
      "模板-CM",
      "模板-CV2",
    ]);
  });

  it("prefills typical ratings and delivery lead time, not contact cards", () => {
    const cm2 = applyPreset(ORDER_PRESETS[0]);
    expect(cm2.family).toBe("CM2");
    expect(cm2.oltc_current_a).toBe("500");
    expect(cm2.oltc_um_kv).toBe("72.5");
    expect(cm2.oltc_connection).toBe("Y");
    expect(cm2.oltc_selector_grade).toBe("B");
    expect(cm2.delivery_date).toBe("90 days after PO");
    expect(cm2.tap_code).toBe("10193W");
    expect(cm2.country).toBe("China");

    const shzv = applyPreset(ORDER_PRESETS[1]);
    expect(shzv.family).toBe("SHZV");
    expect(shzv.oltc_current_a).toBe("600");
    expect(shzv.oltc_um_kv).toBe("252");
    expect(shzv.oltc_selector_grade).toBe("D");
    expect(shzv.mdu_model).toBe("SHM-D");

    const cv = applyPreset(ORDER_PRESETS[2]);
    expect(cv.family).toBe("CV");
    expect(cv.oltc_current_a).toBe("350");
    expect(cv.oltc_selector_grade).toBe("");

    const cm = applyPreset(ORDER_PRESETS[3]);
    expect(cm.family).toBe("CM");
    expect(cm.oltc_um_kv).toBe("126");
    expect(cm.oltc_selector_grade).toBe("C");

    const cv2 = applyPreset(ORDER_PRESETS[4]);
    expect(cv2.family).toBe("CV2");
    expect(cv2.oltc_current_a).toBe("350");
    expect(cv2.oltc_um_kv).toBe("72.5");
    expect(getPreset("VCV")?.family).toBe("CV2");
  });

  it("omits buyer/designer contact fields from every preset", () => {
    for (const preset of ORDER_PRESETS) {
      for (const key of PRESET_CONTACT_KEYS) {
        expect(preset.values[key], `${preset.id}.${key}`).toBeUndefined();
      }
      const applied = applyPreset(preset);
      for (const key of PRESET_CONTACT_KEYS) {
        expect(applied[key], `applied ${preset.id}.${key}`).toBeUndefined();
      }
    }
  });
});

describe("official Excel templates on disk", () => {
  it("matches TEMPLATE_FILE names committed on main", () => {
    for (const file of Object.values(TEMPLATE_FILE)) {
      expect(existsSync(path.join(process.cwd(), "public/templates", file)), file).toBe(true);
    }
  });
});
