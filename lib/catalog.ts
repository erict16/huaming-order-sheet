import { L, opt } from "./copy";
import type { FamilyDef, PhaseCode } from "./types";

export const EARTH_INSULATION: Record<number, { pf: number; bil: number }> = {
  12: { pf: 35, bil: 75 },
  17.5: { pf: 45, bil: 105 },
  40.5: { pf: 90, bil: 250 },
  72.5: { pf: 140, bil: 350 },
  126: { pf: 230, bil: 550 },
  145: { pf: 275, bil: 650 },
  170: { pf: 325, bil: 750 },
  252: { pf: 460, bil: 1050 },
  300: { pf: 480, bil: 1100 },
  363: { pf: 510, bil: 1175 },
};

export const UM_UN_HINT: Record<number, string> = {
  12: "10 kV",
  17.5: "15 kV",
  40.5: "33 kV",
  72.5: "66 kV",
  126: "110 kV",
  145: "132 kV",
  170: "150 kV",
  252: "220 kV",
  300: "275 kV",
  363: "330 kV",
};

export const UM_KV = [12, 17.5, 40.5, 72.5, 126, 145, 170, 252, 300, 363] as const;

export const SELECTOR_SIZES_BY_UM: Record<number, string[]> = {
  40.5: ["B", "C"],
  72.5: ["B", "C", "D", "DE"],
  126: ["B", "C", "D", "DE"],
  145: ["C", "D", "DE"],
  170: ["B", "C", "D", "DE"],
  252: ["C", "D", "DE"],
  300: ["DE"],
  363: ["DE"],
};

export function defaultSelectorGrade(um: number): string {
  if (!um) return "";
  if (um <= 72.5) return "B";
  if (um <= 145) return "C";
  if (um <= 252) return "D";
  return "DE";
}

export const OLTC_FAMILIES: FamilyDef[] = [
  {
    code: "CM",
    category: "oil_combined",
    hasSelectorGrade: true,
    structure: "combined",
    vacuum: false,
    currents: { I: [500, 600, 800, 1200, 1500], II: [500, 600], III: [500, 600] },
    umKv: [72.5, 126, 170, 252],
    desc: L(
      "油浸组合式（切换开关+选择器），箱内安装。",
      "Oil combined (diverter + selector), in-tank.",
      "Масляный комбинированный (контактор + избиратель), в баке.",
      "OLTC dầu kiểu tổ hợp (chuyển mạch + chọn nấc), trong thùng.",
    ),
  },
  {
    code: "CMD",
    category: "oil_combined",
    hasSelectorGrade: true,
    structure: "combined",
    vacuum: false,
    currents: { I: [400, 600, 1000, 1600, 2400], III: [400, 600, 1000] },
    umKv: [72.5, 126, 170, 252],
    desc: L(
      "油浸组合式大电流，箱内安装。",
      "Oil combined, high-current, in-tank.",
      "Масляный комбинированный, большой ток, в баке.",
      "OLTC dầu tổ hợp dòng lớn, trong thùng.",
    ),
  },
  {
    code: "CV",
    category: "oil_compound",
    hasSelectorGrade: false,
    structure: "compound",
    vacuum: false,
    currents: { I: [350, 700], III: [350] },
    umKv: [40.5, 72.5],
    desc: L(
      "油浸复合式选择开关，箱盖安装。最常见 35/66 kV 油变方案。",
      "Oil compound selector-switch, on-tank head. Common for 33/66 kV.",
      "Масляный составной, на крышке бака. Типичен для 33/66 кВ.",
      "OLTC dầu kiểu selector-switch, lắp nắp thùng. Phổ biến 33/66 kV.",
    ),
  },
  {
    code: "SV",
    category: "oil_compound",
    hasSelectorGrade: false,
    structure: "compound",
    vacuum: false,
    currents: { III: [500] },
    umKv: [40.5, 72.5],
    desc: L(
      "油浸复合式 500 A 三相（CV 的 500 A 规格）。",
      "Oil compound 500 A three-phase (CV 500 A class).",
      "Масляный составной 500 А, три фазы.",
      "OLTC dầu compound 500 A ba pha.",
    ),
  },
  {
    code: "CM2",
    aliases: ["VCM"],
    category: "vacuum_combined",
    hasSelectorGrade: true,
    structure: "combined",
    vacuum: true,
    currents: { I: [500, 600, 800, 1200, 1500], II: [500, 600], III: [500, 600] },
    umKv: [72.5, 126, 170, 252],
    desc: L(
      "真空组合式（油+真空灭弧），箱内。CM 的真空升级。",
      "Vacuum combined (oil + vacuum interrupter), in-tank. Vacuum CM.",
      "Вакуумный комбинированный, в баке. Вакуумная версия CM.",
      "OLTC chân không tổ hợp trong thùng. Bản chân không của CM.",
    ),
  },
  {
    code: "CV2",
    aliases: ["VCV"],
    category: "vacuum_compound",
    hasSelectorGrade: false,
    structure: "compound",
    vacuum: true,
    currents: { I: [350, 600], III: [350, 600] },
    umKv: [40.5, 72.5, 126, 145],
    desc: L(
      "真空复合式。注意：没有 CV2-500，三相只有 350 / 600 A。",
      "Vacuum compound. No CV2-500: three-phase is 350 / 600 A only.",
      "Вакуумный составной. Нет CV2-500: III только 350 / 600 А.",
      "OLTC chân không compound. Không có CV2-500: 350 / 600 A.",
    ),
  },
  {
    code: "SHZV",
    category: "vacuum_combined",
    hasSelectorGrade: true,
    structure: "combined",
    vacuum: true,
    currents: {
      I: [400, 600, 1000, 1200, 1500, 1600, 2400],
      II: [400, 600, 1000],
      III: [400, 600, 1000],
    },
    umKv: [72.5, 126, 170, 252, 300, 363],
    desc: L(
      "箱内真空组合式。电流、Um 或级数超出 CM2/CV2 时选用。",
      "In-tank vacuum combined. Use when CV2/CM2 cannot cover current, Um or positions.",
      "Вакуумный комбинированный в баке. Когда CV2/CM2 недостаточно.",
      "OLTC chân không tổ hợp trong thùng khi CV2/CM2 không đủ.",
    ),
  },
  {
    code: "SHZVG",
    category: "vacuum_combined",
    hasSelectorGrade: true,
    structure: "combined",
    vacuum: true,
    currents: { I: [1300, 2000, 3000], II: [1300], III: [1300, 1500] },
    umKv: [72.5, 126, 170, 252],
    desc: L(
      "SHZV 大电流线。三相约 1300–1500 A。",
      "High-current SHZV line. Three-phase about 1300–1500 A.",
      "Линия SHZV большого тока. III ≈ 1300–1500 А.",
      "Dòng SHZV dòng lớn. Ba pha khoảng 1300–1500 A.",
    ),
  },
  {
    code: "SY",
    category: "legacy",
    hasSelectorGrade: false,
    structure: "compound",
    vacuum: false,
    currents: { III: [200, 400] },
    umKv: [40.5],
    desc: L(
      "老式直接切换油浸有载（约 35 kV），型号如 SYJZZ-200/35-9。",
      "Legacy oil direct-switching OLTC (~35 kV), e.g. SYJZZ-200/35-9.",
      "Устаревший масляный РПН прямого переключения (~35 кВ).",
      "OLTC dầu kiểu cũ chuyển trực tiếp (~35 kV).",
    ),
  },
];

