import type { TokenStyle } from "../types";

/**
 * Local snapshot of the FZ Wiki game-richtext style table used by the card
 * renderer. The URLs were resolved to files in public/assets/richtext so the
 * app keeps working when it is offline or packaged by Tauri.
 */
export type GameRichTextMeta = {
  id: string;
  color?: string;
  iconSrc?: string;
  iconScale?: number;
  semantic?: TokenStyle;
  underline?: boolean;
  bold?: boolean;
};

const icon = (filename: string): string => `/assets/richtext/${filename}`;

export const GAME_RICH_TEXT_ICON_SCALE = 1.4;

/** Skill-panel preDef[0] colors from skill_text_color_rendering.md. */
export const GAME_RICH_TEXT_COLORS = {
  "bl.key": "#FFBB03",
  "gd.key": "#FFCC00",
  "ba.key": "#33C2FF",
  "ss.key": "#22BBFF",
  "ba.vup": "#9EB7FF",
  "ba.vdown": "#FF8080",
  "ba.heal": "#B4D945",
  "ba.natur": "#B4D945",
  "ba.fire": "#FF8E59",
  "ba.cryst": "#30D6E0",
  "ba.pulse": "#FFCC00",
  "ba.phy": "#E3C19A",
  "ba.ether": "#C59EFF",
  "ba.info": "#999999",
} as const;

