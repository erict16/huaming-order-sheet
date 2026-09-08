import {
  APP_OPTS,
  CONN_OPTS,
  CTRL_OPTS,
  CTRL_VOLT_OPTS,
  COMM_OPTS,
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
  PAINT_OPTS,
  PHASE_OPTS,
  PIPE_OPTS,
  POS_TX_OPTS,
  PRV_OPTS,
  REG_OPTS,
  RELAY_OPTS,
  SHM_MODEL_OPTS,
  SIDE_OPTS,
  STD_OPTS,
  YES_NO,
  currentOptions,
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
    { key: "order_no", label: L("订单号 / 询价号", "Order / enquiry no.", "Номер заказа / запроса", "Số đơn / báo giá"), type: "text", placeholder: L("例如 E-CM260001", "e.g. E-CM260001", "напр. E-CM260001", "vd. E-CM260001") },
    { key: "order_date", label: L("日期", "Date", "Дата", "Ngày"), type: "date" },
    { key: "buyer", label: L("买方 / 变压器厂", "Buyer / transformer maker", "Покупатель / завод ТР", "Bên mua / nhà máy MBA"), type: "text", required: true, span: 2 },
    { key: "end_user", label: L("最终用户", "End user", "Конечный пользователь", "Người dùng cuối"), type: "text" },
    { key: "country", label: L("国家 / 地区", "Country / region", "Страна / регион", "Quốc gia / khu vực"), type: "text", required: true },
    { key: "project", label: L("工程名称", "Project", "Объект", "Công trình"), type: "text" },
    { key: "quantity", label: L("数量", "Quantity", "Количество", "Số lượng"), type: "number", unit: "pcs", required: true },
    { key: "designer_name", label: L("设计人", "Designer", "Проектировщик", "Người thiết kế"), type: "text" },
    { key: "designer_email", label: L("邮箱", "Email", "Эл. почта", "Email"), type: "text" },
    { key: "designer_phone", label: L("电话", "Phone", "Телефон", "Điện thoại"), type: "text" },
    { key: "delivery_date", label: L("要货期", "Delivery date", "Срок поставки", "Ngày giao"), type: "date" },
    { key: "hm_product_no", label: L("华明产品编号", "Huaming product no.", "Номер изделия Huaming", "Mã sản phẩm Huaming"), type: "text" },
  ];
}

