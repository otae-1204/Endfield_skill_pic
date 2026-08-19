import {
  GAME_RICH_TEXT_COLORS,
  localizeRichTextIcon,
  lookupRichTextMeta,
  type GameRichTextMeta,
} from "../data/gameRichText";
import {
  MANUAL_STYLE_IDS,
  type CustomKeywordRule,
  type ManualStyleId,
  type RichToken,
  type TokenStyle,
} from "../types";

export const TOKEN_LABELS: Record<TokenStyle, string> = {
  plain: "正文",
  damage: "伤害",
  state: "状态",
  healing: "治疗",
  number: "数值",
  link: "链接",
};

// Skill-panel palette from skill_text_color_rendering.md.
export const TOKEN_COLORS: Record<TokenStyle, string> = {
  plain: "#D6D6D6",
  damage: "#FFCC00",
  state: "#33C2FF",
  healing: "#B4D945",
  number: "#9EB7FF",
  link: "#33C2FF",
};

export type ManualStylePreset = {
  label: string;
  color: string;
  style: TokenStyle;
  underline?: boolean;
  bold?: boolean;
  preserveFormatting?: boolean;
};

export const MANUAL_STYLE_PRESETS: Record<ManualStyleId, ManualStylePreset> = {
  plain: { label: "正文", color: TOKEN_COLORS.plain, style: "plain" },
  "bl.key": { label: "重要黄", color: GAME_RICH_TEXT_COLORS["bl.key"], style: "damage" },
  "gd.key": { label: "关键词黄", color: GAME_RICH_TEXT_COLORS["gd.key"], style: "damage" },
  "ba.key": { label: "战斗蓝", color: GAME_RICH_TEXT_COLORS["ba.key"], style: "state" },
  "ss.key": { label: "关键词蓝", color: GAME_RICH_TEXT_COLORS["ss.key"], style: "state" },
  "ba.vup": { label: "增益", color: GAME_RICH_TEXT_COLORS["ba.vup"], style: "number" },
  "ba.vdown": { label: "减益", color: GAME_RICH_TEXT_COLORS["ba.vdown"], style: "number" },
  "ba.heal": { label: "治疗", color: GAME_RICH_TEXT_COLORS["ba.heal"], style: "healing" },
  "ba.natur": { label: "自然", color: GAME_RICH_TEXT_COLORS["ba.natur"], style: "healing" },
  "ba.fire": { label: "灼热", color: GAME_RICH_TEXT_COLORS["ba.fire"], style: "damage" },
  "ba.cryst": { label: "寒冷", color: GAME_RICH_TEXT_COLORS["ba.cryst"], style: "damage" },
  "ba.pulse": { label: "电磁", color: GAME_RICH_TEXT_COLORS["ba.pulse"], style: "damage" },
  "ba.phy": { label: "物理", color: GAME_RICH_TEXT_COLORS["ba.phy"], style: "damage" },
  "ba.ether": { label: "以太", color: GAME_RICH_TEXT_COLORS["ba.ether"], style: "state" },
  "ba.info": { label: "说明", color: GAME_RICH_TEXT_COLORS["ba.info"], style: "plain" },
  underline: {
    label: "下划线",
    color: TOKEN_COLORS.plain,
    style: "plain",
    underline: true,
    preserveFormatting: true,
  },
  link: { label: "链接", color: GAME_RICH_TEXT_COLORS["ba.key"], style: "link", underline: true },
  bold: { label: "粗体", color: TOKEN_COLORS.plain, style: "plain", bold: true },
};

export const MANUAL_STYLE_OPTIONS = [...MANUAL_STYLE_IDS];

type AutoRule = {
  word: string;
  style: TokenStyle;
  richTextId?: string;
  overrideStyle?: boolean;
  underline?: boolean;
};

