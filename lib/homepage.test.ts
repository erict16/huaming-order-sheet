import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LANGS } from "./copy";
import { chrome, chromeText } from "./i18n";
import { ORDER_PRESETS } from "./presets";
import { SHEETS } from "./schema";

describe("ice chrome", () => {
  it("keeps a light header and an oil/vacuum family catalog", () => {
    const shell = readFileSync(path.join(process.cwd(), "components/AppShell.tsx"), "utf8");
    const picker = readFileSync(path.join(process.cwd(), "components/FamilyPicker.tsx"), "utf8");
    const wizard = readFileSync(path.join(process.cwd(), "components/OrderWizard.tsx"), "utf8");
    expect(shell).toContain("bg-white");
    expect(shell).not.toContain("backdrop-blur");
    expect(shell).toContain('href="#main-content"');
    expect(shell).toContain("skipToContent");
    expect(shell).toContain("langSwitch");
    expect(picker).toContain("grid-cols-[4.75rem_repeat(2,minmax(0,1fr))_repeat(3,minmax(0,1fr))]");
    expect(picker).toContain("row.families.map");
    expect(picker).not.toContain("f: FamilyDef | undefined");
    expect(picker).toContain('"CM"');
    expect(picker).toContain('"CV2"');
    expect(picker).toContain("w-full");
    expect(wizard).toContain("h-10 w-10");
    expect(wizard).toContain('aria-current={i === step ? "step" : undefined}');
    expect(wizard).toContain("justify-center");
    expect(wizard).toContain("exportWordUnavailable");
    expect(wizard).toContain("exportExcelGeneric");
    expect(wizard).toContain("exportWordBlank");
    expect(shell).toContain("max-w-3xl");
    expect(wizard.indexOf("<FamilyPicker")).toBeLessThan(wizard.lastIndexOf("<PresetPicker"));
  });
});

describe("type designation", () => {
  it("keeps TypePlate inline and does not float a spaced panel", () => {
    const plate = readFileSync(path.join(process.cwd(), "components/TypePlate.tsx"), "utf8");
    const wizard = readFileSync(path.join(process.cwd(), "components/OrderWizard.tsx"), "utf8");
    expect(wizard).toContain("<TypePlate compact={typeStr.compact} />");
    expect(plate).not.toMatch(/\bspaced\b/);
    expect(wizard).not.toMatch(/TypePlate[^>]*spaced/);
    expect(plate).not.toMatch(/\b(fixed|sticky|float)/);
  });
});

describe("homepage starters", () => {
  it("keeps real-order presets in a closed details block so sheet links come first", () => {
    const home = readFileSync(path.join(process.cwd(), "components/HomePage.tsx"), "utf8");
    const picker = readFileSync(path.join(process.cwd(), "components/PresetPicker.tsx"), "utf8");
    const pickAt = home.indexOf("pickSheet");
    const presetAt = home.lastIndexOf("PresetPicker");
    expect(pickAt).toBeGreaterThan(0);
    expect(presetAt).toBeGreaterThan(pickAt);
    expect(picker).toContain("<details");
    expect(picker).not.toMatch(/<details[^>]*\sopen/);
    expect(picker).toContain("sheetId");
    expect(picker).toContain("p.sheetId === sheetId");
    expect(picker).toContain("presetsHintN");
    expect(picker).toMatch(/n:\s*presets\.length/);
  });

  it("lists all 6 sheets (oltc, hwv, octc, dry, cma7, shm-d)", () => {
    const home = readFileSync(path.join(process.cwd(), "components/HomePage.tsx"), "utf8");
    expect(home).toContain("SHEETS.map");
    expect(home).toContain("`/sheet/${sheet.id}/`");
    const ids = SHEETS.map((s) => s.id);
    expect(ids).toHaveLength(6);
    expect(ids).toEqual(expect.arrayContaining(["oltc", "hwv", "octc", "dry", "cma7", "shm-d"]));
  });
});

