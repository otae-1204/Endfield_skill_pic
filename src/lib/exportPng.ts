import { toPng } from "html-to-image";

export async function exportElementAsPng(
  element: HTMLElement,
  scale: 1 | 2,
): Promise<Blob> {
  if ("fonts" in document) {
    await document.fonts.ready;
  }

  const dataUrl = await toPng(element, {
    pixelRatio: scale,
    cacheBust: true,
    backgroundColor: "transparent",
    style: {
      transform: "none",
      margin: "0",
    },
  });

  const response = await fetch(dataUrl);
  return response.blob();
}

export function filenameForCard(index: number, title: string, scale: 1 | 2): string {
  const safeTitle = title.trim().replace(/[\\/:*?"<>|\s]+/g, "-") || "skill";
  return `${String(index + 1).padStart(2, "0")}-${safeTitle}@${scale}x.png`;
}