export const OCTC_FAMILIES: FamilyDef[] = [
  {
    code: "WSL",
    category: "octc_cage",
    hasSelectorGrade: false,
    structure: "compound",
    vacuum: false,
    currents: {
      I: [600, 800, 1000, 1200, 1600, 2000, 2400],
      II: [600, 800, 1000, 1200, 1600, 2000, 2400],
      III: [600, 800, 1000, 1200, 1600, 2000, 2400],
    },
    umKv: [12, 40.5, 72.5, 126, 145, 170],
    desc: L(
      "笼式无励磁（箱内）。中性点常用 WSLIV，线端常用 WSLII。",
      "Cage de-energized, in-tank. Neutral often WSLIV; line-end WSLII.",
      "Клетьевой ПБВ в баке. Нейтраль часто WSLIV, линейный WSLII.",
      "OCTC lồng trong thùng. Trung tính thường WSLIV, đầu dây WSLII.",
    ),
  },
  {
    code: "WDL",
    category: "octc_cage",
    hasSelectorGrade: false,
    structure: "compound",
    vacuum: false,
    currents: {
      I: [600, 800, 1000, 1200, 1600, 2000, 2400],
      II: [600, 800, 1000, 1200, 1600, 2000, 2400],
      III: [600, 800, 1000, 1200, 1600, 2000, 2400],
    },
    umKv: [12, 40.5, 72.5, 126, 145, 170],
    desc: L(
      "笼式无励磁 WDL，与 WSL 同一价目表。",
      "Cage OCTC WDL — same commercial list as WSL.",
      "Клетьевой WDL — тот же прайс, что WSL.",
      "OCTC lồng WDL — cùng bảng giá WSL.",
    ),
  },
  {
    code: "WSG",
    category: "octc_drum",
    hasSelectorGrade: false,
    structure: "compound",
    vacuum: false,
    currents: {
      I: [250, 300, 400, 600, 800, 1000, 1250],
      II: [250, 300, 400, 600, 800, 1000, 1250],
      III: [300, 600, 800],
    },
    umKv: [12, 40.5, 72.5],
    desc: L(
      "鼓式无励磁（WG 系列）。线端常为 WSGII。",
      "Drum de-energized (WG family). Line-end often WSGII.",
      "Барабанный ПБВ (серия WG). Линейный часто WSGII.",
      "OCTC tang trống (họ WG). Đầu dây thường WSGII.",
    ),
  },
  {
    code: "WDG",
    category: "octc_drum",
    hasSelectorGrade: false,
    structure: "compound",
    vacuum: false,
    currents: { I: [250, 400, 600, 800], III: [300, 600, 800] },
    umKv: [12, 40.5, 72.5],
    desc: L("鼓式无励磁 WDG。", "Drum OCTC WDG.", "Барабанный WDG.", "OCTC tang trống WDG."),
  },
  {
    code: "WLG",
    category: "octc_drum",
    hasSelectorGrade: false,
    structure: "compound",
    vacuum: false,
    currents: { I: [250, 400, 600], III: [300, 600] },
    umKv: [12, 40.5],
    desc: L("鼓式无励磁 WLG。", "Drum OCTC WLG.", "Барабанный WLG.", "OCTC tang trống WLG."),
  },
];

/** External-tank vacuum OLTC — own sheet, not the in-tank V1.2 xlsm. */
export const HWV_FAMILIES: FamilyDef[] = [
  {
    code: "HWV",
    category: "external",
    hasSelectorGrade: false,
    structure: "combined",
    vacuum: true,
    currents: { I: [400, 800, 1000], III: [400, 800, 1000] },
    umKv: [17.5, 40.5, 72.5],
    desc: L(
      "真空，外附油箱（侧箱）。型号如 HWVIII-400Y/72.5-10193W，没有 B/C/D。",
      "Vacuum OLTC in an external side-tank. Type like HWVIII-400Y/72.5-10193W — no selector grade.",
      "Вакуумный РПН в боковом отсеке. Без класса B/C/D.",
      "OLTC chân không thùng phụ. Kiểu HWVIII-400Y/72.5-10193W, không cấp B/C/D.",
    ),
  },
  {
    code: "HWDK",
    aliases: ["HWDKIII", "HWDKI"],
    category: "external",
    hasSelectorGrade: false,
    structure: "combined",
    vacuum: true,
    currents: { I: [400, 800, 1000], III: [400, 800, 1000] },
    umKv: [17.5, 40.5, 72.5],
    desc: L(
      "真空外附，常配 SHM-X。回路电流只在 HWDK 填。",
      "External vacuum, often with SHM-X. Circulating current is HWDK-only.",
      "Вакуумный внешний, часто SHM-X. Ток циркуляции только у HWDK.",
      "Chân không thùng phụ, thường SHM-X. Dòng tuần hoàn chỉ HWDK.",
    ),
  },
];

