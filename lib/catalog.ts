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
    code: "HWV",
    category: "external",
    hasSelectorGrade: false,
    structure: "combined",
    vacuum: true,
    currents: { I: [400, 800, 1000], III: [400, 800, 1000] },
    umKv: [17.5, 40.5, 72.5],
    desc: L(
      "真空，外附油箱安装（侧箱）。箱顶/外附方案。",
      "Vacuum OLTC in an external side-tank compartment.",
      "Вакуумный РПН в боковом отсеке.",
      "OLTC chân không lắp thùng phụ bên hông.",
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
  opt("power", "电力变压器", "Power transformer", "Силовой трансформатор", "Máy biến áp lực"),
  opt("furnace", "电炉变", "Furnace transformer", "Печной трансформатор", "MBA lò"),
  opt("rectifier", "整流变", "Rectifier transformer", "Выпрямительный трансформатор", "MBA chỉnh lưu"),
  opt("hvdc", "换流/HVDC", "HVDC / converter", "ППТ / преобразователь", "HVDC / biến đổi"),
  opt("reactor", "电抗器", "Reactor", "Реактор", "Cuộn kháng"),
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
  opt("240_1", "AC 240 V 单相", "AC 240 V 1-ph", "AC 240 В 1ф", "AC 240 V 1 pha"),
  opt("110_1", "AC 110 V 单相", "AC 110 V 1-ph", "AC 110 В 1ф", "AC 110 V 1 pha"),
];

export const CTRL_VOLT_OPTS = [
  opt("220_ac", "AC 220 V"),
  opt("110_ac", "AC 110 V"),
  opt("220_dc", "DC 220 V"),
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
  opt("other", "其他", "Other", "Другое", "Khác"),
];

/** Transformer vector group — not OLTC 开关连接 Y/D. */
export const VECTOR_GROUP_OPTS = [
  opt("YNd11", "YNd11"),
  opt("YNd1", "YNd1"),
  opt("Dyn11", "Dyn11"),
  opt("Dyn5", "Dyn5"),
  opt("YNyn0", "YNyn0"),
  opt("Dd0", "Dd0"),
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
