// Lightweight runtime checks for type-string composition and Excel sheets.
import { buildWorkbook } from "../lib/excel";
import { composeCompact, composeSpaced } from "../lib/typeString";
import { SECTIONS } from "../lib/schema";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const cmd = composeCompact({
  family: "CMD",
  phases: "III",
  currentA: 1000,
  connection: "Y",
  umKv: 72.5,
  selectorGrade: "C",
  tapCode: "10193W",
});
assert(cmd === "CMDIII-1000Y/72.5C-10193W", `CMD compact mismatch: ${cmd}`);

const spaced = composeSpaced({
  family: "CMD",
  phases: "III",
  currentA: 1000,
  connection: "Y",
  umKv: 72.5,
  selectorGrade: "C",
  tapCode: "10193W",
});
assert(spaced === "CMD III 1000 Y 72.5 C 10193W", `CMD spaced mismatch: ${spaced}`);

const cv = composeCompact({
  family: "CV",
  phases: "III",
  currentA: 500,
  connection: "Y",
  umKv: 72.5,
  selectorGrade: "C",
  tapCode: "10193W",
});
assert(cv === "CVIII-500Y/72.5-10193W", `CV should omit selector grade: ${cv}`);

for (const section of SECTIONS) {
  assert("titleZh" in section && !("titleRu" in section), `section ${section.id} still has RU title`);
  for (const field of section.fields) {
    assert("labelZh" in field && !("labelRu" in field), `field ${field.key} still has RU label`);
  }
}

const wb = buildWorkbook({
  family: "VCM",
  phases: "III",
  oltc_current_a: "1000",
  oltc_connection: "Y",
  oltc_um_kv: "72.5",
  oltc_selector_grade: "C",
});
assert(wb.SheetNames.join(",") === "Order Sheet,Flat,Meta", `sheets: ${wb.SheetNames.join(",")}`);

const header = (wb.Sheets["Order Sheet"]["A1"].v as string)
  + "|" + (wb.Sheets["Order Sheet"]["B1"].v as string)
  + "|" + (wb.Sheets["Order Sheet"]["C1"].v as string);
assert(header === "Section|Field (ZH)|Field (EN)", `human sheet header: ${header}`);
assert(!JSON.stringify(wb.Sheets["Order Sheet"]).includes("Field (RU)"), "RU column leaked into Excel");

console.log("smoke ok");
