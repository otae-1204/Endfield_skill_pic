# 六卡技能展示生成器

一个离线运行的 React + TypeScript + Vite 技能卡生成器。它把六个固定槽位的结构化数据渲染成和预览一致的深色技能卡，并支持本地草稿、`SkillPack v1` JSON 和独立透明 PNG 导出。

界面与技能卡正文使用《明日方舟：终末地》UI 同款的 HarmonyOS Sans SC。项目内嵌未修改的 Regular、Medium、Bold 字重；字体版权归 Huawei Device Co., Ltd. 所有，完整许可见 [`public/assets/fonts/LICENSE-HarmonyOS-Sans.txt`](public/assets/fonts/LICENSE-HarmonyOS-Sans.txt)。

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
- 正文通过关键词规则自动着色，也可以在工具栏中选中文本后手动标注。手动标注会优先保留在当前文本中。
- 颜色采用 AKEData 技能详情页的语义色：伤害黄 `#ffcc00`、状态/链接蓝 `#00a8ff`、治疗/自然绿 `#ade131`、数值暖色 `#ffd399`。
- 卡片固定基准宽度 378px，内容自动增高；输出倍率为 1× 或 2×，四角保持透明圆角。
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
  "render": { "baseWidth": 378, "scale": 2, "transparentCorners": true }
}
```

导入时会检查 `version: 1` 和六张卡片；老式正文字符串会在标准化时迁移为富文本 token。
