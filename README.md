# 《明日方舟：终末地》游戏内技能简览页面还原器

本项目的目的，是尽可能一比一复刻《明日方舟：终末地》游戏内的技能简览页面，并提供可编辑、可复用的还原器。它不是通用卡片生成器，也不是官方项目；当前重点是还原游戏中技能悬浮简览的字体、颜色、排版、图标、节点装饰、背景和底部属性区域。

应用使用 React + TypeScript + Vite 离线运行，把普通攻击、战技、连携技、终结技和两个天赋节点的结构化数据渲染为技能简览卡片，并支持本地草稿、`SkillPack v1` JSON 和独立透明 PNG 导出。

## 字体与数字渲染

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
- 正文通过关键词规则自动着色，也可以在工具栏中选中文本后使用 18 种精确预设手动标注，包括重要黄、关键词黄/蓝、战斗蓝、增益、减益、治疗、自然、灼热、寒冷、电磁、物理、以太、说明、下划线、链接、粗体和正文。手动标注会优先保留在当前文本中。
- 颜色按 `skill_text_color_rendering.md` 的悬浮技能面板 `preDef[0]` 渲染：正文浅灰 `#D6D6D6`、电磁黄 `#FFCC00`、战斗蓝 `#33C2FF`、增益蓝紫 `#9EB7FF`、治疗/自然绿 `#B4D945`；未知标签保持当前正文色。纯白 `#FFFFFF` 仅用于角色页面展开后的大详情面板正文。
- PNG 输出基准宽度固定为 360px，卡片内容自动增高；输出倍率为 1× 或 2×，四角保持透明圆角。
- PNG 采用渲染预览共用的 DOM，等待本地字体加载后再生成；导出异常会提示错误且不会清空草稿。

## Tauri 2 桌面与 Android

前端核心已经放在 Tauri 2 壳中。安装 Rust、Windows WebView2 以及 Android Studio/SDK 后，可以执行：

```powershell
# Windows 安装包
npx tauri build

# Android 初始化（首次执行）
npx tauri android init
npx tauri android build
```

Windows EXE/MSI 的图标与 Android 应用图标需要先提供有许可的源图，再执行 `npx tauri icon <source-image>`。当前仓库没有把参考游戏 logo 当作正式素材打包。

Tauri 的 Android 构建需要 Android SDK、NDK、Java 和 Rust Android targets；本机没有这些工具链时，网页预览、测试和静态构建仍然可以完整运行。第一版不配置 iOS，iOS 后续需要 macOS + Xcode。

## 数据格式

数据模型在 `src/types.ts` 中定义，正文使用 `RichToken[]`：

```json
{
  "version": 1,
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
