# 来源、归属与再分发说明

## 项目定位

本项目是个人制作的《明日方舟：终末地》游戏内技能简览页面还原器，属于非官方工具，不代表鹰角网络、游戏发行方或其他相关权利方。页面结构和视觉参数是根据项目使用者提供的游戏截图、游戏内资料及 [终末地技能简览参考页面](https://zmd.xinjianya.top/) 进行的独立复刻。

## 图标素材

`src-tauri/icons/endfield-character.png` 来自项目使用者提供的角色图片，经过裁剪并放置到透明方形画布后生成。角色形象及原始图片的版权归原作者和相关权利方，本项目不主张所有权，也未将其描述为原创素材。公开再分发包含该图标的版本前，请确认已取得必要授权。

## 富文本图标快照

`public/assets/richtext/` 保存了 FZ Wiki `game-richtext` 接口公开 `iconPath` 的本地快照，供离线渲染使用。`src/data/gameRichText.ts` 中的颜色、语义和缩放映射是本项目为还原技能面板所做的整理；应用运行时不会请求该站点。

## 字体

- `HarmonyOS Sans SC`：项目随附文件和许可文本见 `public/assets/fonts/LICENSE-HarmonyOS-Sans.txt`，版权归 Huawei Device Co., Ltd. 及其许可方。
- `defaultfont_cn.ttf`：从游戏资源取得的字体文件，因游戏资源的再分发限制不提交到公开仓库。
- `Novecento Sans Wide Normal`：来自 Synthview / MyFonts 的网页字体；项目 CSS 中保留了来源和 MyFonts Webfont EULA 提示。使用者应自行取得有效许可，字体文件不提交到公开仓库。

## 代码与第三方依赖

本项目代码由本仓库维护者编写，依赖许可和具体版本记录在 `package.json`、`package-lock.json` 与 `src-tauri/Cargo.lock`。Tauri、React、Vite 等第三方项目的商标和版权归各自权利方所有。
