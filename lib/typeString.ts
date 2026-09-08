// Compose the Huaming tap-changer type designation from OLTC fields, in both
// the spaced (brochure) and compact (order-sheet / price-list) spellings.
//
//   spaced:  CMD III 1000 Y 72.5 C 10193W
//   compact: CMDIII-1000Y/72.5C-10193W

import { getFamily } from "./catalog";

export interface TypeStringFields {
  family: string;
  phases: string; // I | II | III
  currentA?: number | "";
  connection?: string; // Y | D
  umKv?: number | "";
  selectorGrade?: string; // B | C | D | DE ("" when family has none)
  tapCode?: string; // e.g. 10193W
}

function gradeToken(family: string, grade?: string): string {
  const fam = getFamily(family);
  if (!fam?.hasSelectorGrade) return "";
  return grade ?? "";
}

export function composeSpaced(f: TypeStringFields): string {
  const grade = gradeToken(f.family, f.selectorGrade);
  return [
    f.family,
    f.phases,
    f.currentA === "" || f.currentA == null ? "" : String(f.currentA),
    f.connection ?? "",
    f.umKv === "" || f.umKv == null ? "" : String(f.umKv),
    grade,
    f.tapCode ?? "",
  ]
    .filter((t) => t !== "")
    .join(" ");
}

export function composeCompact(f: TypeStringFields): string {
  const grade = gradeToken(f.family, f.selectorGrade);
  const current =
    f.currentA === "" || f.currentA == null ? "" : String(f.currentA);
  const um = f.umKv === "" || f.umKv == null ? "" : String(f.umKv);
  const head = `${f.family}${f.phases}`;
  const mid = [current, f.connection ?? ""].filter((t) => t !== "").join("");
  const umPart = `${um}${grade}`;
  const parts: string[] = [];
  parts.push(head);
  const afterDash = [mid, umPart].filter((t) => t !== "").join("/");
  let s = parts.join("");
  if (afterDash) s += `-${afterDash}`;
  if (f.tapCode) s += `-${f.tapCode}`;
  return s;
}