function transformerFields(opts?: { fluid?: boolean }): FieldDef[] {
  const fields: FieldDef[] = [
    { key: "application", label: L("用途", "Application", "Применение", "Ứng dụng"), type: "select", options: APP_OPTS },
    { key: "transformer_type", label: L("变压器型号", "Transformer type", "Тип трансформатора", "Kiểu MBA"), type: "text" },
    { key: "rated_power_mva", label: L("额定容量", "Rated power", "Номинальная мощность", "Công suất định mức"), type: "number", unit: "MVA", required: true },
    { key: "hv_kv", label: L("高压额定电压", "HV rated voltage", "Ном. напряжение ВН", "Điện áp cao"), type: "number", unit: "kV" },
    { key: "lv_kv", label: L("低压额定电压", "LV rated voltage", "Ном. напряжение НН", "Điện áp hạ"), type: "number", unit: "kV" },
    { key: "vector_group", label: L("联结组别", "Vector group", "Группа соединения", "Tổ đấu dây"), type: "text", placeholder: L("例如 YNd11", "e.g. YNd11", "напр. YNd11", "vd. YNd11") },
    { key: "frequency_hz", label: L("频率", "Frequency", "Частота", "Tần số"), type: "radio", options: FREQ_OPTS, required: true },
    { key: "phases", label: L("相数", "Phases", "Число фаз", "Số pha"), type: "radio", options: PHASE_OPTS, required: true },
    { key: "standard", label: L("标准", "Standard", "Стандарт", "Tiêu chuẩn"), type: "select", options: STD_OPTS },
    { key: "ambient_temp", label: L("环境温度", "Ambient temperature", "Температура среды", "Nhiệt độ môi trường"), type: "text", placeholder: L("−25 / +40 °C", "-25 / +40 °C", "−25 / +40 °C", "−25 / +40 °C") },
    { key: "altitude_m", label: L("海拔", "Altitude", "Высота над ур. моря", "Độ cao"), type: "number", unit: "m" },
  ];
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
      key: "oltc_current_a",
      label: L("额定通过电流 Ium", "Rated through-current Ium", "Ном. ток Ium", "Dòng định mức Ium"),
      type: "select",
      unit: "A",
      required: true,
      hint: L("按目录取不小于变压器分接电流的档。没有 CV2-500。", "Next catalogue rating ≥ tap winding current. No CV2-500.", "Ближайший каталожный ток ≥ тока обмотки. Нет CV2-500.", "Lấy cấp catalogue ≥ dòng quấn điều áp. Không có CV2-500."),
    },
    {
      key: "oltc_um_kv",
      label: L("设备最高电压 Um", "Highest voltage Um", "Наибольшее напряжение Um", "Điện áp thiết bị Um"),
      type: "select",
      unit: "kV",
      required: true,
      hint: L("开关绝缘等级，不是变压器 Un。66 kV 变用 72.5。", "OLTC insulation class, not transformer Un. 66 kV transformer → 72.5.", "Класс изоляции РПН, не Un трансформатора. 66 кВ → 72.5.", "Cấp cách điện OLTC, không phải Un MBA. 66 kV → 72.5."),
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
    { key: "step_voltage_v", label: L("级电压 Ust", "Step voltage Ust", "Ступенчатое напряжение Ust", "Điện áp nấc Ust"), type: "number", unit: "V" },
    { key: "through_current_a", label: L("变压器分接电流", "Transformer tap current", "Ток регулируемой обмотки", "Dòng quấn điều áp"), type: "number", unit: "A" },
    { key: "tap_range_pct", label: L("调压范围", "Tap range", "Диапазон регулирования", "Dải điều áp"), type: "text", placeholder: L("±8×1.25%", "±8×1.25%", "±8×1.25%", "±8×1.25%") },
  ];
}

function positionFields(): FieldDef[] {
  return [
    { key: "pos_max", label: L("最高档位号", "Max position no.", "Макс. положение", "Vị trí max"), type: "text", placeholder: L("例如 1 或 16", "e.g. 1 or 16", "напр. 1 или 16", "vd. 1 hoặc 16") },
    { key: "pos_mid", label: L("额定档位号", "Rated / mid position", "Ном. / среднее положение", "Vị trí định mức"), type: "text" },
    { key: "pos_min", label: L("最低档位号", "Min position no.", "Мин. положение", "Vị trí min"), type: "text" },
    { key: "raise_direction", label: L("升压方向", "Raise-voltage direction", "Направление повышения", "Hướng tăng áp"), type: "text", placeholder: L("例如 1→n 升压", "e.g. 1→n raises voltage", "напр. 1→n повышает", "vd. 1→n tăng áp") },
  ];
}

function mechanicalFields(): FieldDef[] {
  return [
    { key: "flange_type", label: L("安装法兰", "Mounting flange", "Монтажный фланец", "Mặt bích lắp"), type: "radio", options: FLANGE_OPTS },
    { key: "drive_shaft_horizontal_mm", label: L("水平传动轴长度", "Horizontal drive shaft", "Горизонтальный вал", "Trục ngang"), type: "number", unit: "mm" },
    { key: "drive_shaft_vertical_mm", label: L("垂直传动轴长度", "Vertical drive shaft", "Вертикальный вал", "Trục đứng"), type: "number", unit: "mm" },
    { key: "bevel_gear", label: L("伞齿轮", "Bevel gearbox", "Конический редуктор", "Hộp bánh côn"), type: "select", options: YES_NO },
    { key: "head_variant", label: L("头部型式", "Head variant", "Вариант головки", "Kiểu đầu"), type: "text" },
    { key: "mdu_side", label: L("机构布置", "MDU side", "Сторона привода", "Bên cơ cấu"), type: "radio", options: SIDE_OPTS },
  ];
}