export const DRY_FAMILIES: FamilyDef[] = [
  {
    code: "CZ",
    category: "dry",
    hasSelectorGrade: false,
    structure: "compound",
    vacuum: true,
    currents: { I: [500, 600], III: [500, 600] },
    umKv: [40.5, 72.5],
    desc: L(
      "干式变压器用真空有载。单相结构；三相变常用 3×CZI，由一台机构联动。",
      "Vacuum OLTC for dry-type transformers. Single-phase; 3-phase often 3×CZI on one MDU.",
      "Вакуумный РПН для сухих ТР. Однофазный; 3 фазы часто 3×CZI с одним приводом.",
      "OLTC chân không cho MBA khô. Một pha; ba pha thường 3×CZI một bộ truyền động.",
    ),
  },
];

export const ALL_FAMILIES: FamilyDef[] = [
  ...OLTC_FAMILIES,
  ...HWV_FAMILIES,
  ...OCTC_FAMILIES,
  ...DRY_FAMILIES,
];

export function getFamily(code: string): FamilyDef | undefined {
  return ALL_FAMILIES.find((f) => f.code === code || f.aliases?.includes(code));
}

export function currentsFor(family: FamilyDef | undefined, phase: string): number[] {
  if (!family) return [];
  const key = (phase || "III") as PhaseCode;
  return family.currents[key] ?? family.currents.III ?? family.currents.I ?? [];
}

export const FAMILY_GROUP_LABEL = {
  oil_combined: L("油浸 · 组合式", "Oil · combined", "Масло · комбинированный", "Dầu · tổ hợp"),
  oil_compound: L("油浸 · 复合式", "Oil · compound", "Масло · составной", "Dầu · compound"),
  vacuum_combined: L("真空 · 组合式", "Vacuum · combined", "Вакуум · комбинированный", "Chân không · tổ hợp"),
  vacuum_compound: L("真空 · 复合式", "Vacuum · compound", "Вакуум · составной", "Chân không · compound"),
  external: L("外附油箱", "External compartment", "Боковой отсек", "Thùng phụ"),
  legacy: L("legacy 油浸", "Legacy oil", "Устаревший масляный", "Dầu kiểu cũ"),
  dry: L("干式真空", "Dry vacuum", "Сухой вакуумный", "Khô chân không"),
  octc_cage: L("笼式无励磁", "Cage OCTC", "Клетьевой ПБВ", "OCTC kiểu lồng"),
  octc_drum: L("鼓式无励磁", "Drum OCTC", "Барабанный ПБВ", "OCTC tang trống"),
} as const;

export const PHASE_OPTS = [
  opt("I", "I · 单相", "I · single-phase", "I · однофазный", "I · một pha"),
  opt("II", "II · 两相", "II · two-phase", "II · двухфазный", "II · hai pha"),
  opt("III", "III · 三相", "III · three-phase", "III · трёхфазный", "III · ba pha"),
];

export const CONN_OPTS = [
  opt("Y", "Y · 星形/中性点", "Y · wye / neutral", "Y · звезда / нейтраль", "Y · sao / trung tính"),
  opt("D", "D · 三角形/线端", "D · delta / line end", "D · треугольник / линейный", "D · tam giác / đầu dây"),
];

export const REG_OPTS = [
  opt("linear", "线性（无极性转换）", "Linear (no change-over)", "Линейное (без реверса)", "Tuyến tính (không đảo cực)"),
  opt("reversing", "正反调压 W", "Reversing (W)", "Реверс (W)", "Đảo chiều (W)"),
  opt("coarse_fine", "粗细调压 G", "Coarse–fine (G)", "Грубо-точный (G)", "Thô–tinh (G)"),
];

export const FREQ_OPTS = [
  opt("50", "50 Hz"),
  opt("60", "60 Hz"),
];

export const STD_OPTS = [
  opt("IEC 60214", "IEC 60214"),
  opt("GB 10230", "GB 10230"),
  opt("IEEE C57.131", "IEEE C57.131"),
];

export const APP_OPTS = [
  opt("network", "电网", "Network", "Сеть", "Lưới điện"),
  opt("power", "电力变压器", "Power transformer", "Силовой трансформатор", "Máy biến áp lực"),
  opt("generator", "发电机变", "Generator", "Генераторный", "MBA máy phát"),
  opt("capacity", "调容", "Capacity regulation", "Регул. мощности", "Điều công suất"),
  opt("furnace", "电炉变", "Furnace transformer", "Печной трансформатор", "MBA lò"),
  opt("rectifier", "整流变", "Rectifier transformer", "Выпрямительный трансформатор", "MBA chỉnh lưu"),
  opt("hvdc", "换流/HVDC", "HVDC / converter", "ППТ / преобразователь", "HVDC / biến đổi"),
  opt("reactor", "电抗器", "Reactor", "Реактор", "Cuộn kháng"),
  opt("test", "试验变", "Test transformer", "Испытательный", "MBA thử"),
  opt("other", "其他", "Other", "Другое", "Khác"),
];

export const FLUID_OPTS = [
  opt("mineral", "矿物油", "Mineral oil", "Минеральное масло", "Dầu khoáng"),
  opt("natural_ester", "天然酯", "Natural ester", "Натуральный эфир", "Ester tự nhiên"),
  opt("synthetic_ester", "合成酯", "Synthetic ester", "Синтетический эфир", "Ester tổng hợp"),
  opt("silicone", "硅油", "Silicone", "Силикон", "Silicone"),
];

export const MDU_OPTS = [
  opt("CMA7", "CMA7"),
  opt("SHM-D", "SHM-D"),
  opt("SHM-DL", "SHM-DL"),
  opt("none", "不配 / 已有", "None / existing", "Нет / имеющийся", "Không / có sẵn"),
];

export const CTRL_OPTS = [
  opt("none", "不配", "None", "Нет", "Không"),
  opt("HMC-3C", "HMC-3C"),
  opt("ET-SZ6", "ET-SZ6"),
  opt("SHM-K", "SHM-K"),
  opt("SHM-KX", "SHM-KX"),
  opt("HMIET", "HMIET"),
];

export const FILTER_OPTS = [
  opt("none", "不配", "None", "Нет", "Không"),
  opt("ZXJY-I", "ZXJY-I"),
  opt("ZXJY-II", "ZXJY-II"),
  opt("ZXJY-III", "ZXJY-III"),
];

