# 《明日方舟：终末地》游戏内技能简览页面还原器：项目交接

## 项目位置

`C:\Code\Endfield_skill_pic`

## 项目概况

本项目的明确目标是尽可能一比一复刻《明日方舟：终末地》游戏内技能悬浮简览页面，并把它做成可编辑、可导出、可复用的页面还原器，而不是通用技能卡生成器。

项目基于 React + TypeScript + Vite，固定渲染六种技能卡：

- 普通攻击
- 战技
- 连携技
- 终结技
- 天赋节点 A
- 天赋节点 B

项目支持本地草稿、SkillPack v1 JSON 导入/导出，以及独立透明 PNG 导出。前端核心已放入 Tauri 2 壳中。

项目来源、素材归属和再分发边界见 [`NOTICE.md`](C:/Code/Endfield_skill_pic/NOTICE.md)。这是非官方复刻工具：界面对照项目使用者提供的游戏截图、游戏内资料和参考页面制作；桌面图标是项目使用者提供的角色图片裁剪版本；富文本图标来自 FZ Wiki `game-richtext` 公开接口的本地快照；游戏字体和 Novecento 字体不随公开仓库分发。

## 已完成内容

### 富文本解析

当前支持：

- 自动识别伤害、状态、治疗、数值和链接类文本
- 手动标注优先于自动识别
- API 标记格式：`<@id>`、`<#id>`、`<image="...">`
- 中文换行和连续文本合并
- 消耗类文本保持原色，仅添加下划线
- 自动识别以下词条：
  - 脆弱、虚弱
  - 附着、法术附着
  - 增幅、法术增幅
  - 电磁、灼热、寒冷、自然、物理对应的脆弱与增幅
- 已补充 FZ Wiki API 对应的本地图标，离线运行时不依赖外部网站
- 支持用户添加、修改和删除全局自定义关键词规则；规则可选择全部 18 种样式，较长关键词优先，自定义规则优先于内置规则，手动标注保持最高优先级
- 自定义关键词规则随本地草稿和 SkillPack v1 JSON 保存，旧版无规则字段的 v1 文件仍兼容
- 自动识别的术语按 `skill_term_tag_mapping.md` 走 HyperlinkTextTable 语义（`<#...>`），因此破防、击飞、附着、异常及其子类会自动添加下划线；API 的 `<#...>` 和 `<@...>` 已区分处理，后者只应用直接样式，不因存在图标而自动加下划线
- 已同步术语表中的法术附着/异常、物理异常、法术爆发、增幅/脆弱、连击与其他技能术语 ID；`ba.poise` 数值颜色更新为 `#FFAE6B`

关键文件：

- [`src/lib/richText.ts`](C:/Code/Endfield_skill_pic/src/lib/richText.ts)
- [`src/data/gameRichText.ts`](C:/Code/Endfield_skill_pic/src/data/gameRichText.ts)
- [`src/lib/richText.test.ts`](C:/Code/Endfield_skill_pic/src/lib/richText.test.ts)
- [`public/assets/richtext`](C:/Code/Endfield_skill_pic/public/assets/richtext)

### 技能卡视觉还原

当前已实现：

- 卡片内部按 400px 编排，PNG 输出统一缩放为 360px 基准宽度
- 内容超长自动增高
- 深色背景、边框、分割线和透明圆角
- 左上角黄色圆环与装饰贴图
- 等级 Lv9 的三块 SVG 图标
- Rank 文字和等级装饰条
- 独立灰色空心圆环
- Rank 长条右端坐标固定，长条从圆环右侧开始
- 长条左侧约 33% 区域带 4 道不规则裂纹
- 右上角双向上折线图标
- 1x/2x PNG 导出

### 字体与底部数值

完整问题记录与排查方法见 [`docs/FONT_RENDERING.md`](C:/Code/Endfield_skill_pic/docs/FONT_RENDERING.md)。

