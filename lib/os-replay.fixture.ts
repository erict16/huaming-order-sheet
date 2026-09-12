import type { SheetId } from "./types";

/** One real OneDrive OS row. Compose unless `skip` names why the wizard cannot. */
export type OsReplayRow = {
  id: string;
  sheet: SheetId;
  family: string;
  /** Commercial type as written on the OS (often hyphen before Um). */
  type: string;
  skip?: string;
};

/**
 * Slim 38-order corpus. Wizard compact is
 * `FAMILY+phases-current+conn/um+grade-tap` (slash after current+conn).
 */
export const OS_REPLAY: OsReplayRow[] = [
  {
    id: "mee-tienyen-cv2",
    sheet: "oltc",
    family: "CV2",
    type: "CV2III-500Y-72.5-10191W",
    skip: "cv2-500-iii",
  },
  {
    id: "mee-tienyen-cma7",
    sheet: "cma7",
    family: "CV2",
    type: "CV2III-500Y-72.5-10191W",
    skip: "cma7-sheet",
  },
  {
    id: "mee-lq250049-cv2",
    sheet: "oltc",
    family: "CV2",
    type: "CV2III-350D-126-10193W",
  },
  {
    id: "mee-wsl-evn-npc-600d",
    sheet: "octc",
    family: "WSL",
    type: "WSLII-600D-72.5-6X5A",
  },
  {
    id: "mee-wsl-duc-hue-600y",
    sheet: "octc",
    family: "WSL",
    type: "WSLIV-600Y-72.5-6X5A",
  },
  {
    id: "mee-wsl-evn-800d-hand",
    sheet: "octc",
    family: "WSL",
    type: "WSLII-800D-72.5-6X5A",
  },
  {
    id: "mee-wsl-sp-evn-600d",
    sheet: "octc",
    family: "WSL",
    type: "WSLII-600D-72.5-6X5A",
  },
  {
    id: "hlg-havec-cv",
    sheet: "oltc",
    family: "CV",
    type: "CVIII-350D-40.5-14271W",
  },
  {
    id: "hlg-havec-cv-cma7",
    sheet: "cma7",
    family: "CV",
    type: "CVIII-350D-40.5-14271W",
    skip: "cma7-sheet",
  },
  {
    id: "hlg-havec-svr",
    sheet: "oltc",
    family: "SV",
    type: "SVIII-500D-40.5",
  },
  {
    id: "hlg-havec-svr-cma7",
    sheet: "cma7",
    family: "SV",
    type: "SVIII-500D-40.5",
    skip: "cma7-sheet",
  },
  {
    id: "hlg-hwv-evn-retrofit",
    sheet: "hwv",
    family: "HWV",
    type: "HWVIII-400Y-72.5-10191W",
  },
  {
    id: "hlg-mbt-cv",
    sheet: "oltc",
    family: "CV",
    type: "CVIII-350D-40.5-10193W",
  },
  {
    id: "eemc-po26-667-shzv",
    sheet: "oltc",
    family: "SHZV",
    type: "SHZVIII-1000Y-72.5C-10193W",
  },
  {
    id: "sanaky-laos-cvi",
    sheet: "oltc",
    family: "CV",
    type: "CVI-700-72.5-10070",
  },
  {
    id: "tirathai-cv-lab",
    sheet: "oltc",
    family: "CV",
    type: "CVIII-350D-40.5-12233G",
  },
  {
    id: "tirathai-cv-lab-cma7",
    sheet: "cma7",
    family: "CV",
    type: "CVIII-350D-40.5-12233G",
    skip: "cma7-sheet",
  },
  {
    id: "padma-cv",
    sheet: "oltc",
    family: "CV",
    type: "CVIII-350D-40.5-10193G",
  },
  {
    id: "padma-shm-d",
    sheet: "shm-d",
    family: "CV",
    type: "CVIII-350D-40.5-10193G",
    skip: "shm-d-sheet",
  },
  {
    id: "trafoindo-salak7-cv2",
    sheet: "oltc",
    family: "CV2",
    type: "CV2III-350D-40.5-10193W",
  },
  {
    id: "trafoindo-lubuk-gaung-cv2",
    sheet: "oltc",
    family: "CV2",
    type: "CV2III-350Y-40.5-10193W",
  },
  {
    id: "bambang-px360-cm2",
    sheet: "oltc",
    family: "CM2",
    type: "CM2III-500Y-72.5B-18353W",
  },
  {
    id: "bambang-px360-cma7",
    sheet: "cma7",
    family: "CM2",
    type: "CM2III-500Y-72.5B-18353W",
    skip: "cma7-sheet",
  },
  {
    id: "bambang-px356-shzv",
    sheet: "oltc",
    family: "SHZV",
    type: "SHZVIII-1000Y-72.5C-10181W",
    skip: "10181w",
  },
  {
    id: "bambang-hwv-400y",
    sheet: "hwv",
    family: "HWV",
    type: "HWVIII-400Y-17.5-18353W",
  },
  {
    id: "bambang-cz-3xczi",
    sheet: "dry",
    family: "CZ",
    type: "3×CZI-500-40.5-17",
  },
  {
    id: "symphos-5mva-cv",
    sheet: "oltc",
    family: "CV",
    type: "CVIII-350D-40.5-10193W",
  },
  {
    id: "symphos-10mva-sv",
    sheet: "oltc",
    family: "SV",
    type: "SVIII-500D-40.5-10193W",
  },
  {
    id: "symphos-26-0002-cv-21pos",
    sheet: "oltc",
    family: "CV",
    type: "CVIII-350D-40.5-12233W",
  },
  {
    id: "asata-7p5-auto-cv",
    sheet: "oltc",
    family: "CV",
    type: "CVIII-350D-40.5-10193W",
  },
  {
    id: "ge-unindo-wotu-cm2",
    sheet: "oltc",
    family: "CM2",
    type: "CM2I-600Y-170C-10191W",
    skip: "cm2-170-c-floor",
  },
  {
    id: "ue-hwv",
    sheet: "hwv",
    family: "HWV",
    type: "HWVIII-400Y-72.5-10193W",
  },
  {
    id: "melbourne-cz",
    sheet: "dry",
    family: "CZ",
    type: "3×CZI-500-40.5-9",
  },
  {
    id: "melbourne-hwv-dry",
    sheet: "hwv",
    family: "HWV",
    type: "HWVIII-400D-40.5-9",
    skip: "hwv-linear-9",
  },
  {
    id: "wilson-shzv-1000-126",
    sheet: "oltc",
    family: "SHZV",
    type: "SHZVIII-1000Y-126D-10193W",
  },
  {
    id: "wilson-shzv-i-2400",
    sheet: "oltc",
    family: "SHZV",
    type: "3×SHZVI-2400Y-72.5D-10193W",
  },
  {
    id: "wilson-cv2-600d",
    sheet: "oltc",
    family: "CV2",
    type: "CV2III-600D-72.5-10193W",
  },
  {
    id: "wilson-shzvg-1500",
    sheet: "oltc",
    family: "SHZVG",
    type: "SHZVGIII-1500Y-72.5C-10193W",
  },
];

