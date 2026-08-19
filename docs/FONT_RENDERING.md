# 字体渲染与问题排查

本文记录技能简览还原过程中已经确认的字体事实、最终实现和常见误区。调整字体前应先对照本文件，避免重复引入已经修复的问题。

## 当前字体分工

| 区域 | 字体 | 当前设置 |
|---|---|---|
| 技能标题、Rank、右上角类型等中文 UI | `Endfield Default CN` | 来自游戏资源 `defaultfont_cn.ttf` |
| 技能正文 | `HarmonyOS Sans SC Regular` | `14.8px`，行高 `1.22`，字重 `400` |
| 底部纯数字 | `Novecento Sans Wide Normal` | `21.5px`，普通数字形式 |
| 底部中文单位 | `HarmonyOS Sans SC Regular` | `18px` |

普通正文颜色固定为 `#D6D6D6`，正文和中文单位均不使用 `-webkit-text-stroke`。字体颜色与笔画粗细是两个独立问题，不要为了让文字看起来更深而擅自修改规范颜色。

## `defaultfont_cn.ttf` 为什么不能直接用于全部正文

从游戏资源提取的 `defaultfont_cn.ttf` 内部识别为 HarmonyOS Sans SC Medium。它是静态 Medium 字形，不会因为 CSS 写了 `font-weight: 400` 就真正变成 Regular。

因此直接用于大段正文时会比参考图显得更粗、更拥挤。当前做法是：标题、Rank、类型等 UI 继续使用游戏提取字体，正文改用同族的 HarmonyOS Sans SC Regular。不要通过文字描边模拟介于 Regular 与 Medium 之间的字重；实践中即使 `0.08px` 描边也会破坏小字号字形。

## Novecento 数字 `1` 的问题

底部数值必须使用 `Novecento Sans Wide Normal`，但只能使用字体的普通数字形式：

```css
font-variant-numeric: normal;
font-feature-settings: normal;
```

不要启用 `tabular-nums`、`lining-nums`、`tnum` 或 `lnum`。此前强制等宽数字后，数字 `1` 会切换为另一套字形，与游戏截图明显不一致；这不是字体文件损坏，而是 OpenType 数字变体使用错误。

## 数字与中文单位必须拆分

`15秒` 不能作为一个节点统一设置 Novecento。Novecento 不包含正确的中文字形，浏览器回退后又会让“秒”继承数字字号，导致单位过大或比例失真。

当前 `SkillCard.tsx` 会把底部值拆为：

- 数字部分 `15`：Novecento，`21.5px`；
- 单位部分 `秒`：HarmonyOS Sans SC Regular，`18px`。

纯数字 `240` 只生成数字节点。右侧数值整体相对行盒上移 `1px`，右边距为 `9px`。如需继续微调，应分别调整 `.skill-card-footer-number`、`.skill-card-footer-unit` 和父级 `strong`，不要再次把数字与单位合并。

## 字体加载与公开仓库限制

公开仓库不会提交以下字体文件：

- `public/assets/fonts/defaultfont_cn.ttf`
- `public/assets/fonts/NovecentoSansWideNormal.woff2`
- `public/assets/fonts/NovecentoSansWideNormal.woff`

使用者需合法取得字体并放到上述路径。缺失时浏览器会使用后备字体，页面虽可运行，但不能据此判断视觉还原是否准确。HarmonyOS Sans SC 随项目提供的字体文件及许可见 `public/assets/fonts/LICENSE-HarmonyOS-Sans.txt`。

## 排查顺序

发现字体不一致时按以下顺序检查：

1. 在浏览器开发工具中确认实际加载的 `font-family`，不要只看 CSS 声明。
2. 确认私有字体文件请求没有返回 404。
3. 检查是否意外启用了 `font-synthesis`、文字描边或 OpenType 数字变体。
4. 区分字号、行高、基线、字距和字重，不要用单一字号同时补偿所有差异。
5. 对底部数值分别检查数字节点和中文单位节点。
6. PNG 导出前需等待 `document.fonts.ready`；当前导出流程已经执行此步骤。

## 相关实现

- 字体声明与视觉参数：`src/styles.css`
- 数字/单位拆分：`src/components/SkillCard.tsx`
- PNG 字体等待：`src/lib/exportPng.ts`
