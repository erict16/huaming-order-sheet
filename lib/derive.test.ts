import { describe, expect, it } from "vitest";
import { deriveValues } from "./derive";

describe("deriveValues", () => {
  it("clears current when family cannot cover it", () => {
    const shzv = deriveValues({}, { family: "SHZV", phases: "III", oltc_current_a: "1000", oltc_um_kv: "170" });
    expect(shzv.oltc_current_a).toBe("1000");
    const cv2 = deriveValues(shzv, { family: "CV2" });
    expect(cv2.oltc_current_a).toBe("");
    expect(cv2.oltc_selector_grade).toBe("");
  });

  it("bumps selector grade when Um rises", () => {
    const low = deriveValues({}, { family: "CM2", phases: "III", oltc_um_kv: "72.5" });
    expect(low.oltc_selector_grade).toBe("B");
    const high = deriveValues(low, { oltc_um_kv: "170" });
    expect(high.oltc_selector_grade).toBe("D");
  });

  it("keeps a stronger grade when Um still allows it", () => {
    const de = deriveValues({}, { family: "CM2", oltc_um_kv: "72.5", oltc_selector_grade: "DE" });
    expect(de.oltc_selector_grade).toBe("DE");
    const still = deriveValues(de, { oltc_um_kv: "126" });
    expect(still.oltc_selector_grade).toBe("DE");
  });

  it("migrates a stored ISO 要货期 into the custom calendar preset", () => {
    const v = deriveValues({}, { delivery_date: "2026-09-01" });
    expect(v.delivery_date).toBe("custom");
    expect(v.delivery_date_custom).toBe("2026-09-01");
  });

  it("switches HWDK onto SHM-X and strips HWV selector grade", () => {
    const hwdk = deriveValues({ mdu_model: "CMA7" }, { family: "HWDK" });
    expect(hwdk.mdu_model).toBe("SHM-X");
    const hwv = deriveValues({ mdu_model: "SHM-X", oltc_selector_grade: "B" }, { family: "HWV", oltc_um_kv: "72.5" });
    expect(hwv.mdu_model).toBe("CMA7");
    expect(hwv.oltc_selector_grade).toBe("");
  });

  it("fills 10193W positions 1 / 9a9b9c / 17", () => {
    const v = deriveValues(
      {},
      { family: "CM2", regulation: "reversing", plus_minus: "8", oltc_tap_mid: "3" },
    );
    expect(v.tap_code).toBe("10193W");
    expect(v.oltc_tap_positions).toBe("19");
    expect(v.pos_max).toBe("1");
    expect(v.pos_mid).toBe("9a9b9c");
    expect(v.pos_min).toBe("17");
    expect(v.raise_direction).toBeUndefined();
  });

  it("derives tap_range_pct from range_plus / range_minus without breaking 10193W", () => {
    const base = deriveValues(
      {},
      { family: "CM2", regulation: "reversing", plus_minus: "8", oltc_tap_mid: "3" },
    );
    expect(base.tap_code).toBe("10193W");
    const asym = deriveValues(base, { range_minus: "20", range_plus: "6" });
    expect(asym.tap_range_pct).toBe("−20/+6%");
    expect(asym.range_shape).toBe("asymmetric");
    expect(asym.tap_code).toBe("10193W");
    expect(asym.plus_minus).toBe("8");
    const sym = deriveValues(base, { range_minus: "16", range_plus: "16" });
    expect(sym.tap_range_pct).toBe("±16%");
    expect(sym.tap_code).toBe("10193W");
  });

  it("composes ±N × % per step when the range is symmetric", () => {
    const v = deriveValues(
      { range_shape: "symmetric", plus_minus: "9" },
      { step_percent: "1.78" },
    );
    expect(v.tap_range_pct).toBe("±9×1.78%");
  });
});
