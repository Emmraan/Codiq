import { describe, expect, it } from "vitest";

import { cn, formatNumber, formatReadingTime, slugify } from "@/lib/utils";

describe("cn", () => {
  it("merges conflicting tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("keeps truthy values and drops falsy ones", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("CSS Selectors")).toBe("css-selectors");
    expect(slugify("  Hello   World  ")).toBe("hello-world");
  });

  it("strips non-alphanumeric characters", () => {
    expect(slugify("React & Next.js!")).toBe("react-nextjs");
  });

  it("handles empty input", () => {
    expect(slugify("")).toBe("");
  });
});

describe("formatReadingTime", () => {
  it("handles sub-minute and single values", () => {
    expect(formatReadingTime(0)).toBe("Under a minute");
    expect(formatReadingTime(1)).toBe("1 min");
  });

  it("formats hour boundaries", () => {
    expect(formatReadingTime(60)).toBe("1h");
    expect(formatReadingTime(90)).toBe("1h 30m");
  });
});

describe("formatNumber", () => {
  it("compacts large numbers", () => {
    expect(formatNumber(1250)).toBe("1.3K");
  });
});
