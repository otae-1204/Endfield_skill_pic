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

export const GAME_RICH_TEXT_STYLES: Record<string, GameRichTextMeta> = {
  "ba.key": { id: "ba.key", color: "#33c2ff", semantic: "state" },
  "ap.key": { id: "ap.key", color: "#46c1f8", semantic: "state" },
  "ss.key": { id: "ss.key", color: "#22bbff", semantic: "state" },
  "cc.key": { id: "cc.key", color: "#22bbff", semantic: "state" },
  "ba.pulse": { id: "ba.pulse", color: "#ffcc00", semantic: "damage" },
  "ba.pulseinflict": {
    id: "ba.pulseinflict",
    color: "#ffcc00",
    semantic: "damage",
    iconSrc: icon("c660f77745ae564b.png"),
    iconScale: 1.25,
  },
  "ba.pulseenhance": {
    id: "ba.pulseenhance",
    color: "#ffcc00",
    semantic: "damage",
    iconSrc: icon("db73592aa8b85442.png"),
    iconScale: 1.25,
  },
  "ba.conduct": {
    id: "ba.conduct",
    color: "#ffcc00",
    semantic: "damage",
    iconSrc: icon("08f558e7fd0d59f2.png"),
    iconScale: 1.25,
  },
  "ba.fire": { id: "ba.fire", color: "#ff8e59", semantic: "damage" },
  "ba.fireinflict": {
    id: "ba.fireinflict",
    color: "#ff8e59",
    semantic: "damage",
    iconSrc: icon("73c30d18d8329633.png"),
    iconScale: 1.25,
  },
  "ba.burning": {
    id: "ba.burning",
    color: "#ff8e59",
    semantic: "damage",
    iconSrc: icon("d05bb86a671b3bf4.png"),
    iconScale: 1.25,
  },
  "ba.cryst": { id: "ba.cryst", color: "#08edfb", semantic: "damage" },
  "ba.crystinflict": {
    id: "ba.crystinflict",
    color: "#30d6e0",
    semantic: "damage",
    iconSrc: icon("efe8972849b2cbb9.png"),
    iconScale: 1.25,
  },
  "ba.frozen": {
    id: "ba.frozen",
    color: "#08edfb",
    semantic: "damage",
    iconSrc: icon("08497b0cbc805ec4.png"),
    iconScale: 1.25,
  },
  "ba.natur": { id: "ba.natur", color: "#ade131", semantic: "healing" },
  "ba.naturalinflict": {
    id: "ba.naturalinflict",
    color: "#ade131",
    semantic: "healing",
    iconSrc: icon("0ede51a7c74b5ae4.png"),
    iconScale: 1.25,
  },
  "ba.heal": { id: "ba.heal", color: "#ade131", semantic: "healing" },
  "ba.phy": { id: "ba.phy", color: "#e3c19a", semantic: "damage" },
  "ba.pd": { id: "ba.pd", color: "#e3c19a", semantic: "damage" },
  "ba.poise": { id: "ba.poise", color: "#ffd399", semantic: "number" },
  "ba.noguard": {
    id: "ba.noguard",
    color: "#e8ceb0",
    semantic: "state",
    iconSrc: icon("817f9771dd684e27.png"),
    iconScale: 1.25,
  },
  "ba.crush": {
    id: "ba.crush",
    color: "#e8ceb0",
    semantic: "state",
    iconSrc: icon("551c02932e4043d1.png"),
    iconScale: 1.25,
  },
  "ba.fracture": {
    id: "ba.fracture",
    color: "#e8ceb0",
    semantic: "state",
    iconSrc: icon("4e01724fc248f65e.png"),
    iconScale: 1.25,
  },
  "ba.knockdown": {
    id: "ba.knockdown",
    color: "#e8ceb0",
    semantic: "state",
    iconSrc: icon("b0450aad3b4226c2.png"),
    iconScale: 1.25,
  },
  "ba.airborne": {
    id: "ba.airborne",
    color: "#e8ceb0",
    semantic: "state",
    iconSrc: icon("ddfcc67dbc770162.png"),
    iconScale: 1.25,
  },
  "ba.crystbreak": {
    id: "ba.crystbreak",
    color: "#30d6e0",
    semantic: "damage",
    iconSrc: icon("140f265484bdd362.png"),
    iconScale: 1.25,
  },
  "ba.spellinflict": { id: "ba.spellinflict", color: "#33c2ff", semantic: "link" },
  // Consume text is a reference-style annotation in the source UI: it keeps
  // the surrounding body color and only receives an underline.
  "ba.consume": { id: "ba.consume", semantic: "plain", underline: true },
  "gd.key": { id: "gd.key", color: "#ffcc00", semantic: "damage" },
  "intru.bold": { id: "intru.bold", bold: true, semantic: "plain" },
  "tips.orange": { id: "tips.orange", color: "#ffd399", semantic: "number" },
  "tips.purple": { id: "tips.purple", color: "#c59eff", semantic: "state" },
  "weekraid.key": {
    id: "weekraid.key",
    color: "#ffcc00",
    semantic: "link",
    underline: true,
  },
};

