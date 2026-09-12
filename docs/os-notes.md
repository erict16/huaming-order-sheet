# Official Huaming OS notes (from templates + filled OneDrive files)

Written from:

- `public/templates/cma7-order-sheet.docx` (32 SDT + **69** `w:checkBox`)
- `public/templates/cma7-order-specification-v1.2.xlsm`
- `public/templates/oltc-order-sheet.docx` (96 SDT + 40 `w:checkBox`)
- `public/templates/in-tank-oltc-v1.2.xlsm`
- `public/templates/hwv-hwdk-order-spec.docx` (51 FORMTEXT + 68 FORMCHECKBOX)
- `public/templates/octc-order-spec.docx` (64 FORMTEXT + 69 FORMCHECKBOX)
- Filled OS: `OS/Indonesia/Bambangdjaja/PO 26005587 PX-360/CMA7 MDU Order SpecificationsPX-360_R3.doc`
- Filled OS: MEE EVN Tiên Yên `OLTC Order Specifications 40M` (vector **YNd11yn12**)
- Overnight corpus `~/.grok/huaming-order-sheet-overnight/os-replay-slim.json` / `GAPS.md`

**Word fill target for CMA7 checkboxes:** `cma7-order-sheet.docx` (live `w:checked` nodes). The V1.2 xlsm is the Excel path (dropdown cells, not Word ticks).

## CMA7 official groups vs wizard (before this work)

Official Word groups, in document order. Wizard previously stored only a short heater/IP/voltage subset; the rest died in remarks.

| Official group | Template ticks / boxes | Wizard before | Cited |
|---|---|---|---|
| Operating positions max / mid / min + automatic passage | SDT 7–10 | `mdu_positions` number only | PX-360: 1 / 17A,17B,17C / 33 |
| Motor circuit network | 3AC/N, AC, 3AC, DC + 50/60 Hz (C00–C05) + voltage SDT 11 | `motor_voltage` + `frequency_hz` only | PX-360: 380V/50Hz 3AC/N **and** Others 230 V 60 Hz |
| Control circuit | From motor / separate (C06–C07); 2AC/AC/DC (C08–C10); protection without vs dropdown (C11–C12) | one `control_voltage` | PX-360: From motor; Others 230 V 60 Hz; 2-pole auto-cut |
| Heating circuit | From motor / separate (C13–C14); AC/2AC; protection | missing | PX-360: From motor; 230 V 60 Hz |
| Heater type | Resistor std / thermostat / hygrostat+thermostat (C19–C21) | `heater` yes/no | MEE Tiên Yên CMA7: hygrostat+thermostat (`mee-tienyen-cma7`) |
| Hand lamp H4 | Without / With (C22–C23) | missing | Tiên Yên gap list |
| S16/S17 end-position | Without / 1 N/O / 1 C/O | missing | official Word |
| S18 hand-crank | Without / 1 N/O / 1 C/O | missing | official Word |
| S20 cam | Without / 1 C/O | missing | `mee-tienyen-cma7` |
| S21 incomplete tap | Without / 1 C/O | missing | `mee-tienyen-cma7` |
| X10 plug socket | Without / Universal / Others + country SDT 16 | missing | Tiên Yên |
| Position N/O type | 1/2 N/O BBM or MBB (C37–C40) | missing | PX-360 |
| BCD module | Without / 1 / 2 (C41–C43) | `position_tx=bcd` only | Tiên Yên BCD quantity |
| 4–20 mA | Without / 1 / 2 / 3 (C44–C47) | `position_tx=4_20` | official Word |
| Resistor signal | Without / 1st Ω/pos / 0 Ω first / 2nd / 3rd (C48–C52) + SDT 17–19 | missing | PX-360: 33 step resistors 10 Ω |
| Door hinges | Left / Right (C53–C54) | missing | official Word |
| Bottom plate | 2×φ50 / +gland / no bore / other (C55–C58) | missing | official Word |
| Padlock | Without / With (C59–C60) | missing | official Word |
| HMC-3C / ET-SZ6 AVR | Without / aviation / terminal + 30 m cable (C61–C68) | `controller` HMC-3C/ET-SZ6 as one select | `mee-tienyen-cma7` ET-SZ6 |

Standard-included (do not invent extra ticks unless the OS asks): 1 N/C motor protective switch, 1 N/C over-current blocking jumper, 1 N/O tap-changer in operation, Remote/Off/Local with 1 remote & local signal, Phoenix UK5 terminals.

## In-tank OLTC vs HWV vs OCTC

| | In-tank Word | HWV 2023-8 Word | OCTC 2011 Word |
|---|---|---|---|
| Families | CV/SV/CM/CM2/CMD/SHZV/SHZVG | HWVIII/HWVI/HWDKIII/HWDKI | WSL/WDL/WSL-D/WDG/WLG/WSG |
| Checkboxes | 40 (overload, ambient, capacity, Ust constant/variable, **8 regulation-location diagrams**, supporting flange, PRV, temp sensor) | 68 FORMTEXT-style ticks | 69 ticks |
| Three-winding | Vector group SDT + Excel `HV/MV/LV` cell H23. Word page 1 has **one** High Voltage box + “OLTC on _ kV side”. | Same single voltage box | Rated voltage one box |
| Fill target | `oltc-order-sheet.docx` + `in-tank-oltc-v1.2.xlsm` | `hwv-hwdk-order-spec.docx` | `octc-order-spec.docx` |

## Three-winding / tertiary

Official in-tank Excel (`in-tank-oltc-v1.2.xlsm` H23) is printed as:

```
HV(   ) kV
MV(   ) kV
LV(   ) kV
```

Wizard stored `hv_kv` + `lv_kv` only; MV was hardcoded blank. Vector `YNd11yn12` is already a first-class `VECTOR_GROUP_OPTS` value.

Cited: MEE EVN Tiên Yên `OLTC Order Specifications 40M` — vector **YNd11yn12**, 40 MVA, 115 kV (corpus `mee-tienyen-cv2`). GE Vernova Marisa notes 150/20/10 kV three-winding in `GAPS.md`.

Word export should keep HV in SDT 19, vector in SDT 10, and put `MV … kV` / `LV … kV` in the remarks SDT when MV is filled, matching how a single High Voltage box cannot hold three numbers.

## Remaining wizard gaps (not this slice)

- CV2-500 three-phase (catalogue III is 350/600).
- Tap code 10181W (not in Fig 3-3).
- SHM-D 2025.3 `.doc` is not a fillable checkbox form.
- Multi-segment shafts H1–H4 / V1–V4 as four lengths (Excel has the cells; Word SDTs 78–85 exist).
