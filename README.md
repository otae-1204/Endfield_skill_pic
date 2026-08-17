# 六卡技能展示生成器

一个离线运行的 React + TypeScript + Vite 技能卡生成器。它把六个固定槽位的结构化数据渲染成和预览一致的深色技能卡，并支持本地草稿、`SkillPack v1` JSON 和独立透明 PNG 导出。

界面与技能卡正文使用《明日方舟：终末地》UI 同款的 HarmonyOS Sans SC。项目内嵌未修改的 Regular、Medium、Bold 字重；字体版权归 Huawei Device Co., Ltd. 所有，完整许可见 [`public/assets/fonts/LICENSE-HarmonyOS-Sans.txt`](public/assets/fonts/LICENSE-HarmonyOS-Sans.txt)。

技能卡字体参数按 `skill_text_font_rendering.md` 以约 `0.6` Canvas 比例复刻：标题 `18px`、类型 `15.4px`、Rank `14.4px`、正文/节点 `15.6px`、底部属性 `18px`。由于 HarmonyOS Sans SC Regular 比游戏 `defaultfont_cn.ttf` 视觉更粗，常规 `400` 映射到 Light 字形并增加 `0.12px` 轻描边作视觉补偿；仅 `<b>` 与 `<@intru.bold>` 使用 Bold `700`。

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
- 卡片固定基准宽度 400px，内容自动增高；输出倍率为 1× 或 2×，四角保持透明圆角。
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
  "render": { "baseWidth": 400, "scale": 2, "transparentCorners": true }
}
```

导入时会检查 `version: 1` 和六张卡片；老式正文字符串会在标准化时迁移为富文本 token。
