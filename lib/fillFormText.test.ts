import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { applyFormFields, countFormPlaceholders, fillFormTextDocx, readDocumentXml } from "./fillFormText";

const template = path.join(process.cwd(), "public/templates/hwv-hwdk-order-spec.docx");

describe("fillFormText", () => {
  it("counts 51 FORMTEXT and 68 FORMCHECKBOX on the committed 2023-8 template", async () => {
    const xml = await readDocumentXml(readFileSync(template));
    expect(countFormPlaceholders(xml)).toEqual({ formtext: 51, formcheckbox: 68 });
    expect(xml).not.toContain("w:sdt");
  });

  it("replaces the n-th FORMTEXT and checks the n-th FORMCHECKBOX", async () => {
    const texts = new Array<string | undefined>(51);
    const checks = new Array<boolean>(68).fill(false);
    texts[0] = "United Energy";
    texts[32] = "400";
    checks[0] = true;
    const filled = await fillFormTextDocx(readFileSync(template), { texts, checks });
    const xml = await readDocumentXml(filled);
    expect(xml).toContain("United Energy");
    expect(xml).toContain("400");
    expect(xml).toContain("☒");
    const left = countFormPlaceholders(xml);
    expect(left.formtext).toBe(49);
    expect(left.formcheckbox).toBe(67);
  });

  it("leaves empty FORMTEXT and unchecked FORMCHECKBOX in place", () => {
    const xml =
      `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      `<w:t xml:space="preserve"> FORMTEXT \u2002\u2002\u2002\u2002\u2002</w:t><w:t> FORMCHECKBOX </w:t></w:document>`;
    const out = applyFormFields(xml, { texts: [""], checks: [false] });
    expect(out).toContain("FORMTEXT");
    expect(out).toContain("FORMCHECKBOX");
    expect(out).not.toContain("☒");
  });

  it("fills a run that holds both FORMCHECKBOX and FORMTEXT", () => {
    const xml =
      `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      `<w:t xml:space="preserve"> FORMCHECKBOX ( FORMTEXT \u2002\u2002\u2002\u2002\u2002)</w:t></w:document>`;
    const out = applyFormFields(xml, { texts: ["25"], checks: [true] });
    expect(out).toContain("☒");
    expect(out).toContain("25");
    expect(out).not.toContain("FORMTEXT");
    expect(out).not.toContain("FORMCHECKBOX");
  });
});