export const GAME_RICH_TEXT_STYLES: Record<string, GameRichTextMeta> = {
  "bl.key": { id: "bl.key", color: GAME_RICH_TEXT_COLORS["bl.key"], semantic: "damage" },
  "ba.key": { id: "ba.key", color: GAME_RICH_TEXT_COLORS["ba.key"], semantic: "state" },
  "ap.key": { id: "ap.key", color: "#46c1f8", semantic: "state" },
  "ss.key": { id: "ss.key", color: GAME_RICH_TEXT_COLORS["ss.key"], semantic: "state" },
  "cc.key": { id: "cc.key", color: "#22bbff", semantic: "state" },
  "ba.vup": { id: "ba.vup", color: GAME_RICH_TEXT_COLORS["ba.vup"], semantic: "number" },
  "ba.vdown": { id: "ba.vdown", color: GAME_RICH_TEXT_COLORS["ba.vdown"], semantic: "number" },
  "ba.pulse": { id: "ba.pulse", color: GAME_RICH_TEXT_COLORS["ba.pulse"], semantic: "damage" },
  "ba.pulseinflict": {
    id: "ba.pulseinflict",
    color: GAME_RICH_TEXT_COLORS["ba.pulse"],
    semantic: "damage",
    iconSrc: icon("c660f77745ae564b.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.pulseenhance": {
    id: "ba.pulseenhance",
    color: GAME_RICH_TEXT_COLORS["ba.pulse"],
    semantic: "damage",
    iconSrc: icon("db73592aa8b85442.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.conduct": {
    id: "ba.conduct",
    color: GAME_RICH_TEXT_COLORS["ba.pulse"],
    semantic: "damage",
    iconSrc: icon("08f558e7fd0d59f2.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.corrupt": {
    id: "ba.corrupt",
    color: GAME_RICH_TEXT_COLORS["ba.natur"],
    semantic: "healing",
    iconSrc: icon("f9179317c2ae317f.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.fire": { id: "ba.fire", color: GAME_RICH_TEXT_COLORS["ba.fire"], semantic: "damage" },
  "ba.fireinflict": {
    id: "ba.fireinflict",
    color: GAME_RICH_TEXT_COLORS["ba.fire"],
    semantic: "damage",
    iconSrc: icon("73c30d18d8329633.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.burning": {
    id: "ba.burning",
    color: GAME_RICH_TEXT_COLORS["ba.fire"],
    semantic: "damage",
    iconSrc: icon("d05bb86a671b3bf4.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.cryst": { id: "ba.cryst", color: GAME_RICH_TEXT_COLORS["ba.cryst"], semantic: "damage" },
  "ba.crystinflict": {
    id: "ba.crystinflict",
    color: GAME_RICH_TEXT_COLORS["ba.cryst"],
    semantic: "damage",
    iconSrc: icon("efe8972849b2cbb9.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.frozen": {
    id: "ba.frozen",
    color: GAME_RICH_TEXT_COLORS["ba.cryst"],
    semantic: "damage",
    iconSrc: icon("08497b0cbc805ec4.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.natur": { id: "ba.natur", color: GAME_RICH_TEXT_COLORS["ba.natur"], semantic: "healing" },
  "ba.naturalinflict": {
    id: "ba.naturalinflict",
    color: GAME_RICH_TEXT_COLORS["ba.natur"],
    semantic: "healing",
    iconSrc: icon("0ede51a7c74b5ae4.png"),
    // The leaf has extra vertical transparency and needs a small compensation.
    iconScale: 1.5,
  },
  "ba.heal": { id: "ba.heal", color: GAME_RICH_TEXT_COLORS["ba.heal"], semantic: "healing" },
  "ba.phy": { id: "ba.phy", color: GAME_RICH_TEXT_COLORS["ba.phy"], semantic: "damage" },
  "ba.pd": { id: "ba.pd", color: GAME_RICH_TEXT_COLORS["ba.phy"], semantic: "damage" },
  "ba.ether": { id: "ba.ether", color: GAME_RICH_TEXT_COLORS["ba.ether"], semantic: "state" },
  "ba.info": { id: "ba.info", color: GAME_RICH_TEXT_COLORS["ba.info"], semantic: "plain" },
  "ba.poise": { id: "ba.poise", color: "#ffd399", semantic: "number" },
  "ba.noguard": {
    id: "ba.noguard",
    color: "#e8ceb0",
    semantic: "state",
    iconSrc: icon("817f9771dd684e27.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.crush": {
    id: "ba.crush",
    color: "#e8ceb0",
    semantic: "state",
    iconSrc: icon("551c02932e4043d1.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.fracture": {
    id: "ba.fracture",
    color: "#e8ceb0",
    semantic: "state",
    iconSrc: icon("4e01724fc248f65e.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.knockdown": {
    id: "ba.knockdown",
    color: "#e8ceb0",
    semantic: "state",
    iconSrc: icon("b0450aad3b4226c2.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.airborne": {
    id: "ba.airborne",
    color: "#e8ceb0",
    semantic: "state",
    iconSrc: icon("ddfcc67dbc770162.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.crystbreak": {
    id: "ba.crystbreak",
    color: GAME_RICH_TEXT_COLORS["ba.cryst"],
    semantic: "damage",
    iconSrc: icon("140f265484bdd362.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.spellinflict": { id: "ba.spellinflict", color: GAME_RICH_TEXT_COLORS["ba.key"], semantic: "link" },
  // Consume text is a reference-style annotation in the source UI: it keeps
  // the surrounding body color and only receives an underline.
  "ba.consume": { id: "ba.consume", semantic: "plain", underline: true },
  "gd.key": { id: "gd.key", color: GAME_RICH_TEXT_COLORS["gd.key"], semantic: "damage" },
  "intru.bold": { id: "intru.bold", bold: true, semantic: "plain" },
  "tips.orange": { id: "tips.orange", color: "#ffd399", semantic: "number" },
  "tips.purple": { id: "tips.purple", color: GAME_RICH_TEXT_COLORS["ba.ether"], semantic: "state" },
  "weekraid.key": {
    id: "weekraid.key",
    color: GAME_RICH_TEXT_COLORS["gd.key"],
    semantic: "link",
    underline: true,
  },
};

/** Link entries with an iconPath in the API snapshot. */
export const GAME_RICH_TEXT_LINKS: Record<string, GameRichTextMeta> = {
  "ba.slow": {
    id: "ba.slow",
    color: GAME_RICH_TEXT_COLORS["ba.key"],
    semantic: "link",
    iconSrc: icon("441badac71ceee4e.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.weak": {
    id: "ba.weak",
    color: GAME_RICH_TEXT_COLORS["ba.key"],
    semantic: "link",
    iconSrc: icon("1f029fc64bf209f6.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.vulnerable": {
    id: "ba.vulnerable",
    color: GAME_RICH_TEXT_COLORS["ba.key"],
    semantic: "state",
    iconSrc: icon("99f3b7556e495989.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.firevul": {
    id: "ba.firevul",
    color: GAME_RICH_TEXT_COLORS["ba.fire"],
    semantic: "damage",
    iconSrc: icon("c36d87435d173890.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.crystvul": {
    id: "ba.crystvul",
    color: GAME_RICH_TEXT_COLORS["ba.cryst"],
    semantic: "damage",
    iconSrc: icon("2679d6cde38673cf.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.pulsevul": {
    id: "ba.pulsevul",
    color: GAME_RICH_TEXT_COLORS["ba.pulse"],
    semantic: "damage",
    iconSrc: icon("a7890b94bfc13bf8.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.naturalvul": {
    id: "ba.naturalvul",
    color: GAME_RICH_TEXT_COLORS["ba.natur"],
    semantic: "healing",
    iconSrc: icon("8f14f40bc458efc2.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.physicalvul": {
    id: "ba.physicalvul",
    color: GAME_RICH_TEXT_COLORS["ba.phy"],
    semantic: "damage",
    iconSrc: icon("e82f5eb3144df5e3.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.spellvul": {
    id: "ba.spellvul",
    color: GAME_RICH_TEXT_COLORS["ba.key"],
    semantic: "state",
    iconSrc: icon("8b188608c99c7ca9.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.combo": {
    id: "ba.combo",
    color: GAME_RICH_TEXT_COLORS["ba.key"],
    semantic: "link",
    iconSrc: icon("4a3b9be9843bf8aa.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.guard": {
    id: "ba.guard",
    color: GAME_RICH_TEXT_COLORS["ba.key"],
    semantic: "link",
    iconSrc: icon("cf8a140a31a7b731.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.enhance": {
    id: "ba.enhance",
    color: GAME_RICH_TEXT_COLORS["ba.key"],
    semantic: "link",
    iconSrc: icon("54a31a13576b70fb.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.fireenhance": {
    id: "ba.fireenhance",
    color: GAME_RICH_TEXT_COLORS["ba.fire"],
    semantic: "damage",
    iconSrc: icon("ea926c4bd5b05bcf.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.crystenhance": {
    id: "ba.crystenhance",
    color: GAME_RICH_TEXT_COLORS["ba.cryst"],
    semantic: "damage",
    iconSrc: icon("6977187e72fcf5b6.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.naturalenhance": {
    id: "ba.naturalenhance",
    color: GAME_RICH_TEXT_COLORS["ba.natur"],
    semantic: "healing",
    iconSrc: icon("66503e96323cfcf6.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.physicalenhance": {
    id: "ba.physicalenhance",
    color: GAME_RICH_TEXT_COLORS["ba.phy"],
    semantic: "damage",
    iconSrc: icon("a8dbb4bc5990ef17.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.spellenhance": {
    id: "ba.spellenhance",
    color: GAME_RICH_TEXT_COLORS["ba.key"],
    semantic: "state",
    iconSrc: icon("b5059c1e15b7319f.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.speedup": {
    id: "ba.speedup",
    color: GAME_RICH_TEXT_COLORS["ba.key"],
    semantic: "link",
    iconSrc: icon("685b9cf1ea4fc8b1.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
};

const LOCAL_ICON_BY_FILENAME = new Set(
  Object.values({ ...GAME_RICH_TEXT_STYLES, ...GAME_RICH_TEXT_LINKS })
    .map((meta) => meta.iconSrc)
    .filter((src): src is string => Boolean(src))
    .map((src) => src.split("/").pop() ?? ""),
);

export function localizeRichTextIcon(url: string): string {
  const filename = url.split("/").pop()?.split("?")[0] ?? "";
  return LOCAL_ICON_BY_FILENAME.has(filename)
    ? `/assets/richtext/${filename}`
    : url;
}

export function lookupRichTextMeta(
  id: string,
  tagKind: "@" | "#",
): GameRichTextMeta {
  const link = GAME_RICH_TEXT_LINKS[id];
  const style = GAME_RICH_TEXT_STYLES[id];
  const fallback = !link && !style ? { semantic: "plain" as TokenStyle } : undefined;
  return {
    ...(fallback ?? {}),
    ...(style ?? {}),
    ...(link ?? {}),
    id,
    underline: tagKind === "#" || style?.underline || link?.underline,
  };
}
