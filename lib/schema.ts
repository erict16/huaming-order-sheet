import {
  APP_OPTS,
  COUNTRY_CODE_OPTS,
  CONN_OPTS,
  DELIVERY_DATE_OPTS,
  CTRL_OPTS,
  CTRL_VOLT_OPTS,
  COMM_OPTS,
  CORROSIVE_OPTS,
  DRY_FAMILIES,
  DRY_MOUNT_OPTS,
  FILTER_OPTS,
  FLANGE_OPTS,
  FLUID_OPTS,
  FREQ_OPTS,
  IP_OPTS,
  MDU_OPTS,
  MOTOR_VOLT_OPTS,
  NAMEPLATE_OPTS,
  OCTC_CONTACT_OPTS,
  OCTC_DRIVE_OPTS,
  OCTC_FAMILIES,
  OCTC_SERIES_OPTS,
  OCTC_SIZE_OPTS,
  OLTC_FAMILIES,
  HWV_AMBIENT_OPTS,
  HWV_APP_OPTS,
  HWV_CAPACITY_OPTS,
  HWV_CTRL_OPTS,
  HWV_FAMILIES,
  HWV_FLUX_OPTS,
  HWV_FREQ_OPTS,
  HWV_HWDK_CONN_OPTS,
  HWV_MDU_OPTS,
  HWV_MOUNT_OPTS,
  HWV_OVERLOAD_OPTS,
  HWV_PHASE_OPTS,
  HWV_PRV_OPTS,
  HWV_RANGE_SHAPE_OPTS,
  HWV_RELAY_OPTS,
  HWV_TAP_WINDING_OPTS,
  HWV_TX_OPTS,
  HWV_UST_OPTS,
  INS_FILL_OPTS,
  OLTC_AMBIENT_OPTS,
  OLTC_SIDE_OPTS,
  SUPPORT_FLANGE_OPTS,
  TEMP_SENSOR_OPTS,
  CMA7_AVR_OPTS,
  CMA7_BOTTOM_OPTS,
  CMA7_CAM_OPTS,
  CMA7_COUNT_OPTS,
  CMA7_FROM_OPTS,
  CMA7_HEATER_KIND_OPTS,
  CMA7_HINGE_OPTS,
  CMA7_NET_CTRL_OPTS,
  CMA7_NET_MOTOR_OPTS,
  CMA7_NO_TYPE_OPTS,
  CMA7_PROTECT_OPTS,
  CMA7_SIG_OPTS,
  CMA7_SOCKET_OPTS,
  PAINT_OPTS,
  PHASE_OPTS,
  VECTOR_GROUP_OPTS,
  PIPE_E2_OPTS,
  PIPE_HEIGHT_OPTS,
  PIPE_Q_OPTS,
  PIPE_R_OPTS,
  PIPE_S_OPTS,
  POS_TX_OPTS,
  POTENTIAL_OPTS,
  PRV_OPTS,
  REG_OPTS,
  RELAY_OPTS,
  SHAFT_LEN_OPTS,
  SHM_MODEL_OPTS,
  SIDE_OPTS,
  STD_OPTS,
  TIE_IN_OPTS,
  TOP_GEAR_OPTS,
  YES_NO,
  currentOptions,
  defaultSelectorGrade,
  getFamily,
  umOptions,
} from "./catalog";
import { L } from "./copy";
import { PM_STEP_OPTIONS_G, PM_STEP_OPTIONS_W } from "./tapCode";
import type {
  FieldDef,
  OrderValues,
  SectionDef,
  SheetDef,
  SheetId,
  StepDef,
} from "./types";

function orderFields(): FieldDef[] {
  return [
    { key: "order_date", label: L("日期", "Date", "Дата", "Ngày"), type: "date" },
    { key: "order_no", label: L("报价单号", "Quotation No.", "Номер котировки", "Số báo giá"), type: "text" },
    { key: "buyer", label: L("买方 / 变压器厂", "Buyer / transformer maker", "Покупатель / завод ТР", "Bên mua / nhà máy MBA"), type: "text", required: true },
    { key: "end_user", label: L("最终用户", "End user", "Конечный пользователь", "Người dùng cuối"), type: "text" },
    { key: "country", label: L("国家 / 地区", "Country / region", "Страна / регион", "Quốc gia / khu vực"), type: "text", required: true },
    { key: "project", label: L("工程名称", "Project", "Объект", "Công trình"), type: "text" },
    { key: "quantity", label: L("数量", "Quantity", "Количество", "Số lượng"), type: "number", unit: "pcs", required: true },
    {
      key: "delivery_date",
      label: L("要货期", "Delivery date", "Срок поставки", "Ngày giao"),
      type: "select",
      options: DELIVERY_DATE_OPTS,
    },
    {
      key: "delivery_date_custom",
      label: L("指定要货日期", "Specific delivery date", "Конкретный срок", "Ngày giao cụ thể"),
      type: "date",
      applies: (v) => v.delivery_date === "custom",
    },
  ];
}

function contactFields(): FieldDef[] {
  return [
    { key: "designer_name", label: L("设计人", "Designer", "Проектировщик", "Người thiết kế"), type: "text" },
    {
      key: "designer_phone_cc",
      label: L("区号", "Country code", "Код страны", "Mã vùng"),
      type: "combobox",
      options: COUNTRY_CODE_OPTS,
      placeholder: L("选或填 +84", "Pick or type +84", "Выберите или введите +84", "Chọn hoặc gõ +84"),
    },
    {
      key: "designer_phone",
      label: L("电话号码", "Phone number", "Номер", "Số điện thoại"),
      type: "text",
      placeholder: L("不填区号", "Number only", "Только номер", "Chỉ số"),
    },
    { key: "designer_email", label: L("邮箱", "Email", "Эл. почта", "Email"), type: "text" },
  ];
}

function contactStep(): StepDef {
  return {
    id: "contact",
    title: L("联系人", "Contact", "Контакт", "Liên hệ"),
    blurb: L("导出前填设计人。可空。", "Designer contact before export. Optional.", "Контакт проектировщика. Необязательно.", "Người thiết kế trước khi xuất. Có thể trống."),
    sections: [{ id: "contact", title: L("联系人", "Contact", "Контакт", "Liên hệ"), fields: contactFields() }],
  };
}

function transformerFields(opts?: { fluid?: boolean; txKind?: boolean }): FieldDef[] {
  const fields: FieldDef[] = [
    { key: "application", label: L("用途", "Application", "Применение", "Ứng dụng"), type: "select", options: APP_OPTS },
    {
      key: "application_other",
      label: L("其他用途", "Other application", "Другое применение", "Ứng dụng khác"),
      type: "text",
      applies: (v) => v.application === "other",
    },
  ];
  if (opts?.txKind !== false) {
    fields.push({
      key: "tx_kind",
      label: L("变压器结构", "Type of transformer", "Тип трансформатора", "Kiểu MBA"),
      type: "radio",
      options: HWV_TX_OPTS,
      span: 2,
    });
  }
  fields.push(
    { key: "transformer_type", label: L("变压器型号", "Transformer type", "Тип трансформатора", "Kiểu MBA"), type: "text" },
    { key: "rated_power_mva", label: L("额定容量", "Rated power", "Номинальная мощность", "Công suất định mức"), type: "number", unit: "MVA", required: true },
    { key: "hv_kv", label: L("高压额定电压", "HV rated voltage", "Ном. напряжение ВН", "Điện áp cao"), type: "number", unit: "kV" },
    { key: "mv_kv", label: L("中压额定电压", "MV rated voltage", "Ном. напряжение СН", "Điện áp trung"), type: "number", unit: "kV", hint: L("三绕组才填。两绕组留空。", "Only for three-winding. Leave blank on two-winding.", "Только для трёхобмоточного.", "Chỉ MBA ba cuộn. Hai cuộn để trống.") },
    { key: "lv_kv", label: L("低压额定电压", "LV rated voltage", "Ном. напряжение НН", "Điện áp hạ"), type: "number", unit: "kV" },
    { key: "vector_group", label: L("联结组别", "Vector group", "Группа соединения", "Tổ đấu dây"), type: "select", options: VECTOR_GROUP_OPTS },
    {
      key: "vector_group_other",
      label: L("其他联结组别", "Other vector group", "Другая группа соединения", "Tổ đấu dây khác"),
      type: "text",
      placeholder: L("例如 YNyn6", "e.g. YNyn6", "напр. YNyn6", "vd. YNyn6"),
      applies: (v) => v.vector_group === "other",
    },
    { key: "frequency_hz", label: L("频率", "Frequency", "Частота", "Tần số"), type: "radio", options: FREQ_OPTS, required: true },
    { key: "phases", label: L("相数", "Phases", "Число фаз", "Số pha"), type: "radio", options: PHASE_OPTS, required: true },
    { key: "flux", label: L("磁通 / 感应", "Flux / induction", "Поток / индукция", "Từ thông"), type: "radio", options: HWV_FLUX_OPTS, span: 2 },
    { key: "overload_mode", label: L("过载", "Overload", "Перегрузка", "Quá tải"), type: "radio", options: HWV_OVERLOAD_OPTS },
    {
      key: "overload_pct",
      label: L("过载倍数", "Overload", "Перегрузка", "Quá tải"),
      type: "number",
      unit: "%",
      applies: (v) => v.overload_mode === "above",
    },
    { key: "capacity_mode", label: L("容量", "Capacity", "Мощность", "Công suất"), type: "radio", options: HWV_CAPACITY_OPTS },
    {
      key: "capacity_from_pos",
      label: L("从哪一档开始递减", "Decreasing from position", "Убывание с положения", "Giảm từ vị trí"),
      type: "text",
      applies: (v) => v.capacity_mode === "decreasing",
    },
    {
      key: "oltc_side",
      label: L("开关装在哪一侧", "OLTC on", "РПН на стороне", "OLTC lắp phía"),
      type: "radio",
      options: OLTC_SIDE_OPTS.filter((o) => o.value !== "mv"),
      span: 2,
      hint: L("电压填上面高压/低压。有中压时会出现中压侧。", "Voltages are HV/LV above. MV side appears once MV is filled.", "Напряжения ВН/НН выше. СН — когда заполнено.", "Điện áp cao/hạ ở trên. Có trung áp mới hiện phía trung."),
    },
    { key: "ambient_band", label: L("环境温度", "Ambient temperature", "Температура среды", "Nhiệt độ môi trường"), type: "radio", options: OLTC_AMBIENT_OPTS, span: 2 },
    {
      key: "ambient_min",
      label: L("最低", "Min", "Мин.", "Min"),
      type: "number",
      unit: "℃",
      prefix: "−",
      placeholder: L("25", "25", "25", "25"),
      applies: (v) => v.ambient_band === "other" || v.ambient_temp === "other",
    },
    {
      key: "ambient_max",
      label: L("最高", "Max", "Макс.", "Max"),
      type: "number",
      unit: "℃",
      prefix: "+",
      placeholder: L("50", "50", "50", "50"),
      applies: (v) => v.ambient_band === "other" || v.ambient_temp === "other",
    },
    { key: "standard", label: L("标准", "Standard", "Стандарт", "Tiêu chuẩn"), type: "select", options: STD_OPTS },
  );
  if (opts?.fluid !== false) {
    fields.push({
      key: "insulating_fluid",
      label: L("绝缘介质", "Insulating fluid", "Изоляционная жидкость", "Chất cách điện"),
      type: "select",
      options: FLUID_OPTS,
    });
  }
  return fields;
}

