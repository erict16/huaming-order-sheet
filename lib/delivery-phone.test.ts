import { describe, expect, it } from "vitest";
import { formatIntlPhone, resolveDeliveryDate } from "./osCells";

describe("formatIntlPhone", () => {
  it("does not double '+'", () => {
    expect(formatIntlPhone("+86", "13800138000")).toBe("+86 13800138000");
    expect(formatIntlPhone("86", "13800138000")).toBe("+86 13800138000");
    expect(formatIntlPhone("++86", "13800138000")).toBe("+86 13800138000");
    expect(formatIntlPhone("+86", "+86 13800138000")).toBe("+86 13800138000");
    expect(formatIntlPhone("86", "+86 13800138000")).toBe("+86 13800138000");
    expect(formatIntlPhone("++86", "+86 13800138000")).toBe("+86 13800138000");
    expect(formatIntlPhone("+86", "+8613800138000")).toBe("+86 13800138000");
    expect(formatIntlPhone("+353", "+353 861234567")).toBe("+353 861234567");
    expect(formatIntlPhone(undefined, "13800138000")).toBe("13800138000");
    expect(formatIntlPhone("+86", "")).toBe("+86");
    expect(formatIntlPhone("+86", "13800138000")).not.toMatch(/\+\+/);
    expect(formatIntlPhone("++86", "+86 13800138000")).not.toMatch(/\+\+/);
  });
});

describe("resolveDeliveryDate", () => {
  it("prefers ISO date over lead days", () => {
    expect(
      resolveDeliveryDate({
        delivery_date: "2026-09-01",
        delivery_lead: "90 days after PO",
      }),
    ).toBe("2026-09-01");
    expect(
      resolveDeliveryDate({
        delivery_date: "2026-06-15",
        delivery_lead: "TBC",
        delivery_date_custom: "2026-12-01",
      }),
    ).toBe("2026-06-15");
    expect(resolveDeliveryDate({ delivery_date: "2026-09-01" })).toBe("2026-09-01");
    expect(resolveDeliveryDate({ delivery_date: "", delivery_lead: "90 days after PO" })).toBe(
      "90 days after PO",
    );
    expect(
      resolveDeliveryDate({
        delivery_date: "custom",
        delivery_date_custom: "2026-12-01",
        delivery_lead: "90 days after PO",
      }),
    ).toBe("2026-12-01");
  });
});
