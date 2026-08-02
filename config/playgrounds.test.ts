import { describe, expect, it } from "vitest";

import { playgroundPresets } from "@/config/playgrounds";
import { technologies } from "@/lib/generated/content-registry";

const MONACO_LANGUAGES = ["html", "css", "javascript", "typescript", "json", "markdown"];

describe("playground presets", () => {
  it("every registered technology has a preset", () => {
    for (const tech of technologies) {
      expect(playgroundPresets[tech.slug], `${tech.slug} preset`).toBeDefined();
    }
  });

  it("presets are internally consistent", () => {
    for (const [slug, preset] of Object.entries(playgroundPresets)) {
      expect(preset.files.length, `${slug} has files`).toBeGreaterThan(0);

      const paths = preset.files.map((file) => file.path);
      expect(new Set(paths).size, `${slug} file paths unique`).toBe(paths.length);

      expect(paths, `${slug} mainFile present`).toContain(preset.mainFile);

      for (const file of preset.files) {
        expect(MONACO_LANGUAGES, `${slug} ${file.path} language`).toContain(file.language);
        expect(typeof file.code, `${slug} ${file.path} code`).toBe("string");
      }

      if (preset.mode === "sandpack") {
        expect(["vanilla", "vanilla-ts", "react-ts", "node"], `${slug} template`).toContain(
          preset.template,
        );
        expect(
          preset.showsPreview || preset.showsConsole || preset.showsTranspiled,
          `${slug} renders something`,
        ).toBe(true);
      }
    }
  });
});
