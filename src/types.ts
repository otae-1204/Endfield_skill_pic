export const SLOT_IDS = [
  "normalAttack",
  "battleSkill",
  "comboSkill",
  "ultimate",
  "talentA",
  "talentB",
] as const;

export type SkillSlot = (typeof SLOT_IDS)[number];

export type TokenStyle =
  | "plain"
  | "damage"
  | "state"
  | "healing"
  | "number"
  | "link";

export const MANUAL_STYLE_IDS = [
  "plain",
  "bl.key",
  "gd.key",
  "ba.key",
  "ss.key",
  "ba.vup",
  "ba.vdown",
  "ba.heal",
  "ba.natur",
  "ba.fire",
  "ba.cryst",
  "ba.pulse",
  "ba.phy",
  "ba.ether",
  "ba.info",
  "underline",
  "link",
  "bold",
] as const;

export type ManualStyleId = (typeof MANUAL_STYLE_IDS)[number];

export type RichToken = {
  text: string;
  style: TokenStyle;
  manual?: boolean;
  manualStyleId?: ManualStyleId;
  richTextId?: string;
  tagKind?: "@" | "#";
  iconSrc?: string;
  iconSource?: string;
  iconScale?: number;
  color?: string;
  underline?: boolean;
  bold?: boolean;
  source?: "auto" | "api" | "image" | "manual";
};

export type FooterRow = {
  label: string;
  value: string;
};

export type SkillCard = {
  slot: SkillSlot;
  title: string;
  typeLabel: string;
  rank?: number;
  subtitle?: string;
  nodeMarks?: number;
  body: RichToken[];
  footerRows?: FooterRow[];
};

export type RenderSettings = {
  baseWidth: 360;
  scale: 1 | 2;
  transparentCorners: true;
};

export type SkillPack = {
  version: 1;
  cards: [SkillCard, SkillCard, SkillCard, SkillCard, SkillCard, SkillCard];
  render: RenderSettings;
};

export type EditableCardPatch = Partial<
  Omit<SkillCard, "slot" | "body" | "footerRows">
> & {
  body?: RichToken[];
  footerRows?: FooterRow[];
};