- 正文：`HarmonyOS Sans SC Regular`，`14.8px`，行高 `1.22`，颜色 `#D6D6D6`，无文字描边。
- 标题、Rank、类型等中文 UI：优先使用游戏资源中的 `defaultfont_cn.ttf`（CSS 名称 `Endfield Default CN`）。
- 底部数字：`Novecento Sans Wide Normal`，`21.5px`，使用普通数字形式，禁止 `tabular-nums`/`tnum`，否则数字 `1` 的字形会错误。
- 中文单位：与数字拆分渲染，例如 `15秒` 会拆为 `15` 和 `秒`；“秒”使用 HarmonyOS Sans SC Regular，`18px`。
- 右侧数值上移 `1px`，右边距 `9px`。
- `defaultfont_cn.ttf` 和 Novecento Webfont 因授权/再分发限制不提交到公开仓库，需由使用者合法取得后放入 `public/assets/fonts/`。

关键文件：

- [`src/components/SkillCard.tsx`](C:/Code/Endfield_skill_pic/src/components/SkillCard.tsx)
- [`src/styles.css`](C:/Code/Endfield_skill_pic/src/styles.css)

### 数据与导出

- 六卡固定槽位数据模型
- 本地草稿保存
- SkillPack v1 JSON 校验与迁移
- 预览 DOM 与导出 DOM 共用渲染逻辑
- PNG 导出失败时保留当前数据并显示错误

## 最近视觉参数

Rank 装饰条相关 CSS 当前约定：

- 长条容器：`left: 34px`、`width: 40px`
- 原始贴图：75×6，使用 `left: -19px` 裁掉左侧伪装饰
- 灰色圆环：6×6，边框 1.5px，半透明白色
- 裂纹横向位置：约 2px、5px、9px、12px，集中在长条左侧三分之一

## 验证结果

最后一次验证通过：

```powershell
npm run typecheck
npm test -- --run
npm run build
```

测试结果：

- 3 个测试文件通过
- 共 40 个测试通过
- TypeScript 检查通过
- Vite 生产构建通过

## 本地启动

```powershell
cd C:\Code\Endfield_skill_pic
npm install
npm run dev -- --host 127.0.0.1
```

预览地址：

<http://localhost:4173/>

交接检查时，4173 端口没有持续监听；如页面无法访问，需要重新执行启动命令。

## Tauri 构建

项目已有 `src-tauri` 目录和 Tauri 配置，已完成 Windows 便携 EXE 与 NSIS 安装包构建。发布构建会使用透明应用图标，并通过 Windows GUI 子系统隐藏控制台窗口。

Windows：

```powershell
$env:Path = "C:/Users/otae/.cargo/bin;" + $env:Path
npx tauri build --bundles nsis
```

发布产物位于 `src-tauri/target/release/skill-card-forge.exe` 和
`src-tauri/target/release/bundle/nsis/六卡技能展示生成器_0.1.0_x64-setup.exe`。

Android 首次初始化与构建：

```powershell
npx tauri android init
npx tauri android build
```

构建前需要准备 Rust、Windows WebView2、Android Studio、Android SDK、NDK、Java 和 Rust Android targets。当前第一版不包含 iOS。

## 尚未完成事项

- MSI 打包依赖 WiX 工具链；当前已验证 NSIS 安装包和便携 EXE，发布时优先使用 NSIS
- 尚未实际构建 Android APK
- 六张用户截图的 golden fixture 视觉测试尚未完全自动化
- 后续若游戏新增术语，按 `skill_term_tag_mapping.md` 先补充 `GAME_RICH_TEXT_TERM_IDS`、离线样式元数据和对应 `AUTO_RULES`，并为 `<#>`/`<@>` 各补一条回归测试
- HarmonyOS Sans SC 字体及许可已嵌入；游戏提取的 `defaultfont_cn.ttf` 与 Novecento Webfont 不随公开仓库分发，使用者需合法取得后放入 `public/assets/fonts/`

## 推荐接手顺序

1. 启动 Vite 服务并刷新预览页。
2. 输入包含“脆弱、附着、增幅”的正文，确认颜色和图标。
3. 对照用户截图继续调整 Rank 区域和正文换行。
4. 修改后运行类型检查、测试和生产构建。
5. 工具链准备好后，再进行 Tauri Windows 和 Android 构建。
