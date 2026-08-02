import { describe, expect, it } from "vitest";

import { compileMdx, normalizeText } from "@/lib/content/mdx";

const SAMPLE = `## First heading

Some **bold** text with \`inline code\`.

\`\`\`js
const x = 1;
\`\`\`

- list item

## First heading

Duplicate heading should get a -1 suffix.

<Note variant="info">A note</Note>

### Sub heading
`;

describe("normalizeText", () => {
  it("collapses whitespace", () => {
    expect(normalizeText("a\n  b \t c")).toBe("a b c");
  });
});

describe("compileMdx", () => {
  it("compiles MDX to ESM with a default MDXContent export", async () => {
    const result = await compileMdx(SAMPLE);
    expect(result.code).toContain("export default function MDXContent");
    expect(result.code).toContain('from "@/lib/mdx-components"');
    expect(result.code).toContain("react/jsx-runtime");
  });

  it("extracts headings with unique github-slugger ids", async () => {
    const result = await compileMdx(SAMPLE);
    expect(result.headings.map((h) => h.text)).toEqual([
      "First heading",
      "First heading",
      "Sub heading",
    ]);
    expect(result.headings.map((h) => h.id)).toEqual([
      "first-heading",
      "first-heading-1",
      "sub-heading",
    ]);
    expect(result.headings[0]?.depth).toBe(2);
  });

  it("extracts plain text for search, excluding frontmatter", async () => {
    const withFrontmatter = `---
title: Hidden
---
${SAMPLE}`;
    const result = await compileMdx(withFrontmatter);
    expect(result.text).toContain("bold");
    expect(result.text).toContain("inline code");
    expect(result.text).toContain("list item");
    expect(result.text).not.toContain("Hidden");
  });
});
