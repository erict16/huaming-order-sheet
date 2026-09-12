import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("ice chrome", () => {
  it("keeps a light header and equal family tiles", () => {
    const shell = readFileSync(path.join(process.cwd(), "components/AppShell.tsx"), "utf8");
    const picker = readFileSync(path.join(process.cwd(), "components/FamilyPicker.tsx"), "utf8");
    expect(shell).toContain("bg-white/90");
    expect(shell).not.toMatch(/header className="[^"]*bg-navy[^\-]/);
    expect(picker).toContain("grid-cols-2");
    expect(picker).toContain("sm:grid-cols-3");
    expect(picker).toContain("min-h-[4.25rem]");
    expect(picker).toContain("bg-navy-50");
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
});
