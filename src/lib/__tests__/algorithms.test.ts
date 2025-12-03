import { describe, it, expect } from "vitest";
import { ALGORITHMS } from "../algorithms";


describe("ALGORITHMS catalog", () => {
  it("should not be empty", () => {
    expect(ALGORITHMS.length).toBeGreaterThan(0);
  });

  it("each algorithm should have required metadata", () => {
    for (const algo of ALGORITHMS) {
      expect(algo.id).toBeTruthy();
      expect(algo.title).toBeTruthy();
      expect(algo.category).toBeTruthy();
      expect(algo.difficulty).toBeTruthy();
      expect(algo.languages.length).toBeGreaterThan(0);
    }
  });

  it("should contain bubble sort with javascript support", () => {
    const bubble = ALGORITHMS.find((a) => a.id === "bubble-sort");
    expect(bubble).toBeDefined();
    expect(bubble!.languages).toContain("javascript");
  });
});