const AUTO_RULES: AutoRule[] = [
  { word: "电磁附着", style: "damage", richTextId: "ba.pulseinflict", underline: true },
  { word: "灼热附着", style: "damage", richTextId: "ba.fireinflict", underline: true },
  { word: "寒冷附着", style: "damage", richTextId: "ba.crystinflict", underline: true },
  { word: "自然附着", style: "healing", richTextId: "ba.naturalinflict", underline: true },
  {
    word: "法术附着",
    style: "state",
    richTextId: "ba.spellinflict",
    overrideStyle: true,
    underline: true,
  },
  { word: "电磁脆弱", style: "damage", richTextId: "ba.pulsevul" },
  { word: "灼热脆弱", style: "damage", richTextId: "ba.firevul" },
  { word: "寒冷脆弱", style: "damage", richTextId: "ba.crystvul" },
  { word: "自然脆弱", style: "healing", richTextId: "ba.naturalvul" },
  { word: "物理脆弱", style: "damage", richTextId: "ba.physicalvul" },
  { word: "法术脆弱", style: "state", richTextId: "ba.spellvul" },
  {
    word: "脆弱",
    style: "state",
    richTextId: "ba.vulnerable",
    overrideStyle: true,
  },
  { word: "虚弱", style: "state", richTextId: "ba.weak", overrideStyle: true },
  { word: "缓速", style: "link", richTextId: "ba.slow", underline: true },
  { word: "电磁增幅", style: "damage", richTextId: "ba.pulseenhance" },
  { word: "灼热增幅", style: "damage", richTextId: "ba.fireenhance" },
  { word: "寒冷增幅", style: "damage", richTextId: "ba.crystenhance" },
  { word: "自然增幅", style: "healing", richTextId: "ba.naturalenhance" },
  { word: "物理增幅", style: "damage", richTextId: "ba.physicalenhance" },
  { word: "法术增幅", style: "state", richTextId: "ba.spellenhance" },
  {
    word: "附着",
    style: "state",
    richTextId: "ba.spellinflict",
    overrideStyle: true,
  },
  { word: "增幅", style: "state", richTextId: "ba.enhance", overrideStyle: true },
  { word: "电磁伤害", style: "damage", richTextId: "ba.pulse" },
  { word: "灼热伤害", style: "damage", richTextId: "ba.fire" },
  { word: "寒冷伤害", style: "damage", richTextId: "ba.cryst" },
  { word: "自然伤害", style: "healing", richTextId: "ba.natur" },
  { word: "物理伤害", style: "damage", richTextId: "ba.phy" },
  { word: "电磁", style: "damage", richTextId: "ba.pulse" },
  { word: "导电", style: "damage", richTextId: "ba.conduct", underline: true },
  { word: "腐蚀", style: "healing", richTextId: "ba.corrupt", underline: true },
  { word: "燃烧", style: "damage", richTextId: "ba.burning", underline: true },
  { word: "冻结", style: "damage", richTextId: "ba.frozen", underline: true },
  { word: "破防", style: "state", richTextId: "ba.noguard" },
  { word: "击飞", style: "state", richTextId: "ba.airborne" },
  { word: "倒地", style: "state", richTextId: "ba.knockdown" },
  { word: "碎甲", style: "state", richTextId: "ba.fracture" },
  { word: "猛击", style: "state", richTextId: "ba.crush" },
  { word: "失衡", style: "number", richTextId: "ba.poise" },
  { word: "治疗", style: "healing", richTextId: "ba.heal" },
  { word: "生命值", style: "healing", richTextId: "ba.heal" },
  { word: "恢复生命", style: "healing", richTextId: "ba.heal" },
  { word: "天理合真", style: "state", richTextId: "ba.key" },
  { word: "青莲剑", style: "state", richTextId: "ba.key" },
  { word: "寻星", style: "state", richTextId: "ba.key" },
  { word: "易异", style: "state", richTextId: "ba.key" },
  { word: "易暴", style: "state", richTextId: "ba.key" },
  { word: "霜寒", style: "state", richTextId: "ba.key" },
  { word: "异常等级", style: "state", richTextId: "ba.key" },
  { word: "异常", style: "state", richTextId: "ba.key" },
  { word: "姿态", style: "state", richTextId: "ba.key" },
  { word: "状态", style: "state", richTextId: "ba.key" },
  {
    word: "法术异常",
    style: "link",
    richTextId: "ba.spellinflict",
    underline: true,
  },
  { word: "重击", style: "link", richTextId: "ba.key" },
  { word: "战技", style: "link", richTextId: "ba.key" },
  { word: "连携技", style: "link", richTextId: "ba.key" },
  { word: "终结技", style: "link", richTextId: "ba.key" },
  { word: "消耗", style: "link", richTextId: "ba.consume" },
];

const SORTED_AUTO_RULES = [...AUTO_RULES].sort(
  (left, right) => right.word.length - left.word.length,
);

function styleForMeta(meta: GameRichTextMeta, tagKind?: "@" | "#"): TokenStyle {
  if (meta.semantic) return meta.semantic;
  if (tagKind === "#") return "link";
  return "plain";
}

