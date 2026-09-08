// Tap-selector "basic connection diagram" code, e.g. 10193W.
//
//   10  19  3  W
//   │   │   │  └ change-over: W = reversing, G = coarse/fine, "" = linear
//   │   │   └─── mid positions (0 for linear, typically 1 or 3)
//   │   └─────── max service/operating positions
//   └─────────── tap-selector pitch (inherent contacts): 10/12/14/16/18
//
// Relation: positions = 2 * plusMinusSteps + midPositions.

export type ChangeOver = "W" | "G" | "";

export interface TapCodeFields {
  pitch: number;
  positions: number;
  midPositions: number;
  changeOver: ChangeOver;
}

export function positionsFromSteps(plusMinusSteps: number, midPositions: number): number {
  return 2 * plusMinusSteps + midPositions;
}

export function encodeTapCode(fields: TapCodeFields): string {
  const { pitch, positions, midPositions, changeOver } = fields;
  return `${pitch}${positions}${midPositions}${changeOver}`;
}

// Best-effort decode. The pitch is 2 digits, mid is the last digit before the
// change-over letter, and positions are the digits in between.
export function decodeTapCode(code: string): TapCodeFields | null {
  const m = /^(\d{2})(\d+)(\d)([WG]?)$/.exec(code.trim().toUpperCase());
  if (!m) return null;
  const pitch = Number(m[1]);
  const positions = Number(m[2]);
  const midPositions = Number(m[3]);
  const changeOver = (m[4] as ChangeOver) ?? "";
  return { pitch, positions, midPositions, changeOver };
}

export function changeOverForRegulation(regulation: string): ChangeOver {
  if (regulation === "reversing") return "W";
  if (regulation === "coarse_fine") return "G";
  return "";
}