export const RELAY_OPTS = [
  opt(
    "QJ4G-25,flange without groove,one N/O contact (oil flow)",
    "QJ4G-25 · 法兰不带槽",
    "QJ4G-25 without groove",
    "QJ4G-25 без канавки",
    "QJ4G-25 không rãnh",
  ),
  opt(
    "QJ4G-25,flange with groove,one N/O contact (oil flow)",
    "QJ4G-25 · 法兰带槽",
    "QJ4G-25 with groove",
    "QJ4G-25 с канавкой",
    "QJ4G-25 có rãnh",
  ),
  opt(
    "QJ4-25,flange without groove,one N/O contact (oil flow),one N/O contact(gas alarm), only for vacuum OLTC",
    "QJ4-25 · 法兰不带槽",
    "QJ4-25 without groove",
    "QJ4-25 без канавки",
    "QJ4-25 không rãnh",
  ),
  opt(
    "QJ4-25,flange with groove,one N/O contact (oil flow),one N/O contact(gas alarm), only for vacuum OLTC",
    "QJ4-25 · 法兰带槽",
    "QJ4-25 with groove",
    "QJ4-25 с канавкой",
    "QJ4-25 có rãnh",
  ),
  opt(
    "QJ6-25,flange without groove,two N/O contacts (oil flow)",
    "QJ6-25 · 法兰不带槽",
    "QJ6-25 without groove",
    "QJ6-25 без канавки",
    "QJ6-25 không rãnh",
  ),
  opt(
    "QJ6-25,flange with groove,two N/O contacts (oil flow)",
    "QJ6-25 · 法兰带槽",
    "QJ6-25 with groove",
    "QJ6-25 с канавкой",
    "QJ6-25 có rãnh",
  ),
];

export const GROOVE_OPTS = [
  opt("with", "法兰带槽", "With groove", "С канавкой", "Có rãnh"),
  opt("without", "法兰不带槽", "Without groove", "Без канавки", "Không rãnh"),
];

export const POTENTIAL_OPTS = [
  opt("without", "不带", "Without", "Без", "Không"),
  opt("with", "带（需绕组图）", "With (winding layout required)", "С (нужна схема обмотки)", "Có (cần sơ đồ quấn)"),
  opt("check", "由华明核算（需绕组图）", "Huaming to check (send winding layout)", "Проверит Huaming", "Huaming kiểm"),
];

export const TIE_IN_OPTS = [
  opt("lateral", "侧装", "Installed laterally", "Сбоку", "Lắp bên"),
  opt("board", "外挂板式", "Separately on board", "На щитке", "Tấm ngoài"),
  opt("cylinder", "底部筒式", "Below (cylinder)", "Снизу (цилиндр)", "Dưới (ống)"),
  opt("below_board", "底部板式", "Below (board)", "Снизу (щиток)", "Dưới (tấm)"),
];

export const TOP_GEAR_OPTS = [
  opt("right", "右出轴", "Right output", "Выход вправо", "Trục ra phải"),
  opt("left", "左出轴", "Left output", "Выход влево", "Trục ra trái"),
];

export const PIPE_Q_OPTS = [
  opt("Without bleeder,flange with groove*", "无放气阀 · 带槽（常规）", "No bleeder, grooved (std.)", "Без воздушного, с канавкой", "Không van, có rãnh"),
  opt("Without bleeder,flange without groove", "无放气阀 · 不带槽", "No bleeder, no groove", "Без воздушного, без канавки", "Không van, không rãnh"),
  opt("With bleeder, flange with groove", "带放气阀 · 带槽", "Bleeder, grooved", "С воздушником, с канавкой", "Có van, có rãnh"),
  opt("With bleeder, flange without groove", "带放气阀 · 不带槽", "Bleeder, no groove", "С воздушником, без канавки", "Có van, không rãnh"),
  opt("Blind flange on OLTC head", "头部盲板", "Blind flange", "Глухой фланец", "Mặt bích bịt"),
];

export const PIPE_S_OPTS = [
  opt("With bleeder, flange with groove*", "带放气阀 · 带槽（常规）", "Bleeder, grooved (std.)", "С воздушником, с канавкой", "Có van, có rãnh"),
  opt("With bleeder, flange without groove", "带放气阀 · 不带槽", "Bleeder, no groove", "С воздушником, без канавки", "Có van, không rãnh"),
  opt("Blind flange on OLTC head", "头部盲板", "Blind flange", "Глухой фланец", "Mặt bích bịt"),
];

export const PIPE_R_OPTS = [
  opt("Without bleeder,flange without groove*", "无放气阀 · 不带槽（常规）", "No bleeder, no groove (std.)", "Без воздушного, без канавки", "Không van, không rãnh"),
  opt("Without bleeder,flange with groove", "无放气阀 · 带槽", "No bleeder, grooved", "Без воздушного, с канавкой", "Không van, có rãnh"),
  opt("With bleeder, flange with groove", "带放气阀 · 带槽", "Bleeder, grooved", "С воздушником, с канавкой", "Có van, có rãnh"),
  opt("With bleeder, flange without groove", "带放气阀 · 不带槽", "Bleeder, no groove", "С воздушником, без канавки", "Có van, không rãnh"),
  opt("Blind flange on OLTC head", "头部盲板", "Blind flange", "Глухой фланец", "Mặt bích bịt"),
];

export const PIPE_E2_OPTS = [
  opt("Blind flange on OLTC head*", "头部盲板（常规）", "Blind flange (std.)", "Глухой фланец", "Mặt bích bịt"),
  opt("Without bleeder,flange with groove", "无放气阀 · 带槽", "No bleeder, grooved", "Без воздушного, с канавкой", "Không van, có rãnh"),
  opt("Without bleeder,flange without groove", "无放气阀 · 不带槽", "No bleeder, no groove", "Без воздушного, без канавки", "Không van, không rãnh"),
  opt("With bleeder, flange with groove", "带放气阀 · 带槽", "Bleeder, grooved", "С воздушником, с канавкой", "Có van, có rãnh"),
  opt("With bleeder, flange without groove", "带放气阀 · 不带槽", "Bleeder, no groove", "С воздушником, без канавки", "Có van, không rãnh"),
];

export const PIPE_HEIGHT_OPTS = [
  opt("181", "181 mm"),
  opt("201", "201 mm"),
  opt("231", "231 mm"),
];

export const SHAFT_LEN_OPTS = [1000, 1200, 1500, 2000].map((n) => opt(String(n), `${n} mm`));

export const YES_NO = [
  opt("yes", "是", "Yes", "Да", "Có"),
  opt("no", "否", "No", "Нет", "Không"),
];

