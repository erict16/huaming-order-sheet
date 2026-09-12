import JSZip from "jszip";
import { DOMParser, XMLSerializer, Element as XmlEl } from "@xmldom/xmldom";

function localName(el: XmlEl): string {
  return el.localName || el.nodeName.replace(/^.*:/, "");
}

function childElements(el: XmlEl): XmlEl[] {
  const out: XmlEl[] = [];
  for (let i = 0; i < el.childNodes.length; i++) {
    const n = el.childNodes[i];
    if (n && n.nodeType === 1) out.push(n as XmlEl);
  }
  return out;
}

function findChildren(el: XmlEl, name: string): XmlEl[] {
  return childElements(el).filter((c) => localName(c) === name);
}

function findChild(el: XmlEl, name: string): XmlEl | undefined {
  return findChildren(el, name)[0];
}

function collectSdt(root: XmlEl): XmlEl[] {
  const out: XmlEl[] = [];
  function walk(el: XmlEl) {
    if (localName(el) === "sdt") out.push(el);
    for (const c of childElements(el)) walk(c);
  }
  walk(root);
  return out;
}

function ownTextNodes(sdt: XmlEl): XmlEl[] {
  const content = findChild(sdt, "sdtContent");
  if (!content) return [];
  const texts: XmlEl[] = [];
  function walk(el: XmlEl) {
    if (el !== content && localName(el) === "sdt") return;
    if (localName(el) === "t") texts.push(el);
    for (const c of childElements(el)) walk(c);
  }
  walk(content);
  return texts;
}

export function setSdtTexts(xml: string, values: Array<string | undefined>): string {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const root = doc.documentElement;
  if (!root) return xml;
  const sdts = collectSdt(root);
  for (let i = 0; i < sdts.length && i < values.length; i++) {
    const v = values[i];
    if (v == null || v === "") continue;
    const nodes = ownTextNodes(sdts[i]);
    if (!nodes.length) continue;
    nodes[0].textContent = v;
    for (let n = 1; n < nodes.length; n++) nodes[n].textContent = "";
  }
  return new XMLSerializer().serializeToString(doc);
}

function collectCheckBoxes(root: XmlEl): XmlEl[] {
  const out: XmlEl[] = [];
  function walk(el: XmlEl) {
    if (localName(el) === "checkBox") out.push(el);
    for (const c of childElements(el)) walk(c);
  }
  walk(root);
  return out;
}

function setBoxVal(box: XmlEl, name: string, on: boolean) {
  const el = findChild(box, name);
  if (!el) return;
  el.setAttribute("w:val", on ? "1" : "0");
}

/** Official OLTC Word OS uses 40 legacy FORMCHECKBOX fields (`w:checked`). */
export function setLegacyCheckboxes(xml: string, checks: Array<boolean | undefined | null>): string {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const root = doc.documentElement;
  if (!root) return xml;
  const boxes = collectCheckBoxes(root);
  for (let i = 0; i < boxes.length && i < checks.length; i++) {
    const on = !!checks[i];
    setBoxVal(boxes[i], "checked", on);
    setBoxVal(boxes[i], "default", on);
  }
  return new XMLSerializer().serializeToString(doc);
}

export function readLegacyCheckboxes(xml: string): boolean[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const root = doc.documentElement;
  if (!root) return [];
  return collectCheckBoxes(root).map((box) => findChild(box, "checked")?.getAttribute("w:val") === "1");
}

export async function fillDocx(
  template: ArrayBuffer | Uint8Array,
  values: Array<string | undefined>,
  checks?: Array<boolean | undefined | null>,
): Promise<ArrayBuffer> {
  const zip = await JSZip.loadAsync(template);
  const path = "word/document.xml";
  let xml = await zip.file(path)!.async("string");
  xml = setSdtTexts(xml, values);
  if (checks) xml = setLegacyCheckboxes(xml, checks);
  zip.file(path, xml);
  return zip.generateAsync({ type: "arraybuffer", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}

export function readSdtTexts(xml: string): string[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const root = doc.documentElement;
  if (!root) return [];
  return collectSdt(root).map((sdt) =>
    ownTextNodes(sdt)
      .map((t) => t.textContent || "")
      .join("")
      .trim(),
  );
}


