import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TEMPLATE_FILE } from "./osCells";
import {
  applyPreset,
  getPreset,
  hydrateSheetValues,
  ORDER_PRESETS,
  PRESET_CONTACT_KEYS,
} from "./presets";
import { typeFromValues } from "./typeString";

const ALLOWED_SHEETS = ["oltc", "octc", "dry", "cma7"] as const;

function compactOf(id: string): string {
  const preset = ORDER_PRESETS.find((p) => p.id === id);
  expect(preset, id).toBeTruthy();
  return typeFromValues(preset!.sheetId, applyPreset(preset!)).compact;
}

describe("ORDER_PRESETS", () => {
  it("starts from real OneDrive OS orders, not textbook 模板", () => {
    expect(ORDER_PRESETS.map((p) => p.id)).toEqual([
      "mee-tienyen-cv2",
      "hlg-havec-cv",
      "ue-hwv",
      "mee-wsl",
      "bambang-cz",
      "tirathai-cv",
      "bambang-px360",
      "trafoindo-salak-cv2",
    ]);
    expect(ORDER_PRESETS.map((p) => p.family)).toEqual([
      "CV2",
      "CV",
      "HWV",
      "WSL",
      "CZ",
      "CV",
      "CMA7",
      "CV2",
    ]);
    expect(ORDER_PRESETS.map((p) => p.sheetId)).toEqual([
      "oltc",
      "oltc",
      "oltc",
      "octc",
      "dry",
      "oltc",
      "cma7",
      "oltc",
    ]);
    expect(ORDER_PRESETS.every((p) => (ALLOWED_SHEETS as readonly string[]).includes(p.sheetId))).toBe(
      true,
    );
    expect(ORDER_PRESETS.some((p) => (p.sheetId as string) === "hwv")).toBe(false);
    for (const preset of ORDER_PRESETS) {
      expect(preset.title.zh, preset.id).not.toMatch(/模板/);
      expect(preset.values.project, preset.id).not.toMatch(/模板/);
    }
  });

  it("composes the compact type string from schema-accepted fields", () => {
    expect(compactOf("mee-tienyen-cv2")).toBe("CV2III-350Y/72.5-10191W");
    expect(compactOf("hlg-havec-cv")).toBe("CVIII-350D/40.5-14271W");
    expect(compactOf("ue-hwv")).toBe("HWVIII-400Y/72.5-10193W");
    expect(compactOf("mee-wsl")).toBe("WSLII-600D/72.5-6x5A");
    expect(compactOf("bambang-cz")).toBe("3×CZI-500/40.5-17");
    expect(compactOf("tirathai-cv")).toBe("CVIII-350D/40.5-12233G");
    expect(compactOf("bambang-px360")).toBe("CMA7");
    expect(compactOf("trafoindo-salak-cv2")).toBe("CV2III-350D/40.5-10193W");
  });

  it("keeps CV 300 A on catalog CV-350 and HWV on the oltc sheet", () => {
    const havec = applyPreset(getPreset("hlg-havec-cv")!);
    expect(havec.family).toBe("CV");
    expect(havec.oltc_current_a).toBe("350");
    expect(havec.through_current_a).toBe("300");
    expect(havec.notes).toMatch(/300 A/);

    const hwv = applyPreset(getPreset("ue-hwv")!);
    expect(hwv.family).toBe("HWV");
    expect(getPreset("ue-hwv")?.sheetId).toBe("oltc");
    expect(hwv.oltc_current_a).toBe("400");
    expect(hwv.tap_code).toBe("10193W");

    expect(getPreset("VCV")?.family).toBe("CV2");
    expect(getPreset("CV2")?.id).toBe("mee-tienyen-cv2");
  });

  it("omits buyer/designer contact fields from every preset", () => {
    for (const preset of ORDER_PRESETS) {
      for (const key of PRESET_CONTACT_KEYS) {
        expect(preset.values[key], `${preset.id}.${key}`).toBeUndefined();
      }
      const applied = applyPreset(preset);
      for (const key of PRESET_CONTACT_KEYS) {
        expect(applied[key], `applied ${preset.id}.${key}`).toBe("");
      }
      const blob = JSON.stringify(preset.values);
      expect(blob, preset.id).not.toMatch(/@/);
      expect(blob, preset.id).not.toMatch(/AUD|USD|\$|unit price|报价/i);
    }
  });

  it("hydrates ?preset= over stored drafts and still omits contact fields", () => {
    const next = hydrateSheetValues(
      "oltc",
      "?preset=mee-tienyen-cv2",
      { designer_phone_cc: "+86", designer_phone: "13800138000", buyer: "Old" },
    );
    expect(next.project).toBe("EVN Tiên Yên");
    expect(next.country).toBe("Vietnam");
    expect(next.family).toBe("CV2");
    expect(next.oltc_current_a).toBe("350");
    expect(next.tap_code).toBe("10191W");
    expect(next.designer_phone_cc).toBe("");
    expect(next.designer_phone).toBe("");
    expect(next.buyer).toBe("");
  });
});

describe("official Excel templates on disk", () => {
  it("matches TEMPLATE_FILE names committed on main", () => {
    for (const file of Object.values(TEMPLATE_FILE)) {
      expect(existsSync(path.join(process.cwd(), "public/templates", file)), file).toBe(true);
    }
  });
});
