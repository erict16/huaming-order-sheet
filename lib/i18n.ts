import { L } from "./copy";
import type { I18nText, Lang } from "./types";

export const LANG_STORAGE = "hm-os-lang";

export const chrome = {
  brand: L("上海华明", "Shanghai Huaming", "Shanghai Huaming", "Shanghai Huaming"),
  brandSub: L("电力设备", "Power Equipment", "Power Equipment", "Power Equipment"),
  appName: L("订货技术规范书", "Order specifications", "Спецификация заказа", "Phiếu đặt hàng kỹ thuật"),
  appNameShort: L("订货单", "Order sheet", "Бланк заказа", "Phiếu đặt hàng"),
  heroLead: L("空白项按常规配置。", "Blank fields = standard supply.", "Пустые поля — стандарт.", "Ô trống = tiêu chuẩn."),
  pickSheet: L("选择要填的订货单", "Choose an order sheet", "Выберите бланк", "Chọn phiếu đặt hàng"),
  start: L("开始填写", "Start", "Начать", "Bắt đầu"),
  backHome: L("返回首页", "All sheets", "Все бланки", "Về trang đầu"),
  next: L("下一步", "Next", "Далее", "Tiếp"),
  prev: L("上一步", "Back", "Назад", "Trước"),
  save: L("保存", "Save", "Сохранить", "Lưu"),
  savedFlash: L("已保存", "Saved", "Сохранено", "Đã lưu"),
  copyType: L("复制型号", "Copy type", "Копировать тип", "Sao chép kiểu"),
  copied: L("已复制", "Copied", "Скопировано", "Đã sao chép"),
  typePlate: L("型号", "Type designation", "Обозначение", "Ký hiệu kiểu"),
  required: L("必填", "Required", "Обязательно", "Bắt buộc"),
  standardNote: L("未填 = 常规配置", "Blank = standard supply", "Пусто = стандарт", "Trống = tiêu chuẩn"),
  clear: L("清空本单", "Clear this sheet", "Очистить бланк", "Xoá phiếu này"),
  stepOf: L("第 {n} / {total} 步", "Step {n} of {total}", "Шаг {n} из {total}", "Bước {n} / {total}"),
  reviewTitle: L("核对全部参数", "Check every field", "Проверьте все параметры", "Kiểm tra mọi thông số"),
  reviewLead: L("核对后选 Word 或 Excel 下载。空白项按常规。", "Then download Word or Excel. Blank = standard.", "После проверки — Word или Excel. Пусто = стандарт.", "Kiểm xong tải Word hoặc Excel. Trống = tiêu chuẩn."),
  reviewEmpty: L("还没有可核对的内容。先选系列、填必填。", "Nothing to review yet. Pick a family and fill the required fields.", "Пока нечего проверять. Сначала серия и обязательные поля.", "Chưa có gì để kiểm. Hãy chọn họ máy và điền bắt buộc."),
  exportWord: L("导出 Word", "Export Word", "Экспорт Word", "Xuất Word"),
  exportWordUnavailable: L("本单没有 Word 模板，请用 Excel。", "This sheet has no Word template. Use Excel.", "Для этого бланка нет шаблона Word. Используйте Excel.", "Phiếu này không có mẫu Word. Dùng Excel."),
  exportWordBlank: L("这份 .doc 是空白官方表。填好的内容在 Excel（xlsm）。", "This .doc is a blank official form. The filled sheet is the Excel (xlsm).", "Этот .doc — пустой официальный бланк. Заполненный файл — Excel (xlsm).", "File .doc này là mẫu chính thức trống. Nội dung đã điền nằm ở Excel (xlsm)."),
  exportExcel: L("导出 Excel", "Export Excel", "Экспорт Excel", "Xuất Excel"),
  exportExcelGeneric: L("本单 Excel 是普通 xlsx，不是官方订货表。官方表请用 Word。", "Excel here is a generic xlsx, not the official order sheet. Use Word for the official form.", "Excel здесь — обычный xlsx, не официальный бланк. Официальная форма — Word.", "Excel ở đây là xlsx thường, không phải phiếu chính thức. Phiếu chính thức dùng Word."),
  exportFormat: L("导出格式", "Export format", "Формат экспорта", "Định dạng xuất"),
  exporting: L("正在导出…", "Exporting…", "Экспорт…", "Đang xuất…"),
  presets: L("按真实订单起单", "Start from a real order", "Начать с реального заказа", "Bắt đầu từ đơn thật"),
  presetsHint: L("8 份 OneDrive 真单，点开再选。默认收着。", "Eight real OneDrive orders. Closed by default — pick one to prefill.", "Восемь реальных заказов. Свёрнуто — выберите, чтобы заполнить.", "Tám đơn OneDrive thật. Mặc định gập, chọn để điền sẵn."),
  presetsHintN: L("{n} 份 OneDrive 真单，点开再选。默认收着。", "Real OneDrive orders ({n}). Closed by default, pick one to prefill.", "Реальных заказов: {n}. Свёрнуто, выберите, чтобы заполнить.", "{n} đơn OneDrive thật. Mặc định gập, chọn để điền sẵn."),
  presetApply: L("一键填入", "Prefill", "Заполнить", "Điền sẵn"),
  search: L("搜索", "Search", "Поиск", "Tìm"),
  noMatches: L("无匹配", "No matches", "Нет совпадений", "Không khớp"),
  missing: L("还有必填没填", "Required fields are empty", "Не заполнены обязательные поля", "Còn trường bắt buộc trống"),
  footer: L("华明电力设备 · IEC 60214 / GB 10230 · 仅供订货填写，最终以工程确认为准。", "Huaming Power Equipment · IEC 60214 / GB 10230 · For ordering; engineering confirmation is final.", "Huaming · IEC 60214 / GB 10230 · Для заказа; окончательно — подтверждение конструкторов.", "Huaming · IEC 60214 / GB 10230 · Chỉ để đặt hàng; kỹ thuật xác nhận mới là cuối cùng."),
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