const notesField: FieldDef = {
  key: "notes",
  label: L("备注（未填 = 常规配置）", "Notes (blank = standard supply)", "Примечания (пусто = стандарт)", "Ghi chú (trống = tiêu chuẩn)"),
  type: "textarea",
  span: 2,
  placeholder: L("特殊要求、图纸号、与常规配置的差异…", "Special requirements, drawing nos., deviations from standard…", "Особые требования, чертежи, отличия от стандарта…", "Yêu cầu đặc biệt, số bản vẽ, khác tiêu chuẩn…"),
};

function oltcRatingFields(): FieldDef[] {
  return [
    {
      key: "unit_count",
      label: L("台数", "Number of units", "Число аппаратов", "Số bộ"),
      type: "select",
      options: [
        { value: "1", label: L("1 台", "1 unit", "1 аппарат", "1 bộ") },
        { value: "3", label: L("3× 单相（三相变）", "3× single-phase", "3× однофазных", "3× một pha") },
      ],
      applies: (v) => v.phases === "I",
      hint: L("三相变压器订三台单相开关时选 3×，型号写成 3×SHZVI-…", "Use 3× when three single-phase units serve one three-phase transformer.", "3× — три однофазных на один трёхфазный ТР.", "Ba pha dùng 3 bộ một pha thì chọn 3×."),
    },
    {
      key: "oltc_current_a",
      label: L("额定通过电流 Ium", "Rated through-current Ium", "Ном. ток Ium", "Dòng định mức Ium"),
      type: "select",
      unit: "A",
      required: true,
    },
    {
      key: "oltc_um_kv",
      label: L("设备最高电压 Um", "Highest voltage Um", "Наибольшее напряжение Um", "Điện áp thiết bị Um"),
      type: "select",
      unit: "kV",
      required: true,
    },
    {
      key: "oltc_connection",
      label: L("开关连接", "Connection", "Соединение", "Đấu nối"),
      type: "radio",
      options: CONN_OPTS,
      required: true,
    },
    {
      key: "oltc_selector_grade",
      label: L("选择器绝缘等级", "Selector insulation grade", "Класс изоляции избирателя", "Cấp cách điện bộ chọn"),
      type: "radio",
      options: [
        { value: "B", label: L("B", "B", "B", "B") },
        { value: "C", label: L("C", "C", "C", "C") },
        { value: "D", label: L("D", "D", "D", "D") },
        { value: "DE", label: L("DE", "DE", "DE", "DE") },
      ],
      applies: (v) => !!getFamily(v.family || "")?.hasSelectorGrade,
    },
    {
      key: "regulation",
      label: L("调压方式", "Regulation", "Режим регулирования", "Kiểu điều áp"),
      type: "radio",
      options: REG_OPTS,
      required: true,
      span: 2,
    },
    {
      key: "plus_minus",
      label: L("± 级数 N", "± steps N", "± ступени N", "± nấc N"),
      type: "select",
      required: true,
      applies: (v) => v.regulation === "reversing" || v.regulation === "coarse_fine",
      hint: L("最常见 ±8。工作位置 P = 2N + 中间档。±8 且中间 3 → 19 档 → 10193W。", "Most common ±8. Positions P = 2N + mid. ±8 and mid 3 → 19 pos → 10193W.", "Чаще ±8. P = 2N + середина. ±8 и середина 3 → 10193W.", "Phổ biến ±8. P = 2N + giữa. ±8 và giữa 3 → 10193W."),
      options: PM_STEP_OPTIONS_W.map((n) => ({
        value: String(n),
        label: L(`±${n}`, `±${n}`, `±${n}`, `±${n}`),
      })),
    },
    {
      key: "oltc_tap_mid",
      label: L("中间位置数", "Mid positions", "Средние положения", "Vị trí giữa"),
      type: "select",
      options: [
        { value: "1", label: L("1", "1", "1", "1") },
        { value: "3", label: L("3（常用）", "3 (usual)", "3 (обычно)", "3 (thường)") },
      ],
      applies: (v) => v.regulation === "reversing" || v.regulation === "coarse_fine",
    },
    {
      key: "oltc_tap_positions",
      label: L("工作位置数 P", "Service positions P", "Рабочие положения P", "Số vị trí P"),
      type: "number",
      required: true,
    },
    {
      key: "oltc_tap_pitch",
      label: L("选择器节距", "Selector pitch", "Шаг избирателя", "Bước bộ chọn"),
      type: "select",
      options: [10, 12, 14, 16, 18].map((n) => ({ value: String(n), label: L(String(n), String(n), String(n), String(n)) })),
    },
    {
      key: "tap_code",
      label: L("接线图号（分接代码）", "Connection diagram / tap code", "Схема / код ответвлений", "Mã sơ đồ nấc"),
      type: "text",
      placeholder: L("例如 10193W", "e.g. 10193W", "напр. 10193W", "vd. 10193W"),
      hint: L("10 节距 · 19 位置 · 3 中间 · W 正反。由上面参数自动生成，必要时可改。", "pitch·positions·mid·W/G. Auto-filled; override if engineering requires.", "шаг·положения·середина·W/G. Заполняется само.", "bước·vị trí·giữa·W/G. Tự điền."),
    },
    { key: "tap_winding", label: L("调压位置", "Regulation location", "Место регулирования", "Vị trí điều áp"), type: "select", options: HWV_TAP_WINDING_OPTS, span: 2, hint: L("对应 Word 表上那 8 个绕组示意图。", "Matches the 8 winding diagrams on the Word OS.", "Соответствует 8 схемам на бланке Word.", "Khớp 8 sơ đồ trên phiếu Word.") },
    { key: "ust_mode", label: L("级电压", "Step voltage", "Ступенчатое напряжение", "Điện áp nấc"), type: "radio", options: HWV_UST_OPTS },
    { key: "step_voltage_v", label: L("级电压 Ust", "Step voltage Ust", "Ступенчатое напряжение Ust", "Điện áp nấc Ust"), type: "number", unit: "V", applies: (v) => v.ust_mode !== "variable" },
    {
      key: "ust_max_v",
      label: L("Ust 最大", "Ust max", "Ust макс.", "Ust max"),
      type: "number",
      unit: "V",
      applies: (v) => v.ust_mode === "variable",
    },
    {
      key: "ust_min_v",
      label: L("Ust 最小", "Ust min", "Ust мин.", "Ust min"),
      type: "number",
      unit: "V",
      applies: (v) => v.ust_mode === "variable",
    },
    { key: "step_percent", label: L("每级百分数", "% per step", "% на ступень", "% mỗi nấc"), type: "number", unit: "%" },
    {
      key: "through_current_a",
      label: L("变压器额定电流 I", "Transformer rated current I", "Ном. ток ТР I", "Dòng MBA I"),
      type: "number",
      unit: "A",
      hint: L("绕组相电流，不是目录 Ium。", "Phase current of the winding, not catalogue Ium.", "Ток фазы обмотки, не Ium.", "Dòng pha cuộn, không phải Ium."),
    },
    { key: "imax_a", label: L("变压器最大电流 Imax", "Transformer max. current Imax", "Макс. ток Imax", "Dòng max Imax"), type: "number", unit: "A" },
    {
      key: "range_shape",
      label: L("调压范围写法", "Range layout", "Запись диапазона", "Cách ghi dải"),
      type: "radio",
      options: HWV_RANGE_SHAPE_OPTS,
      span: 2,
    },
    {
      key: "range_minus",
      label: L("调压 −%", "Range −%", "Диапазон −%", "Dải −%"),
      type: "number",
      unit: "%",
      applies: (v) => v.range_shape === "asymmetric",
    },
    {
      key: "range_plus",
      label: L("调压 +%", "Range +%", "Диапазон +%", "Dải +%"),
      type: "number",
      unit: "%",
      applies: (v) => v.range_shape === "asymmetric",
    },
    {
      key: "tap_range_pct",
      label: L("调压范围（自动）", "Tap range (composed)", "Диапазон (собирается)", "Dải (tự ghép)"),
      type: "text",
      span: 2,
      hint: L("由 ±N 和每级百分数拼出，可改。对称常见 ±8×1.25%。", "From ±N and % per step. Override if the OS writes something else.", "Из ±N и % на ступень. Можно править.", "Từ ±N và % mỗi nấc. Có thể sửa."),
    },
  ];
}

function positionFields(): FieldDef[] {
  return [
    { key: "pos_max", label: L("最高档位号", "Max position no.", "Макс. положение", "Vị trí max"), type: "text", hint: L("由分接代码自动填，常见 1。", "Filled from tap code; usually 1.", "Из кода ответвлений; обычно 1.", "Tự điền từ mã nấc; thường 1.") },
    { key: "pos_mid", label: L("中间档位号", "Mid position", "Среднее положение", "Vị trí giữa"), type: "text", hint: L("10193 为 9A9B9C。", "10193 → 9A9B9C.", "10193 → 9A9B9C.", "10193 → 9A9B9C.") },
    { key: "pos_min", label: L("最低档位号", "Min position no.", "Мин. положение", "Vị trí min"), type: "text" },
  ];
}

function mechanicalFields(): FieldDef[] {
  return [
    { key: "flange_type", label: L("安装法兰", "Mounting flange", "Монтажный фланец", "Mặt bích lắp"), type: "radio", options: FLANGE_OPTS },
    {
      key: "support_flange",
      label: L("钟罩支撑法兰", "Supporting flange (bell-type tank)", "Опорный фланец (колокол)", "Mặt bích đỡ (kiểu chuông)"),
      type: "radio",
      options: SUPPORT_FLANGE_OPTS,
      span: 2,
      applies: (v) => v.flange_type === "bell",
      hint: L("Word 表 Supporting flange for bell-type tank。箱盖安装不用填。", "Word OS: supporting flange for bell-type tank. Skip for tank-top.", "Только для колокольного бака.", "Chỉ khi kiểu chuông."),
    },
    { key: "top_gear", label: L("出轴方向", "Top gear output", "Выход верхнего редуктора", "Hướng trục ra"), type: "radio", options: TOP_GEAR_OPTS, hint: L("齿轮盒出轴，不是机构装在哪一侧。", "Shaft output of the top gear, not which side the MDU hangs.", "Выход вала, не сторона привода.", "Trục ra hộp bánh, không phải bên cơ cấu.") },
    { key: "drive_shaft_horizontal_mm", label: L("水平传动轴长度", "Horizontal drive shaft", "Горизонтальный вал", "Trục ngang"), type: "select", unit: "mm", options: SHAFT_LEN_OPTS },
    { key: "drive_shaft_vertical_mm", label: L("垂直传动轴长度", "Vertical drive shaft", "Вертикальный вал", "Trục đứng"), type: "select", unit: "mm", options: SHAFT_LEN_OPTS },
  ];
}

function needsTieIn(v: OrderValues): boolean {
  return v.potential_connection === "with" || v.potential_connection === "check";
}

