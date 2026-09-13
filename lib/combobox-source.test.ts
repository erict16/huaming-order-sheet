import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const src = readFileSync(path.join(process.cwd(), "components/Combobox.tsx"), "utf8");

function tagSlice(source: string, tag: string): string {
  const start = source.indexOf(`<${tag}`);
  expect(start, `<${tag}`).toBeGreaterThan(-1);
  const selfClose = source.indexOf("/>", start);
  const closeTag = source.indexOf(`</${tag}>`, start);
  const end = selfClose >= 0 && (closeTag < 0 || selfClose < closeTag) ? selfClose : closeTag;
  expect(end, `end of <${tag}`).toBeGreaterThan(start);
  return source.slice(start, end);
}

function jsxHandler(block: string, attr: string): string {
  const needle = `${attr}={`;
  const at = block.indexOf(needle);
  expect(at, needle).toBeGreaterThan(-1);
  const open = at + needle.length - 1;
  let depth = 0;
  for (let i = open; i < block.length; i++) {
    const ch = block[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return block.slice(open + 1, i);
    }
  }
  throw new Error(`unbalanced ${needle}`);
}

describe("combobox source", () => {
  it("does not call onChange from ComboboxInput onChange (mid-type / allowCustom)", () => {
    const handler = jsxHandler(tagSlice(src, "ComboboxInput"), "onChange");
    expect(handler).toContain("setEditing");
    expect(handler).not.toMatch(/\bonChange\s*\(/);
    expect(src).toMatch(/if \(allowCustom\) commitTyped\(\)/);
  });
});