/** Wizard compact strings the catalog/tapCode table can already build. */
export const MUST_COMPOSE: readonly string[] = [
  "WSLII-600D/72.5-6x5A",
  "WSLIV-600Y/72.5-6x5A",
  "WSLII-800D/72.5-6x5A",
  "CVIII-350D/40.5-14271W",
  "CVIII-350D/40.5-10193W",
  "CVIII-350D/40.5-12233W",
  "CVIII-350D/40.5-12233G",
  "CVIII-350D/40.5-10193G",
  "CV2III-350D/40.5-10193W",
  "CV2III-350Y/40.5-10193W",
  "CV2III-350D/126-10193W",
  "CV2III-600D/72.5-10193W",
  "HWVIII-400Y/72.5-10193W",
  "HWVIII-400Y/72.5-10191W",
  "HWVIII-400Y/17.5-18353W",
  "SHZVIII-1000Y/72.5C-10193W",
  "SHZVIII-1000Y/126D-10193W",
  "SHZVGIII-1500Y/72.5C-10193W",
  "CM2III-500Y/72.5B-18353W",
  "3×SHZVI-2400Y/72.5D-10193W",
  "3×CZI-500/40.5-17",
  "3×CZI-500/40.5-9",
  "SVIII-500D/40.5",
  "SVIII-500D/40.5-10193W",
  "CVI-700/72.5-10070",
];
