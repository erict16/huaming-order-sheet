import { describe, expect, it } from "vitest";
import {
  APP_OPTS,
  COUNTRY_CODE_OPTS,
  CONN_OPTS,
  CORROSIVE_OPTS,
  CTRL_OPTS,
  CTRL_VOLT_OPTS,
  CMA7_BOTTOM_OPTS,
  DELIVERY_DATE_OPTS,
  HWV_CTRL_OPTS,
  HWV_FAMILIES,
  MOTOR_VOLT_OPTS,
  OCTC_LEAD_OPTS,
  OLTC_FAMILIES,
  PAINT_OPTS,
  POS_TX_OPTS,
  SHAFT_LEN_OPTS,
  VECTOR_GROUP_OPTS,
} from "./catalog";
import { SHEETS, allFields, getSheet, resolveFieldOptions } from "./schema";

describe("orderFields", () => {
  it("keeps 报价单号 on the order step and contact at the last step before review", () => {
    for (const sheet of SHEETS) {
      const keys = allFields(sheet, {}).map(({ field }) => field.key);
      expect(keys, sheet.id).toContain("order_no");
      expect(keys, sheet.id).toContain("designer_name");
      expect(keys, sheet.id).toContain("designer_phone");
      expect(keys, sheet.id).not.toContain("designer_email");
      expect(keys, sheet.id).toContain("designer_phone_cc");
      const cc = allFields(sheet, {}).find(({ field }) => field.key === "designer_phone_cc")!.field;
      expect(cc.type, sheet.id).toBe("combobox");
      expect(COUNTRY_CODE_OPTS.find((o) => o.value === "+86")?.label.zh).toBe("+86");
      expect(COUNTRY_CODE_OPTS.find((o) => o.value === "+84")?.label.zh).toBe("+84");
      const orderNo = allFields(sheet, {}).find(({ field }) => field.key === "order_no")!.field;
      expect(orderNo.label.zh).toBe("报价单号");
      expect(orderNo.label.en).toBe("Quotation No.");
      const delivery = allFields(sheet, {}).find(({ field }) => field.key === "delivery_date")!.field;
      expect(delivery.type).toBe("date");
      const lead = allFields(sheet, {}).find(({ field }) => field.key === "delivery_lead")!.field;
      expect(lead.type).toBe("radio");
      expect(lead.options?.map((o) => o.value)).toEqual(DELIVERY_DATE_OPTS.map((o) => o.value));
      expect(allFields(sheet, {}).map(({ field }) => field.key)).not.toContain("delivery_date_custom");
      const custom = allFields(sheet, { delivery_date: "custom" }).find(({ field }) => field.key === "delivery_date_custom");
      expect(custom?.field.type, sheet.id).toBe("date");
      const country = allFields(sheet, {}).find(({ field }) => field.key === "country")!.field;
      expect(country.type, sheet.id).toBe("combobox");
      expect(country.required, sheet.id).toBe(true);
      expect(country.options?.some((o) => o.value === "Vietnam"), sheet.id).toBe(true);
      const contact = sheet.steps.find((st) => st.id === "contact");
      expect(contact, sheet.id).toBeTruthy();
      const reviewIdx = sheet.steps.findIndex((st) => st.kind === "review");
      const contactIdx = sheet.steps.findIndex((st) => st.id === "contact");
      expect(contactIdx, sheet.id).toBe(reviewIdx - 1);
    }
  });

  it("exposes official CMA7 groups and three-winding MV on the forms", () => {
    const cma7 = getSheet("cma7")!;
    const keys = allFields(cma7, { heat_from: "separate", socket_x10: "other", resistor_sig: "1", avr_model: "hmc3c_air" }).map(
      ({ field }) => field.key,
    );
    for (const k of [
      "motor_network",
      "control_from",
      "heater_kind",
      "cam_s20",
      "incomplete_s21",
      "bcd_qty",
      "door_hinge",
      "avr_model",
      "pos_max",
      "drawing_no",
      "destination_port",
      "resistor_zero_first",
      "resistor_ohm",
    ]) {
      expect(keys, k).toContain(k);
    }
    expect(allFields(cma7, { resistor_sig: "3" }).map(({ field }) => field.key)).toEqual(
      expect.arrayContaining(["resistor_ohm_2", "resistor_ohm_3"]),
    );
    // bottom_plate "other": CMA7 Word C58; cma7Map still ticks holes50 for unknown values.
    expect(CMA7_BOTTOM_OPTS.map((o) => o.value)).toEqual(["holes50", "gland", "nobore", "other"]);
    expect(allFields(cma7, { bottom_plate: "other" }).map(({ field }) => field.key)).toContain("bottom_plate_other");
    const oltcKeys = allFields(getSheet("oltc")!, {}).map(({ field }) => field.key);
    expect(oltcKeys).toContain("mv_kv");
    expect(oltcKeys).toContain("vector_group");
    expect(oltcKeys).toContain("oltc_side");
    expect(oltcKeys).not.toContain("oltc_on_kv");
    expect(allFields(getSheet("oltc")!, { ambient_band: "other" }).map(({ field }) => field.key)).toEqual(
      expect.arrayContaining(["ambient_min", "ambient_max"]),
    );
    const side = allFields(getSheet("oltc")!, {}).find(({ field }) => field.key === "oltc_side")!.field;
    expect(resolveFieldOptions(side, { mv_kv: "22" }).options?.map((o) => o.value)).toContain("mv");
    expect(resolveFieldOptions(side, {}).options?.map((o) => o.value)).toEqual(["hv", "lv"]);
    expect(allFields(getSheet("octc")!, {}).map(({ field }) => field.key)).toContain("rain_cover");
  });

  it("exposes winding data, supporting flange and regulation location on the OLTC sheet", () => {
    const oltc = getSheet("oltc")!;
    const keys = allFields(oltc, { flange_type: "bell", ust_mode: "constant" }).map(({ field }) => field.key);
    expect(keys).toContain("tap_winding");
    expect(keys).toContain("support_flange");
    expect(keys).toContain("potential_connection");
    expect(keys).not.toContain("wind_r1_mm");
    expect(keys).not.toContain("ins_a_pf_kv");
    expect(keys).toContain("temp_sensor");
    expect(keys).toContain("ust_mode");
    expect(allFields(oltc, { flange_type: "tank_top" }).map(({ field }) => field.key)).toContain("support_flange");
    const withResistor = allFields(oltc, { potential_connection: "with" }).map(({ field }) => field.key);
    expect(withResistor).toContain("wind_r1_mm");
    expect(withResistor).toContain("wind_cw_pf");
    expect(withResistor).toContain("tie_in_mounting");
    expect(allFields(oltc, { potential_connection: "check" }).map(({ field }) => field.key)).toContain("wind_r1_mm");
    expect(allFields(oltc, { ins_fill: "provided" }).map(({ field }) => field.key)).toContain("ins_a_pf_kv");
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

  it("offers real OS vector groups plus 其他, not free text", () => {
    const oltc = getSheet("oltc")!;
    const vg = allFields(oltc, {}).find(({ field }) => field.key === "vector_group")!.field;
    expect(vg.type).toBe("select");
    expect(vg.options?.map((o) => o.value)).toEqual([
      "YNd11",
      "YNd1",
      "Dyn11",
      "Dyn5",
      "YNyn0",
      "Dd0",
      "YNa0",
      "YNd11yn12",
      "Ynd11d11",
      "Yd11",
      "Dyn1",
      "other",
    ]);
    expect(VECTOR_GROUP_OPTS.map((o) => o.value)).toContain("YNd11yn12");
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
      "RAL7033",
      "ANSI70",
      "other",
    ]);
    expect(PAINT_OPTS.find((o) => o.value === "RAL7033")?.label.zh).toBe("RAL 7033");
    expect(PAINT_OPTS.find((o) => o.value === "ANSI70")?.label.zh).toBe("ANSI 70");
    const oltc = getSheet("oltc")!;
    expect(allFields(oltc, { paint: "RAL7040" }).map(({ field }) => field.key)).not.toContain("paint_other");
    const custom = allFields(oltc, { paint: "other" }).find(({ field }) => field.key === "paint_other")!.field;
    expect(custom.type).toBe("text");
    expect(custom.label.zh).toBe("其他漆色");
  });

  it("covers Network / Generator / 调容 / 试验变 on APP_OPTS", () => {
    expect(APP_OPTS.map((o) => o.value)).toEqual([
      "network",
      "power",
      "generator",
      "capacity",
      "furnace",
      "rectifier",
      "hvdc",
      "reactor",
      "test",
      "other",
    ]);
    expect(APP_OPTS.find((o) => o.value === "network")?.label.zh).toBe("电网");
    expect(APP_OPTS.find((o) => o.value === "capacity")?.label.zh).toBe("调容");
    expect(APP_OPTS.find((o) => o.value === "test")?.label.zh).toBe("试验变");
  });

  it("has motor 230 V 1-ph and 230/240 AC / 125 DC control", () => {
    expect(MOTOR_VOLT_OPTS.map((o) => o.value)).toContain("230_1");
    expect(CTRL_VOLT_OPTS.map((o) => o.value)).toEqual(
      expect.arrayContaining(["230_ac", "240_ac", "125_dc"]),
    );
  });

  it("puts I / Imax and tx_kind on OLTC, OCTC and HWV", () => {
    for (const id of ["oltc", "octc", "hwv"] as const) {
      const keys = allFields(getSheet(id)!, {}).map(({ field }) => field.key);
      expect(keys, id).toContain("through_current_a");
      expect(keys, id).toContain("imax_a");
      expect(keys, id).toContain("tx_kind");
    }
    const oltc = allFields(getSheet("oltc")!, {});
    expect(oltc.find(({ field }) => field.key === "oltc_current_a")?.field.label.zh).toContain("Ium");
    expect(oltc.find(({ field }) => field.key === "through_current_a")?.field.label.zh).toContain("I");
    expect(oltc.find(({ field }) => field.key === "range_shape")?.field).toBeTruthy();
    expect(oltc.find(({ field }) => field.key === "tap_range_pct")?.field).toBeTruthy();
    const asym = allFields(getSheet("oltc")!, { range_shape: "asymmetric" });
    expect(asym.find(({ field }) => field.key === "range_plus")?.field).toBeTruthy();
    expect(asym.find(({ field }) => field.key === "range_minus")?.field).toBeTruthy();
    expect(oltc.find(({ field }) => field.key === "corrosive_class")?.field.options?.map((o) => o.value)).toEqual(
      CORROSIVE_OPTS.map((o) => o.value),
    );
    const dryKeys = allFields(getSheet("dry")!, {}).map(({ field }) => field.key);
    expect(dryKeys).not.toContain("tx_kind");
  });
});

