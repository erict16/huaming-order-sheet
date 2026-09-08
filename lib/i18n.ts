import { L } from "./copy";
import type { I18nText, Lang } from "./types";

export const LANG_STORAGE = "hm-os-lang";

const chrome = {
  brand: L("上海华明", "Shanghai Huaming", "Shanghai Huaming", "Shanghai Huaming"),
  brandSub: L("电力设备", "Power Equipment", "Power Equipment", "Power Equipment"),
  appName: L("订货技术规范书", "Order Specifications", "Спецификация заказа", "Phiếu đặt hàng kỹ thuật"),
  appNameShort: L("订货单", "Order Sheet", "Бланк заказа", "Phiếu đặt hàng"),
  heroEyebrow: L("在线填写 · 导出 Excel", "Fill online · Export Excel", "Онлайн · экспорт Excel", "Điền online · Xuất Excel"),
  heroTitle: L("把订货单填清楚，一次到位", "Fill the order sheet once, clearly", "Заполните бланк заказа один раз", "Điền phiếu đặt hàng một lần, rõ ràng"),
  heroLead: L(
    "按华明订货规范书填写。有载、CMA7、SHM-D 导出官方 V1.2 xlsm。空白项按表上常规配置。全部在浏览器里完成，不会上传。",
    "Fill the Huaming order specification. OLTC, CMA7 and SHM-D download the official V1.2 xlsm. Blank fields mean standard supply. Stays in your browser.",
    "Заполните бланк Huaming. OLTC, CMA7 и SHM-D — официальный xlsm V1.2. Пустые поля — стандарт. Всё в браузере.",
    "Điền phiếu Huaming. OLTC, CMA7, SHM-D tải xlsm V1.2 chính thức. Ô trống = tiêu chuẩn. Ở trong trình duyệt.",
  ),
  pickSheet: L("选择要填的订货单", "Choose an order sheet", "Выберите бланк", "Chọn phiếu đặt hàng"),
  start: L("开始填写", "Start", "Начать", "Bắt đầu"),
  backHome: L("返回选择", "All sheets", "Все бланки", "Tất cả phiếu"),
  next: L("下一步", "Next", "Далее", "Tiếp"),
  prev: L("上一步", "Back", "Назад", "Trước"),
  review: L("核对并导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"),
  export: L("下载订货单", "Download order sheet", "Скачать бланк", "Tải phiếu đặt hàng"),
  print: L("打印 / 存 PDF", "Print / PDF", "Печать / PDF", "In / PDF"),
  copyType: L("复制型号", "Copy type", "Копировать тип", "Sao chép kiểu"),
  copied: L("已复制", "Copied", "Скопировано", "Đã sao chép"),
  typePlate: L("型号", "Type designation", "Обозначение", "Ký hiệu kiểu"),
  typeHint: L("由下面参数自动组成，可在备注里说明特例。", "Composed from the fields below. Note exceptions in remarks.", "Собирается из полей ниже. Особые случаи — в примечаниях.", "Tự ghép từ các trường. Ngoại lệ ghi ở ghi chú."),
  required: L("必填", "Required", "Обязательно", "Bắt buộc"),
  optional: L("选填", "Optional", "Необязательно", "Tuỳ chọn"),
  standardNote: L("未填 = 常规配置", "Blank = standard supply", "Пусто = стандарт", "Trống = tiêu chuẩn"),
  saved: L("已自动保存在本机", "Autosaved on this device", "Автосохранение на этом устройстве", "Tự lưu trên máy này"),
  clear: L("清空本单", "Clear this sheet", "Очистить бланк", "Xoá phiếu này"),
  stepOf: L("第 {n} / {total} 步", "Step {n} of {total}", "Шаг {n} из {total}", "Bước {n} / {total}"),
  familyPick: L("先选系列，后面的电流、Um、绝缘等级会跟着变。", "Pick the family first — current, Um and grade options follow.", "Сначала серия — ток, Um и класс изоляции подстроятся.", "Chọn họ máy trước — dòng, Um và cấp cách điện sẽ theo."),
  reviewTitle: L("请核对全部参数", "Please review every parameter", "Проверьте все параметры", "Vui lòng kiểm tra mọi thông số"),
  reviewLead: L("有载 / CMA7 / SHM-D 导出华明 V1.2 订货规范书。空白项按表上常规。", "OLTC / CMA7 / SHM-D download the official V1.2 order specification. Blank = standard on the form.", "OLTC / CMA7 / SHM-D — официальный бланк V1.2. Пусто = стандарт.", "OLTC / CMA7 / SHM-D tải phiếu V1.2. Trống = tiêu chuẩn."),
  missing: L("还缺必填项", "Required fields missing", "Не заполнены обязательные поля", "Thiếu trường bắt buộc"),
  warnings: L("请留意", "Please check", "Обратите внимание", "Lưu ý"),
  footer: L("华明电力设备 · IEC 60214 / GB 10230 · 仅供订货填写，最终以工程确认为准。", "Huaming Power Equipment · IEC 60214 / GB 10230 · For ordering; engineering confirmation is final.", "Huaming · IEC 60214 / GB 10230 · Для заказа; окончательно — подтверждение конструкторов.", "Huaming · IEC 60214 / GB 10230 · Chỉ để đặt hàng; kỹ thuật xác nhận mới là cuối cùng."),
  more: L("更多选项", "More options", "Дополнительно", "Tuỳ chọn thêm"),
  positionsHint: L("工作位置数 P = 2×(±N) + 中间位置。最常见是 ±8、中间 3 → 19 档 → 10193W。", "Service positions P = 2×(±N) + mid. Most common: ±8, mid 3 → 19 pos → 10193W.", "Рабочие положения P = 2×(±N) + средние. Чаще всего ±8, середина 3 → 19 → 10193W.", "Số vị trí P = 2×(±N) + giữa. Phổ biến: ±8, giữa 3 → 19 → 10193W."),
  selectorHint: L("组合式才有 B/C/D/DE。复合式（CV/CV2/SV）型号里没有这级字母。", "Grade B/C/D/DE is for combined types only. Compound (CV/CV2/SV) has no letter.", "Класс B/C/D/DE только у комбинированных. У составных (CV/CV2/SV) буквы нет.", "Cấp B/C/D/DE chỉ loại tổ hợp. Compound (CV/CV2/SV) không có chữ này."),
  octcHint: L("无励磁不是有载。笼式 WSL/WDL；鼓式 WSG/WDG/WLG。Y 常用 IV，D 常用 II。", "De-energized, not on-load. Cage WSL/WDL; drum WSG/WDG/WLG. Y often IV, D often II.", "ПБВ, не РПН. Клеть WSL/WDL; барабан WSG/WDG/WLG. Y часто IV, D часто II.", "Cắt điện, không mang tải. Lồng WSL/WDL; trống WSG/WDG/WLG. Y thường IV, D thường II."),
  dryHint: L("CZ 是单相结构。三相干变通常订 3×CZI，由一台电动机构机械联动。", "CZ is single-phase. Three-phase dry transformers usually order 3×CZI on one motor drive.", "CZ — однофазный. Для 3ф сухих ТР обычно 3×CZI с одним приводом.", "CZ là một pha. MBA khô ba pha thường 3×CZI một bộ truyền động."),
  cma7Hint: L("CMA7 是传统电动机构。请写明带动的开关型号和档位数，否则机构行程对不上。", "CMA7 is the classic motor drive. State the tap-changer type and positions so the travel matches.", "CMA7 — классический привод. Укажите тип РПН и число положений.", "CMA7 là bộ truyền động cổ điển. Ghi kiểu OLTC và số vị trí."),
  shmdHint: L("SHM-D 是数字机构，可带控制器和通信。SHM-DL 带就地显示。", "SHM-D is the digital drive; optional controller and comms. SHM-DL has a local display.", "SHM-D — цифровой привод, опции контроллера и связи. SHM-DL — с местным дисплеем.", "SHM-D là bộ số; có thể kèm bộ điều khiển và truyền thông. SHM-DL có màn hình tại chỗ."),
  noFamily: L("请先选择系列", "Please pick a family first", "Сначала выберите серию", "Hãy chọn họ máy trước"),
} satisfies Record<string, I18nText>;

export type ChromeKey = keyof typeof chrome;

export function chromeText(key: ChromeKey, lang: Lang, vars?: Record<string, string | number>): string {
  let s = chrome[key][lang] || chrome[key].zh;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}
