import type { SkillCard, SkillPack, SkillSlot } from "../types";
import { parseRichText } from "../lib/richText";

type DraftCard = Omit<SkillCard, "body"> & { body: string };

const draftCards: DraftCard[] = [
  {
    slot: "normalAttack",
    title: "疾风击",
    typeLabel: "普通攻击",
    rank: 9,
    body: "普通攻击：\n对敌人进行至多5段攻击，造成电磁伤害。作为主控干员时，重击会造成18点失衡。\n\n下落攻击：\n处于空中时使用普通攻击，会下落并攻击附近敌人，造成电磁伤害。\n\n处决攻击：\n附近有敌人处于失衡状态时使用普通攻击，将处决该敌人，造成大量电磁伤害并恢复一定技力。",
  },
  {
    slot: "battleSkill",
    title: "惊星淬",
    typeLabel: "战技",
    rank: 9,
    body: "消耗目标的易异状态，使本次战技伤害倍率提高，并生成相当于消耗掉易异的异常等级+1柄青莲剑。\n若现存的青莲剑少于3柄，则使未消耗目标的易异状态仍能生成青莲剑。\n随后引导附近的青莲剑依次贯击目标，造成电磁伤害并额外获得终结技能量，最后一次击造成6倍伤害。\n一次击败最多生成3柄青莲剑。",
    footerRows: [{ label: "技力消耗", value: "100" }],
  },
  {
    slot: "comboSkill",
    title: "一息万变",
    typeLabel: "连携技",
    rank: 9,
    body: "主控干员的重击或处决，命中处于电磁附着状态的敌人后可以发动。\n构造晶阵阵法攻击敌人，造成电磁伤害。命中处于电磁附着的敌人时，消耗其电磁附着，强制施加易异，并基于消耗的层数额外获得终结技能量。\n若强制施加易异时，敌人已处于易异状态，则所施加的易异等级+1。",
    footerRows: [{ label: "冷却时间", value: "18秒" }],
  },
  {
    slot: "ultimate",
    title: "万钧风雷",
    typeLabel: "终结技",
    rank: 9,
    body: "进入天理合真状态：\n普通攻击强化，自身行动更加不容易被打断。战技惊爆使伤害倍率提高，伤害范围扩大，最后一次雷击命中时额外施加电磁附着。\n连接持续期间对一定范围内的敌人生效，伤害倍率提高，冷却恢复速度提升至原本的4倍。\n首次施放时按连接天理合真拥有的易异，若存在目标，则无论是否处于易异状态，必定生成3柄青莲剑。",
    footerRows: [
      { label: "所需终结技能量", value: "240" },
      { label: "冷却时间", value: "15秒" },
    ],
  },
  {
    slot: "talentA",
    title: "天地造化",
    typeLabel: "天赋",
    subtitle: "节点",
    nodeMarks: 2,
    body: "施放战技惊爆时对自身施加18%电磁增幅，持续5秒。\n战技的雷击命中时使该效果+2%。\n每次施放战技惊爆时，该电磁增幅效果重置。",
  },
  {
    slot: "talentB",
    title: "承天之佑",
    typeLabel: "天赋",
    subtitle: "节点",
    nodeMarks: 2,
    body: "有9%的概率免疫受到的伤害，附近每存在1柄青莲剑，此概率+1%。\n当该伤害免疫效果后，回复自身18%最大生命值，每99秒最多回复1次生命值。",
  },
];

export const DEFAULT_PACK: SkillPack = {
  version: 1,
  cards: draftCards.map(({ body, ...card }) => ({
    ...card,
    body: parseRichText(body),
  })) as SkillPack["cards"],
  render: {
    baseWidth: 360,
    scale: 1,
    transparentCorners: true,
  },
};

export const SLOT_LABELS: Record<SkillSlot, string> = {
  normalAttack: "普通攻击",
  battleSkill: "战技",
  comboSkill: "连携技",
  ultimate: "终结技",
  talentA: "天赋节点 A",
  talentB: "天赋节点 B",
};