/** Link entries with an iconPath in the API snapshot. */
export const GAME_RICH_TEXT_LINKS: Record<string, GameRichTextMeta> = {
  "ba.slow": {
    id: "ba.slow",
    color: "#33c2ff",
    semantic: "link",
    iconSrc: icon("441badac71ceee4e.png"),
    iconScale: 1.25,
  },
  "ba.weak": {
    id: "ba.weak",
    color: "#33c2ff",
    semantic: "link",
    iconSrc: icon("1f029fc64bf209f6.png"),
    iconScale: 1.25,
  },
  "ba.vulnerable": {
    id: "ba.vulnerable",
    color: "#33c2ff",
    semantic: "state",
    iconSrc: icon("99f3b7556e495989.png"),
    iconScale: 1.25,
  },
  "ba.firevul": {
    id: "ba.firevul",
    color: "#ff8e59",
    semantic: "damage",
    iconSrc: icon("c36d87435d173890.png"),
    iconScale: 1.25,
  },
  "ba.crystvul": {
    id: "ba.crystvul",
    color: "#08edfb",
    semantic: "damage",
    iconSrc: icon("2679d6cde38673cf.png"),
    iconScale: 1.25,
  },
  "ba.pulsevul": {
    id: "ba.pulsevul",
    color: "#ffcc00",
    semantic: "damage",
    iconSrc: icon("a7890b94bfc13bf8.png"),
    iconScale: 1.25,
  },
  "ba.naturalvul": {
    id: "ba.naturalvul",
    color: "#ade131",
    semantic: "healing",
    iconSrc: icon("8f14f40bc458efc2.png"),
    iconScale: 1.25,
  },
  "ba.physicalvul": {
    id: "ba.physicalvul",
    color: "#e3c19a",
    semantic: "damage",
    iconSrc: icon("e82f5eb3144df5e3.png"),
    iconScale: 1.25,
  },
  "ba.spellvul": {
    id: "ba.spellvul",
    color: "#33c2ff",
    semantic: "state",
    iconSrc: icon("8b188608c99c7ca9.png"),
    iconScale: 1.25,
  },
  "ba.combo": {
    id: "ba.combo",
    color: "#33c2ff",
    semantic: "link",
    iconSrc: icon("4a3b9be9843bf8aa.png"),
    iconScale: 1.25,
  },
  "ba.guard": {
    id: "ba.guard",
    color: "#33c2ff",
    semantic: "link",
    iconSrc: icon("cf8a140a31a7b731.png"),
    iconScale: 1.25,
  },
  "ba.enhance": {
    id: "ba.enhance",
    color: "#33c2ff",
    semantic: "link",
    iconSrc: icon("54a31a13576b70fb.png"),
    iconScale: 1.25,
  },
  "ba.fireenhance": {
    id: "ba.fireenhance",
    color: "#ff8e59",
    semantic: "damage",
    iconSrc: icon("ea926c4bd5b05bcf.png"),
    iconScale: 1.25,
  },
  "ba.crystenhance": {
    id: "ba.crystenhance",
    color: "#08edfb",
    semantic: "damage",
    iconSrc: icon("6977187e72fcf5b6.png"),
    iconScale: 1.25,
  },
  "ba.naturalenhance": {
    id: "ba.naturalenhance",
    color: "#ade131",
    semantic: "healing",
    iconSrc: icon("66503e96323cfcf6.png"),
    iconScale: 1.25,
  },
  "ba.physicalenhance": {
    id: "ba.physicalenhance",
    color: "#e3c19a",
    semantic: "damage",
    iconSrc: icon("a8dbb4bc5990ef17.png"),
    iconScale: 1.25,
  },
  "ba.spellenhance": {
    id: "ba.spellenhance",
    color: "#33c2ff",
    semantic: "state",
    iconSrc: icon("b5059c1e15b7319f.png"),
    iconScale: 1.25,
  },
  "ba.speedup": {
    id: "ba.speedup",
    color: "#33c2ff",
    semantic: "link",
    iconSrc: icon("685b9cf1ea4fc8b1.png"),
    iconScale: 1.25,
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
  const fallback = tagKind === "#" ? GAME_RICH_TEXT_STYLES["ba.key"] : undefined;
  return {
    ...(fallback ?? {}),
    ...(style ?? {}),
    ...(link ?? {}),
    id,
    underline: tagKind === "#" || style?.underline || link?.underline,
  };
}
