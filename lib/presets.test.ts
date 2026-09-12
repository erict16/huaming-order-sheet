import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SHEET_DEFAULTS } from "./defaults";
import { TEMPLATE_FILE } from "./osCells";
import {
  applyPreset,
  getPreset,
  hydrateSheetValues,
  ORDER_PRESETS,
  pendingPresetKey,
  PRESET_CONTACT_KEYS,
} from "./presets";
import { typeFromValues } from "./typeString";
import { WORD_TEMPLATE } from "./wordMap";

const ALLOWED_SHEETS = ["oltc", "octc", "dry", "cma7", "shm-d", "hwv"] as const;

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
      "hwv",
      "octc",
      "dry",
      "oltc",
      "cma7",
      "oltc",
    ]);
    expect(ORDER_PRESETS.every((p) => (ALLOWED_SHEETS as readonly string[]).includes(p.sheetId))).toBe(
      true,
    );
    expect(ORDER_PRESETS.some((p) => p.sheetId === "hwv")).toBe(true);
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

  it("keeps CV 300 A on catalog CV-350 and HWV on the hwv sheet", () => {
    const havec = applyPreset(getPreset("hlg-havec-cv")!);
    expect(havec.family).toBe("CV");
    expect(havec.oltc_current_a).toBe("350");
    expect(havec.through_current_a).toBe("300");
    expect(havec.imax_a).toBe("300");
    expect(havec.application).toBe("network");
    expect(havec.tx_kind).toBe("auto");
    expect(havec.range_minus).toBe("20");
    expect(havec.range_plus).toBe("6");
    expect(havec.tap_range_pct).toBe("−20/+6%");
    expect(havec.vector_group).toBe("YNa0");
    expect(havec.paint).toBe("RAL7033");
    expect(havec.notes).toMatch(/300 A/);

    const hwv = applyPreset(getPreset("ue-hwv")!);
    expect(hwv.family).toBe("HWV");
    expect(getPreset("ue-hwv")?.sheetId).toBe("hwv");
    expect(hwv.oltc_current_a).toBe("400");
    expect(hwv.tap_code).toBe("10193W");

    expect(getPreset("VCV")?.family).toBe("CV2");
    expect(getPreset("CV2")?.id).toBe("mee-tienyen-cv2");
    expect(hydrateSheetValues("oltc", "?preset=mee-wsl", {}).family).not.toBe("WSL");
    expect(hydrateSheetValues("octc", "?preset=mee-wsl", {}).family).toBe("WSL");

    const tien = applyPreset(getPreset("mee-tienyen-cv2")!);
    expect(tien.application).toBe("network");
    expect(tien.tx_kind).toBe("separated");
    expect(tien.vector_group).toBe("YNd11yn12");
    expect(tien.imax_a).toBe("239.07");
    expect(tien.paint).toBe("RAL7033");
    expect(tien.corrosive_class).toBe("C4-H");

    const tira = applyPreset(getPreset("tirathai-cv")!);
    expect(tira.application).toBe("test");
    expect(tira.tx_kind).toBe("separated");
  });

  it("omits buyer/designer contact fields from every preset", () => {
    const blankAfterApply = [
      "designer_name",
      "designer_phone",
      "designer_phone_cc",
      "designer_email",
      "buyer",
      "end_user",
    ] as const;
    for (const preset of ORDER_PRESETS) {
      for (const key of PRESET_CONTACT_KEYS) {
        expect(preset.values[key], `${preset.id}.${key}`).toBeUndefined();
      }
      const applied = applyPreset(preset);
      for (const key of blankAfterApply) {
        expect(applied[key], `applied ${preset.id}.${key}`).toBe("");
      }
      for (const key of PRESET_CONTACT_KEYS) {
        expect(applied[key], `applied ${preset.id}.${key}`).toBe("");
      }
      const blob = JSON.stringify(preset.values);
      expect(blob, preset.id).not.toMatch(/@/);
      expect(blob, preset.id).not.toMatch(/AUD|USD|\$|unit price|报价/i);
    }
  });

  it("applyPreset blanks a salesperson card even if the starter object carries one", () => {
    const base = getPreset("mee-tienyen-cv2")!;
    const dirty = {
      ...base,
      values: {
        ...base.values,
        designer_name: "Alice",
        designer_phone: "13800138000",
        designer_phone_cc: "+86",
        designer_email: "alice@huaming.com",
        buyer: "Old Buyer",
        end_user: "Old End",
      },
    };
    const applied = applyPreset(dirty);
    expect(applied.project).toBe("EVN Tiên Yên");
    expect(applied.designer_name).toBe("");
    expect(applied.designer_phone).toBe("");
    expect(applied.designer_phone_cc).toBe("");
    expect(applied.designer_email).toBe("");
    expect(applied.buyer).toBe("");
    expect(applied.end_user).toBe("");
  });

  it("hydrates ?preset= over stored drafts and still omits contact fields", () => {
    const stored = {
      designer_name: "Old Designer",
      designer_phone: "13800138000",
      designer_phone_cc: "+86",
      designer_email: "old@example.com",
      buyer: "Old Buyer",
      end_user: "Old End",
    };
    const next = hydrateSheetValues("oltc", "?preset=mee-tienyen-cv2", stored);
    expect(next.project).toBe("EVN Tiên Yên");
    expect(next.country).toBe("Vietnam");
    expect(next.family).toBe("CV2");
    expect(next.oltc_current_a).toBe("350");
    expect(next.tap_code).toBe("10191W");
    expect(next.designer_name).toBe("");
    expect(next.designer_phone_cc).toBe("");
    expect(next.designer_phone).toBe("");
    expect(next.designer_email).toBe("");
    expect(next.buyer).toBe("");
    expect(next.end_user).toBe("");

    for (const preset of ORDER_PRESETS) {
      const applied = hydrateSheetValues(preset.sheetId, `?preset=${preset.id}`, stored);
      expect(applied.designer_name, preset.id).toBe("");
      expect(applied.designer_phone, preset.id).toBe("");
      expect(applied.designer_phone_cc, preset.id).toBe("");
      expect(applied.designer_email, preset.id).toBe("");
      expect(applied.buyer, preset.id).toBe("");
      expect(applied.end_user, preset.id).toBe("");
    }

    const kept = hydrateSheetValues("oltc", "", stored);
    expect(kept.designer_name).toBe("Old Designer");
    expect(kept.buyer).toBe("Old Buyer");
    expect(kept.end_user).toBe("Old End");
  });

  it("applies a pending preset id the same way as ?preset=, still blanking contact", () => {
    const stored = { designer_name: "Old Designer", buyer: "Old Buyer" };
    const next = hydrateSheetValues("oltc", "", stored, "mee-tienyen-cv2");
    expect(next.project).toBe("EVN Tiên Yên");
    expect(next.family).toBe("CV2");
    expect(next.designer_name).toBe("");
    expect(next.buyer).toBe("");
    expect(hydrateSheetValues("octc", "", stored, "mee-tienyen-cv2").buyer).toBe("Old Buyer");
    expect(pendingPresetKey("oltc")).toBe("hm-os:pending-preset:oltc");
    expect(pendingPresetKey("shm-d")).toBe("hm-os:pending-preset:shm-d");
  });

  it("does not stash contact or multi-shaft segments in starters or sheet defaults", () => {
    for (const preset of ORDER_PRESETS) {
      expect(preset.values.shaft_multi, preset.id).toBeUndefined();
      expect(preset.values.h1, preset.id).toBeUndefined();
      expect(preset.values.h2, preset.id).toBeUndefined();
      expect(preset.values.h3, preset.id).toBeUndefined();
      expect(preset.values.h4, preset.id).toBeUndefined();
      expect(WORD_TEMPLATE[preset.sheetId], preset.id).toBeTruthy();
    }
    for (const id of ALLOWED_SHEETS) {
      for (const key of PRESET_CONTACT_KEYS) {
        expect(SHEET_DEFAULTS[id][key], `${id}.${key}`).toBeUndefined();
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
