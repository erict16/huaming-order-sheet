import { getFamily } from "./catalog";
import type { OrderValues } from "./types";

interface TypeParts {
  family: string;
  phases: string;
  currentA: string;
  connection: string;
  umKv: string;
  selectorGrade: string;
  tapCode: string;
  unitCount?: string;
  octcSeries?: string;
  octcContact?: string;
  octcSize?: string;
  dryPositions?: string;
}

function gradeToken(family: string, grade?: string): string {
  const fam = getFamily(family);
  if (!fam?.hasSelectorGrade) return "";
  return grade ?? "";
}

function composeOltcSpaced(p: TypeParts): string {
  const grade = gradeToken(p.family, p.selectorGrade);
  return [p.family, p.phases, p.currentA, p.connection, p.umKv, grade, p.tapCode]
    .filter(Boolean)
    .join(" ");
}

function composeOltcCompact(p: TypeParts): string {
  if (!p.family) return "";
  const n = Number(p.unitCount || "1");
  const prefix = n > 1 ? `${n}×` : "";
  const grade = gradeToken(p.family, p.selectorGrade);
  const head = `${prefix}${p.family}${p.phases || ""}`;
  const mid = `${p.currentA || ""}${p.connection || ""}`;
  const um = `${p.umKv || ""}${grade}`;
  let s = head;
  const after = [mid, um].filter(Boolean).join("/");
  if (after) s += `-${after}`;
  if (p.tapCode) s += `-${p.tapCode}`;
  return s;
}

/** WSLIV-800Y/170-6x5B */
function composeOctc(p: TypeParts): string {
  if (!p.family) return "";
  const series = p.octcSeries || "";
  const head = `${p.family}${series}`;
  const mid = `${p.currentA || ""}${p.connection || ""}`;
  const um = p.umKv || "";
  const contact = `${p.octcContact || ""}${p.octcSize || ""}`;
  let s = head;
  if (mid || um) s += `-${mid}${um ? `/${um}` : ""}`;
  if (contact) s += `-${contact}`;
  return s;
}

/** 3×CZI-500/40.5-17 */
function composeDry(p: TypeParts): string {
  if (!p.family) return "";
  const n = Number(p.unitCount || "1");
  const prefix = n > 1 ? `${n}×` : "";
  const head = `${prefix}${p.family}${p.phases || "I"}`;
  const mid = p.currentA ? `-${p.currentA}` : "";
  const um = p.umKv ? `/${p.umKv}` : "";
  const pos = p.dryPositions ? `-${p.dryPositions}` : "";
  return `${head}${mid}${um}${pos}`;
}

export function typeFromValues(sheetId: string, values: OrderValues): { spaced: string; compact: string } {
  const p: TypeParts = {
    family: values.family || "",
    phases: values.phases || "",
    currentA: values.oltc_current_a || values.current_a || "",
    connection: values.oltc_connection || values.connection || "",
    umKv: values.oltc_um_kv || values.um_kv || "",
    selectorGrade: values.oltc_selector_grade || "",
    tapCode: values.tap_code || "",
    unitCount: values.unit_count,
    octcSeries: values.octc_series,
    octcContact: values.octc_contact,
    octcSize: values.octc_size,
    dryPositions: values.dry_positions,
  };

  if (sheetId === "octc") {
    const compact = composeOctc(p);
    return { spaced: compact, compact };
  }
  if (sheetId === "dry") {
    const compact = composeDry(p);
    return { spaced: compact, compact };
  }
  if (sheetId === "cma7") {
    const mdu = "CMA7";
    const match = values.matching_oltc || "";
    const compact = match ? `${match}+${mdu}` : mdu;
    return { spaced: compact, compact };
  }
  if (sheetId === "shm-d") {
    const mdu = values.shm_model || "SHM-D";
    const ctrl = values.controller && values.controller !== "none" ? `+${values.controller}` : "";
    const match = values.matching_oltc || "";
    const compact = `${match ? `${match}+` : ""}${mdu}${ctrl}`;
    return { spaced: compact, compact };
  }
  return { spaced: composeOltcSpaced(p), compact: composeOltcCompact(p) };
}
