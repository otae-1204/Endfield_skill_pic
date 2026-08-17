// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { toPng } from "html-to-image";
import { exportElementAsPng, filenameForCard } from "./exportPng";

vi.mock("html-to-image", () => ({
  toPng: vi.fn().mockResolvedValue("data:image/png;base64,UE5H"),
}));

describe("PNG export contract", () => {
  it("passes transparent background and the requested scale to the renderer", async () => {
    const element = document.createElement("div");
    const blob = await exportElementAsPng(element, 2);

    expect(blob.type).toBe("image/png");
    expect(toPng).toHaveBeenCalledWith(
      element,
      expect.objectContaining({
        pixelRatio: 2,
        backgroundColor: "transparent",
        cacheBust: true,
      }),
    );
  });

  it("creates stable filenames with the base card index and scale", () => {
    expect(filenameForCard(0, "疾风击", 1)).toBe("01-疾风击@1x.png");
    expect(filenameForCard(5, "A/B 终结技", 2)).toBe("06-A-B-终结技@2x.png");
  });
});