describe("i18n chrome", () => {
  it("keeps zh/en/ru/vi on every chrome key and does not hide copy with a space", () => {
    expect(LANGS.map((l) => l.id)).toEqual(["zh", "en", "ru", "vi"]);
    for (const [key, text] of Object.entries(chrome)) {
      for (const { id } of LANGS) {
        expect(text[id], `${key}.${id}`).toEqual(expect.any(String));
        expect(text[id], `${key}.${id}`).not.toBe(" ");
      }
    }
  });

  it("matches the OneDrive preset count in presetsHint", () => {
    expect(ORDER_PRESETS).toHaveLength(8);
    expect(chromeText("presetsHint", "zh")).toMatch(/8/);
    expect(chromeText("presetsHint", "en").toLowerCase()).toMatch(/eight/);
    expect(chromeText("presetsHint", "ru").toLowerCase()).toMatch(/восемь/);
    expect(chromeText("presetsHint", "vi").toLowerCase()).toMatch(/tám/);
    const n = ORDER_PRESETS.length;
    expect(chromeText("presetsHintN", "zh", { n })).toMatch(/8/);
    expect(chromeText("presetsHintN", "en", { n })).toMatch(/8/);
    expect(chromeText("presetsHintN", "ru", { n })).toMatch(/8/);
    expect(chromeText("presetsHintN", "vi", { n })).toMatch(/8/);
    expect(chromeText("presetsHintN", "zh", { n: 1 })).toContain("1");
    expect(chromeText("presetsHintN", "zh", { n: 1 })).not.toContain("{n}");
    expect(chromeText("presetsHintN", "zh", { n: 1 })).not.toMatch(/8/);
  });

  it("keeps empty-state and validation chrome, and sentence-case EN headings", () => {
    expect(chromeText("exporting", "zh")).toMatch(/导出/);
    expect(chromeText("exporting", "en")).toMatch(/Exporting/);
    expect(chromeText("reviewEmpty", "zh")).toMatch(/核对/);
    expect(chromeText("missing", "zh")).toMatch(/必填/);
    expect(chromeText("noMatches", "zh")).toMatch(/无匹配/);
    expect(chromeText("noFamily", "zh")).toMatch(/系列/);
    expect(chromeText("standardNote", "zh")).toMatch(/常规/);
    expect(chromeText("appName", "en")).toBe("Order specifications");
    expect(chromeText("appNameShort", "en")).toBe("Order sheet");
    expect(chromeText("typePlate", "en")).toBe("Type designation");
    expect(chromeText("skipToContent", "zh")).toMatch(/正文/);
    expect(chromeText("oil", "ru")).toBe("Масло");
    expect(chromeText("vacuum", "vi")).toBe("Chân không");
    expect(chromeText("exportWordUnavailable", "zh")).toMatch(/Word/);
    expect(chromeText("exportWordUnavailable", "en")).toMatch(/Word/);
    expect(chromeText("exportExcelGeneric", "zh")).toMatch(/xlsx/);
    expect(chromeText("exportExcelGeneric", "en")).toMatch(/xlsx/);
    expect(chromeText("exportWordBlank", "zh")).toMatch(/\.doc/);
    expect(chromeText("exportWordBlank", "en")).toMatch(/\.doc/);
    expect(chromeText("exportWordBlank", "en")).toMatch(/xlsm/);
  });
});

describe("review and export chrome", () => {
  it("keeps sticky section heads and a disabled Word title", () => {
    const review = readFileSync(path.join(process.cwd(), "components/ReviewPanel.tsx"), "utf8");
    const seg = readFileSync(path.join(process.cwd(), "components/SegmentedControl.tsx"), "utf8");
    expect(review).toContain("sticky top-0");
    expect(review).toContain("reviewEmpty");
    expect(seg).toContain("opt.title");
    expect(seg).toContain("aria-label");
  });
});

describe("wizard step blurbs", () => {
  it("does not use a single-space blurb to hide help", () => {
    for (const sheet of SHEETS) {
      for (const step of sheet.steps) {
        for (const lang of ["zh", "en", "ru", "vi"] as const) {
          expect(step.blurb[lang], `${sheet.id}.${step.id}.${lang}`).not.toBe(" ");
        }
      }
    }
  });
});
