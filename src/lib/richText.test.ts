import { describe, expect, it } from "vitest";
import {
  applyManualPreset,
  applyManualStyle,
  parseRichText,
  TOKEN_COLORS,
  tokenClass,
  tokensToText,
  updateRichTextPreservingManual,
} from "./richText";

describe("rich text rules", () => {
  it("uses the tooltip panel's light-gray base text color", () => {
    expect(TOKEN_COLORS.plain).toBe("#D6D6D6");
  });

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
    expect(tokens[2]).toMatchObject({ richTextId: "ba.pulse", color: "#FFCC00" });
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
      color: "#33C2FF",
      underline: true,
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

  it("underlines automatically recognized spell infliction and spell status", () => {
    const tokens = parseRichText("法术附着会形成法术异常");

    expect(tokens.find((token) => token.text === "法术附着")).toMatchObject({
      underline: true,
      source: "auto",
    });
    expect(tokens.find((token) => token.text === "法术异常")).toMatchObject({
      underline: true,
      source: "auto",
    });
  });

  it("inherits spell-category underlines for infliction and status subclasses", () => {
    const subclassNames = [
      "灼热附着",
      "电磁附着",
      "寒冷附着",
      "自然附着",
      "燃烧",
      "导电",
      "冻结",
      "腐蚀",
    ];
    const tokens = parseRichText(subclassNames.join("、"));

    for (const name of subclassNames) {
      expect(tokens.find((token) => token.text === name)).toMatchObject({
        underline: true,
        source: "auto",
      });
    }
  });

  it("recognizes corrosion with its natural color and term icon", () => {
    const [corrosion] = parseRichText("腐蚀");

    expect(corrosion).toMatchObject({
      text: "腐蚀",
      style: "healing",
      richTextId: "ba.corrupt",
      color: "#B4D945",
      iconSrc: "/assets/richtext/f9179317c2ae317f.png",
      iconScale: 1.4,
    });
  });

  it("recognizes slow with its game term icon and underline", () => {
    const [slow] = parseRichText("缓速");

    expect(slow).toMatchObject({
      text: "缓速",
      style: "link",
      richTextId: "ba.slow",
      color: "#33C2FF",
      iconSrc: "/assets/richtext/441badac71ceee4e.png",
      iconScale: 1.4,
      underline: true,
      source: "auto",
    });
  });

  it("compensates attachment icons with different transparent padding", () => {
    const tokens = parseRichText("寒冷附着、自然附着");

    expect(tokens.find((token) => token.text === "寒冷附着")).toMatchObject({
      richTextId: "ba.crystinflict",
      iconScale: 1.4,
    });
    expect(tokens.find((token) => token.text === "自然附着")).toMatchObject({
      richTextId: "ba.naturalinflict",
      iconScale: 1.5,
    });
  });

  it("preserves Chinese newlines when converting tokens back to text", () => {
    const text = "第一段\n第二段\n\n第三段";
    expect(tokensToText(parseRichText(text))).toBe(text);
  });

  it("applies custom keyword styles before built-in automatic rules", () => {
    const tokens = parseRichText("进入自定义状态并造成电磁伤害", [
      { id: "custom-1", keyword: "自定义状态", style: "ba.fire" },
      { id: "custom-2", keyword: "电磁伤害", style: "ba.vdown" },
    ]);

    expect(tokens.find((token) => token.text === "自定义状态")).toMatchObject({
      style: "damage",
      color: "#FF8E59",
      source: "auto",
    });
    expect(tokens.find((token) => token.text === "电磁伤害")).toMatchObject({
      style: "number",
      color: "#FF8080",
      source: "auto",
    });
  });

  it("matches longer custom keywords first", () => {
    const tokens = parseRichText("超级状态", [
      { id: "short", keyword: "状态", style: "ba.key" },
      { id: "long", keyword: "超级状态", style: "ba.heal" },
    ]);

    expect(tokens).toHaveLength(1);
    expect(tokens[0]).toMatchObject({ text: "超级状态", color: "#B4D945" });
  });

  it("lets underline-only custom rules preserve the detected keyword color", () => {
    const tokens = parseRichText("电磁伤害", [
      { id: "underline", keyword: "电磁伤害", style: "underline" },
    ]);

    expect(tokens[0]).toMatchObject({
      text: "电磁伤害",
      color: "#FFCC00",
      underline: true,
      source: "auto",
    });
  });

  it("keeps manual annotations above custom keyword rules", () => {
    const manuallyStyled = applyManualPreset(parseRichText("核心词"), 0, 3, "ba.vdown");
    const reparsed = updateRichTextPreservingManual(manuallyStyled, "核心词", [
      { id: "custom", keyword: "核心词", style: "ba.heal" },
    ]);

    expect(reparsed[0]).toMatchObject({
      text: "核心词",
      manual: true,
      manualStyleId: "ba.vdown",
      color: "#FF8080",
    });
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

  it("applies exact manual color presets instead of broad semantic colors", () => {
    const styled = applyManualPreset(parseRichText("伤害降低效果"), 2, 4, "ba.vdown");

    expect(styled.find((token) => token.text === "降低")).toMatchObject({
      style: "number",
      manual: true,
      manualStyleId: "ba.vdown",
      color: "#FF8080",
      source: "manual",
    });
  });

  it("applies an underline without changing the existing text color", () => {
    const styled = applyManualPreset(
      parseRichText("需要<@ba.fire>灼热</>效果"),
      2,
      4,
      "underline",
    );

    expect(styled.find((token) => token.text === "灼热")).toMatchObject({
      style: "damage",
      manualStyleId: "underline",
      color: "#FF8E59",
      underline: true,
    });
  });

  it("preserves manual annotations when text outside them is edited", () => {
    const manuallyStyled = applyManualPreset(parseRichText("前缀重点后缀"), 2, 4, "ba.vdown");
    const edited = updateRichTextPreservingManual(manuallyStyled, "新增前缀重点后缀");

    expect(edited.find((token) => token.text === "重点")).toMatchObject({
      manual: true,
      manualStyleId: "ba.vdown",
      color: "#FF8080",
    });
  });

  it("lets replacement text inside a manual annotation inherit its style", () => {
    const manuallyStyled = applyManualPreset(parseRichText("前缀重点后缀"), 2, 4, "bold");
    const edited = updateRichTextPreservingManual(manuallyStyled, "前缀核心内容后缀");

    expect(edited.find((token) => token.text === "核心内容")).toMatchObject({
      manual: true,
      manualStyleId: "bold",
      bold: true,
    });
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
      iconScale: 1.4,
      underline: true,
    });
    expect(tokens.at(-1)).toMatchObject({
      source: "image",
      iconSrc: "/assets/richtext/c660f77745ae564b.png",
      iconScale: 1.25,
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

  it("uses the documented skill-panel preDef[0] palette", () => {
    const tokens = parseRichText(
      "<@bl.key>关键</><@ba.vup>提升</><@ba.vdown>降低</><@ba.heal>治疗</><@ba.cryst>寒冷</><@ba.ether>以太</><@ba.info>说明</>",
    );

    expect(tokens.map(({ text, color }) => ({ text, color }))).toEqual([
      { text: "关键", color: "#FFBB03" },
      { text: "提升", color: "#9EB7FF" },
      { text: "降低", color: "#FF8080" },
      { text: "治疗", color: "#B4D945" },
      { text: "寒冷", color: "#30D6E0" },
      { text: "以太", color: "#C59EFF" },
      { text: "说明", color: "#999999" },
    ]);
  });

  it("keeps unknown tags at the white body-text fallback", () => {
    const [direct, separator, term] = parseRichText(
      "<@missing.style>直接样式</>|<#missing.term>未知术语</>",
    );

    expect(direct).toMatchObject({ text: "直接样式", style: "plain" });
    expect(direct.color).toBeUndefined();
    expect(separator).toMatchObject({ text: "|", style: "plain" });
    expect(term).toMatchObject({ text: "未知术语", style: "plain" });
    expect(term.color).toBeUndefined();
  });

  it("uses weight 700 metadata only for explicit bold tags", () => {
    const tokens = parseRichText("普通<b>粗体</b><@intru.bold>强调</>");

    expect(tokens.map(({ text, bold }) => ({ text, bold }))).toEqual([
      { text: "普通", bold: undefined },
      { text: "粗体", bold: true },
      { text: "强调", bold: true },
    ]);
  });
});