function tokenFromMeta(
  text: string,
  meta: GameRichTextMeta,
  options: {
    manual?: boolean;
    source?: RichToken["source"];
    tagKind?: "@" | "#";
  } = {},
): RichToken {
  const style = styleForMeta(meta, options.tagKind);
  const token: RichToken = {
    text,
    style,
    richTextId: meta.id,
  };
  if (options.manual !== undefined) token.manual = options.manual;
  if (options.tagKind) token.tagKind = options.tagKind;
  if (meta.iconSrc) token.iconSrc = meta.iconSrc;
  if (meta.iconScale !== undefined) token.iconScale = meta.iconScale;
  if (meta.color) token.color = meta.color;
  if (meta.underline !== undefined) token.underline = meta.underline;
  if (meta.bold !== undefined) token.bold = meta.bold;
  if (options.source) token.source = options.source;
  return token;
}

function sameTokenMeta(left: RichToken, right: RichToken): boolean {
  return (
    left.style === right.style &&
    left.manual === right.manual &&
    left.manualStyleId === right.manualStyleId &&
    left.richTextId === right.richTextId &&
    left.tagKind === right.tagKind &&
    left.iconSrc === right.iconSrc &&
    left.iconSource === right.iconSource &&
    left.iconScale === right.iconScale &&
    left.color === right.color &&
    left.underline === right.underline &&
    left.bold === right.bold &&
    left.source === right.source
  );
}

function pushToken(tokens: RichToken[], token: RichToken): void {
  if (!token.text && !token.iconSrc) return;
  const previous = tokens[tokens.length - 1];
  if (previous && sameTokenMeta(previous, token)) {
    previous.text += token.text;
  } else {
    tokens.push(token);
  }
}

function builtInAutoTokenAt(text: string, index: number): { length: number; token: RichToken } {
  for (const rule of SORTED_AUTO_RULES) {
    if (!text.startsWith(rule.word, index)) continue;
    const meta = rule.richTextId
      ? lookupRichTextMeta(rule.richTextId, "@")
      : { id: rule.word, semantic: rule.style, color: TOKEN_COLORS[rule.style] };
    const token = tokenFromMeta(text.slice(index, index + rule.word.length), meta, {
      source: "auto",
    });
    if (rule.overrideStyle) token.style = rule.style;
    if (rule.underline) token.underline = true;
    return {
      length: rule.word.length,
      token,
    };
  }

  const numeric = text.slice(index).match(/^\d+(?:\.\d+)?%?/);
  if (numeric) {
    return {
      length: numeric[0].length,
      token: {
        text: numeric[0],
        style: "number",
        color: TOKEN_COLORS.number,
      },
    };
  }

  return {
    length: 1,
    token: { text: text[index], style: "plain" },
  };
}

type RichContext = RichToken & { tagKind?: "@" | "#"; richTextId: string };

function customTokenForRule(text: string, rule: CustomKeywordRule): RichToken {
  const preset = MANUAL_STYLE_PRESETS[rule.style];
  return {
    text,
    style: preset.style,
    color: preset.color,
    source: "auto",
    ...(preset.underline ? { underline: true } : {}),
    ...(preset.bold ? { bold: true } : {}),
  };
}

function parseAutomaticSegment(
  text: string,
  tokens: RichToken[],
  customRules: CustomKeywordRule[],
): void {
  let index = 0;
  while (index < text.length) {
    const customRule = customRules.find((rule) => text.startsWith(rule.keyword, index));
    if (customRule) {
      const preset = MANUAL_STYLE_PRESETS[customRule.style];
      if (preset.preserveFormatting) {
        const underlying: RichToken[] = [];
        let customOffset = 0;
        while (customOffset < customRule.keyword.length) {
          const underlyingMatch = builtInAutoTokenAt(customRule.keyword, customOffset);
          pushToken(underlying, {
            ...underlyingMatch.token,
            underline: true,
            source: "auto",
          });
          customOffset += underlyingMatch.length;
        }
        underlying.forEach((token) => pushToken(tokens, token));
      } else {
        pushToken(tokens, customTokenForRule(customRule.keyword, customRule));
      }
      index += customRule.keyword.length;
      continue;
    }

    const match = builtInAutoTokenAt(text, index);
    pushToken(tokens, match.token);
    index += match.length;
  }
}

function parseTaggedSegment(text: string, context: RichContext, tokens: RichToken[]): void {
  if (!text) return;
  pushToken(tokens, { ...context, text, source: "api" });
}

const RICH_TAG_RE = /<image\s*=\s*"([^"]+)"(?:\s+scale\s*=\s*([\d.]+))?\s*\/?>|<([@#])([a-z0-9_.-]+)>|(<\/?b>)|<\/>/gi;

