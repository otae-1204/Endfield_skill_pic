import { describe, expect, it } from "vitest";
import { DEFAULT_PACK } from "../data/defaultPack";
import { normalizePack, packToJson, validatePack } from "./storage";

describe("SkillPack v1", () => {
  it("keeps the fixed six-card shape during normalization", () => {
    const normalized = normalizePack({
      version: 1,
      cards: [{ title: "只改第一张", typeLabel: "测试", body: "12%电磁伤害" }],
    });

    expect(normalized.version).toBe(1);
    expect(normalized.cards).toHaveLength(6);
    expect(normalized.cards[0].title).toBe("只改第一张");
    expect(normalized.cards[0].body.map(({ text, style }) => ({ text, style }))).toEqual([
      { text: "12%", style: "number" },
      { text: "电磁伤害", style: "damage" },
    ]);
    expect(normalized.cards[5].slot).toBe(DEFAULT_PACK.cards[5].slot);
  });

  it("rejects a pack without six cards or v1 metadata", () => {
    expect(validatePack({ version: 1, cards: [] })).toContain("必须包含固定的六张技能卡");
    expect(validatePack({ version: 2, cards: DEFAULT_PACK.cards })).toContain(
      "仅支持 SkillPack v1",
    );
  });

  it("serializes a portable JSON document", () => {
    const json = packToJson(DEFAULT_PACK);
    const parsed = JSON.parse(json) as typeof DEFAULT_PACK;
    expect(parsed.version).toBe(1);
    expect(parsed.cards).toHaveLength(6);
    expect(parsed.render.baseWidth).toBe(360);
  });

  it("migrates legacy token arrays so new API icons appear in old drafts", () => {
    const normalized = normalizePack({
      version: 1,
      cards: [
        {
          title: "旧草稿",
          typeLabel: "普通攻击",
          body: [{ text: "造成电磁附着", style: "damage" }],
        },
      ],
    });

    expect(normalized.cards[0].body[1]).toMatchObject({
      text: "电磁附着",
      iconSrc: "/assets/richtext/c660f77745ae564b.png",
    });
  });

  it("migrates old consume tokens to underline-only body text", () => {
    const normalized = normalizePack({
      version: 1,
      cards: [
        {
          title: "旧卡片",
          typeLabel: "战技",
          body: [{
            text: "消耗",
            style: "link",
            richTextId: "ba.consume",
            color: "#33c2ff",
          }],
        },
      ],
    });

    expect(normalized.cards[0].body[0]).toMatchObject({
      text: "消耗",
      style: "plain",
      underline: true,
    });
    expect(normalized.cards[0].body[0].color).toBeUndefined();
  });

  it("recolors serialized drafts with the current documented palette", () => {
    const normalized = normalizePack({
      version: 1,
      cards: [
        {
          title: "旧颜色",
          typeLabel: "天赋",
          body: [{
            text: "生命值",
            style: "healing",
            richTextId: "ba.heal",
            color: "#ade131",
            source: "auto",
          }],
        },
      ],
    });

    expect(normalized.cards[0].body[0]).toMatchObject({
      text: "生命值",
      richTextId: "ba.heal",
      color: "#B4D945",
    });
  });

  it("preserves exact manual annotation presets in stored drafts", () => {
    const normalized = normalizePack({
      version: 1,
      cards: [
        {
          title: "手动标注",
          typeLabel: "战技",
          body: [{
            text: "灼热",
            style: "damage",
            manual: true,
            manualStyleId: "ba.fire",
            color: "#000000",
            source: "manual",
          }],
        },
      ],
    });

    expect(normalized.cards[0].body[0]).toMatchObject({
      text: "灼热",
      manualStyleId: "ba.fire",
      color: "#FF8E59",
    });
  });
});