function insulationFields(): FieldDef[] {
  return [
    { key: "ins_fill", label: L("绝缘水平", "Insulation levels", "Уровни изоляции", "Cấp cách điện"), type: "radio", options: INS_FILL_OPTS, span: 2 },
    { key: "ins_earth_pf_kv", label: L("对地工频", "To earth, PF", "На землю, пром. частота", "Đối đất tần số"), type: "number", unit: "kV", hint: L("随 Um 自动填目录值，可改。", "Filled from Um table; override if specified.", "Из таблицы Um; можно изменить.", "Theo bảng Um; có thể sửa.") },
    { key: "ins_earth_li_kv", label: L("对地雷电冲击", "To earth, LI", "На землю, импульс", "Đối đất xung sét"), type: "number", unit: "kV" },
    { key: "ins_a_pf_kv", label: L("同相调压绕组 (a) 工频", "Across winding (a), PF", "Обмотка (a), ПЧ", "Cuộn (a) tần số"), type: "number", unit: "kV" },
    { key: "ins_a_li_kv", label: L("同相调压绕组 (a) 冲击", "Across winding (a), LI", "Обмотка (a), импульс", "Cuộn (a) xung"), type: "number", unit: "kV" },
    { key: "ins_a1_pf_kv", label: L("相邻分接 (a1) 工频", "Between taps (a1), PF", "Между ответвл. (a1)", "Giữa nấc (a1)"), type: "number", unit: "kV" },
    { key: "ins_a1_li_kv", label: L("相邻分接 (a1) 冲击", "Between taps (a1), LI", "Между ответвл. (a1), импульс", "Giữa nấc (a1) xung"), type: "number", unit: "kV" },
    { key: "ins_b_pf_kv", label: L("相间 (b) 工频", "Between phases (b), PF", "Между фазами (b)", "Giữa pha (b)"), type: "number", unit: "kV" },
    { key: "ins_b_li_kv", label: L("相间 (b) 冲击", "Between phases (b), LI", "Между фазами (b), импульс", "Giữa pha (b) xung"), type: "number", unit: "kV" },
    { key: "ins_c1_pf_kv", label: L("粗细调 (c1) 工频", "Coarse–fine (c1), PF", "Грубо-точный (c1)", "Thô–tinh (c1)"), type: "number", unit: "kV" },
    { key: "ins_c1_li_kv", label: L("粗细调 (c1) 冲击", "Coarse–fine (c1), LI", "Грубо-точный (c1), импульс", "Thô–tinh (c1) xung"), type: "number", unit: "kV" },
    { key: "ins_c2_pf_kv", label: L("粗调相间 (c2) 工频", "Coarse phases (c2), PF", "Грубые фазы (c2)", "Thô giữa pha (c2)"), type: "number", unit: "kV" },
    { key: "ins_c2_li_kv", label: L("粗调相间 (c2) 冲击", "Coarse phases (c2), LI", "Грубые фазы (c2), импульс", "Thô giữa pha (c2) xung"), type: "number", unit: "kV" },
    { key: "ins_d_pf_kv", label: L("粗调绕组 (d) 工频", "Coarse winding (d), PF", "Грубая обмотка (d)", "Cuộn thô (d)"), type: "number", unit: "kV" },
    { key: "ins_d_li_kv", label: L("粗调绕组 (d) 冲击", "Coarse winding (d), LI", "Грубая обмотка (d), импульс", "Cuộn thô (d) xung"), type: "number", unit: "kV" },
    { key: "recovery_voltage_kv", label: L("恢复电压", "Recovery voltage", "Напряжение восстановления", "Điện áp phục hồi"), type: "number", unit: "kV" },
    { key: "special_winding", label: L("特殊绕组布置", "Special winding arrangement", "Особая схема обмотки", "Bố trí cuộn đặc biệt"), type: "radio", options: YES_NO },
    {
      key: "potential_connection",
      label: L("电位电阻", "Potential / tie-in resistor", "Потенциальный резистор", "Điện trở thế"),
      type: "select",
      options: POTENTIAL_OPTS,
      span: 2,
      hint: L("不带就不用填绕组尺寸。带或交给华明核算时，再填 R1–R4 / H1 / H2 / Cw / Ca。", "Skip winding sizes if without. Fill R1–R4 / H1 / H2 / Cw / Ca only when fitted or Huaming is to check.", "Размеры обмотки — только если резистор нужен или считает Huaming.", "Không mang thì khỏi điền. Có hoặc Huaming tính mới điền R1–R4."),
    },
    { key: "tie_in_mounting", label: L("电位电阻安装", "Tie-in mounting", "Крепление резистора", "Cách lắp điện trở"), type: "select", options: TIE_IN_OPTS, applies: needsTieIn },
    { key: "wind_r1_mm", label: L("绕组 R1", "Winding R1", "Обмотка R1", "Cuộn R1"), type: "number", unit: "mm", applies: needsTieIn },
    { key: "wind_r2_mm", label: L("绕组 R2", "Winding R2", "Обмотка R2", "Cuộn R2"), type: "number", unit: "mm", applies: needsTieIn },
    { key: "wind_r3_mm", label: L("绕组 R3", "Winding R3", "Обмотка R3", "Cuộn R3"), type: "number", unit: "mm", applies: needsTieIn },
    { key: "wind_r4_mm", label: L("绕组 R4", "Winding R4", "Обмотка R4", "Cuộn R4"), type: "number", unit: "mm", applies: needsTieIn },
    { key: "wind_h1_mm", label: L("绕组 H1", "Winding H1", "Обмотка H1", "Cuộn H1"), type: "number", unit: "mm", applies: needsTieIn },
    { key: "wind_h2_mm", label: L("绕组 H2", "Winding H2", "Обмотка H2", "Cuộn H2"), type: "number", unit: "mm", applies: needsTieIn },
    { key: "wind_cw_pf", label: L("Cw", "Cw", "Cw", "Cw"), type: "number", unit: "pF", applies: needsTieIn },
    { key: "wind_ca_pf", label: L("Ca", "Ca", "Ca", "Ca"), type: "number", unit: "pF", applies: needsTieIn },
  ];
}

function driveFields(includeMdu = true): FieldDef[] {
  const f: FieldDef[] = [];
  if (includeMdu) {
    f.push({ key: "mdu_model", label: L("电动机构", "Motor drive unit", "Привод", "Bộ truyền động"), type: "radio", options: MDU_OPTS, span: 2 });
  }
  f.push(
    { key: "controller", label: L("控制器", "Controller", "Контроллер", "Bộ điều khiển"), type: "select", options: CTRL_OPTS },
    { key: "motor_voltage", label: L("电机电源", "Motor supply", "Питание двигателя", "Nguồn động cơ"), type: "select", options: MOTOR_VOLT_OPTS },
    { key: "control_voltage", label: L("控制电压", "Control voltage", "Напряжение управления", "Điện áp điều khiển"), type: "select", options: CTRL_VOLT_OPTS },
    { key: "mdu_ip", label: L("防护等级", "Ingress protection", "Степень защиты", "Cấp bảo vệ"), type: "select", options: IP_OPTS },
    { key: "heater", label: L("加热器", "Heater", "Обогреватель", "Điện trở sưởi"), type: "radio", options: YES_NO },
  );
  return f;
}

function paintFields(): FieldDef[] {
  return [
    { key: "paint", label: L("漆色", "Paint", "Окраска", "Màu sơn"), type: "select", options: PAINT_OPTS },
    {
      key: "paint_other",
      label: L("其他漆色", "Other paint", "Другая окраска", "Màu sơn khác"),
      type: "text",
      placeholder: L("RAL / C5 / 特殊漆", "RAL / C5 / special", "RAL / C5 / спец.", "RAL / C5 / đặc biệt"),
      applies: (v) => v.paint === "other",
    },
    {
      key: "corrosive_class",
      label: L("防腐等级", "Corrosive class", "Класс коррозии", "Cấp ăn mòn"),
      type: "select",
      options: CORROSIVE_OPTS,
    },
  ];
}

function accessoryFields(opts?: { oil?: boolean }): FieldDef[] {
  const f: FieldDef[] = [];
  if (opts?.oil !== false) {
    f.push(
      { key: "protective_relay", label: L("保护继电器", "Protective relay", "Защитное реле", "Rơle bảo vệ"), type: "select", options: RELAY_OPTS, span: 2 },
      { key: "pressure_relief", label: L("压力释放", "Pressure relief", "Сброс давления", "Xả áp"), type: "select", options: PRV_OPTS },
      { key: "oil_filter", label: L("在线滤油机", "Online oil filter", "Фильтр масла", "Lọc dầu online"), type: "select", options: FILTER_OPTS },
      { key: "temp_sensor", label: L("温度传感器", "Temperature sensor", "Датчик температуры", "Cảm biến nhiệt"), type: "radio", options: TEMP_SENSOR_OPTS },
      {
        key: "temp_sensor_type",
        label: L("传感器型号", "Sensor type", "Тип датчика", "Kiểu cảm biến"),
        type: "text",
        placeholder: L("PT100 / BWTY", "PT100 / BWTY", "PT100 / BWTY", "PT100 / BWTY"),
        applies: (v) => v.temp_sensor === "with",
      },
    );
  }
  f.push(
    { key: "rain_cover", label: L("防雨罩", "Rain cover", "Защитный кожух", "Nắp che mưa"), type: "select", options: YES_NO },
    ...paintFields(),
    { key: "nameplate_language", label: L("铭牌语言", "Nameplate language", "Язык таблички", "Ngôn ngữ nhãn"), type: "select", options: NAMEPLATE_OPTS },
  );
  return f;
}

function pipeFields(): FieldDef[] {
  return [
    { key: "pipe_q", label: L("Q", "Q", "Q", "Q"), type: "select", options: PIPE_Q_OPTS },
    { key: "pipe_q_height", label: L("Q 管高", "Q height", "Высота Q", "Cao Q"), type: "select", options: PIPE_HEIGHT_OPTS, unit: "mm" },
    { key: "pipe_s", label: L("S", "S", "S", "S"), type: "select", options: PIPE_S_OPTS },
    { key: "pipe_s_height", label: L("S 管高", "S height", "Высота S", "Cao S"), type: "select", options: PIPE_HEIGHT_OPTS, unit: "mm" },
    { key: "pipe_r", label: L("R", "R", "R", "R"), type: "select", options: PIPE_R_OPTS },
    { key: "pipe_r_height", label: L("R 管高", "R height", "Высота R", "Cao R"), type: "select", options: PIPE_HEIGHT_OPTS, unit: "mm" },
    { key: "pipe_e2", label: L("E2", "E2", "E2", "E2"), type: "select", options: PIPE_E2_OPTS },
    { key: "pipe_e2_height", label: L("E2 管高", "E2 height", "Высота E2", "Cao E2"), type: "select", options: PIPE_HEIGHT_OPTS, unit: "mm" },
  ];
}