describe("HWV sheet", () => {
  it("keeps HWV/HWDK off the in-tank OLTC family list", () => {
    expect(OLTC_FAMILIES.map((f) => f.code)).not.toContain("HWV");
    expect(OLTC_FAMILIES.map((f) => f.code)).not.toContain("HWDK");
    expect(HWV_FAMILIES.map((f) => f.code)).toEqual(["HWV", "HWDK"]);
    expect(HWV_FAMILIES.find((f) => f.code === "HWDK")?.category).toBe("external");
    expect(HWV_FAMILIES.every((f) => !f.hasSelectorGrade)).toBe(true);
    const hwv = getSheet("hwv")!;
    expect(hwv.families?.map((f) => f.code)).toEqual(["HWV", "HWDK"]);
    expect(SHEETS.map((s) => s.id)).toContain("hwv");
  });
});

describe("drive shafts H1–H4 / V1–V4", () => {
  it("keeps single-length selects and exposes optional segments on OLTC and OCTC", () => {
    expect(SHAFT_LEN_OPTS.map((o) => o.value)).toEqual(["800", "1000", "1200", "1500", "2000"]);
    for (const id of ["oltc", "octc"] as const) {
      const keys = allFields(getSheet(id)!, {}).map(({ field }) => field.key);
      expect(keys, id).toContain("drive_shaft_horizontal_mm");
      expect(keys, id).toContain("drive_shaft_vertical_mm");
      expect(keys, id).toContain("shaft_multi");
      expect(keys, id).not.toContain("h1");
      const multi = allFields(getSheet(id)!, { shaft_multi: "yes" }).map(({ field }) => field.key);
      // h1–h4 / v1–v3: octcMap T55–T61. v4: Word OLTC SDT 85; octcMap has no V4 cell.
      expect(multi, id).toEqual(expect.arrayContaining(["h1", "h2", "h3", "h4", "v1", "v2", "v3", "v4"]));
    }
    const dryKeys = allFields(getSheet("dry")!, {}).map(({ field }) => field.key);
    expect(dryKeys).toContain("drive_shaft_horizontal_mm");
    expect(dryKeys).not.toContain("h1");
  });
});