export const NAMEPLATE_OPTS = [
  opt("zh", "中文", "Chinese", "Китайский", "Tiếng Trung"),
  opt("en", "English", "English", "Английский", "Tiếng Anh"),
  opt("ru", "Русский", "Russian", "Русский", "Tiếng Nga"),
  opt("vi", "Tiếng Việt", "Vietnamese", "Вьетнамский", "Tiếng Việt"),
  opt("tr", "Türkçe", "Turkish", "Турецкий", "Tiếng Thổ"),
  opt("pt", "Português", "Portuguese", "Португальский", "Tiếng Bồ"),
  opt("id", "Bahasa Indonesia", "Indonesian", "Индонезийский", "Tiếng Indonesia"),
];

export const MOTOR_VOLT_OPTS = [
  opt("380_3", "AC 380 V 三相", "AC 380 V 3-ph", "AC 380 В 3ф", "AC 380 V 3 pha"),
  opt("400_3", "AC 400 V 三相", "AC 400 V 3-ph", "AC 400 В 3ф", "AC 400 V 3 pha"),
  opt("415_3", "AC 415 V 三相", "AC 415 V 3-ph", "AC 415 В 3ф", "AC 415 V 3 pha"),
  opt("440_3", "AC 440 V 三相", "AC 440 V 3-ph", "AC 440 В 3ф", "AC 440 V 3 pha"),
  opt("220_3", "AC 220 V 三相", "AC 220 V 3-ph", "AC 220 В 3ф", "AC 220 V 3 pha"),
  opt("220_1", "AC 220 V 单相", "AC 220 V 1-ph", "AC 220 В 1ф", "AC 220 V 1 pha"),
  opt("230_1", "AC 230 V 单相", "AC 230 V 1-ph", "AC 230 В 1ф", "AC 230 V 1 pha"),
  opt("240_1", "AC 240 V 单相", "AC 240 V 1-ph", "AC 240 В 1ф", "AC 240 V 1 pha"),
  opt("110_1", "AC 110 V 单相", "AC 110 V 1-ph", "AC 110 В 1ф", "AC 110 V 1 pha"),
];

export const CTRL_VOLT_OPTS = [
  opt("220_ac", "AC 220 V"),
  opt("230_ac", "AC 230 V"),
  opt("240_ac", "AC 240 V"),
  opt("110_ac", "AC 110 V"),
  opt("220_dc", "DC 220 V"),
  opt("125_dc", "DC 125 V"),
  opt("110_dc", "DC 110 V"),
  opt("24_dc", "DC 24 V"),
  opt("same", "与电机相同", "Same as motor", "Как у двигателя", "Cùng điện áp motor"),
];

export const IP_OPTS = [
  opt("IP54", "IP54"),
  opt("IP55", "IP55"),
  opt("IP65", "IP65"),
];

export const PAINT_OPTS = [
  opt("RAL7032", "RAL 7032"),
  opt("RAL7035", "RAL 7035"),
  opt("RAL7040", "RAL 7040"),
  opt("RAL7012", "RAL 7012"),
  opt("RAL7001", "RAL 7001"),
  opt("RAL9002", "RAL 9002"),
  opt("RAL9003", "RAL 9003"),
  opt("RAL5012", "RAL 5012"),
  opt("RAL5015", "RAL 5015"),
  opt("RAL7033", "RAL 7033"),
  opt("ANSI70", "ANSI 70"),
  opt("other", "其他", "Other", "Другое", "Khác"),
];

export const CORROSIVE_OPTS = [
  opt("none", "不要求", "None", "Нет", "Không"),
  opt("C3", "C3"),
  opt("C4", "C4"),
  opt("C4-H", "C4-H"),
  opt("C4-M", "C4-M"),
  opt("C5", "C5"),
  opt("C5-M", "C5-M"),
];

/** Transformer vector group — not OLTC 开关连接 Y/D. */
export const VECTOR_GROUP_OPTS = [
  opt("YNd11", "YNd11"),
  opt("YNd1", "YNd1"),
  opt("Dyn11", "Dyn11"),
  opt("Dyn5", "Dyn5"),
  opt("YNyn0", "YNyn0"),
  opt("Dd0", "Dd0"),
  opt("YNa0", "YNa0"),
  opt("YNd11yn12", "YNd11yn12"),
  opt("Ynd11d11", "Ynd11d11"),
  opt("Yd11", "Yd11"),
  opt("Dyn1", "Dyn1"),
  opt("other", "其他", "Other", "Другое", "Khác"),
];

export const FLANGE_OPTS = [
  opt("tank_top", "箱盖安装", "Tank-top", "На крышке бака", "Lắp nắp thùng"),
  opt("bell", "钟罩式", "Bell-type (钟罩)", "Колокольный бак", "Kiểu chuông"),
];

export const PRV_OPTS = [
  opt("burst", "防爆盖（不要压力释放阀）", "Rupture disc only", "Только разрывной диск", "Nắp chống nổ, không van"),
  opt("prv_50", "压力释放阀 50 mm，不要防爆盖", "PRD 50 mm, no rupture disc", "ПРД 50 мм", "Van 50 mm, không nắp"),
  opt("prv_130", "压力释放阀 130 mm，不要防爆盖", "PRD 130 mm, no rupture disc", "ПРД 130 мм", "Van 130 mm, không nắp"),
  opt("none", "不配", "None", "Нет", "Không"),
];

export const POS_TX_OPTS = [
  opt("potentiometer", "电位器", "Potentiometer", "Потенциометр", "Biến trở"),
  opt("bcd", "BCD 码", "BCD", "BCD", "BCD"),
  opt("4_20", "4–20 mA"),
  opt("0_5v", "0–5 V"),
  opt("1_5v", "1–5 V"),
  opt("none", "不配", "None", "Нет", "Không"),
];

export const OCTC_SERIES_OPTS = [
  opt("I", "I"),
  opt("II", "II"),
  opt("III", "III"),
  opt("IV", "IV"),
];

export const OCTC_CONTACT_OPTS = [
  opt("6x5", "6×5"),
  opt("7x6", "7×6"),
  opt("12x11", "12×11"),
  opt("18x17", "18×17"),
  opt("4x5", "4×5"),
];

export const OCTC_SIZE_OPTS = [
  opt("A", "A"),
  opt("B", "B"),
  opt("E", "E"),
];

