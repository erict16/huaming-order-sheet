/** Max / mid / min numbering used on Huaming OS (CMA7 example: 1 / 9a9b9c / 17). */

export function operatingDesignation(
  positions: number,
  mid: 0 | 1 | 3,
): { max: string; mid: string; min: string; stop: string } {
  if (!positions || positions < 2) {
    return { max: "", mid: "", min: "", stop: "" };
  }
  if (mid === 3) {
    const min = positions - 2;
    const midNum = (1 + min) / 2;
    const m = String(midNum);
    return { max: "1", mid: `${m}a${m}b${m}c`, min: String(min), stop: `${m}b` };
  }
  if (mid === 1) {
    const midNum = (positions + 1) / 2;
    const token = String(midNum);
    return { max: "1", mid: token, min: String(positions), stop: token };
  }
  return { max: "1", mid: "", min: String(positions), stop: "" };
}

export function maxMidMinLine(d: { max: string; mid: string; min: string }): string {
  if (!d.max && !d.min) return "";
  if (d.mid) return `最大${d.max}，中间${d.mid}，最小${d.min}`;
  return `最大${d.max}，最小${d.min}`;
}