/** Parse plain Chinese text and the API's <@id> / <#id> / <image="..."> syntax. */
export function parseRichText(text: string, customRules: CustomKeywordRule[] = []): RichToken[] {
  const tokens: RichToken[] = [];
  const stack: RichContext[] = [];
  const sortedCustomRules = customRules
    .filter((rule) => rule.keyword.length > 0 && MANUAL_STYLE_IDS.includes(rule.style))
    .map((rule) => ({ ...rule, keyword: rule.keyword.trim() }))
    .filter((rule) => rule.keyword.length > 0)
    .sort((left, right) => right.keyword.length - left.keyword.length);
  let cursor = 0;

  for (const match of text.matchAll(RICH_TAG_RE)) {
    const fullMatch = match[0];
    const index = match.index ?? 0;
    const segment = text.slice(cursor, index);
    const context = stack[stack.length - 1];
    if (context) parseTaggedSegment(segment, context, tokens);
    else parseAutomaticSegment(segment, tokens, sortedCustomRules);

    const imageUrl = match[1];
    if (imageUrl) {
      tokens.push({
        text: "",
        style: "plain",
        iconSrc: localizeRichTextIcon(imageUrl),
        iconSource: imageUrl,
        iconScale: Number(match[2] || 1),
        source: "image",
      });
    } else if (match[3] && match[4]) {
      const tagKind = match[3] as "@" | "#";
      const meta = lookupRichTextMeta(match[4], tagKind);
      stack.push({
        ...tokenFromMeta("", meta, { source: "api", tagKind }),
        tagKind,
        richTextId: match[4],
      });
    } else if (match[5]?.toLowerCase() === "<b>") {
      stack.push({
        text: "",
        style: "plain",
        bold: true,
        source: "api",
        richTextId: "html.bold",
      });
    } else if (match[5]?.toLowerCase() === "</b>" && stack.length) {
      stack.pop();
    } else if (fullMatch === "</>" && stack.length) {
      stack.pop();
    }
    cursor = index + fullMatch.length;
  }

  const tail = text.slice(cursor);
  const context = stack[stack.length - 1];
  if (context) parseTaggedSegment(tail, context, tokens);
  else parseAutomaticSegment(tail, tokens, sortedCustomRules);
  return tokens;
}

export function tokensToText(tokens: RichToken[]): string {
  return tokens.map((token) => token.text).join("");
}

/** Keep pasted API markup visible in the editor while auto-detected text stays readable. */
export function tokensToEditorText(tokens: RichToken[]): string {
  return tokens
    .map((token) => {
      if (token.source === "api" && token.bold && token.richTextId === "html.bold") {
        return `<b>${token.text}</b>`;
      }
      if (token.source === "api" && token.richTextId && token.tagKind) {
        return `<${token.tagKind}${token.richTextId}>${token.text}</>`;
      }
      if (token.source === "image" && token.iconSource) {
        return `<image="${token.iconSource}" scale=${token.iconScale ?? 1}/>`;
      }
      return token.text;
    })
    .join("");
}

type ManualRange = {
  start: number;
  end: number;
  manualStyleId?: ManualStyleId;
  style: TokenStyle;
};

function manualRanges(tokens: RichToken[]): ManualRange[] {
  const ranges: ManualRange[] = [];
  let offset = 0;
  for (const token of tokens) {
    const end = offset + token.text.length;
    if (token.manual && end > offset) {
      ranges.push({
        start: offset,
        end,
        manualStyleId: token.manualStyleId,
        style: token.style,
      });
    }
    offset = end;
  }
  return ranges;
}