const oltcSheet: SheetDef = {
  id: "oltc",
  meta: {
    id: "oltc",
    title: L("有载分接开关订货单", "OLTC order sheet", "Бланк заказа РПН", "Phiếu đặt hàng OLTC"),
    short: L("有载 OLTC", "OLTC", "РПН", "OLTC"),
    tag: L("油浸 / 真空", "Oil / vacuum", "Масло / вакуум", "Dầu / chân không"),
    summary: L("油浸 / 真空有载", "Oil / vacuum OLTC", "Масло / вакуум", "Dầu / chân không"),
    accent: "#00428C",
  },
  families: OLTC_FAMILIES,
  steps: [
    {
      id: "family",
      kind: "family",
      title: L("开关系列", "Tap-changer family", "Серия РПН", "Họ máy"),
      blurb: L(" ", " ", " ", " "),
      sections: [],
    },
    {
      id: "order",
      title: L("订单与变压器", "Order & transformer", "Заказ и трансформатор", "Đơn và MBA"),
      blurb: L(" ", " ", " ", " "),
      sections: [
        { id: "order", title: L("订单", "Order", "Заказ", "Đơn"), fields: orderFields() },
        { id: "transformer", title: L("变压器数据", "Transformer data", "Данные трансформатора", "Dữ liệu MBA"), fields: transformerFields() },
      ],
    },
    {
      id: "ratings",
      title: L("开关参数", "OLTC ratings", "Параметры РПН", "Thông số OLTC"),
      blurb: L(" ", " ", " ", " "),
      sections: [
        { id: "oltc", title: L("有载开关数据", "On-load tap-changer data", "Данные РПН", "Dữ liệu OLTC"), fields: oltcRatingFields() },
        { id: "position", title: L("档位定义", "Position definition", "Определение положений", "Định nghĩa vị trí"), fields: positionFields() },
      ],
    },
    {
      id: "construction",
      title: L("结构与绝缘", "Construction & insulation", "Конструкция и изоляция", "Kết cấu và cách điện"),
      blurb: L(" ", " ", " ", " "),
      sections: [
        { id: "mechanical", title: L("机械 / 安装", "Mechanical / mounting", "Механика / монтаж", "Cơ khí / lắp đặt"), fields: mechanicalFields() },
        { id: "pipes", title: L("Q / S / R / E2", "Q / S / R / E2", "Q / S / R / E2", "Q / S / R / E2"), fields: pipeFields() },
        { id: "insulation", title: L("绝缘数据", "Insulation data", "Изоляционные данные", "Dữ liệu cách điện"), fields: insulationFields() },
      ],
    },
    {
      id: "package",
      title: L("附件", "Accessories", "Аксессуары", "Phụ kiện"),
      blurb: L("保护继电器、压力释放。电位电阻在绝缘那一步。电动机构电气在 CMA7 / SHM-D 单上填。", "Relay and pressure relief. Tie-in resistor is on the insulation step. Motor-drive electrics go on CMA7 / SHM-D.", "Реле и сброс давления. Резистор — на шаге изоляции.", "Rơle và xả áp. Điện trở thế ở bước cách điện."),
      sections: [
        { id: "drive", title: L("所配电动机构", "Matching motor drive", "Привод", "Bộ truyền động"), fields: [{ key: "mdu_model", label: L("电动机构", "Motor drive unit", "Привод", "Bộ truyền động"), type: "radio", options: MDU_OPTS, span: 2, hint: L("这里只选型号。电机电源、加热、位置传送请到 CMA7 或 SHM-D 订货单。", "Family only. Motor supply, heater and transmitters belong on the CMA7 or SHM-D sheet.", "Только тип. Питание и сигналы — в бланке CMA7 / SHM-D.", "Chỉ chọn kiểu. Nguồn và tín hiệu điền ở phiếu CMA7 / SHM-D.") }] },
        { id: "accessories", title: L("附件", "Accessories", "Аксессуары", "Phụ kiện"), fields: accessoryFields() },
        { id: "notes", title: L("备注", "Notes", "Примечания", "Ghi chú"), fields: [notesField] },
      ],
    },
    contactStep(),
    {
      id: "review",
      kind: "review",
      title: L("核对导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"),
      blurb: L("看完整张单，再选 Word 或 Excel 下载。", "Read the whole sheet, then download Word or Excel.", "Просмотрите бланк и скачайте Word или Excel.", "Xem cả phiếu rồi tải Word hoặc Excel."),
      sections: [],
    },
  ],
};

const octcSheet: SheetDef = {
  id: "octc",
  meta: {
    id: "octc",
    title: L("无励磁分接开关订货单", "OCTC order sheet", "Бланк заказа ПБВ", "Phiếu đặt hàng OCTC"),
    short: L("无励磁 OCTC", "OCTC", "ПБВ", "OCTC"),
    tag: L("断电调压", "De-energized", "Без возбуждения", "Cắt điện"),
    summary: L(
      "笼式 WSL/WDL、鼓式 WSG/WDG/WLG。型号如 WSLIV-800Y/170-6x5B。可选手轮或 CMA7。",
      "Cage WSL/WDL and drum WSG/WDG/WLG. Type like WSLIV-800Y/170-6x5B. Handwheel or CMA7.",
      "Клеть WSL/WDL и барабан WSG. Тип WSLIV-800Y/170-6x5B.",
      "Lồng WSL/WDL và trống WSG. Kiểu WSLIV-800Y/170-6x5B.",
    ),
    accent: "#0f766e",
  },
  families: OCTC_FAMILIES,
  steps: [
    {
      id: "family",
      kind: "family",
      title: L("无励磁系列", "OCTC family", "Серия ПБВ", "Họ OCTC"),
      blurb: L("笼式和鼓式不是同一张价目。Y 常用 IV，D 常用 II。", "Cage and drum are different lists. Y often IV, D often II.", "Клеть и барабан — разные прайсы. Y часто IV, D часто II.", "Lồng và trống khác bảng giá. Y thường IV, D thường II."),
      sections: [],
    },
    {
      id: "order",
      title: L("订单与变压器", "Order & transformer", "Заказ и трансформатор", "Đơn và MBA"),
      blurb: L("无励磁必须在变压器断电后才能调档。", "The transformer must be de-energized before tapping.", "Переключение только при отключенном ТР.", "Chỉ đổi nấc khi MBA đã cắt điện."),
      sections: [
        { id: "order", title: L("订单", "Order", "Заказ", "Đơn"), fields: orderFields() },
        { id: "transformer", title: L("变压器数据", "Transformer data", "Данные трансформатора", "Dữ liệu MBA"), fields: transformerFields() },
      ],
    },
    {
      id: "ratings",
      title: L("开关参数", "OCTC ratings", "Параметры ПБВ", "Thông số OCTC"),
      blurb: L("系列罗马数字、电流、Um、触头排列和规格字母组成型号。", "Roman series, current, Um, contact layout and size letter make the type.", "Римская серия, ток, Um, контакты и буква размера.", "Số La Mã, dòng, Um, tiếp điểm và cỡ chữ."),
      sections: [
        {
          id: "octc",
          title: L("无励磁开关数据", "De-energized tap-changer data", "Данные ПБВ", "Dữ liệu OCTC"),
          fields: [
            { key: "octc_series", label: L("结构系列", "Series", "Серия", "Series"), type: "radio", options: OCTC_SERIES_OPTS, required: true, hint: L("中性点 Y 常用 IV，线端 D 常用 II。", "Neutral Y usually IV; line-end D usually II.", "Нейтраль Y обычно IV; линейный D обычно II.", "Trung tính Y thường IV; đầu dây D thường II.") },
            { key: "current_a", label: L("额定电流", "Rated current", "Номинальный ток", "Dòng định mức"), type: "select", unit: "A", required: true },
            {
              key: "through_current_a",
              label: L("变压器额定电流 I", "Transformer rated current I", "Ном. ток ТР I", "Dòng MBA I"),
              type: "number",
              unit: "A",
            },
            { key: "imax_a", label: L("变压器最大电流 Imax", "Transformer max. current Imax", "Макс. ток Imax", "Dòng max Imax"), type: "number", unit: "A" },
            { key: "um_kv", label: L("设备最高电压 Um", "Highest voltage Um", "Наибольшее напряжение Um", "Um"), type: "select", unit: "kV", required: true },
            { key: "connection", label: L("连接", "Connection", "Соединение", "Đấu nối"), type: "radio", options: CONN_OPTS, required: true },
            { key: "octc_positions", label: L("分接位置数", "Number of tapping positions", "Число положений", "Số vị trí nấc"), type: "number", required: true },
            { key: "octc_contact", label: L("触头排列", "Contact arrangement", "Схема контактов", "Bố trí tiếp điểm"), type: "select", options: OCTC_CONTACT_OPTS, hint: L("由位置数映射：5→6×5，6→7×6，11→12×11，17→18×17。", "From positions: 5→6×5, 6→7×6, 11→12×11, 17→18×17.", "Из числа положений: 5→6×5…", "Từ số vị trí: 5→6×5…") },
            { key: "octc_size", label: L("规格", "Size", "Типоразмер", "Cỡ"), type: "radio", options: OCTC_SIZE_OPTS },
            { key: "octc_drive", label: L("操作机构", "Operating mechanism", "Привод", "Cơ cấu thao tác"), type: "radio", options: OCTC_DRIVE_OPTS, span: 2 },
          ],
        },
      ],
    },
    {
      id: "package",
      title: L("安装与备注", "Mounting & notes", "Монтаж и примечания", "Lắp đặt và ghi chú"),
      blurb: L("箱内安装为主。需要电动时选 CMA7。", "Usually in-tank. Choose CMA7 if motorized.", "Обычно в баке. CMA7 — если с двигателем.", "Thường trong thùng. CMA7 nếu có động cơ."),
      sections: [
        { id: "mechanical", title: L("安装", "Mounting", "Монтаж", "Lắp đặt"), fields: [...mechanicalFields().filter((f) => f.key !== "flange_type"), ...paintFields()] },
        { id: "drive", title: L("若配电动机构", "If motorized", "Если с приводом", "Nếu có động cơ"), fields: driveFields(false), hint: L("手轮方案可跳过。", "Skip if handwheel.", "Пропустите при штурвале.", "Bỏ qua nếu tay quay.") },
        { id: "notes", title: L("备注", "Notes", "Примечания", "Ghi chú"), fields: [notesField] },
      ],
    },
    contactStep(),
    { id: "review", kind: "review", title: L("核对导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"), blurb: L("核对后选 Word 或 Excel 下载。", "Then download Word or Excel.", "Затем Word или Excel.", "Sau đó tải Word hoặc Excel."), sections: [] },
  ],
};

