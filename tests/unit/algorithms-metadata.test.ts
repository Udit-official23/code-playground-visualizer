// src/lib/__tests__/algorithms-metadata.test.ts
import { describe, it, expect } from "vitest";
import { ALGORITHMS } from "../../src/lib/algorithms";

describe("ALGORITHMS metadata integrity", () => {
  it("has unique ids", () => {
    const ids = ALGORITHMS.map(a => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("each algorithm has required fields", () => {
    for (const algo of ALGORITHMS) {
      expect(algo.id).toBeTruthy();
      expect(algo.title).toBeTruthy();
      expect(algo.category).toBeTruthy();
      expect(algo.difficulty).toBeTruthy();
    }
  });
});
