import { describe, expect, it } from "vitest";
import {
  applyManualStyle,
  parseRichText,
  tokenClass,
  tokensToText,
} from "./richText";

describe("rich text rules", () => {
  it("uses longest matching semantic words before numbers", () => {
    const tokens = parseRichText("造成18%电磁伤害，并恢复生命值");

    expect(tokens.map(({ text, style }) => ({ text, style }))).toEqual([
      { text: "造成", style: "plain" },
      { text: "18%", style: "number" },
      { text: "电磁伤害", style: "damage" },
      { text: "，并", style: "plain" },
      { text: "恢复生命", style: "healing" },
      { text: "值", style: "plain" },
    ]);
    expect(tokens[2]).toMatchObject({ richTextId: "ba.pulse", color: "#ffcc00" });
  });

  it("recognizes untagged vulnerability, infliction, and amp annotations", () => {
    const tokens = parseRichText("脆弱、法术附着、增幅、电磁脆弱、自然增幅");

    expect(tokens.find((token) => token.text === "脆弱")).toMatchObject({
      style: "state",
      richTextId: "ba.vulnerable",
      iconSrc: "/assets/richtext/99f3b7556e495989.png",
    });
    expect(tokens.find((token) => token.text === "法术附着")).toMatchObject({
      style: "state",
      richTextId: "ba.spellinflict",
      color: "#33c2ff",
    });
    expect(tokens.find((token) => token.text === "增幅")).toMatchObject({
      style: "state",
      richTextId: "ba.enhance",
      iconSrc: "/assets/richtext/54a31a13576b70fb.png",
    });
    expect(tokens.find((token) => token.text === "电磁脆弱")).toMatchObject({
      style: "damage",
      richTextId: "ba.pulsevul",
      iconSrc: "/assets/richtext/a7890b94bfc13bf8.png",
    });
    expect(tokens.find((token) => token.text === "自然增幅")).toMatchObject({
      style: "healing",
      richTextId: "ba.naturalenhance",
      iconSrc: "/assets/richtext/66503e96323cfcf6.png",
    });
  });

  it("preserves Chinese newlines when converting tokens back to text", () => {
    const text = "第一段\n第二段\n\n第三段";
    expect(tokensToText(parseRichText(text))).toBe(text);
  });

  it("lets manual styling split and override automatic tokens", () => {
    const tokens = parseRichText("造成电磁伤害");
    const styled = applyManualStyle(tokens, 2, 4, "state");

    expect(styled.map(({ text, style, manual }) => ({ text, style, manual }))).toEqual([
      { text: "造成", style: "plain" },
      { text: "电磁", style: "state", manual: true },
      { text: "伤害", style: "damage" },
    ]);
    expect(tokenClass("state")).toBe("rich-token rich-token-state");
  });

  it("parses API tags and image tags without dropping the visible text", () => {
    const tokens = parseRichText(
      '<#ba.pulseinflict>电磁附着</> + <@ba.pulse>电磁伤害</><image="https://assets.fz.wiki/c40f3979bc72cf80/c660f77745ae564b.png" scale=1.25/>',
    );

    expect(tokensToText(tokens)).toBe("电磁附着 + 电磁伤害");
    expect(tokens[0]).toMatchObject({
      text: "电磁附着",
      richTextId: "ba.pulseinflict",
      tagKind: "#",
      iconSrc: "/assets/richtext/c660f77745ae564b.png",
      underline: true,
    });
    expect(tokens.at(-1)).toMatchObject({
      source: "image",
      iconSrc: "/assets/richtext/c660f77745ae564b.png",
    });
  });

  it("underlines consume annotations without applying a link color", () => {
    const consume = parseRichText("消耗目标的易异状态").find((token) => token.text === "消耗");

    expect(consume).toMatchObject({
      style: "plain",
      richTextId: "ba.consume",
      underline: true,
    });
    expect(consume?.color).toBeUndefined();
  });
});
