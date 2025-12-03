import { describe, it, expect } from "vitest";
import { getAlgorithmCode } from "../algorithmCode";
import type { Language } from "../types";


describe("getAlgorithmCode", () => {
  it("returns a template for known algorithm and language", () => {
    const code = getAlgorithmCode("bubble-sort", "javascript" as Language);
    expect(code).toBeTruthy();
    expect(code).toMatch(/bubble/i);
  });

  it("falls back to a generic starter for unknown algorithm id", () => {
  const code = getAlgorithmCode("non-existent", "javascript" as Language);
  expect(code).not.toBeNull();
  expect(typeof code).toBe("string");
  expect(code).toContain("Playground");
});

});
