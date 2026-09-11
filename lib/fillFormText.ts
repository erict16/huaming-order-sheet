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

function collectTextNodes(root: XmlEl): XmlEl[] {
  const out: XmlEl[] = [];
  function walk(el: XmlEl) {
    if (localName(el) === "t") out.push(el);
    for (const c of childElements(el)) walk(c);
  }
  walk(root);
  return out;
}

/** FORMTEXT plus the underline spaces that textutil leaves in the same run. */
const TOKEN_RE = /FORMCHECKBOX|FORMTEXT[\s\u00a0\u2002]*/g;

export function countFormPlaceholders(xml: string): { formtext: number; formcheckbox: number } {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const root = doc.documentElement;
  if (!root) return { formtext: 0, formcheckbox: 0 };
  let formtext = 0;
  let formcheckbox = 0;
  for (const node of collectTextNodes(root)) {
    const s = node.textContent || "";
    for (const m of s.matchAll(/FORMTEXT/g)) {
      if (m) formtext += 1;
    }
    for (const m of s.matchAll(/FORMCHECKBOX/g)) {
      if (m) formcheckbox += 1;
    }
  }
  return { formtext, formcheckbox };
}

export function applyFormFields(
  xml: string,
  fields: {
    texts?: Array<string | undefined | null>;
    checks?: Array<boolean | undefined | null>;
  },
): string {
  const texts = fields.texts ?? [];
  const checks = fields.checks ?? [];
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const root = doc.documentElement;
  if (!root) return xml;
  let ti = 0;
  let ci = 0;
  for (const node of collectTextNodes(root)) {
    const raw = node.textContent || "";
    if (!raw.includes("FORMTEXT") && !raw.includes("FORMCHECKBOX")) continue;
    const next = raw.replace(TOKEN_RE, (match) => {
      if (match.startsWith("FORMCHECKBOX")) {
        const on = checks[ci++];
        return on ? "☒" : match;
      }
      const v = texts[ti++];
      if (v == null || v === "") return match;
      return v;
    });
    if (next !== raw) node.textContent = next;
  }
  return new XMLSerializer().serializeToString(doc);
}

export async function fillFormTextDocx(
  template: ArrayBuffer | Uint8Array,
  fields: {
    texts?: Array<string | undefined | null>;
    checks?: Array<boolean | undefined | null>;
  },
): Promise<ArrayBuffer> {
  const zip = await JSZip.loadAsync(template);
  const path = "word/document.xml";
  const xml = await zip.file(path)!.async("string");
  zip.file(path, applyFormFields(xml, fields));
  return zip.generateAsync({
    type: "arraybuffer",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

export async function readDocumentXml(buf: ArrayBuffer | Uint8Array): Promise<string> {
  const zip = await JSZip.loadAsync(buf);
  return zip.file("word/document.xml")!.async("string");
}