export const OCTC_DRIVE_OPTS = [
  opt("handwheel", "手轮", "Handwheel", "Штурвал", "Tay quay"),
  opt("CMA7", "CMA7 电动", "CMA7 motor", "CMA7 привод", "CMA7 động cơ"),
  opt("SHM-D", "SHM-D 电动", "SHM-D motor", "SHM-D привод", "SHM-D động cơ"),
];

export const SHM_MODEL_OPTS = [
  opt("SHM-D", "SHM-D"),
  opt("SHM-DL", "SHM-DL"),
  opt("SHM-DA", "SHM-DA"),
];

export const COMM_OPTS = [
  opt("none", "不配", "None", "Нет", "Không"),
  opt("rs485", "RS-485 / Modbus"),
  opt("ethernet", "Ethernet"),
  opt("iec61850", "IEC 61850"),
];

export const DRY_MOUNT_OPTS = [
  opt("frame", "支架安装", "Supporting frame", "На раме", "Khung đỡ"),
  opt("enclosure", "外壳内安装", "In enclosure", "В кожухе", "Trong vỏ"),
];

export const SIDE_OPTS = [
  opt("right", "机构在右侧", "MDU on the right", "Привод справа", "Cơ cấu bên phải"),
  opt("left", "机构在左侧", "MDU on the left", "Привод слева", "Cơ cấu bên trái"),
];

/** Frequent Huaming markets first, then other common calling codes. */
export const COUNTRY_CODE_OPTS = [
  opt("+86", "+86 中国", "+86 China", "+86 Китай", "+86 Trung Quốc"),
  opt("+90", "+90 土耳其", "+90 Turkey", "+90 Турция", "+90 Thổ Nhĩ Kỳ"),
  opt("+62", "+62 印度尼西亚", "+62 Indonesia", "+62 Индонезия", "+62 Indonesia"),
  opt("+91", "+91 印度", "+91 India", "+91 Индия", "+91 Ấn Độ"),
  opt("+7", "+7 俄罗斯 / 哈萨克", "+7 Russia / Kazakhstan", "+7 Россия / Казахстан", "+7 Nga / Kazakhstan"),
  opt("+61", "+61 澳大利亚", "+61 Australia", "+61 Австралия", "+61 Úc"),
  opt("+84", "+84 越南", "+84 Vietnam", "+84 Вьетнам", "+84 Việt Nam"),
  opt("+998", "+998 乌兹别克斯坦", "+998 Uzbekistan", "+998 Узбекистан", "+998 Uzbekistan"),
  opt("+60", "+60 马来西亚", "+60 Malaysia", "+60 Малайзия", "+60 Malaysia"),
  opt("+66", "+66 泰国", "+66 Thailand", "+66 Таиланд", "+66 Thái Lan"),
  opt("+55", "+55 巴西", "+55 Brazil", "+55 Бразилия", "+55 Brazil"),
  opt("+39", "+39 意大利", "+39 Italy", "+39 Италия", "+39 Ý"),
  opt("+49", "+49 德国", "+49 Germany", "+49 Германия", "+49 Đức"),
  opt("+1", "+1 美国 / 加拿大", "+1 USA / Canada", "+1 США / Канада", "+1 Mỹ / Canada"),
  opt("+44", "+44 英国", "+44 United Kingdom", "+44 Великобритания", "+44 Anh"),
  opt("+33", "+33 法国", "+33 France", "+33 Франция", "+33 Pháp"),
  opt("+81", "+81 日本", "+81 Japan", "+81 Япония", "+81 Nhật"),
  opt("+82", "+82 韩国", "+82 Korea", "+82 Корея", "+82 Hàn Quốc"),
  opt("+971", "+971 阿联酋", "+971 UAE", "+971 ОАЭ", "+971 UAE"),
  opt("+966", "+966 沙特", "+966 Saudi Arabia", "+966 Саудовская Аравия", "+966 Ả Rập Xê-út"),
  opt("+20", "+20 埃及", "+20 Egypt", "+20 Египет", "+20 Ai Cập"),
  opt("+27", "+27 南非", "+27 South Africa", "+27 ЮАР", "+27 Nam Phi"),
  opt("+92", "+92 巴基斯坦", "+92 Pakistan", "+92 Пакистан", "+92 Pakistan"),
  opt("+880", "+880 孟加拉", "+880 Bangladesh", "+880 Бангладеш", "+880 Bangladesh"),
  opt("+94", "+94 斯里兰卡", "+94 Sri Lanka", "+94 Шри-Ланка", "+94 Sri Lanka"),
  opt("+95", "+95 缅甸", "+95 Myanmar", "+95 Мьянма", "+95 Myanmar"),
  opt("+856", "+856 老挝", "+856 Laos", "+856 Лаос", "+856 Lào"),
  opt("+855", "+855 柬埔寨", "+855 Cambodia", "+855 Камбоджа", "+855 Campuchia"),
  opt("+63", "+63 菲律宾", "+63 Philippines", "+63 Филиппины", "+63 Philippines"),
  opt("+65", "+65 新加坡", "+65 Singapore", "+65 Сингапур", "+65 Singapore"),
  opt("+852", "+852 香港", "+852 Hong Kong", "+852 Гонконг", "+852 Hồng Kông"),
  opt("+853", "+853 澳门", "+853 Macau", "+853 Макао", "+853 Macao"),
  opt("+886", "+886 台湾", "+886 Taiwan", "+886 Тайвань", "+886 Đài Loan"),
  opt("+64", "+64 新西兰", "+64 New Zealand", "+64 Новая Зеландия", "+64 New Zealand"),
  opt("+34", "+34 西班牙", "+34 Spain", "+34 Испания", "+34 Tây Ban Nha"),
  opt("+351", "+351 葡萄牙", "+351 Portugal", "+351 Португалия", "+351 Bồ Đào Nha"),
  opt("+48", "+48 波兰", "+48 Poland", "+48 Польша", "+48 Ba Lan"),
  opt("+31", "+31 荷兰", "+31 Netherlands", "+31 Нидерланды", "+31 Hà Lan"),
  opt("+32", "+32 比利时", "+32 Belgium", "+32 Бельгия", "+32 Bỉ"),
  opt("+41", "+41 瑞士", "+41 Switzerland", "+41 Швейцария", "+41 Thụy Sĩ"),
  opt("+43", "+43 奥地利", "+43 Austria", "+43 Австрия", "+43 Áo"),
  opt("+46", "+46 瑞典", "+46 Sweden", "+46 Швеция", "+46 Thụy Điển"),
  opt("+47", "+47 挪威", "+47 Norway", "+47 Норвегия", "+47 Na Uy"),
  opt("+358", "+358 芬兰", "+358 Finland", "+358 Финляндия", "+358 Phần Lan"),
  opt("+45", "+45 丹麦", "+45 Denmark", "+45 Дания", "+45 Đan Mạch"),
  opt("+30", "+30 希腊", "+30 Greece", "+30 Греция", "+30 Hy Lạp"),
  opt("+36", "+36 匈牙利", "+36 Hungary", "+36 Венгрия", "+36 Hungary"),
  opt("+40", "+40 罗马尼亚", "+40 Romania", "+40 Румыния", "+40 Romania"),
  opt("+420", "+420 捷克", "+420 Czechia", "+420 Чехия", "+420 Séc"),
  opt("+52", "+52 墨西哥", "+52 Mexico", "+52 Мексика", "+52 Mexico"),
  opt("+54", "+54 阿根廷", "+54 Argentina", "+54 Аргентина", "+54 Argentina"),
  opt("+56", "+56 智利", "+56 Chile", "+56 Чили", "+56 Chile"),
  opt("+57", "+57 哥伦比亚", "+57 Colombia", "+57 Колумбия", "+57 Colombia"),
  opt("+51", "+51 秘鲁", "+51 Peru", "+51 Перу", "+51 Peru"),
  opt("+234", "+234 尼日利亚", "+234 Nigeria", "+234 Нигерия", "+234 Nigeria"),
  opt("+212", "+212 摩洛哥", "+212 Morocco", "+212 Марокко", "+212 Morocco"),
  opt("+98", "+98 伊朗", "+98 Iran", "+98 Иран", "+98 Iran"),
  opt("+964", "+964 伊拉克", "+964 Iraq", "+964 Ирак", "+964 Iraq"),
  opt("+962", "+962 约旦", "+962 Jordan", "+962 Иордания", "+962 Jordan"),
  opt("+968", "+968 阿曼", "+968 Oman", "+968 Оман", "+968 Oman"),
  opt("+974", "+974 卡塔尔", "+974 Qatar", "+974 Катар", "+974 Qatar"),
  opt("+973", "+973 巴林", "+973 Bahrain", "+973 Бахрейн", "+973 Bahrain"),
  opt("+965", "+965 科威特", "+965 Kuwait", "+965 Кувейт", "+965 Kuwait"),
  opt("+993", "+993 土库曼斯坦", "+993 Turkmenistan", "+993 Туркменистан", "+993 Turkmenistan"),
  opt("+992", "+992 塔吉克斯坦", "+992 Tajikistan", "+992 Таджикистан", "+992 Tajikistan"),
  opt("+996", "+996 吉尔吉斯斯坦", "+996 Kyrgyzstan", "+996 Кыргызстан", "+996 Kyrgyzstan"),
  opt("+994", "+994 阿塞拜疆", "+994 Azerbaijan", "+994 Азербайджан", "+994 Azerbaijan"),
  opt("+995", "+995 格鲁吉亚", "+995 Georgia", "+995 Грузия", "+995 Georgia"),
  opt("+353", "+353 爱尔兰", "+353 Ireland", "+353 Ирландия", "+353 Ireland"),
  opt("other", "其他 / 自定义", "Other / custom", "Другой / свой", "Khác / tuỳ chỉnh"),
];

