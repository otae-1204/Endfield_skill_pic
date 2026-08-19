import { DEFAULT_PACK } from "../data/defaultPack";
import {
  SLOT_IDS,
  type CustomKeywordRule,
  type FooterRow,
  type SkillCard,
  type SkillPack,
  type RichToken,
} from "../types";
import {
  applyManualStyle,
  applyManualPreset,
  isManualStyleId,
  isTokenStyle,
  parseRichText,
  tokensToEditorText,
  tokensToText,
} from "./richText";

export const STORAGE_KEY = "skill-card-forge:pack:v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isTagKind(value: unknown): value is "@" | "#" {
  return value === "@" || value === "#";
}

function normalizeToken(value: Record<string, unknown>): RichToken {
  const token: RichToken = {
    text: typeof value.text === "string" ? value.text : "",
    style: isTokenStyle(value.style) ? value.style : "plain",
  };
  if (value.manual === true) token.manual = true;
  if (isManualStyleId(value.manualStyleId)) token.manualStyleId = value.manualStyleId;
  if (typeof value.richTextId === "string") token.richTextId = value.richTextId;
  if (isTagKind(value.tagKind)) token.tagKind = value.tagKind;
  if (typeof value.iconSrc === "string") token.iconSrc = value.iconSrc;
  if (typeof value.iconSource === "string") token.iconSource = value.iconSource;
  if (typeof value.iconScale === "number") token.iconScale = value.iconScale;
  if (typeof value.color === "string") token.color = value.color;
  if (value.underline === true) token.underline = true;
  if (value.bold === true) token.bold = true;
  if (
    value.source === "auto" ||
    value.source === "api" ||
    value.source === "image" ||
    value.source === "manual"
  ) {
    token.source = value.source;
  }
  return normalizeConsumeToken(token);
}

function normalizeConsumeToken(token: RichToken): RichToken {
  if (token.richTextId !== "ba.consume" || token.manual) return token;
  const { color: _legacyColor, ...withoutColor } = token;
  return {
    ...withoutColor,
    style: "plain",
    underline: true,
  };
}

function upgradeLegacyTokens(
  tokens: RichToken[],
  customKeywords: CustomKeywordRule[],
): RichToken[] {
  // Reparse every stored token array so old serialized colors and unknown-tag
  // fallbacks cannot override the current skill-panel palette.
  let upgraded = parseRichText(tokensToEditorText(tokens), customKeywords);
  let offset = 0;
  for (const token of tokens) {
    const nextOffset = offset + token.text.length;
    if (token.manual) {
      upgraded = token.manualStyleId
        ? applyManualPreset(upgraded, offset, nextOffset, token.manualStyleId)
        : applyManualStyle(upgraded, offset, nextOffset, token.style);
    }
    offset = nextOffset;
  }
  return upgraded;
}

function normalizeCard(
  value: unknown,
  index: number,
  customKeywords: CustomKeywordRule[],
): SkillCard {
  const fallback = DEFAULT_PACK.cards[index];
  if (!isRecord(value)) return fallback;

  const bodyValue: RichToken[] = Array.isArray(value.body)
    ? upgradeLegacyTokens(value.body.filter(isRecord).map(normalizeToken), customKeywords)
    : parseRichText(typeof value.body === "string" ? value.body : "", customKeywords);

  const footerRows: FooterRow[] | undefined = Array.isArray(value.footerRows)
    ? value.footerRows
        .filter(isRecord)
        .map((row) => ({
          label: typeof row.label === "string" ? row.label : "",
          value: typeof row.value === "string" ? row.value : "",
        }))
    : undefined;

  return {
    slot: SLOT_IDS[index],
    title: typeof value.title === "string" ? value.title : fallback.title,
    typeLabel:
      typeof value.typeLabel === "string" ? value.typeLabel : fallback.typeLabel,
    rank: typeof value.rank === "number" ? value.rank : fallback.rank,
    subtitle:
      typeof value.subtitle === "string" ? value.subtitle : fallback.subtitle,
    nodeMarks:
      typeof value.nodeMarks === "number" ? value.nodeMarks : fallback.nodeMarks,
    body: bodyValue.length ? bodyValue : fallback.body,
    footerRows,
  };
}

export function normalizePack(value: unknown): SkillPack {
  if (!isRecord(value)) return structuredClone(DEFAULT_PACK);
  const customKeywords: CustomKeywordRule[] = Array.isArray(value.customKeywords)
    ? value.customKeywords
        .filter(isRecord)
        .map((rule, index) => ({
          id: typeof rule.id === "string" && rule.id ? rule.id : `custom-${index + 1}`,
          keyword: typeof rule.keyword === "string" ? rule.keyword.trim() : "",
          style: isManualStyleId(rule.style) ? rule.style : "plain",
        }))
        .filter((rule) => rule.keyword.length > 0)
    : [];
  const cardValues = Array.isArray(value.cards) ? value.cards : null;
  const cards = cardValues
    ? SLOT_IDS.map((_, index) => normalizeCard(cardValues[index], index, customKeywords))
    : DEFAULT_PACK.cards;
  const renderValue = isRecord(value.render) ? value.render : {};

  return {
    version: 1,
    cards: cards as SkillPack["cards"],
    customKeywords,
    render: {
      baseWidth: 360,
      scale: renderValue.scale === 2 ? 2 : 1,
      transparentCorners: true,
    },
  };
}

export function validatePack(value: unknown): string[] {
  const issues: string[] = [];
  if (!isRecord(value)) return ["文件内容必须是 JSON 对象"];
  if (value.version !== 1) issues.push("仅支持 SkillPack v1");
  if (!Array.isArray(value.cards) || value.cards.length !== SLOT_IDS.length) {
    issues.push("必须包含固定的六张技能卡");
    return issues;
  }

  if (value.customKeywords !== undefined && !Array.isArray(value.customKeywords)) {
    issues.push("自定义关键词规则格式不正确");
  } else if (Array.isArray(value.customKeywords)) {
    value.customKeywords.forEach((rule, index) => {
      if (
        !isRecord(rule) ||
        typeof rule.keyword !== "string" ||
        !rule.keyword.trim() ||
        !isManualStyleId(rule.style)
      ) {
        issues.push(`第 ${index + 1} 条自定义关键词规则格式不正确`);
      }
    });
  }

  value.cards.forEach((card, index) => {
    if (!isRecord(card)) {
      issues.push(`第 ${index + 1} 张卡片不是对象`);
      return;
    }
    if (typeof card.title !== "string") issues.push(`第 ${index + 1} 张卡片缺少标题`);
    if (typeof card.typeLabel !== "string") issues.push(`第 ${index + 1} 张卡片缺少类型`);
    if (!(typeof card.body === "string" || Array.isArray(card.body))) {
      issues.push(`第 ${index + 1} 张卡片正文格式不正确`);
    }
  });
  return issues;
}

export function loadPack(): SkillPack {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizePack(JSON.parse(raw)) : structuredClone(DEFAULT_PACK);
  } catch {
    return structuredClone(DEFAULT_PACK);
  }
}

export function savePack(pack: SkillPack): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pack));
}

export function packToJson(pack: SkillPack): string {
  return JSON.stringify(pack, null, 2);
}

export function cardBodyText(card: SkillCard): string {
  return tokensToText(card.body);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadText(text: string, filename: string, type: string): void {
  downloadBlob(new Blob([text], { type }), filename);
}

export async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("文件读取失败"));
    reader.readAsText(file);
  });
}