describe("CMA7 / SHM-D option lists", () => {
  it("offers ET-SZ6 and SHM-K on CTRL_OPTS (already on HWV)", () => {
    expect(CTRL_OPTS.map((o) => o.value)).toEqual(["none", "HMC-3C", "ET-SZ6", "SHM-K", "SHM-KX", "HMIET"]);
    expect(HWV_CTRL_OPTS.map((o) => o.value)).toEqual(expect.arrayContaining(["ET-SZ6", "SHM-K"]));
    const shm = allFields(getSheet("shm-d")!, {}).find(({ field }) => field.key === "controller")!.field;
    expect(shm.options?.map((o) => o.value)).toEqual(CTRL_OPTS.map((o) => o.value));
  });

  it("offers 0–5 V and 1–5 V analogue position output", () => {
    expect(POS_TX_OPTS.map((o) => o.value)).toEqual([
      "potentiometer",
      "bcd",
      "4_20",
      "0_5v",
      "1_5v",
      "none",
    ]);
    expect(POS_TX_OPTS.find((o) => o.value === "0_5v")?.label.en).toBe("0–5 V");
    expect(POS_TX_OPTS.find((o) => o.value === "1_5v")?.label.en).toBe("1–5 V");
    const shm = allFields(getSheet("shm-d")!, {}).find(({ field }) => field.key === "position_tx")!.field;
    expect(shm.options?.map((o) => o.value)).toEqual(POS_TX_OPTS.map((o) => o.value));
    const cma7Keys = allFields(getSheet("cma7")!, {}).map(({ field }) => field.key);
    expect(cma7Keys).toContain("bcd_qty");
    expect(cma7Keys).toContain("ma_qty");
  });

  it("covers SHM-D Excel groups the wizard can collect", () => {
    const shm = allFields(getSheet("shm-d")!, { socket_x10: "other", resistor_sig: "1" }).map(({ field }) => field.key);
    for (const k of [
      "pos_max",
      "pos_mid",
      "pos_min",
      "control_from",
      "control_protect",
      "heat_from",
      "hand_lamp",
      "socket_x10",
      "bcd_qty",
      "ma_qty",
      "resistor_sig",
      "door_hinge",
      "padlock",
      "destination_port",
    ]) {
      expect(shm, k).toContain(k);
    }
    // shmDCells / cma7Map do not write these yet; keys match the Excel rows.
    expect(shm).toContain("emergency_stop"); // SHM-D Excel A38 急停按钮
    expect(shm).toContain("fiber_length_m"); // SHM-D Excel A53 4-core multimode fibre
    expect(MOTOR_VOLT_OPTS.map((o) => o.value)).toContain("220_240");
  });
});

describe("OCTC official extras", () => {
  it("collects port / SN / lead / flange the Word map already fills", () => {
    const keys = allFields(getSheet("octc")!, {}).map(({ field }) => field.key);
    expect(keys).toContain("destination_port");
    expect(keys).toContain("transformer_sn");
    expect(keys).toContain("huaming_sn");
    expect(keys).toContain("octc_lead");
    expect(keys).toContain("flange_type");
    expect(OCTC_LEAD_OPTS.map((o) => o.value)).toEqual(["A", "B", "C"]);
  });
});