/** Reparse edited text while carrying manual annotations across unchanged text. */
export function updateRichTextPreservingManual(
  previousTokens: RichToken[],
  nextEditorText: string,
  customRules: CustomKeywordRule[] = [],
): RichToken[] {
  let nextTokens = parseRichText(nextEditorText, customRules);
  const ranges = manualRanges(previousTokens);
  if (!ranges.length) return nextTokens;

  const previousText = tokensToText(previousTokens);
  const nextText = tokensToText(nextTokens);
  let prefix = 0;
  const prefixLimit = Math.min(previousText.length, nextText.length);
  while (prefix < prefixLimit && previousText[prefix] === nextText[prefix]) prefix += 1;

  let suffix = 0;
  const suffixLimit = Math.min(previousText.length - prefix, nextText.length - prefix);
  while (
    suffix < suffixLimit &&
    previousText[previousText.length - 1 - suffix] === nextText[nextText.length - 1 - suffix]
  ) {
    suffix += 1;
  }

  const previousEditEnd = previousText.length - suffix;
  const nextEditEnd = nextText.length - suffix;
  const delta = nextText.length - previousText.length;
  const mapStart = (position: number): number => {
    if (position <= prefix) return position;
    if (position >= previousEditEnd) return position + delta;
    return prefix;
  };
  const mapEnd = (position: number): number => {
    if (position <= prefix) return position;
    if (position >= previousEditEnd) return position + delta;
    return nextEditEnd;
  };

  for (const range of ranges) {
    const start = Math.max(0, Math.min(nextText.length, mapStart(range.start)));
    const end = Math.max(start, Math.min(nextText.length, mapEnd(range.end)));
    if (end <= start) continue;
    nextTokens = range.manualStyleId
      ? applyManualPreset(nextTokens, start, end, range.manualStyleId)
      : applyManualStyle(nextTokens, start, end, range.style);
  }
  return nextTokens;
}

export function applyManualStyle(
  tokens: RichToken[],
  start: number,
  end: number,
  style: TokenStyle,
): RichToken[] {
  if (end <= start) return tokens;
  const result: RichToken[] = [];
  let offset = 0;

  for (const token of tokens) {
    const tokenStart = offset;
    const tokenEnd = offset + token.text.length;
    const overlapStart = Math.max(start, tokenStart);
    const overlapEnd = Math.min(end, tokenEnd);

    if (overlapStart >= overlapEnd) {
      pushToken(result, token);
      offset = tokenEnd;
      continue;
    }

    const before = token.text.slice(0, overlapStart - tokenStart);
    const selected = token.text.slice(overlapStart - tokenStart, overlapEnd - tokenStart);
    const after = token.text.slice(overlapEnd - tokenStart);

    if (before) pushToken(result, { ...token, text: before });
    pushToken(result, {
      text: selected,
      style,
      manual: true,
      color: TOKEN_COLORS[style],
      source: "manual",
      ...(style === "link" ? { underline: true } : {}),
    });
    if (after) pushToken(result, { ...token, text: after });
    offset = tokenEnd;
  }

  return result;
}

export function applyManualPreset(
  tokens: RichToken[],
  start: number,
  end: number,
  manualStyleId: ManualStyleId,
): RichToken[] {
  if (end <= start) return tokens;
  const preset = MANUAL_STYLE_PRESETS[manualStyleId];
  const result: RichToken[] = [];
  let offset = 0;

  for (const token of tokens) {
    const tokenStart = offset;
    const tokenEnd = offset + token.text.length;
    const overlapStart = Math.max(start, tokenStart);
    const overlapEnd = Math.min(end, tokenEnd);

    if (overlapStart >= overlapEnd) {
      pushToken(result, token);
      offset = tokenEnd;
      continue;
    }

    const before = token.text.slice(0, overlapStart - tokenStart);
    const selected = token.text.slice(overlapStart - tokenStart, overlapEnd - tokenStart);
    const after = token.text.slice(overlapEnd - tokenStart);

    if (before) pushToken(result, { ...token, text: before });
    if (preset.preserveFormatting) {
      const selectedToken = { ...token };
      if (before) {
        delete selectedToken.iconSrc;
        delete selectedToken.iconScale;
      }
      pushToken(result, {
        ...selectedToken,
        text: selected,
        manual: true,
        manualStyleId,
        underline: true,
        source: "manual",
      });
    } else {
      pushToken(result, {
        text: selected,
        style: preset.style,
        manual: true,
        manualStyleId,
        color: preset.color,
        source: "manual",
        ...(preset.underline ? { underline: true } : {}),
        ...(preset.bold ? { bold: true } : {}),
      });
    }
    if (after) {
      const afterToken = { ...token };
      delete afterToken.iconSrc;
      delete afterToken.iconScale;
      pushToken(result, { ...afterToken, text: after });
    }
    offset = tokenEnd;
  }

  return result;
}

export function tokenClass(style: TokenStyle): string {
  return `rich-token rich-token-${style}`;
}

export function isTokenStyle(value: unknown): value is TokenStyle {
  return (
    value === "plain" ||
    value === "damage" ||
    value === "state" ||
    value === "healing" ||
    value === "number" ||
    value === "link"
  );
}

export function isManualStyleId(value: unknown): value is ManualStyleId {
  return typeof value === "string" && MANUAL_STYLE_IDS.includes(value as ManualStyleId);
}

export function plainTextToTokens(text: string): RichToken[] {
  return parseRichText(text);
}