function insulationFields(): FieldDef[] {
  return [
    { key: "ins_earth_pf_kv", label: L("对地工频耐受", "Earth power-frequency withstand", "Испыт. напряжение пром. частоты", "Chịu tần số công nghiệp đối đất"), type: "number", unit: "kV", hint: L("随 Um 自动填目录值，可改。", "Filled from Um table; override if specified.", "Из таблицы Um; можно изменить.", "Theo bảng Um; có thể sửa.") },
    { key: "ins_earth_li_kv", label: L("对地雷电冲击", "Earth lightning impulse (BIL)", "Грозовой импульс на землю", "Xung sét đối đất (BIL)"), type: "number", unit: "kV" },
    { key: "across_bil_kv", label: L("级间雷电冲击", "Across-tap BIL", "Импульс между ответвлениями", "BIL giữa nấc"), type: "number", unit: "kV" },
    { key: "across_pf_kv", label: L("级间工频", "Across-tap power frequency", "Пром. частота между ответвлениями", "Tần số công nghiệp giữa nấc"), type: "number", unit: "kV" },
    { key: "ins_distance_note", label: L("内部绝缘距离 a / a1 / b / c1 / c2 / d", "Internal distances a / a1 / b / c1 / c2 / d", "Внутр. расстояния a / a1 / b / c1 / c2 / d", "Khoảng cách trong a / a1 / b / c1 / c2 / d"), type: "text", span: 2 },
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

function accessoryFields(opts?: { oil?: boolean }): FieldDef[] {
  const f: FieldDef[] = [];
  if (opts?.oil !== false) {
    f.push(
      { key: "protective_relay", label: L("保护继电器", "Protective relay", "Защитное реле", "Rơle bảo vệ"), type: "select", options: RELAY_OPTS },
      { key: "oil_filter", label: L("在线滤油机", "Online oil filter", "Фильтр масла", "Lọc dầu online"), type: "select", options: FILTER_OPTS },
      { key: "pipe_fittings", label: L("管接头", "Pipe fittings", "Патрубки", "Ống nối"), type: "select", options: PIPE_OPTS },
      { key: "pressure_relief", label: L("压力释放", "Pressure relief", "Сброс давления", "Xả áp"), type: "select", options: PRV_OPTS },
      { key: "oil_sampling", label: L("取油样阀", "Oil sampling", "Отбор проб масла", "Van lấy mẫu dầu"), type: "select", options: YES_NO },
    );
  }
  f.push(
    { key: "rain_cover", label: L("防雨罩", "Rain cover", "Защитный кожух", "Nắp che mưa"), type: "select", options: YES_NO },
    { key: "paint", label: L("漆色", "Paint", "Окраска", "Màu sơn"), type: "select", options: PAINT_OPTS },
    { key: "nameplate_language", label: L("铭牌语言", "Nameplate language", "Язык таблички", "Ngôn ngữ nhãn"), type: "select", options: NAMEPLATE_OPTS },
  );
  return f;
}

const oltcSheet: SheetDef = {
  id: "oltc",
  meta: {
    id: "oltc",
    title: L("有载分接开关订货单", "OLTC order sheet", "Бланк заказа РПН", "Phiếu đặt hàng OLTC"),
    short: L("有载 OLTC", "OLTC", "РПН", "OLTC"),
    tag: L("油浸 / 真空", "Oil / vacuum", "Масло / вакуум", "Dầu / chân không"),
    summary: L(
      "CM / CMD / CV / CV2 / CM2 / SHZV 等油浸与真空有载。填写变压器、开关额定、分接代码、安装和机构。",
      "Oil and vacuum on-load families: CM, CMD, CV, CV2, CM2, SHZV… Transformer, ratings, tap code, mounting, drive.",
      "Масляные и вакуумные РПН: CM, CMD, CV, CV2, CM2, SHZV…",
      "OLTC dầu và chân không: CM, CMD, CV, CV2, CM2, SHZV…",
    ),
    accent: "#00428C",
  },
  families: OLTC_FAMILIES,
  steps: [
    {
      id: "family",
      kind: "family",
      title: L("开关系列", "Tap-changer family", "Серия РПН", "Họ máy"),
      blurb: L("系列决定后面能选的电流、Um 和是否出现绝缘等级字母。", "Family drives current, Um and whether a grade letter appears.", "Серия задаёт ток, Um и букву класса.", "Họ máy quyết định dòng, Um và chữ cấp cách điện."),
      sections: [],
    },
    {
      id: "order",
      title: L("订单与变压器", "Order & transformer", "Заказ и трансформатор", "Đơn và MBA"),
      blurb: L("谁订、给哪台变、容量和电压。", "Who orders, which transformer, power and voltage.", "Кто заказывает, какой ТР, мощность и напряжение.", "Ai đặt, MBA nào, công suất và điện áp."),
      sections: [
        { id: "order", title: L("订单 / 联系人", "Order / contact", "Заказ / контакт", "Đơn / liên hệ"), fields: orderFields() },
        { id: "transformer", title: L("变压器数据", "Transformer data", "Данные трансформатора", "Dữ liệu MBA"), fields: transformerFields() },
      ],
    },
    {
      id: "ratings",
      title: L("开关参数", "OLTC ratings", "Параметры РПН", "Thông số OLTC"),
      blurb: L("电流、Um、Y/D、调压方式和分接代码会拼成型号。", "Current, Um, Y/D, regulation and tap code become the type string.", "Ток, Um, Y/D и код ответвлений складываются в тип.", "Dòng, Um, Y/D và mã nấc thành chuỗi kiểu."),
      sections: [
        { id: "oltc", title: L("有载开关数据", "On-load tap-changer data", "Данные РПН", "Dữ liệu OLTC"), hint: L("组合式型号带 B/C/D/DE；复合式 CV/CV2/SV 不带。", "Combined types carry B/C/D/DE; compound CV/CV2/SV do not.", "Комбинированные — с буквой; составные CV/CV2/SV — без.", "Tổ hợp có B/C/D/DE; compound CV/CV2/SV không."), fields: oltcRatingFields() },
        { id: "position", title: L("档位定义", "Position definition", "Определение положений", "Định nghĩa vị trí"), fields: positionFields() },
      ],
    },
    {
      id: "construction",
      title: L("结构与绝缘", "Construction & insulation", "Конструкция и изоляция", "Kết cấu và cách điện"),
      blurb: L("法兰、传动轴、对地和级间绝缘。不清楚可留空，按常规。", "Flange, shafts, earth and across-tap insulation. Leave blank for standard.", "Фланец, валы, изоляция. Пусто = стандарт.", "Mặt bích, trục, cách điện. Trống = tiêu chuẩn."),
      sections: [
        { id: "mechanical", title: L("机械 / 安装", "Mechanical / mounting", "Механика / монтаж", "Cơ khí / lắp đặt"), fields: mechanicalFields() },
        { id: "insulation", title: L("绝缘数据", "Insulation data", "Изоляционные данные", "Dữ liệu cách điện"), fields: insulationFields() },
      ],
    },
    {
      id: "package",
      title: L("机构与附件", "Drive & accessories", "Привод и аксессуары", "Truyền động và phụ kiện"),
      blurb: L("CMA7 / SHM-D、控制器、滤油机、保护继电器。", "CMA7 / SHM-D, controller, oil filter, protective relay.", "CMA7 / SHM-D, контроллер, фильтр, реле.", "CMA7 / SHM-D, bộ điều khiển, lọc dầu, rơle."),
      sections: [
        { id: "drive", title: L("电动机构与控制", "Motor drive & control", "Привод и управление", "Truyền động và điều khiển"), fields: driveFields() },
        { id: "accessories", title: L("附件", "Accessories", "Аксессуары", "Phụ kiện"), fields: accessoryFields() },
        { id: "notes", title: L("备注", "Notes", "Примечания", "Ghi chú"), fields: [notesField] },
      ],
    },
    {
      id: "review",
      kind: "review",
      title: L("核对导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"),
      blurb: L("看完整张单，再下载 Excel。", "Read the whole sheet, then download Excel.", "Просмотрите бланк и скачайте Excel.", "Xem cả phiếu rồi tải Excel."),
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
        { id: "order", title: L("订单 / 联系人", "Order / contact", "Заказ / контакт", "Đơn / liên hệ"), fields: orderFields() },
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
        { id: "mechanical", title: L("安装", "Mounting", "Монтаж", "Lắp đặt"), fields: mechanicalFields().filter((f) => f.key !== "flange_type") },
        { id: "drive", title: L("若配电动机构", "If motorized", "Если с приводом", "Nếu có động cơ"), fields: driveFields(false), hint: L("手轮方案可跳过。", "Skip if handwheel.", "Пропустите при штурвале.", "Bỏ qua nếu tay quay.") },
        { id: "notes", title: L("备注", "Notes", "Примечания", "Ghi chú"), fields: [notesField] },
      ],
    },
    { id: "review", kind: "review", title: L("核对导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"), blurb: L("核对后下载 Excel。", "Download Excel after review.", "После проверки — Excel.", "Sau khi kiểm tra, tải Excel."), sections: [] },
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
        { id: "order", title: L("订单 / 联系人", "Order / contact", "Заказ / контакт", "Đơn / liên hệ"), fields: orderFields() },
        { id: "transformer", title: L("干式变压器", "Dry-type transformer", "Сухой трансформатор", "MBA khô"), fields: transformerFields({ fluid: false }) },
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
    { id: "review", kind: "review", title: L("核对导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"), blurb: L("核对后下载 Excel。", "Download Excel after review.", "После проверки — Excel.", "Sau khi kiểm tra, tải Excel."), sections: [] },
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
        { id: "order", title: L("订单 / 联系人", "Order / contact", "Заказ / контакт", "Đơn / liên hệ"), fields: orderFields() },
        {
          id: "match",
          title: L("所配开关", "Matching tap changer", "Сопряжённый РПН", "Máy đi kèm"),
          fields: [
            matchingOltcField(),
            { key: "mdu_positions", label: L("操作位置数", "Operating positions", "Число положений", "Số vị trí thao tác"), type: "number", required: true },
            { key: "raise_direction", label: L("升压方向", "Raise-voltage direction", "Направление повышения", "Hướng tăng áp"), type: "text" },
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
            { key: "motor_voltage", label: L("电机电源", "Motor supply", "Питание двигателя", "Nguồn động cơ"), type: "select", options: MOTOR_VOLT_OPTS, required: true },
            { key: "control_voltage", label: L("控制电压", "Control voltage", "Напряжение управления", "Điện áp điều khiển"), type: "select", options: CTRL_VOLT_OPTS, required: true },
            { key: "remote_control", label: L("远方控制", "Remote control", "Дистанционное управление", "Điều khiển xa"), type: "radio", options: YES_NO },
            { key: "heater", label: L("加热器", "Heater", "Обогреватель", "Sưởi"), type: "radio", options: YES_NO },
            { key: "mdu_ip", label: L("防护等级", "Ingress protection", "Степень защиты", "Cấp bảo vệ"), type: "select", options: IP_OPTS },
          ],
        },
      ],
    },
    {
      id: "mech",
      title: L("机械与信号", "Mechanical & signals", "Механика и сигналы", "Cơ khí và tín hiệu"),
      blurb: L("位置指示、并列、额外接点。", "Position indication, parallel, extra contacts.", "Индикация, параллель, доп. контакты.", "Báo vị trí, song song, tiếp điểm thêm."),
      sections: [
        {
          id: "signals",
          title: L("位置与并列", "Position & parallel", "Положение и параллель", "Vị trí và song song"),
          fields: [
            { key: "position_tx", label: L("位置传送", "Position transmitter", "Датчик положения", "Tín hiệu vị trí"), type: "select", options: POS_TX_OPTS },
            { key: "extra_contacts", label: L("额外接点对数", "Extra contact pairs", "Доп. пары контактов", "Số cặp tiếp điểm thêm"), type: "number" },
            { key: "parallel", label: L("并列运行", "Parallel operation", "Параллельная работа", "Chạy song song"), type: "radio", options: YES_NO },
            { key: "mdu_side", label: L("安装位置", "Mounting side", "Сторона установки", "Bên lắp"), type: "radio", options: SIDE_OPTS },
            { key: "ambient_temp", label: L("环境温度", "Ambient temperature", "Температура среды", "Nhiệt độ môi trường"), type: "text" },
            { key: "nameplate_language", label: L("铭牌语言", "Nameplate language", "Язык таблички", "Ngôn ngữ nhãn"), type: "select", options: NAMEPLATE_OPTS },
            { key: "paint", label: L("漆色", "Paint", "Окраска", "Màu sơn"), type: "select", options: PAINT_OPTS },
          ],
        },
        { id: "notes", title: L("备注", "Notes", "Примечания", "Ghi chú"), fields: [notesField] },
      ],
    },
    { id: "review", kind: "review", title: L("核对导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"), blurb: L("核对后下载 Excel。", "Download Excel after review.", "После проверки — Excel.", "Sau khi kiểm tra, tải Excel."), sections: [] },
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
      "SHM-D / SHM-DL 数字电动机构，可配 SHM-K、HMC-3C、通信（Modbus / IEC 61850）。",
      "SHM-D / SHM-DL digital drive, optional SHM-K / HMC-3C and comms (Modbus / IEC 61850).",
      "Цифровой SHM-D / SHM-DL, опции SHM-K / HMC-3C и связи.",
      "Bộ số SHM-D / SHM-DL, tuỳ chọn SHM-K / HMC-3C và truyền thông.",
    ),
    accent: "#6d28d9",
  },
  steps: [
    {
      id: "order",
      title: L("订单与所配开关", "Order & matching switch", "Заказ и РПН", "Đơn và máy đi kèm"),
      blurb: L("数字机构同样必须对上档位数和开关型号。", "The digital drive must still match type and positions.", "Цифровой привод тоже должен совпадать по типу и положениям.", "Bộ số vẫn phải khớp kiểu và số vị trí."),
      sections: [
        { id: "order", title: L("订单 / 联系人", "Order / contact", "Заказ / контакт", "Đơn / liên hệ"), fields: orderFields() },
        {
          id: "match",
          title: L("所配开关与型号", "Matching switch & model", "РПН и модель", "Máy và model"),
          fields: [
            matchingOltcField(),
            { key: "shm_model", label: L("机构型号", "Drive model", "Модель привода", "Model bộ truyền"), type: "radio", options: SHM_MODEL_OPTS, required: true, span: 2 },
            { key: "mdu_positions", label: L("操作位置数", "Operating positions", "Число положений", "Số vị trí"), type: "number", required: true },
            { key: "raise_direction", label: L("升压方向", "Raise-voltage direction", "Направление повышения", "Hướng tăng áp"), type: "text" },
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
            { key: "ambient_temp", label: L("环境温度", "Ambient temperature", "Температура среды", "Nhiệt độ môi trường"), type: "text" },
          ],
        },
      ],
    },
    {
      id: "digital",
      title: L("控制器与通信", "Controller & comms", "Контроллер и связь", "Bộ điều khiển và truyền thông"),
      blurb: L("SHM-K 就地/远方；HMC-3C 自动调压；IEC 61850 按工程要求。", "SHM-K local/remote; HMC-3C AVR; IEC 61850 if the project requires it.", "SHM-K местное/дистанционное; HMC-3C АРН; IEC 61850 по проекту.", "SHM-K tại chỗ/xa; HMC-3C AVR; IEC 61850 theo công trình."),
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
            { key: "paint", label: L("漆色", "Paint", "Окраска", "Màu sơn"), type: "select", options: PAINT_OPTS },
          ],
        },
        { id: "notes", title: L("备注", "Notes", "Примечания", "Ghi chú"), fields: [notesField] },
      ],
    },
    { id: "review", kind: "review", title: L("核对导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"), blurb: L("核对后下载 Excel。", "Download Excel after review.", "После проверки — Excel.", "Sau khi kiểm tra, tải Excel."), sections: [] },
  ],
};

export const SHEETS: SheetDef[] = [oltcSheet, octcSheet, drySheet, cma7Sheet, shmSheet];

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
  return field;
}

export const SHEET_IDS: SheetId[] = SHEETS.map((s) => s.id);
