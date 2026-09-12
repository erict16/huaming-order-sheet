import { describe, expect, it } from "vitest";
import { ALL_FAMILIES } from "./catalog";
import { deriveValues } from "./derive";
import { MUST_COMPOSE, OS_REPLAY, type OsReplayRow } from "./os-replay.fixture";
import type { OrderValues, Regulation } from "./types";
import { typeFromValues } from "./typeString";

const FAMILY_CODES = [...ALL_FAMILIES.map((f) => f.code)].sort((a, b) => b.length - a.length);

type ParsedType = {
  unitCount: string;
  family: string;
  roman: string;
  currentA: string;
  connection: string;
  umKv: string;
  selectorGrade: string;
  tail: string;
};

function parseType(type: string): ParsedType {
  const famAlt = FAMILY_CODES.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const re = new RegExp(
    `^(?:(\\d+)[×xX])?(${famAlt})(IV|I{1,3})-(\\d+)([YDyd])?[-/](\\d+(?:\\.\\d+)?)([BCDE]{1,2})?(?:-(.+))?$`,
    "i",
  );
  const m = re.exec(type);
  if (!m) throw new Error(`unparsed type: ${type}`);
  const code = FAMILY_CODES.find((c) => c.toLowerCase() === m[2]!.toLowerCase());
  if (!code) throw new Error(`unknown family in ${type}`);
  return {
    unitCount: m[1] || "",
    family: code,
    roman: m[3]!.toUpperCase(),
    currentA: m[4]!,
    connection: (m[5] || "").toUpperCase(),
    umKv: m[6]!,
    selectorGrade: (m[7] || "").toUpperCase(),
    tail: m[8] || "",
  };
}

function tapPatch(code: string): OrderValues | null {
  const m = /^(\d{2})(\d{2})([013])([WG])?$/i.exec(code);
  if (!m) return null;
  const positions = Number(m[2]);
  const mid = Number(m[3]) as 0 | 1 | 3;
  const co = (m[4] || "").toUpperCase();
  const regulation: Regulation = co === "G" ? "coarse_fine" : co === "W" ? "reversing" : "linear";
  const patch: OrderValues = {
    regulation,
    oltc_tap_positions: String(positions),
    oltc_tap_mid: String(mid),
    oltc_tap_pitch: String(Number(m[1])),
  };
  if (regulation !== "linear") patch.plus_minus = String((positions - mid) / 2);
  return patch;
}

function valuesFromRow(row: OsReplayRow): OrderValues {
  const p = parseType(row.type);
  if (row.sheet === "octc") {
    const contact = /^(\d+[xX]\d+)([A-Za-z])?$/.exec(p.tail);
    return deriveValues(
      {},
      {
        family: p.family,
        octc_series: p.roman,
        current_a: p.currentA,
        connection: p.connection,
        um_kv: p.umKv,
        octc_contact: contact ? contact[1]!.toLowerCase() : "",
        octc_size: contact?.[2] ? contact[2].toUpperCase() : "",
      },
    );
  }
  if (row.sheet === "dry") {
    return deriveValues(
      {},
      {
        family: p.family,
        unit_count: p.unitCount || "1",
        phases: p.roman,
        oltc_current_a: p.currentA,
        oltc_um_kv: p.umKv,
        dry_positions: p.tail,
      },
    );
  }
  const patch: OrderValues = {
    family: p.family,
    phases: p.roman,
    oltc_current_a: p.currentA,
    oltc_um_kv: p.umKv,
  };
  if (p.connection) patch.oltc_connection = p.connection;
  if (p.selectorGrade) patch.oltc_selector_grade = p.selectorGrade;
  const tap = tapPatch(p.tail);
  if (tap) Object.assign(patch, tap);
  return deriveValues({}, patch);
}

/** Real OS often writes a hyphen before Um; wizard compact uses a slash. */
export function toWizardCompact(type: string): string {
  return type.replace(/(\d+[YDyd]?)[-/](\d)/, "$1/$2").replace(/(\d)X(\d)/i, "$1x$2");
}

describe("os replay", () => {
  it("lists every slim OS row as compose-pass or a named skip", () => {
    expect(OS_REPLAY).toHaveLength(38);
    const seen = new Set<string>();
    for (const row of OS_REPLAY) {
      expect(row.type, row.id).toBeTruthy();
      expect(seen.has(row.id), row.id).toBe(false);
      seen.add(row.id);
      if (row.skip) {
        expect(row.skip, row.id).toMatch(/^[a-z0-9-]+$/);
        continue;
      }
      const got = typeFromValues(row.sheet, valuesFromRow(row)).compact;
      expect(got, row.id).toBe(toWizardCompact(row.type));
    }
  });

  it("composes at least 20 distinct wizard type strings", () => {
    const composed = new Set(
      OS_REPLAY.filter((row) => !row.skip).map((row) => typeFromValues(row.sheet, valuesFromRow(row)).compact),
    );
    expect(composed.size).toBeGreaterThanOrEqual(20);
    for (const type of MUST_COMPOSE) {
      expect(composed, type).toContain(type);
    }
  });
});
