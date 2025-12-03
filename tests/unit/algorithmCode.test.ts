// tests/unit/algorithmCode.test.ts
import { describe, it, expect } from "vitest";
import { getAlgorithmCode } from "../../src/lib/algorithmCode";
import { ALGORITHMS } from "../../src/lib/algorithms";
import type { Language } from "../../src/lib/types";

describe("getAlgorithmCode", () => {
  it("returns a template for a known algorithm & language", () => {
    // use first algorithm from the catalog so it always exists
    const first = ALGORITHMS[0];
    const lang = (first.languages[0] as Language) ?? "javascript";

    const code = getAlgorithmCode(first.id, lang);

    expect(code).toBeTruthy();
    expect(typeof code).toBe("string");
  });

  it("falls back to a generic starter snippet for unknown id", () => {
    const code = getAlgorithmCode(
      "non-existent-id-123",
      "javascript" as Language
    );

    expect(code).toBeTruthy();
    expect(code).toContain("Playground starter");
  });
});