const drySheet: SheetDef = {
  id: "dry",
  meta: {
    id: "dry",
    title: L("干式有载开关订货单", "Dry-type OLTC order sheet", "Бланк заказа сухого РПН", "Phiếu OLTC MBA khô"),
    short: L("干式 CZ", "Dry CZ", "Сухой CZ", "CZ khô"),
    tag: L("真空 · 干变", "Vacuum · dry", "Вакуум · сухой", "Chân không · khô"),
    summary: L(
      "CZ 真空有载，用于室内干式变。三相通常 3×CZI，一台机构联动。无油附件。",
      "CZ vacuum OLTC for indoor dry transformers. Three-phase usually 3×CZI on one MDU. No oil accessories.",
      "Вакуумный CZ для сухих ТР. 3 фазы обычно 3×CZI. Без масляных опций.",
      "OLTC chân không CZ cho MBA khô trong nhà. Ba pha thường 3×CZI. Không phụ kiện dầu.",
    ),
    accent: "#b45309",
  },
  families: DRY_FAMILIES,
  steps: [
    {
      id: "order",
      title: L("订单与变压器", "Order & transformer", "Заказ и трансформатор", "Đơn và MBA"),
      blurb: L("干变、室内、真空切换。默认三相订 3 台单相 CZ。", "Dry, indoor, vacuum switching. Default 3 single-phase CZ for three-phase.", "Сухой, внутри, вакуум. По умолчанию 3 однофазных CZ.", "Khô, trong nhà, chân không. Mặc định 3 CZ một pha."),
      sections: [
        { id: "order", title: L("订单", "Order", "Заказ", "Đơn"), fields: orderFields() },
        { id: "transformer", title: L("干式变压器", "Dry-type transformer", "Сухой трансформатор", "MBA khô"), fields: transformerFields({ fluid: false, txKind: false }) },
      ],
    },
    {
      id: "ratings",
      title: L("CZ 参数与安装", "CZ ratings & mounting", "Параметры CZ и монтаж", "Thông số CZ và lắp"),
      blurb: L("电流 500/600 A，Um 40.5/72.5。级电压约 950 V。", "Current 500/600 A, Um 40.5/72.5. Step voltage about 950 V.", "Ток 500/600 А, Um 40.5/72.5. Ust ≈ 950 В.", "Dòng 500/600 A, Um 40.5/72.5. Ust khoảng 950 V."),
      sections: [
        {
          id: "cz",
          title: L("CZ 开关数据", "CZ tap-changer data", "Данные CZ", "Dữ liệu CZ"),
          fields: [
            { key: "family", label: L("系列", "Family", "Серия", "Họ"), type: "select", options: [{ value: "CZ", label: L("CZ", "CZ", "CZ", "CZ") }], required: true },
            { key: "unit_count", label: L("台数", "Number of units", "Число аппаратов", "Số bộ"), type: "select", options: [{ value: "1", label: L("1（单相）", "1 (single-phase)", "1 (однофазный)", "1 (một pha)") }, { value: "3", label: L("3×CZI（三相联动）", "3×CZI (3-ph linked)", "3×CZI (3ф связанные)", "3×CZI (3 pha liên kết)") }], required: true },
            { key: "phases", label: L("每台相数", "Phases per unit", "Фаз на аппарат", "Pha mỗi bộ"), type: "radio", options: [PHASE_OPTS[0], PHASE_OPTS[2]] },
            { key: "oltc_current_a", label: L("额定电流", "Rated current", "Номинальный ток", "Dòng định mức"), type: "select", options: currentOptions([500, 600]), unit: "A", required: true },
            { key: "oltc_um_kv", label: L("设备最高电压 Um", "Highest voltage Um", "Um", "Um"), type: "select", options: umOptions([40.5, 72.5]), unit: "kV", required: true },
            { key: "oltc_connection", label: L("连接", "Connection", "Соединение", "Đấu nối"), type: "radio", options: [...CONN_OPTS, { value: "any", label: L("任意", "Any", "Любое", "Bất kỳ") }] },
            { key: "dry_positions", label: L("工作位置数", "Operating positions", "Рабочие положения", "Số vị trí"), type: "select", options: [7, 9, 13, 17].map((n) => ({ value: String(n), label: L(`${n} 档`, `${n} pos.`, `${n} пол.`, `${n} vị trí`) })), required: true },
            { key: "step_voltage_v", label: L("级电压 Ust", "Step voltage Ust", "Ust", "Ust"), type: "number", unit: "V" },
            { key: "regulation", label: L("调压方式", "Regulation", "Регулирование", "Điều áp"), type: "radio", options: REG_OPTS },
          ],
        },
        {
          id: "mount",
          title: L("安装", "Mounting", "Монтаж", "Lắp đặt"),
          fields: [
            { key: "dry_mount", label: L("安装方式", "Mounting", "Способ установки", "Cách lắp"), type: "radio", options: DRY_MOUNT_OPTS, span: 2 },
            { key: "mdu_side", label: L("机构位置", "MDU side", "Сторона привода", "Bên cơ cấu"), type: "radio", options: SIDE_OPTS },
            { key: "drive_shaft_horizontal_mm", label: L("绝缘水平传动轴", "Insulated horizontal shaft", "Изолированный гориз. вал", "Trục ngang cách điện"), type: "number", unit: "mm" },
          ],
        },
      ],
    },
    {
      id: "package",
      title: L("机构与附件", "Drive & accessories", "Привод и аксессуары", "Truyền động và phụ kiện"),
      blurb: L("常用 CMA7 或 SHM-III。无油、无滤油机、无瓦斯继电器。", "Usually CMA7 or SHM-III. No oil, filter or Buchholz.", "Обычно CMA7 или SHM-III. Без масла и фильтра.", "Thường CMA7 hoặc SHM-III. Không dầu, lọc, rơle khí."),
      sections: [
        { id: "drive", title: L("电动机构", "Motor drive", "Привод", "Truyền động"), fields: driveFields() },
        { id: "accessories", title: L("附件", "Accessories", "Аксессуары", "Phụ kiện"), fields: accessoryFields({ oil: false }) },
        { id: "notes", title: L("备注", "Notes", "Примечания", "Ghi chú"), fields: [notesField] },
      ],
    },
    contactStep(),
    { id: "review", kind: "review", title: L("核对导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"), blurb: L("核对后选 Word 或 Excel 下载。", "Then download Word or Excel.", "Затем Word или Excel.", "Sau đó tải Word hoặc Excel."), sections: [] },
  ],
};

function matchingOltcField(): FieldDef {
  return {
    key: "matching_oltc",
    label: L("所配开关型号", "Tap-changer type to be driven", "Тип РПН / ПБВ", "Kiểu máy cần truyền động"),
    type: "text",
    required: true,
    span: 2,
    placeholder: L("例如 CM2III-500Y/72.5B-10193W", "e.g. CM2III-500Y/72.5B-10193W", "напр. CM2III-500Y/72.5B-10193W", "vd. CM2III-500Y/72.5B-10193W"),
    hint: L("机构行程必须和开关档位数一致。", "Drive travel must match the number of positions.", "Ход привода = число положений.", "Hành trình phải khớp số vị trí."),
  };
}

const cma7Sheet: SheetDef = {
  id: "cma7",
  meta: {
    id: "cma7",
    title: L("CMA7 电动机构订货单", "CMA7 motor drive order sheet", "Бланк заказа привода CMA7", "Phiếu đặt hàng CMA7"),
    short: L("CMA7 机构", "CMA7 MDU", "Привод CMA7", "CMA7"),
    tag: L("电动机构", "Motor drive", "Моторный привод", "Bộ truyền động"),
    summary: L(
      "传统电动机构。写明带动的开关、档位数、电机和控制电源、加热和位置传送。",
      "Classic motor drive. Matching tap-changer, positions, motor/control supply, heater, position transmitter.",
      "Классический привод. Тип РПН, положения, питание, обогрев, датчик положения.",
      "Bộ truyền động cổ điển. Kiểu máy, số vị trí, nguồn, sưởi, tín hiệu vị trí.",
    ),
    accent: "#1d4ed8",
  },
  steps: [
    {
      id: "order",
      title: L("订单与所配开关", "Order & matching switch", "Заказ и РПН", "Đơn và máy đi kèm"),
      blurb: L("单独订机构时一定要写原开关型号和档位数。", "For MDU-only orders, the original type and positions are mandatory.", "Для заказа только привода обязательны тип и положения.", "Đặt riêng cơ cấu thì bắt buộc ghi kiểu và số vị trí."),
      sections: [
        { id: "order", title: L("订单", "Order", "Заказ", "Đơn"), fields: orderFields() },
        {
          id: "match",
          title: L("所配开关", "Matching tap changer", "Сопряжённый РПН", "Máy đi kèm"),
          fields: [
            matchingOltcField(),
            { key: "mdu_positions", label: L("操作位置数", "Operating positions", "Число положений", "Số vị trí thao tác"), type: "number", required: true },
            { key: "pos_max", label: L("最高档位号", "Max position no.", "Макс. положение", "Vị trí max"), type: "text" },
            { key: "pos_mid", label: L("中间档位号", "Mid position", "Среднее положение", "Vị trí giữa"), type: "text", hint: L("例如 17A,17B,17C 或 9a9b9c。", "e.g. 17A,17B,17C or 9a9b9c.", "напр. 17A,17B,17C.", "vd. 17A,17B,17C.") },
            { key: "pos_min", label: L("最低档位号", "Min position no.", "Мин. положение", "Vị trí min"), type: "text" },
            { key: "auto_passage", label: L("自动越过的档位", "Automatic passage of position(s)", "Автопроход положений", "Vị trí tự nhảy"), type: "text" },
          ],
        },
      ],
    },
    {
      id: "electrical",
      title: L("电气", "Electrical", "Электрика", "Điện"),
      blurb: L("电机电源、控制电压、频率必须写清，海外现场常和国内默认不同。", "Motor supply, control voltage and frequency must be explicit — overseas sites often differ from China default.", "Питание, управление и частота обязательны.", "Nguồn motor, điện áp điều khiển và tần số phải ghi rõ."),
      sections: [
        {
          id: "elec",
          title: L("电源与控制", "Supply & control", "Питание и управление", "Nguồn và điều khiển"),
          fields: [
            { key: "frequency_hz", label: L("频率", "Frequency", "Частота", "Tần số"), type: "radio", options: FREQ_OPTS, required: true },
            { key: "motor_voltage", label: L("电机电源电压", "Motor supply voltage", "Напряжение двигателя", "Điện áp motor"), type: "select", options: MOTOR_VOLT_OPTS, required: true },
            { key: "motor_network", label: L("电机回路接线", "Motor network type", "Сеть двигателя", "Kiểu mạng motor"), type: "radio", options: CMA7_NET_MOTOR_OPTS, span: 2 },
            { key: "control_from", label: L("控制回路电源", "Control-circuit supply", "Питание цепи управления", "Nguồn mạch điều khiển"), type: "radio", options: CMA7_FROM_OPTS, span: 2 },
            { key: "control_voltage", label: L("控制电压", "Control voltage", "Напряжение управления", "Điện áp điều khiển"), type: "select", options: CTRL_VOLT_OPTS, required: true },
            { key: "control_network", label: L("控制回路接线", "Control network type", "Сеть управления", "Kiểu mạng điều khiển"), type: "radio", options: CMA7_NET_CTRL_OPTS },
            { key: "control_protect", label: L("控制回路保护", "Control-circuit protection", "Защита цепи управления", "Bảo vệ mạch điều khiển"), type: "select", options: CMA7_PROTECT_OPTS },
            { key: "heat_from", label: L("加热回路电源", "Heating-circuit supply", "Питание обогрева", "Nguồn mạch sưởi"), type: "radio", options: CMA7_FROM_OPTS, span: 2 },
            { key: "heat_voltage", label: L("加热电压", "Heating voltage", "Напряжение обогрева", "Điện áp sưởi"), type: "select", options: CTRL_VOLT_OPTS, applies: (v) => v.heat_from === "separate" },
            { key: "heat_network", label: L("加热回路接线", "Heating network type", "Сеть обогрева", "Kiểu mạng sưởi"), type: "radio", options: [{ value: "ac", label: L("AC", "AC", "AC", "AC") }, { value: "2ac", label: L("2AC", "2AC", "2AC", "2AC") }] },
            { key: "heat_protect", label: L("加热回路保护", "Heating-circuit protection", "Защита обогрева", "Bảo vệ mạch sưởi"), type: "select", options: CMA7_PROTECT_OPTS },
            { key: "heater_kind", label: L("加热器型式", "Heater type", "Тип обогревателя", "Kiểu sưởi"), type: "radio", options: CMA7_HEATER_KIND_OPTS, span: 2 },
            { key: "mdu_ip", label: L("防护等级", "Ingress protection", "Степень защиты", "Cấp bảo vệ"), type: "select", options: IP_OPTS },
          ],
        },
      ],
    },
    {
      id: "mech",
      title: L("信号与机械", "Signals & cabinet", "Сигналы и шкаф", "Tín hiệu và tủ"),
      blurb: L("官方 CMA7 表上的辅助接点、位置传送、柜门和 AVR。未勾的按常规。", "Auxiliary contacts, transmitters, cabinet and AVR from the official CMA7 OS. Unticked = standard.", "Контакты, датчики, шкаф и АРН с бланка CMA7. Пусто = стандарт.", "Tiếp điểm, tín hiệu vị trí, tủ và AVR trên phiếu CMA7. Không tick = tiêu chuẩn."),
      sections: [
        {
          id: "aux",
          title: L("辅助接点", "Auxiliary contacts", "Вспомогательные контакты", "Tiếp điểm phụ"),
          fields: [
            { key: "hand_lamp", label: L("照明灯 H4", "Hand lamp (H4)", "Лампа H4", "Đèn H4"), type: "radio", options: YES_NO },
            { key: "end_pos_sig", label: L("终端位置 S16/S17", "End-position S16/S17", "Концевой S16/S17", "S16/S17"), type: "radio", options: CMA7_SIG_OPTS, span: 2 },
            { key: "crank_sig", label: L("手摇信号 S18", "Hand-crank S18", "Сигнал рукоятки S18", "S18 tay quay"), type: "radio", options: CMA7_SIG_OPTS, span: 2 },
            { key: "cam_s20", label: L("凸轮开关 S20", "Cam-operated S20", "Кулачковый S20", "Cam S20"), type: "radio", options: CMA7_CAM_OPTS },
            { key: "incomplete_s21", label: L("切换未完成 S21", "Incomplete tap S21", "Незавершённое S21", "S21 chưa xong"), type: "radio", options: CMA7_CAM_OPTS },
            { key: "socket_x10", label: L("插座 X10", "Plug socket X10", "Розетка X10", "Ổ X10"), type: "radio", options: CMA7_SOCKET_OPTS, span: 2 },
            {
              key: "socket_country",
              label: L("插座国家标准", "Socket country", "Стандарт розетки", "Tiêu chuẩn ổ"),
              type: "text",
              applies: (v) => v.socket_x10 === "other",
            },
          ],
        },
        {
          id: "tx",
          title: L("位置传送", "Position transmitter", "Датчик положения", "Tín hiệu vị trí"),
          fields: [
            { key: "pos_no_type", label: L("N/O 接点型式", "N/O contact type", "Тип N/O", "Kiểu N/O"), type: "select", options: CMA7_NO_TYPE_OPTS, span: 2 },
            { key: "bcd_qty", label: L("BCD 模块", "BCD module", "Модуль BCD", "Module BCD"), type: "radio", options: CMA7_COUNT_OPTS.filter((o) => o.value !== "3") },
            { key: "ma_qty", label: L("4–20 mA", "4–20 mA", "4–20 мА", "4–20 mA"), type: "radio", options: CMA7_COUNT_OPTS },
            { key: "resistor_sig", label: L("电阻位置信号", "Resistor signal", "Резисторный сигнал", "Tín hiệu điện trở"), type: "radio", options: CMA7_COUNT_OPTS },
            {
              key: "resistor_ohm",
              label: L("Ω / 档（第 1 路）", "Ω / pos (1st)", "Ом/положение (1)", "Ω / nấc (1)"),
              type: "number",
              unit: "Ω",
              applies: (v) => v.resistor_sig === "1" || v.resistor_sig === "2" || v.resistor_sig === "3",
            },
            { key: "parallel", label: L("并列运行", "Parallel operation", "Параллельная работа", "Chạy song song"), type: "radio", options: YES_NO },
          ],
        },
        {
          id: "cabinet",
          title: L("柜体", "Cabinet", "Шкаф", "Tủ"),
          fields: [
            { key: "door_hinge", label: L("柜门铰链", "Door hinges", "Петли двери", "Bản lề cửa"), type: "radio", options: CMA7_HINGE_OPTS },
            { key: "bottom_plate", label: L("底板开孔", "Bottom plate", "Днище", "Đáy tủ"), type: "select", options: CMA7_BOTTOM_OPTS, span: 2 },
            { key: "padlock", label: L("挂锁", "Pad lock", "Навесной замок", "Ổ khóa"), type: "radio", options: YES_NO },
            { key: "mdu_side", label: L("安装位置", "Mounting side", "Сторона установки", "Bên lắp"), type: "radio", options: SIDE_OPTS },
            { key: "nameplate_language", label: L("铭牌语言", "Nameplate language", "Язык таблички", "Ngôn ngữ nhãn"), type: "select", options: NAMEPLATE_OPTS },
            ...paintFields(),
          ],
        },
        {
          id: "avr",
          title: L("位置指示 / AVR", "Position indicator / AVR", "Индикатор / АРН", "Báo vị trí / AVR"),
          fields: [
            { key: "avr_model", label: L("HMC-3C / ET-SZ6", "HMC-3C / ET-SZ6", "HMC-3C / ET-SZ6", "HMC-3C / ET-SZ6"), type: "select", options: CMA7_AVR_OPTS, span: 2 },
            {
              key: "avr_cable_m",
              label: L("航空插头电缆", "Aviation-connector cable", "Кабель авиаразъёма", "Cáp giắc"),
              type: "number",
              unit: "m",
              hint: L("常规 30 m。端子排方案华明不带电缆。", "Standard 30 m. No cable when terminal-block type.", "Стандарт 30 м. Клеммы — без кабеля.", "Tiêu chuẩn 30 m. Terminal thì không có cáp."),
              applies: (v) => (v.avr_model || "").includes("air"),
            },
          ],
        },
        { id: "notes", title: L("备注", "Notes", "Примечания", "Ghi chú"), fields: [notesField] },
      ],
    },
    contactStep(),
    { id: "review", kind: "review", title: L("核对导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"), blurb: L("核对后选 Word 或 Excel 下载。", "Then download Word or Excel.", "Затем Word или Excel.", "Sau đó tải Word hoặc Excel."), sections: [] },
  ],
};

