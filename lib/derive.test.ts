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
});
