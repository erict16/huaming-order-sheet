import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

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

  it("portals listbox menus so Q/S/R/E2 and shaft dropdowns do not grow a scrollbar on the card", () => {
    const listbox = readFileSync(path.join(process.cwd(), "components/SelectListbox.tsx"), "utf8");
    const css = readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");
    const wizard = readFileSync(path.join(process.cwd(), "components/OrderWizard.tsx"), "utf8");
    expect(listbox).toContain("anchor=\"bottom start\"");
    expect(listbox).toContain("portal");
    expect(listbox).toContain("modal={false}");
    expect(css).not.toMatch(/\.plus-options[\s\S]*?\babsolute\b/);
    expect(wizard).not.toContain("overflow-hidden");
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
