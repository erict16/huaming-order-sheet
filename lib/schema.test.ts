import { describe, expect, it } from "vitest";
import { CONN_OPTS, COUNTRY_CODE_OPTS, DELIVERY_DATE_OPTS, PAINT_OPTS, VECTOR_GROUP_OPTS } from "./catalog";
import { SHEETS, allFields, getSheet } from "./schema";

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
      expect(cc.type).toBe("combobox");
      expect(cc.options?.map((o) => o.value)).toEqual(COUNTRY_CODE_OPTS.map((o) => o.value));
      expect(cc.options?.map((o) => o.value)).toEqual(expect.arrayContaining(["+86", "+90", "+62", "+91", "+7", "+61", "+84", "+998", "+60", "+66", "+55", "+39", "+49", "+1", "other"]));
      const delivery = allFields(sheet, {}).find(({ field }) => field.key === "delivery_date")!.field;
      expect(delivery.type).toBe("select");
      expect(delivery.options?.map((o) => o.value)).toEqual(DELIVERY_DATE_OPTS.map((o) => o.value));
      expect(allFields(sheet, { delivery_date: "custom" }).map(({ field }) => field.key)).toContain("delivery_date_custom");
      expect(allFields(sheet, { designer_phone_cc: "other" }).map(({ field }) => field.key)).toContain("designer_phone_cc_other");
    }
  });

  it("keeps 买方 / 变压器厂 on half the 2-col grid", () => {
    for (const sheet of SHEETS) {
      const buyer = allFields(sheet, {}).find(({ field }) => field.key === "buyer")!.field;
      expect(buyer.span, sheet.id).not.toBe(2);
    }
  });
});

describe("transformer / accessories polish", () => {
  it("drops 海拔 and 升压方向 from every sheet", () => {
    for (const sheet of SHEETS) {
      const keys = allFields(sheet, { paint: "other", vector_group: "other" }).map(({ field }) => field.key);
      expect(keys, sheet.id).not.toContain("altitude_m");
      expect(keys, sheet.id).not.toContain("raise_direction");
    }
  });

  it("offers six common vector groups plus 其他, not free text", () => {
    const oltc = getSheet("oltc")!;
    const vg = allFields(oltc, {}).find(({ field }) => field.key === "vector_group")!.field;
    expect(vg.type).toBe("select");
    expect(vg.options?.map((o) => o.value)).toEqual(["YNd11", "YNd1", "Dyn11", "Dyn5", "YNyn0", "Dd0", "other"]);
    expect(VECTOR_GROUP_OPTS.map((o) => o.label.zh).slice(0, 6)).toEqual([
      "YNd11",
      "YNd1",
      "Dyn11",
      "Dyn5",
      "YNyn0",
      "Dd0",
    ]);
    const other = allFields(oltc, { vector_group: "other" }).find(({ field }) => field.key === "vector_group_other");
    expect(other).toBeTruthy();
    expect(allFields(oltc, { vector_group: "YNd11" }).map(({ field }) => field.key)).not.toContain("vector_group_other");
  });

  it("does not confuse 联结组别 with OLTC 开关连接 Y/D", () => {
    expect(CONN_OPTS.map((o) => o.value)).toEqual(["Y", "D"]);
    const oltc = getSheet("oltc")!;
    const conn = allFields(oltc, { family: "CM2" }).find(({ field }) => field.key === "oltc_connection")!.field;
    expect(conn.options?.map((o) => o.value)).toEqual(["Y", "D"]);
  });

  it("lists common OS RAL colours and shows free text only for 其他", () => {
    expect(PAINT_OPTS.map((o) => o.value)).toEqual([
      "RAL7032",
      "RAL7035",
      "RAL7040",
      "RAL7012",
      "RAL7001",
      "RAL9002",
      "RAL9003",
      "RAL5012",
      "RAL5015",
      "other",
    ]);
    expect(PAINT_OPTS.filter((o) => o.value !== "other").every((o) => o.label.zh.startsWith("RAL "))).toBe(true);
    const oltc = getSheet("oltc")!;
    expect(allFields(oltc, { paint: "RAL7040" }).map(({ field }) => field.key)).not.toContain("paint_other");
    const custom = allFields(oltc, { paint: "other" }).find(({ field }) => field.key === "paint_other")!.field;
    expect(custom.type).toBe("text");
    expect(custom.label.zh).toBe("其他漆色");
  });
});
