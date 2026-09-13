import type { OrderValues, SheetId } from "./types";

export function storageKey(id: SheetId): string {
  return `hm-os:${id}:v3`;
}

export function loadValues(id: SheetId): OrderValues {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(id));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return parsed as OrderValues;
  } catch {
    /* ignore */
  }
  return {};
}

export function saveValues(id: SheetId, values: OrderValues): void {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(values));
  } catch {
    /* quota */
  }
}

export function clearValues(id: SheetId): void {
  try {
    localStorage.removeItem(storageKey(id));
  } catch {
    /* ignore */
  }
}
