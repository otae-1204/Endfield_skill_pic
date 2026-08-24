import type { TokenStyle } from "../types";

/**
 * Local snapshot of the FZ Wiki game-richtext style table used by the card
 * renderer, aligned with the project's skill_term_tag_mapping.md. The URLs
 * were resolved to files in public/assets/richtext so the app keeps working
 * when it is offline or packaged by Tauri.
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

const term = (
  id: string,
  color: string = GAME_RICH_TEXT_COLORS["ba.key"],
  semantic: TokenStyle = "state",
): GameRichTextMeta => ({ id, color, semantic });

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
  "ba.poise": { id: "ba.poise", color: "#FFAE6B", semantic: "number" },
  "ba.noguard": {
    id: "ba.noguard",
    color: GAME_RICH_TEXT_COLORS["ba.phy"],
    semantic: "damage",
    iconSrc: icon("817f9771dd684e27.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.crush": {
    id: "ba.crush",
    color: GAME_RICH_TEXT_COLORS["ba.phy"],
    semantic: "damage",
    iconSrc: icon("551c02932e4043d1.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.fracture": {
    id: "ba.fracture",
    color: GAME_RICH_TEXT_COLORS["ba.phy"],
    semantic: "damage",
    iconSrc: icon("4e01724fc248f65e.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.knockdown": {
    id: "ba.knockdown",
    color: GAME_RICH_TEXT_COLORS["ba.phy"],
    semantic: "damage",
    iconSrc: icon("b0450aad3b4226c2.png"),
    iconScale: GAME_RICH_TEXT_ICON_SCALE,
  },
  "ba.airborne": {
    id: "ba.airborne",
    color: GAME_RICH_TEXT_COLORS["ba.phy"],
    semantic: "damage",
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
  "ba.spellinflict": {
    id: "ba.spellinflict",
    color: GAME_RICH_TEXT_COLORS["ba.key"],
    semantic: "state",
  },
  "ba.physicalstatus": term("ba.physicalstatus", GAME_RICH_TEXT_COLORS["ba.phy"], "damage"),
  "ba.spellstatus": term("ba.spellstatus"),
  "ba.spellinflictonchar": term("ba.spellinflictonchar"),
  "ba.fireonchar": term("ba.fireonchar", GAME_RICH_TEXT_COLORS["ba.fire"], "damage"),
  "ba.pulseonchar": term("ba.pulseonchar", GAME_RICH_TEXT_COLORS["ba.pulse"], "damage"),
  "ba.crystonchar": term("ba.crystonchar", GAME_RICH_TEXT_COLORS["ba.cryst"], "damage"),
  "ba.naturalonchar": term("ba.naturalonchar", GAME_RICH_TEXT_COLORS["ba.natur"], "healing"),
  "ba.burningonchar": term("ba.burningonchar", GAME_RICH_TEXT_COLORS["ba.fire"], "damage"),
  "ba.conductonchar": term("ba.conductonchar", GAME_RICH_TEXT_COLORS["ba.pulse"], "damage"),
  "ba.frozenonchar": term("ba.frozenonchar", GAME_RICH_TEXT_COLORS["ba.cryst"], "damage"),
  "ba.corruptonchar": term("ba.corruptonchar", GAME_RICH_TEXT_COLORS["ba.natur"], "healing"),
  "ba.spellburst": term("ba.spellburst"),
  "ba.fireburst": term("ba.fireburst", GAME_RICH_TEXT_COLORS["ba.fire"], "damage"),
  "ba.pulseburst": term("ba.pulseburst", GAME_RICH_TEXT_COLORS["ba.pulse"], "damage"),
  "ba.crystburst": term("ba.crystburst", GAME_RICH_TEXT_COLORS["ba.cryst"], "damage"),
  "ba.naturalburst": term("ba.naturalburst", GAME_RICH_TEXT_COLORS["ba.natur"], "healing"),
  // Term tags add the underline at lookup time. Direct style tags do not
  // inherit it unless the style itself explicitly defines one.
  "ba.consume": { id: "ba.consume", semantic: "plain" },
  "ba.lastcombo": term("ba.lastcombo", GAME_RICH_TEXT_COLORS["ba.key"], "link"),
  "ba.poiseknot": term("ba.poiseknot", GAME_RICH_TEXT_COLORS["ba.key"], "link"),
  "ba.statuslevel": term("ba.statuslevel"),
  "ba.shield": term("ba.shield", GAME_RICH_TEXT_COLORS["ba.key"], "link"),
  "ba.absorb": term("ba.absorb", GAME_RICH_TEXT_COLORS["ba.key"], "link"),
  "ba.dispel": term("ba.dispel", GAME_RICH_TEXT_COLORS["ba.key"], "link"),
  "ba.dot": term("ba.dot"),
  "ba.return": term("ba.return", GAME_RICH_TEXT_COLORS["ba.key"], "link"),
  "ba.originium": term("ba.originium", GAME_RICH_TEXT_COLORS["ba.key"], "link"),
  "ba.spelldmg": term("ba.spelldmg"),
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

/** HyperlinkTextTable IDs used by the skill-overview text component. */
const GAME_RICH_TEXT_TERM_IDS = new Set([
  "ba.spellinflict",
  "ba.fireinflict",
  "ba.pulseinflict",
  "ba.crystinflict",
  "ba.naturalinflict",
  "ba.spellinflictonchar",
  "ba.fireonchar",
  "ba.pulseonchar",
  "ba.crystonchar",
  "ba.naturalonchar",
  "ba.physicalstatus",
  "ba.noguard",
  "ba.airborne",
  "ba.knockdown",
  "ba.crush",
  "ba.fracture",
  "ba.spellstatus",
  "ba.burning",
  "ba.conduct",
  "ba.frozen",
  "ba.corrupt",
  "ba.crystbreak",
  "ba.burningonchar",
  "ba.conductonchar",
  "ba.frozenonchar",
  "ba.corruptonchar",
  "ba.spellburst",
  "ba.fireburst",
  "ba.pulseburst",
  "ba.crystburst",
  "ba.naturalburst",
  "ba.enhance",
  "ba.physicalenhance",
  "ba.spellenhance",
  "ba.fireenhance",
  "ba.pulseenhance",
  "ba.crystenhance",
  "ba.naturalenhance",
  "ba.vulnerable",
  "ba.physicalvul",
  "ba.spellvul",
  "ba.firevul",
  "ba.pulsevul",
  "ba.crystvul",
  "ba.naturalvul",
  "ba.combo",
  "ba.lastcombo",
  "ba.poiseknot",
  "ba.statuslevel",
  "ba.shield",
  "ba.guard",
  "ba.absorb",
  "ba.dispel",
  "ba.speedup",
  "ba.slow",
  "ba.weak",
  "ba.dot",
  "ba.consume",
  "ba.return",
  "ba.originium",
  "ba.spelldmg",
]);

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
  const known = tagKind === "#" ? GAME_RICH_TEXT_TERM_IDS.has(id) : Boolean(link || style);
  const resolvedStyle = tagKind === "#" && !known ? undefined : style;
  const resolvedLink = tagKind === "#" && !known ? undefined : link;
  const fallback = !known ? { semantic: "plain" as TokenStyle } : undefined;
  return {
    ...(fallback ?? {}),
    ...(resolvedStyle ?? {}),
    ...(resolvedLink ?? {}),
    id,
    // HyperlinkTextTable terms are underlined by the game's UIText layer;
    // direct RichTextStyleTable tags only retain an underline explicitly
    // authored by that style. Unknown IDs remain plain visible text.
    underline: (known && tagKind === "#") || resolvedStyle?.underline || resolvedLink?.underline,
  };
}
