import { describe, expect, it } from "vitest";
import { maxMidMinLine, operatingDesignation } from "./positions";

describe("operatingDesignation", () => {
  it("10193W → 1 / 9a9b9c / 17", () => {
    expect(operatingDesignation(19, 3)).toEqual({
      max: "1",
      mid: "9a9b9c",
      min: "17",
      stop: "9b",
    });
  });

  it("10191W → 1 / 10 / 19", () => {
    expect(operatingDesignation(19, 1)).toEqual({
      max: "1",
      mid: "10",
      min: "19",
      stop: "10",
    });
  });

  it("12233W → 1 / 11a11b11c / 21", () => {
    expect(operatingDesignation(23, 3)).toEqual({
      max: "1",
      mid: "11a11b11c",
      min: "21",
      stop: "11b",
    });
  });

  it("linear 9 positions", () => {
    expect(operatingDesignation(9, 0)).toEqual({
      max: "1",
      mid: "",
      min: "9",
      stop: "",
    });
  });

  it("出图一行", () => {
    expect(maxMidMinLine(operatingDesignation(19, 3))).toBe("最大1，中间9a9b9c，最小17");
  });
});
