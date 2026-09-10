import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const brand = path.join(process.cwd(), "public/brand");

describe("official Huaming HM favicons", () => {
  it("ships the huaming-en brand PNGs (blue HM, not a custom mark)", () => {
    for (const file of ["favicon-32.png", "favicon-48.png", "apple-touch-icon.png"]) {
      const p = path.join(brand, file);
      expect(existsSync(p), file).toBe(true);
      expect(readFileSync(p).subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(
        true,
      );
    }
    expect(readFileSync(path.join(brand, "favicon-32.png")).length).toBe(873);
    expect(readFileSync(path.join(brand, "favicon-48.png")).length).toBe(1197);
    expect(readFileSync(path.join(brand, "apple-touch-icon.png")).length).toBe(3933);
  });
});
