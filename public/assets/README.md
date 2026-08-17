# 本地素材入口

正式素材请放在这个目录或 `src-tauri/icons/`：

- 字体文件：`fonts/` 内已包含并注册 HarmonyOS Sans SC 的 Regular、Medium、Bold 原始字体文件及完整许可协议。
- 技能图标：建议使用原始 SVG/PNG，并在 `SkillCardView` 中按槽位接入。
- 边框、纹理、背景：优先使用无损文件；截图只作为布局 golden fixture，不作为正式素材。

应用运行时不会请求 AKEData 或其他外部站点。

`richtext/` 中的 PNG 是从 FZ Wiki `game-richtext` 接口返回的公开 `iconPath`
快照下载的本地副本；`src/data/gameRichText.ts` 保存对应的颜色、语义和倍率。
这样粘贴 `<@...>`、`<#...>` 或 `<image="..." />` 富文本时，桌面和移动端仍然可以离线渲染。