const shmSheet: SheetDef = {
  id: "shm-d",
  meta: {
    id: "shm-d",
    title: L("SHM-D 机构与控制器订货单", "SHM-D MDU & controller order sheet", "Бланк заказа SHM-D и контроллера", "Phiếu SHM-D và bộ điều khiển"),
    short: L("SHM-D", "SHM-D", "SHM-D", "SHM-D"),
    tag: L("数字机构", "Digital drive", "Цифровой привод", "Bộ số"),
    summary: L(
      "SHM-D / SHM-DL 数字电动机构，可配 SHM-KX、HMC-3C、通信（Modbus / IEC 61850）。",
      "SHM-D / SHM-DL digital drive, optional SHM-KX / HMC-3C and comms (Modbus / IEC 61850).",
      "Цифровой SHM-D / SHM-DL, опции SHM-KX / HMC-3C и связи.",
      "Bộ số SHM-D / SHM-DL, tuỳ chọn SHM-KX / HMC-3C và truyền thông.",
    ),
    accent: "#6d28d9",
  },
  steps: [
    {
      id: "order",
      title: L("订单与所配开关", "Order & matching switch", "Заказ и РПН", "Đơn và máy đi kèm"),
      blurb: L("数字机构同样必须对上档位数和开关型号。", "The digital drive must still match type and positions.", "Цифровой привод тоже должен совпадать по типу и положениям.", "Bộ số vẫn phải khớp kiểu và số vị trí."),
      sections: [
        { id: "order", title: L("订单", "Order", "Заказ", "Đơn"), fields: orderFields() },
        {
          id: "match",
          title: L("所配开关与型号", "Matching switch & model", "РПН и модель", "Máy và model"),
          fields: [
            matchingOltcField(),
            { key: "shm_model", label: L("机构型号", "Drive model", "Модель привода", "Model bộ truyền"), type: "radio", options: SHM_MODEL_OPTS, required: true, span: 2 },
            { key: "mdu_positions", label: L("操作位置数", "Operating positions", "Число положений", "Số vị trí"), type: "number", required: true },
          ],
        },
      ],
    },
    {
      id: "electrical",
      title: L("电气", "Electrical", "Электрика", "Điện"),
      blurb: L("电源与防护，和 CMA7 同一套现场条件。", "Supply and IP — same site conditions as CMA7.", "Питание и IP — как у CMA7.", "Nguồn và IP — cùng điều kiện hiện trường CMA7."),
      sections: [
        {
          id: "elec",
          title: L("电源与环境", "Supply & environment", "Питание и среда", "Nguồn và môi trường"),
          fields: [
            { key: "frequency_hz", label: L("频率", "Frequency", "Частота", "Tần số"), type: "radio", options: FREQ_OPTS, required: true },
            { key: "motor_voltage", label: L("电机电源", "Motor supply", "Питание двигателя", "Nguồn động cơ"), type: "select", options: MOTOR_VOLT_OPTS, required: true },
            { key: "control_voltage", label: L("控制电压", "Control voltage", "Напряжение управления", "Điện áp điều khiển"), type: "select", options: CTRL_VOLT_OPTS, required: true },
            { key: "heater", label: L("加热器", "Heater", "Обогреватель", "Sưởi"), type: "radio", options: YES_NO },
            { key: "mdu_ip", label: L("防护等级", "Ingress protection", "Степень защиты", "Cấp bảo vệ"), type: "select", options: IP_OPTS },
            { key: "ambient_band", label: L("环境温度", "Ambient temperature", "Температура среды", "Nhiệt độ môi trường"), type: "radio", options: OLTC_AMBIENT_OPTS, span: 2 },
            {
              key: "ambient_min",
              label: L("最低", "Min", "Мин.", "Min"),
              type: "number",
              unit: "℃",
              prefix: "−",
              applies: (v) => v.ambient_band === "other",
            },
            {
              key: "ambient_max",
              label: L("最高", "Max", "Макс.", "Max"),
              type: "number",
              unit: "℃",
              prefix: "+",
              applies: (v) => v.ambient_band === "other",
            },
          ],
        },
      ],
    },
    {
      id: "digital",
      title: L("控制器与通信", "Controller & comms", "Контроллер и связь", "Bộ điều khiển và truyền thông"),
      blurb: L("SHM-KX 就地/远方；HMC-3C 自动调压；IEC 61850 按工程要求。", "SHM-KX local/remote; HMC-3C AVR; IEC 61850 if the project requires it.", "SHM-KX местное/дистанционное; HMC-3C АРН; IEC 61850 по проекту.", "SHM-KX tại chỗ/xa; HMC-3C AVR; IEC 61850 theo công trình."),
      sections: [
        {
          id: "ctrl",
          title: L("控制器", "Controller", "Контроллер", "Bộ điều khiển"),
          fields: [
            { key: "controller", label: L("控制器型号", "Controller model", "Модель контроллера", "Model bộ điều khiển"), type: "select", options: CTRL_OPTS },
            { key: "hmi_language", label: L("界面语言", "HMI language", "Язык интерфейса", "Ngôn ngữ giao diện"), type: "select", options: NAMEPLATE_OPTS },
            { key: "communication", label: L("通信", "Communication", "Связь", "Truyền thông"), type: "select", options: COMM_OPTS },
            { key: "position_tx", label: L("模拟位置输出", "Analogue position output", "Аналоговый выход положения", "Ngõ ra vị trí analog"), type: "select", options: POS_TX_OPTS },
            { key: "parallel", label: L("并列运行", "Parallel operation", "Параллельная работа", "Chạy song song"), type: "radio", options: YES_NO },
            { key: "nameplate_language", label: L("铭牌语言", "Nameplate language", "Язык таблички", "Ngôn ngữ nhãn"), type: "select", options: NAMEPLATE_OPTS },
            ...paintFields(),
          ],
        },
        { id: "notes", title: L("备注", "Notes", "Примечания", "Ghi chú"), fields: [notesField] },
      ],
    },
    contactStep(),
    { id: "review", kind: "review", title: L("核对导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"), blurb: L("核对后选 Word 或 Excel 下载。", "Then download Word or Excel.", "Затем Word или Excel.", "Sau đó tải Word hoặc Excel."), sections: [] },
  ],
};

