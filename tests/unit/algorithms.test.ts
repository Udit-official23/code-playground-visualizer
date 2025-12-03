// tests/unit/algorithms.test.ts
import { describe, it, expect } from "vitest";
import { ALGORITHMS } from "../../src/lib/algorithms";

describe("ALGORITHMS catalog", () => {
  it("contains multiple algorithms", () => {
    expect(ALGORITHMS.length).toBeGreaterThanOrEqual(10);
  });

  it("all algorithms have required metadata", () => {
    for (const algo of ALGORITHMS) {
      expect(algo.id).toBeTruthy();
      expect(algo.title).toBeTruthy();
      expect(algo.category).toBeTruthy();
      expect(algo.difficulty).toBeTruthy();
      expect(algo.languages?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it("algorithm ids are unique", () => {
    const ids = ALGORITHMS.map((a) => a.id);
    const uniq = new Set(ids);
    expect(uniq.size).toBe(ids.length);
  });
});
