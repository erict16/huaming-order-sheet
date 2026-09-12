import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SHEETS } from "./schema";

describe("ice chrome", () => {
  it("keeps a light header and an oil/vacuum family catalog", () => {
    const shell = readFileSync(path.join(process.cwd(), "components/AppShell.tsx"), "utf8");
    const picker = readFileSync(path.join(process.cwd(), "components/FamilyPicker.tsx"), "utf8");
    const wizard = readFileSync(path.join(process.cwd(), "components/OrderWizard.tsx"), "utf8");
    expect(shell).toContain("bg-white/90");
    expect(picker).toContain("grid-cols-[4.75rem_repeat(2,minmax(0,1fr))_repeat(3,minmax(0,1fr))]");
    expect(picker).toContain('"CM"');
    expect(picker).toContain('"CV2"');
    expect(picker).toContain("w-full");
    expect(wizard).toContain("h-8 w-8");
    expect(wizard).toContain("justify-center");
    expect(shell).toContain("max-w-3xl");
    expect(wizard.indexOf("<FamilyPicker")).toBeLessThan(wizard.lastIndexOf("<PresetPicker"));
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