const hwvIs = (family: string) => family === "HWDK" || family.startsWith("HWDK");

const hwvSheet: SheetDef = {
  id: "hwv",
  meta: {
    id: "hwv",
    title: L("HWV / HWDK 订货单", "HWV / HWDK order sheet", "Бланк заказа HWV / HWDK", "Phiếu HWV / HWDK"),
    short: L("HWV 外附", "HWV", "HWV", "HWV"),
    tag: L("外附油箱 · 真空", "External tank · vacuum", "Боковой бак · вакуум", "Thùng phụ · chân không"),
    summary: L(
      "外附真空有载，官方 2023-8 Word 表。HWV 没有选择器等级。HWDK 常配 SHM-X，回路电流只在 HWDK 填。电机电源到 CMA7 / SHM-D 单。",
      "External-tank vacuum OLTC, official 2023-8 Word form. No selector grade. HWDK often SHM-X. Motor volts stay on the CMA7 / SHM-D sheet.",
      "Вакуумный РПН в боковом баке, бланк Word 2023-8. Без класса B/C/D.",
      "OLTC chân không thùng phụ, phiếu Word 2023-8. Không cấp B/C/D.",
    ),
    accent: "#0f4c81",
  },
  families: HWV_FAMILIES,
  steps: [
    {
      id: "family",
      kind: "family",
      title: L("开关系列", "Tap-changer family", "Серия РПН", "Họ máy"),
      blurb: L(
        "外附油箱，不是箱内开关。HWDK 常配 SHM-X。",
        "External compartment, not in-tank. HWDK often with SHM-X.",
        "Боковой отсек, не в баке. HWDK часто с SHM-X.",
        "Thùng phụ, không trong thùng. HWDK thường SHM-X.",
      ),
      sections: [],
    },
    {
      id: "order",
      title: L("订单与变压器", "Order & transformer", "Заказ и трансформатор", "Đơn và MBA"),
      blurb: L("未填按常规供货。", "Blank = standard supply.", "Пусто = стандарт.", "Trống = tiêu chuẩn."),
      sections: [
        {
          id: "order",
          title: L("订单", "Order", "Заказ", "Đơn"),
          fields: [
            ...orderFields(),
            { key: "destination_port", label: L("目的港", "Destination port", "Порт назначения", "Cảng đến"), type: "text" },
            { key: "transformer_sn", label: L("变压器序号", "Transformer series No.", "Заводской № ТР", "Số series MBA"), type: "text" },
            { key: "huaming_sn", label: L("华明序号", "Huaming series No.", "№ Huaming", "Số series Huaming"), type: "text" },
          ],
        },
        {
          id: "transformer",
          title: L("变压器数据", "Transformer data", "Данные трансформатора", "Dữ liệu MBA"),
          fields: [
            { key: "application", label: L("用途", "Application", "Применение", "Ứng dụng"), type: "select", options: HWV_APP_OPTS },
            {
              key: "application_other",
              label: L("其他用途", "Other application", "Другое применение", "Ứng dụng khác"),
              type: "text",
              applies: (v) => v.application === "other",
            },
            { key: "tx_kind", label: L("变压器结构", "Type of transformer", "Тип трансформатора", "Kiểu MBA"), type: "radio", options: HWV_TX_OPTS, span: 2 },
            { key: "phases", label: L("相数", "Phases", "Число фаз", "Số pha"), type: "radio", options: HWV_PHASE_OPTS, required: true },
            {
              key: "phases_other",
              label: L("其他相数", "Other phases", "Другое число фаз", "Số pha khác"),
              type: "text",
              applies: (v) => v.phases === "other",
            },
            { key: "frequency_hz", label: L("频率", "Frequency", "Частота", "Tần số"), type: "radio", options: HWV_FREQ_OPTS, required: true },
            {
              key: "frequency_other",
              label: L("其他频率", "Other frequency", "Другая частота", "Tần số khác"),
              type: "number",
              unit: "Hz",
              placeholder: L("60", "60", "60", "60"),
              applies: (v) => v.frequency_hz === "other",
            },
            { key: "ambient_temp", label: L("环境温度", "Ambient temperature", "Температура среды", "Nhiệt độ môi trường"), type: "radio", options: HWV_AMBIENT_OPTS, span: 2 },
            {
              key: "ambient_min",
              label: L("最低", "Min", "Мин.", "Min"),
              type: "number",
              unit: "℃",
              prefix: "−",
              placeholder: L("25", "25", "25", "25"),
              applies: (v) => v.ambient_temp === "other",
            },
            {
              key: "ambient_max",
              label: L("最高", "Max", "Макс.", "Max"),
              type: "number",
              unit: "℃",
              prefix: "+",
              placeholder: L("40", "40", "40", "40"),
              applies: (v) => v.ambient_temp === "other",
            },
            { key: "rated_power_mva", label: L("额定容量", "Rated capacity", "Номинальная мощность", "Công suất định mức"), type: "number", unit: "MVA" },
            { key: "capacity_mode", label: L("容量", "Capacity", "Мощность", "Công suất"), type: "radio", options: HWV_CAPACITY_OPTS },
            {
              key: "capacity_from_pos",
              label: L("从哪一档开始递减", "Decreasing from position", "Убывание с положения", "Giảm từ vị trí"),
              type: "text",
              applies: (v) => v.capacity_mode === "decreasing",
            },
            { key: "overload_mode", label: L("过载", "Overload", "Перегрузка", "Quá tải"), type: "radio", options: HWV_OVERLOAD_OPTS },
            {
              key: "overload_pct",
              label: L("过载倍数", "Overload", "Перегрузка", "Quá tải"),
              type: "number",
              unit: "%",
              applies: (v) => v.overload_mode === "above",
            },
            {
              key: "overload_hours",
              label: L("过载小时", "Overload hours", "Часы перегрузки", "Giờ quá tải"),
              type: "number",
              unit: "h",
              applies: (v) => v.overload_mode === "above",
            },
            { key: "hv_kv", label: L("额定电压", "Rated voltage", "Номинальное напряжение", "Điện áp định mức"), type: "number", unit: "kV" },
            { key: "flux", label: L("磁通", "Flux", "Поток", "Từ thông"), type: "radio", options: HWV_FLUX_OPTS, span: 2 },
            { key: "tap_winding", label: L("分接绕组", "Tap winding", "Регулируемая обмотка", "Cuộn nấc"), type: "select", options: HWV_TAP_WINDING_OPTS, span: 2 },
          ],
        },
      ],
    },
    {
      id: "ratings",
      title: L("开关参数", "OLTC ratings", "Параметры РПН", "Thông số OLTC"),
      blurb: L("型号如 HWVIII-400Y/72.5-10193W，没有 B/C/D。", "Type like HWVIII-400Y/72.5-10193W — no B/C/D grade.", "Тип HWVIII-400Y/72.5-10193W без класса B/C/D.", "Kiểu HWVIII-400Y/72.5-10193W, không B/C/D."),
      sections: [
        {
          id: "oltc",
          title: L("有载开关数据", "On-load tap-changer data", "Данные РПН", "Dữ liệu OLTC"),
          fields: [
            { key: "oltc_current_a", label: L("额定通过电流", "Rated through-current", "Ном. ток", "Dòng định mức"), type: "select", unit: "A", required: true },
            { key: "oltc_um_kv", label: L("设备最高电压 Um", "Highest voltage Um", "Наибольшее напряжение Um", "Um"), type: "select", unit: "kV", required: true },
            { key: "oltc_connection", label: L("开关连接", "Connection", "Соединение", "Đấu nối"), type: "radio", options: CONN_OPTS, required: true },
            { key: "regulation", label: L("调压方式", "Regulation", "Режим регулирования", "Kiểu điều áp"), type: "radio", options: REG_OPTS, required: true, span: 2 },
            {
              key: "range_shape",
              label: L("调压范围写法", "Range layout", "Запись диапазона", "Cách ghi dải"),
              type: "radio",
              options: HWV_RANGE_SHAPE_OPTS,
            },
            {
              key: "plus_minus",
              label: L("± 级数 N", "± steps N", "± ступени N", "± nấc N"),
              type: "select",
              required: true,
              applies: (v) => v.range_shape !== "asymmetric" && (v.regulation === "reversing" || v.regulation === "coarse_fine"),
              hint: L("最常见 ±8。中间 3 → 19 档 → 10193W。", "Most common ±8. Mid 3 → 19 pos → 10193W.", "Чаще ±8. Середина 3 → 10193W.", "Phổ biến ±8. Giữa 3 → 10193W."),
              options: PM_STEP_OPTIONS_W.map((n) => ({
                value: String(n),
                label: L(`±${n}`, `±${n}`, `±${n}`, `±${n}`),
              })),
            },
            {
              key: "oltc_tap_mid",
              label: L("中间位置数", "Mid positions", "Средние положения", "Vị trí giữa"),
              type: "select",
              options: [
                { value: "1", label: L("1", "1", "1", "1") },
                { value: "3", label: L("3（常用）", "3 (usual)", "3 (обычно)", "3 (thường)") },
              ],
              applies: (v) => v.regulation === "reversing" || v.regulation === "coarse_fine",
            },
            {
              key: "tap_range_pct",
              label: L("调压范围 ±", "Tap range ±", "Диапазон ±", "Dải ±"),
              type: "text",
              placeholder: L("8×1.25%", "8×1.25%", "8×1.25%", "8×1.25%"),
              applies: (v) => v.range_shape !== "asymmetric",
            },
            {
              key: "range_plus",
              label: L("调压 +%", "Range +%", "Диапазон +%", "Dải +%"),
              type: "number",
              unit: "%",
              applies: (v) => v.range_shape === "asymmetric",
            },
            {
              key: "range_minus",
              label: L("调压 −%", "Range −%", "Диапазон −%", "Dải −%"),
              type: "number",
              unit: "%",
              applies: (v) => v.range_shape === "asymmetric",
            },
            {
              key: "steps_plus",
              label: L("+ 级数", "+ steps", "+ ступени", "+ nấc"),
              type: "text",
              applies: (v) => v.range_shape === "asymmetric",
            },
            {
              key: "steps_minus",
              label: L("− 级数", "− steps", "− ступени", "− nấc"),
              type: "text",
              applies: (v) => v.range_shape === "asymmetric",
            },
            { key: "oltc_tap_positions", label: L("工作位置数 P", "Service positions P", "Рабочие положения P", "Số vị trí P"), type: "number", required: true },
            {
              key: "oltc_tap_pitch",
              label: L("选择器节距", "Selector pitch", "Шаг избирателя", "Bước bộ chọn"),
              type: "select",
              options: [10, 12, 14, 16, 18].map((n) => ({ value: String(n), label: L(String(n), String(n), String(n), String(n)) })),
            },
            {
              key: "tap_code",
              label: L("接线图号", "Connection diagram", "Схема", "Mã sơ đồ"),
              type: "text",
              placeholder: L("例如 10193W", "e.g. 10193W", "напр. 10193W", "vd. 10193W"),
            },
            { key: "through_current_a", label: L("变压器额定电流 I", "Transformer rated current I", "Ном. ток ТР I", "Dòng MBA I"), type: "number", unit: "A" },
            { key: "imax_a", label: L("变压器最大电流 Imax", "Transformer max. current Imax", "Макс. ток Imax", "Dòng max Imax"), type: "number", unit: "A" },
            {
              key: "circulating_a",
              label: L("回路电流（仅 HWDK）", "Circulating current (HWDK only)", "Ток циркуляции (только HWDK)", "Dòng tuần hoàn (chỉ HWDK)"),
              type: "number",
              unit: "A",
              applies: (v) => hwvIs(v.family || ""),
            },
            { key: "ust_mode", label: L("级电压", "Step voltage", "Ступенчатое напряжение", "Điện áp nấc"), type: "radio", options: HWV_UST_OPTS },
            {
              key: "step_voltage_v",
              label: L("Ust", "Ust", "Ust", "Ust"),
              type: "number",
              unit: "V",
              applies: (v) => v.ust_mode !== "variable",
            },
            {
              key: "ust_max",
              label: L("Ust max", "Ust max", "Ust max", "Ust max"),
              type: "number",
              unit: "V",
              applies: (v) => v.ust_mode === "variable",
            },
            {
              key: "ust_min",
              label: L("Ust min", "Ust min", "Ust min", "Ust min"),
              type: "number",
              unit: "V",
              applies: (v) => v.ust_mode === "variable",
            },
            { key: "recovery_voltage_kv", label: L("恢复电压", "Recovery voltage", "Напряжение восстановления", "Điện áp phục hồi"), type: "number", unit: "kV" },
            {
              key: "potential_connection",
              label: L("电位连接", "Potential connection", "Потенциальное соединение", "Đấu thế"),
              type: "select",
              options: POTENTIAL_OPTS,
            },
          ],
        },
        {
          id: "position",
          title: L("档位定义（HWV）", "Position definition (HWV)", "Положения (HWV)", "Vị trí (HWV)"),
          fields: positionFields().map((f) => ({ ...f, applies: (v) => !hwvIs(v.family || "") })),
        },
        {
          id: "hwdk",
          title: L("HWDK 基本接法", "HWDK basic connection", "Базовая схема HWDK", "Sơ đồ HWDK"),
          fields: [
            {
              key: "hwdk_basic",
              label: L("基本接法", "Basic connection", "Базовая схема", "Sơ đồ cơ bản"),
              type: "select",
              options: HWV_HWDK_CONN_OPTS,
              span: 2,
              applies: (v) => hwvIs(v.family || ""),
            },
          ],
        },
      ],
    },
    {
      id: "construction",
      title: L("绝缘与安装", "Insulation & mounting", "Изоляция и монтаж", "Cách điện và lắp"),
      blurb: L("对地耐受随 Um 自动填，可改。空白按常规。", "Earth withstand fills from Um; override if specified. Blank = standard.", "Изоляция на землю из Um.", "Chịu điện đối đất theo Um."),
      sections: [
        {
          id: "insulation",
          title: L("绝缘数据", "Insulation data", "Изоляционные данные", "Dữ liệu cách điện"),
          fields: [
            { key: "ins_earth_pf_kv", label: L("对地工频", "To earth, power frequency", "На землю, пром. частота", "Đối đất tần số công nghiệp"), type: "number", unit: "kV" },
            { key: "ins_earth_li_kv", label: L("对地雷电冲击", "To earth, lightning impulse", "На землю, импульс", "Đối đất xung sét"), type: "number", unit: "kV" },
            { key: "ins_a_pf_kv", label: L("同相调压绕组工频 (a)", "Across winding (a), PF", "Обмотка (a), пром. частота", "Cuộn (a) tần số"), type: "number", unit: "kV" },
            { key: "ins_a_li_kv", label: L("同相调压绕组冲击 (a)", "Across winding (a), LI", "Обмотка (a), импульс", "Cuộn (a) xung"), type: "number", unit: "kV" },
            { key: "ins_a1_pf_kv", label: L("选择器级间工频 (a1)", "Between taps (a1), PF", "Между ответвл. (a1)", "Giữa nấc (a1) tần số"), type: "number", unit: "kV" },
            { key: "ins_a1_li_kv", label: L("选择器级间冲击 (a1)", "Between taps (a1), LI", "Между ответвл. (a1), импульс", "Giữa nấc (a1) xung"), type: "number", unit: "kV" },
            { key: "ins_b_pf_kv", label: L("相间工频 (b)", "Between phases (b), PF", "Между фазами (b)", "Giữa pha (b) tần số"), type: "number", unit: "kV" },
            { key: "ins_b_li_kv", label: L("相间冲击 (b)", "Between phases (b), LI", "Между фазами (b), импульс", "Giữa pha (b) xung"), type: "number", unit: "kV" },
          ],
        },
        {
          id: "mount",
          title: L("安装", "Mounting", "Монтаж", "Lắp đặt"),
          fields: [{ key: "oltc_mounting", label: L("安装方式", "Mounting", "Способ установки", "Cách lắp"), type: "radio", options: HWV_MOUNT_OPTS, span: 2 }],
        },
      ],
    },
    {
      id: "package",
      title: L("附件", "Accessories", "Аксессуары", "Phụ kiện"),
      blurb: L(
        "机构只选型号。电机电源、加热、位置传送请到 CMA7 或 SHM-D 单。SHM-X 只在本单勾选。",
        "Pick the MDU family only. Motor supply stays on the CMA7 or SHM-D sheet. SHM-X is ticked here.",
        "Только тип привода. Питание — в бланке CMA7 / SHM-D.",
        "Chỉ chọn kiểu cơ cấu. Nguồn motor điền ở phiếu CMA7 / SHM-D.",
      ),
      sections: [
        {
          id: "drive",
          title: L("所配电动机构", "Matching motor drive", "Привод", "Bộ truyền động"),
          fields: [
            {
              key: "mdu_model",
              label: L("电动机构", "Motor drive unit", "Привод", "Bộ truyền động"),
              type: "radio",
              options: HWV_MDU_OPTS,
              span: 2,
              hint: L("HWDK 常用 SHM-X。不要在这张单上填电机电压。", "HWDK usually SHM-X. Do not put motor volts on this sheet.", "HWDK обычно SHM-X. Напряжение двигателя не сюда.", "HWDK thường SHM-X. Không ghi điện áp motor ở phiếu này."),
            },
            { key: "controller", label: L("控制器", "Controller", "Контроллер", "Bộ điều khiển"), type: "select", options: HWV_CTRL_OPTS },
          ],
        },
        {
          id: "accessories",
          title: L("附件", "Accessories", "Аксессуары", "Phụ kiện"),
          fields: [
            { key: "protective_relay", label: L("保护继电器", "Protective relay", "Защитное реле", "Rơle bảo vệ"), type: "select", options: HWV_RELAY_OPTS, span: 2 },
            {
              key: "relay_other",
              label: L("其他继电器", "Other relay", "Другое реле", "Rơle khác"),
              type: "text",
              applies: (v) => v.protective_relay === "other",
            },
            { key: "pressure_relief", label: L("压力释放", "Pressure relief", "Сброс давления", "Xả áp"), type: "select", options: HWV_PRV_OPTS, span: 2 },
            { key: "paint", label: L("漆色", "Paint", "Окраска", "Màu sơn"), type: "select", options: PAINT_OPTS },
            {
              key: "paint_other",
              label: L("其他漆色", "Other paint", "Другая окраска", "Màu sơn khác"),
              type: "text",
              applies: (v) => v.paint === "other",
            },
            {
              key: "corrosive_class",
              label: L("防腐等级", "Corrosive class", "Класс коррозии", "Cấp ăn mòn"),
              type: "select",
              options: CORROSIVE_OPTS,
            },
            { key: "nameplate_language", label: L("铭牌语言", "Nameplate language", "Язык таблички", "Ngôn ngữ nhãn"), type: "select", options: NAMEPLATE_OPTS },
          ],
        },
        { id: "notes", title: L("备注", "Notes", "Примечания", "Ghi chú"), fields: [notesField] },
      ],
    },
    contactStep(),
    {
      id: "review",
      kind: "review",
      title: L("核对导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"),
      blurb: L("核完整张单，再下载官方 Word 订货表。", "Read the whole sheet, then download the official Word OS.", "Просмотрите бланк и скачайте Word.", "Xem cả phiếu rồi tải Word."),
      sections: [],
    },
  ],
};

