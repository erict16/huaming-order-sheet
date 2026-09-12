import { describe, expect, it } from "vitest";
import { allFields, getSheet } from "./schema";

describe("OLTC multi-segment shafts", () => {
  it("exposes schema keys h1–h4 on oltc when shaft_multi=yes", () => {
    const oltc = getSheet("oltc")!;
    const hidden = allFields(oltc, {}).map(({ field }) => field.key);
    expect(hidden).toContain("shaft_multi");
    expect(hidden).toContain("drive_shaft_horizontal_mm");
    expect(hidden).toContain("drive_shaft_vertical_mm");
    expect(hidden).not.toContain("h1");
    expect(hidden).not.toContain("h4");
    expect(hidden).not.toContain("v1");

    const keys = allFields(oltc, { shaft_multi: "yes" }).map(({ field }) => field.key);
    expect(keys).toEqual(expect.arrayContaining(["h1", "h2", "h3", "h4", "v1", "v2", "v3", "v4"]));
    expect(allFields(oltc, { shaft_multi: "no" }).map(({ field }) => field.key)).not.toContain("h1");
  });

  it("does not put H1–H4 on CMA7 / SHM-D / dry", () => {
    for (const id of ["cma7", "shm-d", "dry"] as const) {
      const keys = allFields(getSheet(id)!, { shaft_multi: "yes" }).map(({ field }) => field.key);
      expect(keys, id).not.toContain("h1");
      expect(keys, id).not.toContain("h4");
      expect(keys, id).not.toContain("shaft_multi");
    }
  });
});

describe("OCTC rain cover", () => {
  it("exposes rain_cover on the octc sheet", () => {
    const keys = allFields(getSheet("octc")!, {}).map(({ field }) => field.key);
    expect(keys).toContain("rain_cover");
  });
});