/** Commercial lead times written as-is into Word/Excel delivery cells. */
export const DELIVERY_DATE_OPTS = [
  opt("90 days after PO", "合同后 90 天", "90 days after PO", "90 дней после PO", "90 ngày sau PO"),
  opt("120 days after PO", "合同后 120 天", "120 days after PO", "120 дней после PO", "120 ngày sau PO"),
  opt("150 days after PO", "合同后 150 天", "150 days after PO", "150 дней после PO", "150 ngày sau PO"),
  opt("180 days after PO", "合同后 180 天", "180 days after PO", "180 дней после PO", "180 ngày sau PO"),
  opt("TBC", "待定 TBC", "TBC", "TBC", "TBC"),
  opt("custom", "指定日历日期", "Specific calendar date", "Конкретная дата", "Ngày cụ thể"),
];

export const HWV_PHASE_OPTS = [
  PHASE_OPTS[0],
  PHASE_OPTS[2],
  opt("other", "其他", "Others", "Другое", "Khác"),
];

export const HWV_FREQ_OPTS = [
  ...FREQ_OPTS,
  opt("other", "其他", "Others", "Другое", "Khác"),
];

export const HWV_APP_OPTS = [
  opt("power", "电力变", "Power", "Силовой", "MBA lực"),
  opt("network", "电网", "Network", "Сеть", "Lưới điện"),
  opt("capacity", "容量调节", "Capacity regulation", "Регул. мощности", "Điều công suất"),
  opt("furnace", "电炉变", "Furnace", "Печной", "MBA lò"),
  opt("rectifier", "整流变", "Rectifier", "Выпрямительный", "MBA chỉnh lưu"),
  opt("generator", "发电机变", "Generator", "Генераторный", "MBA máy phát"),
  opt("test", "试验变", "Test transformer", "Испытательный", "MBA thử"),
  opt("other", "其他", "Others", "Другое", "Khác"),
];

export const HWV_TX_OPTS = [
  opt("separated", "独立绕组", "Separated winding", "Раздельные обмотки", "Cuộn tách"),
  opt("auto", "自耦", "Auto-transformer", "Автотрансформатор", "Tự ngẫu"),
  opt("booster", "调压变", "Booster transformer", "Вольтодобавочный", "MBA tăng áp"),
];

export const HWV_AMBIENT_OPTS = [
  opt("-25~+40", "−25～+40 ℃"),
  opt("-40~+40", "−40～+40 ℃"),
  opt("other", "其他", "Others", "Другое", "Khác"),
];

export const HWV_FLUX_OPTS = [
  opt("cfvv", "恒磁通 CFVV", "Constant flux (CFVV)", "Постоянный поток", "Từ thông cố định"),
  opt("vfvv", "变磁通 VFVV（附图纸）", "Variable flux (attach drawing)", "Переменный поток", "Từ thông biến"),
  opt("combined", "混合调压（附图纸）", "Combined (attach drawing)", "Комбинированное", "Hỗn hợp"),
];