export const SHEETS: SheetDef[] = [oltcSheet, octcSheet, drySheet, cma7Sheet, shmSheet, hwvSheet];

export function getSheet(id: string | undefined): SheetDef | undefined {
  return SHEETS.find((s) => s.id === id);
}

export function applicableFields(section: SectionDef, values: OrderValues): FieldDef[] {
  return section.fields.filter((f) => (f.applies ? f.applies(values) : true));
}

export function allFields(sheet: SheetDef, values: OrderValues): { section: SectionDef; field: FieldDef }[] {
  const out: { section: SectionDef; field: FieldDef }[] = [];
  for (const step of sheet.steps) {
    for (const section of step.sections) {
      for (const field of applicableFields(section, values)) {
        out.push({ section, field });
      }
    }
  }
  return out;
}

export function missingRequired(sheet: SheetDef, values: OrderValues): FieldDef[] {
  return allFields(sheet, values).filter(({ field }) => field.required && !String(values[field.key] ?? "").trim()).map((x) => x.field);
}

export function resolveFieldOptions(field: FieldDef, values: OrderValues): FieldDef {
  if (field.key === "oltc_side") {
    const opts = String(values.mv_kv ?? "").trim() ? OLTC_SIDE_OPTS : OLTC_SIDE_OPTS.filter((o) => o.value !== "mv");
    return { ...field, options: opts };
  }
  if (field.key === "plus_minus") {
    const steps = values.regulation === "coarse_fine" ? PM_STEP_OPTIONS_G : PM_STEP_OPTIONS_W;
    return {
      ...field,
      options: steps.map((n) => ({
        value: String(n),
        label: { zh: `±${n}`, en: `±${n}`, ru: `±${n}`, vi: `±${n}` },
      })),
    };
  }
  if (field.key === "oltc_current_a" || field.key === "current_a") {
    const fam = getFamily(values.family || "");
    const amps = fam ? (fam.currents[(values.phases as "I" | "II" | "III") || "III"] ?? fam.currents.III ?? fam.currents.I ?? []) : [];
    if (amps.length) return { ...field, options: currentOptions(amps) };
  }
  if (field.key === "oltc_um_kv" || field.key === "um_kv") {
    const fam = getFamily(values.family || "");
    return { ...field, options: umOptions(fam?.umKv) };
  }
  if (field.key === "oltc_selector_grade") {
    const um = Number(values.oltc_um_kv || 0);
    const floor = um ? defaultSelectorGrade(um) : "B";
    const rank: Record<string, number> = { B: 1, C: 2, D: 3, DE: 4 };
    const min = rank[floor] ?? 1;
    return {
      ...field,
      options: (field.options ?? []).filter((o) => (rank[o.value] ?? 0) >= min),
    };
  }
  return field;
}

export const SHEET_IDS: SheetId[] = SHEETS.map((s) => s.id);
