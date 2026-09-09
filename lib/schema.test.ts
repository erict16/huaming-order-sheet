import { describe, expect, it } from "vitest";
import { SHEETS, allFields } from "./schema";

describe("orderFields", () => {
  it("exposes 报价单号 and country-code phone on every sheet", () => {
    for (const sheet of SHEETS) {
      const keys = allFields(sheet, {}).map(({ field }) => field.key);
      expect(keys, sheet.id).toContain("order_no");
      expect(keys, sheet.id).toContain("designer_phone_cc");
      expect(keys, sheet.id).toContain("designer_phone");
      const orderNo = allFields(sheet, {}).find(({ field }) => field.key === "order_no")!.field;
      expect(orderNo.label.zh).toBe("报价单号");
      expect(orderNo.label.en).toBe("Quotation No.");
      const cc = allFields(sheet, {}).find(({ field }) => field.key === "designer_phone_cc")!.field;
      expect(cc.label.zh).toBe("国家区号");
      expect(cc.label.en).toBe("Country code");
      expect(cc.placeholder?.en).toBe("+86");
    }
  });
});