export const HWV_TAP_WINDING_OPTS = [
  opt("star_neutral", "星形中性点", "Star at neutral", "Звезда на нейтрали", "Sao trung tính"),
  opt("star_middle", "星形绕组中部", "Star at middle of winding", "Звезда в середине", "Sao giữa cuộn"),
  opt("star_end", "星形绕组末端", "Star at end of winding", "Звезда в конце", "Sao cuối cuộn"),
  opt("delta_end", "角形末端", "Delta at end of winding", "Треугольник в конце", "Tam giác cuối"),
  opt("delta_middle", "角形中部", "Delta at middle of winding", "Треугольник в середине", "Tam giác giữa"),
  opt("1plus2", "单相 + 两相", "One single-phase + one two-phase", "1ф + 2ф", "1 pha + 2 pha"),
  opt("linear_end", "线性末端", "Linear at end of winding", "Линейное в конце", "Tuyến tính cuối"),
  opt("linear_middle", "线性中部", "Linear at middle of winding", "Линейное в середине", "Tuyến tính giữa"),
];

export const HWV_MDU_OPTS = [
  opt("CMA7", "CMA7"),
  opt("SHM-D", "SHM-D"),
  opt("SHM-X", "SHM-X（HWDK 常用）", "SHM-X (usual for HWDK)", "SHM-X (часто HWDK)", "SHM-X (thường HWDK)"),
  opt("none", "不配 / 已有", "None / existing", "Нет / имеющийся", "Không / có sẵn"),
];

export const HWV_CTRL_OPTS = [
  opt("none", "不配", "None", "Нет", "Không"),
  opt("HMC-3C", "HMC-3C"),
  opt("ET-SZ6", "ET-SZ6"),
  opt("SHM-K", "SHM-K"),
];

export const HWV_RELAY_OPTS = [
  opt("qj4", "QJ4-25 · 跳闸 + 信号", "QJ4-25 trip + signal", "QJ4-25 откл. + сигнал", "QJ4-25 cắt + tín hiệu"),
  opt("qj4g", "QJ4G-25 · 只跳闸", "QJ4G-25 trip only", "QJ4G-25 только откл.", "QJ4G-25 chỉ cắt"),
  opt("qj6", "QJ6-25 · 两路跳闸", "QJ6-25 two trip contacts", "QJ6-25 два откл.", "QJ6-25 hai tiếp điểm cắt"),
  opt("other", "其他", "Others", "Другое", "Khác"),
];

export const HWV_PRV_OPTS = [
  opt("rupture", "只要防爆膜", "Rupture disk only", "Только разрывной диск", "Chỉ đĩa nổ"),
  opt("rupture_prv", "防爆膜 + 释压阀", "Rupture disk & relief valve", "Диск и клапан", "Đĩa nổ + van"),
  opt("prv_no_signal", "释压阀，无信号", "Relief valve, no signal", "Клапан без сигнала", "Van, không tín hiệu"),
  opt("prv_one", "释压阀，1 组转换接点", "Relief valve, one C/O", "Клапан, 1 C/O", "Van, 1 C/O"),
  opt("prv_two", "释压阀，2 组转换接点", "Relief valve, two C/O", "Клапан, 2 C/O", "Van, 2 C/O"),
];

export const HWV_MOUNT_OPTS = [
  opt("weld", "焊在变压器油箱上", "Weld onto the transformer tank", "Приварка к баку", "Hàn vào thùng"),
  opt("bolts", "螺栓固定", "Fix onto the tank by bolts", "Болтами к баку", "Bu lông"),
];

export const HWV_HWDK_CONN_OPTS = [
  opt("9_linear", "9 档 / 线性", "9-pos. / linear", "9 пол. / линейное", "9 nấc / tuyến tính"),
  opt("17", "17 档", "17-pos.", "17 пол.", "17 nấc"),
  opt("linear", "线性", "Linear", "Линейное", "Tuyến tính"),
  opt("33_reversing", "33 档 / 正反", "33-pos. / reversing", "33 пол. / реверс", "33 nấc / đảo"),
  opt("reversing", "正反", "Reversing", "Реверс", "Đảo chiều"),
];

export const HWV_CAPACITY_OPTS = [
  opt("constant", "恒容量", "Constant", "Постоянная", "Không đổi"),
  opt("decreasing", "递减容量", "Decreasing", "Убывающая", "Giảm dần"),
];

export const HWV_OVERLOAD_OPTS = [
  opt("iec", "按 IEC 60354", "Acc. to IEC 60354", "По IEC 60354", "Theo IEC 60354"),
  opt("above", "高于 IEC 60354", "> IEC 60354", "> IEC 60354", "> IEC 60354"),
];

export const HWV_UST_OPTS = [
  opt("constant", "恒定级电压", "Constant Ust", "Постоянное Ust", "Ust cố định"),
  opt("variable", "变化级电压", "Variable Ust", "Переменное Ust", "Ust biến"),
];

export const HWV_RANGE_SHAPE_OPTS = [
  opt("symmetric", "对称 ±", "Symmetric ±", "Симметрично ±", "Đối xứng ±"),
  opt("asymmetric", "不对称 + / −", "Asymmetric + / −", "Несимметрично + / −", "Lệch + / −"),
];

export function umOptions(allowed?: number[]) {
  const list = allowed?.length ? allowed : [...UM_KV];
  return list.map((u) => {
    const hint = UM_UN_HINT[u];
    return opt(
      String(u),
      hint ? `${u} kV（${hint}）` : `${u} kV`,
      hint ? `${u} kV (${hint})` : `${u} kV`,
      hint ? `${u} кВ (${hint})` : `${u} кВ`,
      hint ? `${u} kV (${hint})` : `${u} kV`,
    );
  });
}

export function currentOptions(amps: number[]) {
  return amps.map((a) => opt(String(a), `${a} A`));
}

export function contactFromPositions(positions: number): string {
  if (positions <= 5) return "6x5";
  if (positions <= 6) return "7x6";
  if (positions <= 11) return "12x11";
  return "18x17";
}

export function defaultOctcSeries(connection: string): string {
  return connection === "D" ? "II" : "IV";
}
