# 《明日方舟：终末地》游戏内技能简览页面还原器

本项目的目的，是尽可能一比一复刻《明日方舟：终末地》游戏内的技能简览页面，并提供可编辑、可复用的还原器。它不是通用卡片生成器，也不是官方项目；当前重点是还原游戏中技能悬浮简览的字体、颜色、排版、图标、节点装饰、背景和底部属性区域。

应用使用 React + TypeScript + Vite 离线运行，把普通攻击、战技、连携技、终结技和两个天赋节点的结构化数据渲染为技能简览卡片，并支持本地草稿、`SkillPack v1` JSON 和独立透明 PNG 导出。

## 来源与归属

这是一个非官方的个人还原工具，不代表《明日方舟：终末地》及其权利方。页面结构、颜色和排版来自项目使用者提供的游戏截图、游戏内资料以及 [终末地技能简览参考页面](https://zmd.xinjianya.top/) 的对照，不是官方源码。

- 应用图标 `src-tauri/icons/endfield-character.png` 是项目使用者提供的角色图片裁剪后的透明版本；角色形象及原始图片的版权归原作者和相关权利方，本项目不主张所有权。
- `public/assets/richtext/` 是 FZ Wiki `game-richtext` 接口公开 `iconPath` 的本地快照，仅用于离线还原富文本图标；对应语义和颜色映射见 `src/data/gameRichText.ts`。
- `defaultfont_cn.ttf` 是从游戏资源取得的字体文件，Novecento 数字字体来自 Synthview / MyFonts；这两种字体不随公开仓库分发，使用者需自行确认授权并合法取得。HarmonyOS Sans SC 的许可见 [`public/assets/fonts/LICENSE-HarmonyOS-Sans.txt`](public/assets/fonts/LICENSE-HarmonyOS-Sans.txt)。

更完整的素材和字体说明见 [`NOTICE.md`](NOTICE.md) 与 [`public/assets/README.md`](public/assets/README.md)。如需公开再分发包含原作角色图标或游戏资源的版本，请先取得相应权利方许可。

## 字体与数字渲染

字体选择、已知问题和排查顺序详见 [`docs/FONT_RENDERING.md`](docs/FONT_RENDERING.md)。

- 正文使用 `HarmonyOS Sans SC Regular`，当前字号为 `14.8px`、行高为 `1.22`、颜色为 `#D6D6D6`，不附加文字描边。HarmonyOS Sans SC 的许可见 [`public/assets/fonts/LICENSE-HarmonyOS-Sans.txt`](public/assets/fonts/LICENSE-HarmonyOS-Sans.txt)。
- 标题、Rank、类型和部分中文 UI 优先使用从游戏资源提取的 `defaultfont_cn.ttf`。该文件在浏览器内注册为 `Endfield Default CN`。
- 底部右侧数值不能把数字与中文单位作为同一种字体渲染。组件会把 `15秒` 拆成数字 `15` 与单位 `秒`：数字使用 `Novecento Sans Wide Normal`，字号 `21.5px`；中文单位使用 HarmonyOS Sans SC Regular，字号 `18px`。
- Novecento 数字保持字体的普通数字形式：`font-variant-numeric: normal`、`font-feature-settings: normal`。不要启用 `tabular-nums`/`tnum`，否则数字 `1` 会切换为不符合参考图的字形。
- 右侧数值整体上移 `1px`，右边距为 `9px`；纯数字（如 `240`）和带单位数值（如 `15秒`）共用这一定位规则。
- `defaultfont_cn.ttf` 与 Novecento Webfont 都不随公开仓库分发。请把合法取得的字体分别放到 `public/assets/fonts/defaultfont_cn.ttf`、`public/assets/fonts/NovecentoSansWideNormal.woff2`（可同时提供 `.woff`）。缺少字体时浏览器会使用后备字体，视觉无法与参考图一致。

## 本地网页预览

```powershell
npm install
npm run dev
```

打开 Vite 输出的地址即可使用。生产构建：

```powershell
npm run typecheck
npm test
npm run build
npm run preview
```

## 功能约定

- 六个槽位固定为普通攻击、战技、连携技、终结技、天赋节点 A、天赋节点 B；每张卡的标题和右上角类型都可以改。
- 正文通过关键词规则自动着色，也可以在工具栏中选中文本后使用 18 种精确预设手动标注，包括重要黄、关键词黄/蓝、战斗蓝、增益、减益、治疗、自然、灼热、寒冷、电磁、物理、以太、说明、下划线、链接、粗体和正文。自动识别的术语按 `skill_term_tag_mapping.md` 使用 `<#术语ID>` 语义并带下划线；直接样式 `<@样式ID>` 只应用颜色/图标，不会因为 ID 对应术语而自动加下划线。手动标注会优先保留在当前文本中。
- 可以添加全局自定义关键词并选择上述任一样式。规则实时应用到六张卡片，较长关键词优先，自定义规则优先于内置自动识别，手动标注仍保持最高优先级；规则会随本地草稿和 JSON 一起保存。
- 自动识别“连击”和“庇护”时会显示对应术语图标与下划线；“失衡节点”使用 `ba.poise` 的橙色，`18点失衡` 这类文本只给前面的失衡数值着色，普通“失衡”文字保持正文色，仅“对处于失衡状态的……”这类目标描述中的状态名使用失衡色。普攻处决描述“敌人处于失衡状态时使用普通攻击”保持正文色。
- 颜色按 `skill_text_color_rendering.md` 的悬浮技能面板 `preDef[0]` 渲染：正文浅灰 `#D6D6D6`、电磁黄 `#FFCC00`、战斗蓝 `#33C2FF`、增益蓝紫 `#9EB7FF`、治疗/自然绿 `#B4D945`；未知标签保持当前正文色。纯白 `#FFFFFF` 仅用于角色页面展开后的大详情面板正文。
- PNG 输出基准宽度固定为 360px，卡片内容自动增高；输出倍率为 1× 或 2×，四角保持透明圆角。
- PNG 采用渲染预览共用的 DOM，等待本地字体加载后再生成；导出异常会提示错误且不会清空草稿。

### 富文本术语检索

术语 ID 和样式 ID 的对照以项目使用者维护的 [`skill_term_tag_mapping.md`](C:/Code/qqbot/bot-entari/.runtime/endfield-skill-overview-prefabs/skill_term_tag_mapping.md) 为准：`<#...>` 通过 HyperlinkTextTable 查询术语，`<@...>` 通过 RichTextStyleTable 查询 `preDef[0]`。`src/data/gameRichText.ts` 保存离线颜色、语义和图标快照，`src/lib/richText.ts` 先按最长词匹配内置术语，再解析 API 标签；未知 ID 仍保留内部文字，不会让整段技能说明消失。

## Tauri 2 桌面与 Android

前端核心已经放在 Tauri 2 壳中。安装 Rust、Windows WebView2 以及 Android Studio/SDK 后，可以执行：

```powershell
# Windows 安装包
npx tauri build

# Android 初始化（首次执行）
npx tauri android init
npx tauri android build
```

Windows EXE/MSI 的图标与 Android 应用图标由 `src-tauri/icons/endfield-character.png` 生成；该文件是项目使用者提供的角色图片裁剪版本，来源与归属见 [`NOTICE.md`](NOTICE.md)。

Tauri 的 Android 构建需要 Android SDK、NDK、Java 和 Rust Android targets；本机没有这些工具链时，网页预览、测试和静态构建仍然可以完整运行。第一版不配置 iOS，iOS 后续需要 macOS + Xcode。

## 数据格式

数据模型在 `src/types.ts` 中定义，正文使用 `RichToken[]`：

```json
{
  "version": 1,
  "customKeywords": [
    { "id": "rule-1", "keyword": "雷暴领域", "style": "ba.pulse" }
  ],
  "cards": [
    {
      "slot": "normalAttack",
      "title": "疾风击",
      "typeLabel": "普通攻击",
      "rank": 9,
      "body": [{ "text": "电磁伤害", "style": "damage" }]
    }
  ],
  "render": { "baseWidth": 360, "scale": 2, "transparentCorners": true }
}
```

导入时会检查 `version: 1` 和六张卡片；老式正文字符串会在标准化时迁移为富文本 token。
