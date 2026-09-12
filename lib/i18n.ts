import { L } from "./copy";
import type { I18nText, Lang } from "./types";

export const LANG_STORAGE = "hm-os-lang";

export const chrome = {
  brand: L("上海华明", "Shanghai Huaming", "Shanghai Huaming", "Shanghai Huaming"),
  brandSub: L("电力设备", "Power Equipment", "Power Equipment", "Power Equipment"),
  appName: L("订货技术规范书", "Order specifications", "Спецификация заказа", "Phiếu đặt hàng kỹ thuật"),
  appNameShort: L("订货单", "Order sheet", "Бланк заказа", "Phiếu đặt hàng"),
  heroEyebrow: L("订货规范书", "Order specifications", "Спецификация заказа", "Phiếu đặt hàng"),
  heroTitle: L("订货技术规范书", "Order specifications", "Спецификация заказа", "Phiếu đặt hàng kỹ thuật"),
  heroLead: L("空白项按常规配置。", "Blank fields = standard supply.", "Пустые поля — стандарт.", "Ô trống = tiêu chuẩn."),
  pickSheet: L("选择要填的订货单", "Choose an order sheet", "Выберите бланк", "Chọn phiếu đặt hàng"),
  start: L("开始填写", "Start", "Начать", "Bắt đầu"),
  backHome: L("返回首页", "All sheets", "Все бланки", "Về trang đầu"),
  next: L("下一步", "Next", "Далее", "Tiếp"),
  prev: L("上一步", "Back", "Назад", "Trước"),
  review: L("核对并导出", "Review & export", "Проверка и экспорт", "Kiểm tra và xuất"),
  export: L("下载订货单", "Download order sheet", "Скачать бланк", "Tải phiếu đặt hàng"),
  save: L("保存", "Save", "Сохранить", "Lưu"),
  savedFlash: L("已保存", "Saved", "Сохранено", "Đã lưu"),
  print: L("保存", "Save", "Сохранить", "Lưu"),
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
  familyPick: L("选系列", "Family", "Серия", "Họ máy"),
  reviewTitle: L("核对全部参数", "Check every field", "Проверьте все параметры", "Kiểm tra mọi thông số"),
  reviewLead: L("核对后选 Word 或 Excel 下载。空白项按常规。", "Then download Word or Excel. Blank = standard.", "После проверки — Word или Excel. Пусто = стандарт.", "Kiểm xong tải Word hoặc Excel. Trống = tiêu chuẩn."),
  reviewEmpty: L("还没有可核对的内容。先选系列、填必填。", "Nothing to review yet. Pick a family and fill the required fields.", "Пока нечего проверять. Сначала серия и обязательные поля.", "Chưa có gì để kiểm. Hãy chọn họ máy và điền bắt buộc."),
  exportWord: L("导出 Word", "Export Word", "Экспорт Word", "Xuất Word"),
  exportWordUnavailable: L("本单没有 Word 模板，请用 Excel。", "This sheet has no Word template. Use Excel.", "Для этого бланка нет шаблона Word. Используйте Excel.", "Phiếu này không có mẫu Word. Dùng Excel."),
  exportExcel: L("导出 Excel", "Export Excel", "Экспорт Excel", "Xuất Excel"),
  exportFormat: L("导出格式", "Export format", "Формат экспорта", "Định dạng xuất"),
  exporting: L("正在导出…", "Exporting…", "Экспорт…", "Đang xuất…"),
  presets: L("按真实订单起单", "Start from a real order", "Начать с реального заказа", "Bắt đầu từ đơn thật"),
  presetsHint: L("8 份 OneDrive 真单，点开再选。默认收着。", "Eight real OneDrive orders. Closed by default — pick one to prefill.", "Восемь реальных заказов. Свёрнуто — выберите, чтобы заполнить.", "Tám đơn OneDrive thật. Mặc định gập, chọn để điền sẵn."),
  presetsHintN: L("{n} 份 OneDrive 真单，点开再选。默认收着。", "Real OneDrive orders ({n}). Closed by default, pick one to prefill.", "Реальных заказов: {n}. Свёрнуто, выберите, чтобы заполнить.", "{n} đơn OneDrive thật. Mặc định gập, chọn để điền sẵn."),
  presetApply: L("一键填入", "Prefill", "Заполнить", "Điền sẵn"),
  search: L("搜索", "Search", "Поиск", "Tìm"),
  noMatches: L("无匹配", "No matches", "Нет совпадений", "Không khớp"),
  missing: L("还有必填没填", "Required fields are empty", "Не заполнены обязательные поля", "Còn trường bắt buộc trống"),
  warnings: L("留意这些", "Check these", "Обратите внимание", "Lưu ý"),
  footer: L("华明电力设备 · IEC 60214 / GB 10230 · 仅供订货填写，最终以工程确认为准。", "Huaming Power Equipment · IEC 60214 / GB 10230 · For ordering; engineering confirmation is final.", "Huaming · IEC 60214 / GB 10230 · Для заказа; окончательно — подтверждение конструкторов.", "Huaming · IEC 60214 / GB 10230 · Chỉ để đặt hàng; kỹ thuật xác nhận mới là cuối cùng."),
  more: L("更多选项", "More options", "Дополнительно", "Tuỳ chọn thêm"),
  positionsHint: L("工作位置数 P = 2×(±N) + 中间位置。最常见是 ±8、中间 3 → 19 档 → 10193W。", "Service positions P = 2×(±N) + mid. Most common: ±8, mid 3 → 19 pos → 10193W.", "Рабочие положения P = 2×(±N) + средние. Чаще всего ±8, середина 3 → 19 → 10193W.", "Số vị trí P = 2×(±N) + giữa. Phổ biến: ±8, giữa 3 → 19 → 10193W."),
  selectorHint: L("组合式才有 B/C/D/DE。复合式（CV/CV2/SV）型号里没有这级字母。", "Grade B/C/D/DE is for combined types only. Compound (CV/CV2/SV) has no letter.", "Класс B/C/D/DE только у комбинированных. У составных (CV/CV2/SV) буквы нет.", "Cấp B/C/D/DE chỉ loại tổ hợp. Compound (CV/CV2/SV) không có chữ này."),
  octcHint: L("无励磁不是有载。笼式 WSL/WDL；鼓式 WSG/WDG/WLG。Y 常用 IV，D 常用 II。", "De-energized, not on-load. Cage WSL/WDL; drum WSG/WDG/WLG. Y often IV, D often II.", "ПБВ, не РПН. Клеть WSL/WDL; барабан WSG/WDG/WLG. Y часто IV, D часто II.", "Cắt điện, không mang tải. Lồng WSL/WDL; trống WSG/WDG/WLG. Y thường IV; D thường II."),
  dryHint: L("CZ 是单相结构。三相干变通常订 3×CZI，由一台电动机构机械联动。", "CZ is single-phase. Three-phase dry transformers usually order 3×CZI on one motor drive.", "CZ — однофазный. Для 3ф сухих ТР обычно 3×CZI с одним приводом.", "CZ là một pha. MBA khô ba pha thường 3×CZI một bộ truyền động."),
  cma7Hint: L("CMA7 是传统电动机构。写明带动的开关型号和档位数，否则机构行程对不上。", "CMA7 is the classic motor drive. State the tap-changer type and positions so the travel matches.", "CMA7 — классический привод. Укажите тип РПН и число положений.", "CMA7 là bộ truyền động cổ điển. Ghi kiểu OLTC và số vị trí."),
  shmdHint: L("SHM-D 是数字机构，可带控制器和通信。SHM-DL 带就地显示。", "SHM-D is the digital drive; optional controller and comms. SHM-DL has a local display.", "SHM-D — цифровой привод, опции контроллера и связи. SHM-DL — с местным дисплеем.", "SHM-D là bộ số; có thể kèm bộ điều khiển và truyền thông. SHM-DL có màn hình tại chỗ."),
  hwvHint: L("HWV / HWDK 是外附油箱真空有载，用 2023-8 Word 表，不是箱内 V1.2。没有 B/C/D。电机电源到机构单。", "HWV / HWDK is external-tank vacuum OLTC on the 2023-8 Word form, not in-tank V1.2. No B/C/D. Motor volts go on the MDU sheet.", "HWV / HWDK — вакуумный РПН в боковом баке, бланк Word 2023-8.", "HWV / HWDK là OLTC chân không thùng phụ, phiếu Word 2023-8."),
  noFamily: L("先选系列", "Pick a family first", "Сначала выберите серию", "Chọn họ máy trước"),
  oil: L("油浸", "Oil", "Масло", "Dầu"),
  vacuum: L("真空", "Vacuum", "Вакуум", "Chân không"),
  skipToContent: L("跳到正文", "Skip to content", "К содержимому", "Đến nội dung"),
  langSwitch: L("语言", "Language", "Язык", "Ngôn ngữ"),
  pipeCol: L("管", "Pipe", "Труба", "Ống"),
  pipeJoint: L("接头", "Joint", "Соединение", "Khớp"),
  pipeHeight: L("管高 mm", "Height mm", "Высота мм", "Cao mm"),
  notFoundTitle: L("未找到该订货单", "This order sheet was not found", "Бланк не найден", "Không tìm thấy phiếu"),
  notFoundLead: L("链接不对，或这张单还不在网页里。", "The link is wrong, or this sheet is not in the app.", "Неверная ссылка или бланка нет в приложении.", "Sai liên kết, hoặc phiếu này chưa có trên web."),
} satisfies Record<string, I18nText>;

export type ChromeKey = keyof typeof chrome;

export function chromeText(key: ChromeKey, lang: Lang, vars?: Record<string, string | number>): string {
  let s = chrome[key][lang] || chrome[key].zh;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}
