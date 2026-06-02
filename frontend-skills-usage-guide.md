# 前端美观类 Skills 使用指南

这份文档整理了 `impeccable`、`baseline-ui`、`gpt-taste` 这三个 skill 的日常使用方法。重点不是记住 skill 的所有规则，而是学会怎么向 Codex 提需求。

## 1. 三个 Skill 分别适合什么

### impeccable

适合日常前端页面设计和打磨。你可以把它理解成一个“产品级 UI 设计与实现助手”。

适合用于：

- 从零设计页面
- 优化已有页面的视觉层级、布局、排版、颜色、动效
- 对页面做审美点评
- 最终上线前的 polish
- 调整页面风格：更大胆、更克制、更清晰、更有品牌感

常用关键词：

- `impeccable craft`：设计并实现一个完整页面
- `impeccable shape`：先做设计方向，不急着改代码
- `impeccable critique`：审查页面哪里丑、哪里不专业
- `impeccable polish`：最终视觉打磨
- `impeccable layout`：优化布局、间距、栅格、响应式
- `impeccable typeset`：优化标题、正文、按钮文字、数字排版
- `impeccable colorize`：优化颜色系统
- `impeccable bolder`：让页面更大胆、更有视觉冲击
- `impeccable quieter`：让页面更克制、更高级

### baseline-ui

适合做 UI 质量检查。它更像一个“前端界面质检员”，重点不是惊艳设计，而是找基础问题。

适合用于：

- 检查可访问性
- 检查按钮、图标、表单、弹窗是否规范
- 检查 Tailwind / CSS 写法是否容易出问题
- 检查移动端布局、空状态、加载状态
- 检查动画性能、层级、z-index、焦点管理
- 在页面完成后做最后一轮基础质量验收

### gpt-taste

适合解决“页面有 AI 味、太模板、太平庸、太丑”的问题。它通常比 `impeccable` 更激进，更强调视觉品味、设计张力和反模板化。

适合用于：

- landing page
- 作品集
- 官网首页
- 视觉展示型页面
- 想要更高级、更有记忆点的页面
- 不想要常见 AI 生成页面风格时

不太适合：

- 纯后台管理系统
- 表格密集型工作台
- 需要极度朴素、稳定、业务优先的内部系统

## 2. 推荐使用顺序

日常开发推荐顺序：

1. 先用 `impeccable` 或 `gpt-taste` 做设计方向。
2. 再让 Codex 实现代码。
3. 用 `baseline-ui` 做 UI 基础质检。
4. 用 `playwright` 打开页面截图检查。
5. 根据截图继续微调。

推荐一句话：

```text
帮我把这个页面做美观一点：用 impeccable 设计和实现，用 baseline-ui 做规则检查，用 playwright 截图检查桌面端和移动端，不好看的地方继续改。
```

如果你想要更大胆、更有设计感：

```text
帮我重做这个页面：用 gpt-taste 提升审美和视觉记忆点，用 baseline-ui 做基础质检，最后用 playwright 截图验收。
```

## 3. impeccable 常用对话模板

### 从零设计页面

```text
用 impeccable craft 帮我做这个页面。先读取项目现有样式和组件，不要直接套模板。先给我设计方向，然后实现代码，最后用 playwright 截图检查桌面端和移动端。
```

### 只要设计方案，先不改代码

```text
用 impeccable shape 给这个页面做一版视觉和交互方案。先不要改代码，只告诉我布局、颜色、字体、组件层级和动效建议。
```

### 审查页面为什么不好看

```text
用 impeccable critique 审查当前页面，重点看视觉层级、间距、排版、颜色、移动端表现和 AI 味。先列问题和优先级，不要改代码。
```

### 直接打磨已有页面

```text
用 impeccable polish 打磨当前页面。保留功能逻辑，重点优化布局、字体层级、间距、颜色、空状态和移动端。完成后用 playwright 截图验收。
```

### 只优化布局

```text
用 impeccable layout 优化这个页面的栅格、留白、对齐、响应式和视觉节奏。不要改变业务逻辑。
```

### 只优化文字排版

```text
用 impeccable typeset 优化这个页面的标题、正文、按钮文字和数字展示，不要大改布局。
```

### 让页面更大胆

```text
用 impeccable bolder 改这个 landing page。不要用常见的三卡片模板，不要紫蓝渐变，给它更强的品牌感和视觉记忆点。
```

### 让页面更克制高级

```text
用 impeccable quieter 把这个页面改得更克制、更高级。减少装饰，强化排版、留白、内容层级和可读性。
```

## 4. baseline-ui 常用对话模板

### 只检查，不改代码

```text
用 baseline-ui 审查这个页面，列出违反规则的代码片段、为什么有问题、以及具体怎么修。先不要改代码。
```

### 直接修基础 UI 问题

```text
用 baseline-ui 修复当前页面里的 UI 基础问题：可访问性、移动端布局、动画性能、icon-only button 的 aria-label、排版、z-index、空状态。不要改变整体视觉方向。
```

### 检查组件质量

```text
用 baseline-ui 检查这个组件是否符合前端 UI 基础规范，重点看键盘操作、焦点管理、aria-label、错误提示、loading 状态和 disabled 状态。
```

### 写一个规范组件

```text
用 baseline-ui 约束来写这个弹窗组件。必须支持键盘操作、焦点管理、aria-label、错误提示靠近触发位置，不要手写复杂 focus 行为。
```

### 页面完成后的验收

```text
用 baseline-ui 给这个页面做最后验收，检查可访问性、响应式、空状态、错误状态、loading 状态、按钮文案和动画性能。有问题就修。
```

## 5. gpt-taste 常用对话模板

### 去掉 AI 味

```text
用 gpt-taste 重做这个首页视觉。目标是高级、现代、有设计感，但不要 AI 紫色渐变、不要三等分功能卡片、不要 SECTION 01 这种标签。先给方向，再改代码，最后截图检查。
```

### 做 landing page

```text
用 gpt-taste 做一个高端 landing page。结构按 Attention、Interest、Desire、Action 来组织。Hero 标题桌面端最多 2 到 3 行，主 CTA 首屏可见，移动端不能溢出。
```

### 重构一个普通页面

```text
用 gpt-taste 审查这个页面哪里有 AI 味，然后直接重构视觉。保留路由、表单字段、接口逻辑和核心文案，不要偷偷改功能。
```

### 加强视觉冲击

```text
用 gpt-taste 给这个页面做更强的视觉方向。需要有明确的主视觉、清晰的层级和更有记忆点的布局，不要只是换颜色和加圆角。
```

### 增加高级动效

```text
用 gpt-taste 给这个页面加高级动效。如果需要 GSAP，先检查项目有没有安装；没有的话先问我。动效要服务内容，不要为了炫技。
```

## 6. 最适合你的日常固定提示词

### 新页面

```text
帮我做这个新页面。先用 impeccable 做设计方向和组件规划，再实现代码；完成后用 baseline-ui 做 UI 质检，用 playwright 截图检查桌面端和移动端，发现不美观或错位就继续改。
```

### 已有页面变好看

```text
这个页面太丑了。请用 impeccable polish 重新打磨，必要时参考 gpt-taste 的审美标准。保留功能逻辑，重点优化布局、排版、色彩、按钮、卡片、移动端和空状态。最后用 playwright 截图验收。
```

### Landing Page 或展示型页面

```text
这是一个展示型页面。请用 gpt-taste 做更有设计感的版本，避免模板感和 AI 味；实现后用 baseline-ui 检查基础 UI 质量，再用 playwright 截图检查。
```

### 后台管理系统

```text
这是一个后台管理页面。不要做花哨的 landing page 风格。用 impeccable quieter 优化信息密度、对齐、表格、筛选区、按钮层级和状态反馈，再用 baseline-ui 做质检。
```

### 只想先听建议

```text
先不要改代码。请用 impeccable critique 和 gpt-taste 的审美标准，分析这个页面为什么不好看，并给我一个按优先级排序的修改计划。
```

## 7. 使用时的关键约束

每次让 Codex 用这些 skill 时，最好补充这些约束：

```text
保留现有功能逻辑，不要改接口和路由。
```

```text
不要使用常见 AI 风格：紫蓝渐变、发光球、三卡片模板、SECTION 01 标签、过度圆角。
```

```text
移动端必须正常显示，文字不能溢出，按钮不能挤在一起。
```

```text
完成后必须用 playwright 截图检查桌面端和移动端。
```

```text
如果要新增依赖，先问我。
```

## 8. 推荐组合

### 最稳组合

```text
impeccable + baseline-ui + playwright
```

适合日常前端作业、练习项目、管理系统、普通应用页面。

### 更好看组合

```text
gpt-taste + impeccable + playwright
```

适合首页、作品集、官网、展示型页面。

### 最严格组合

```text
gpt-taste + impeccable + baseline-ui + playwright
```

适合你明确说“这个页面必须好看一点，不要普通”的时候。

## 9. 一句话记忆

如果你不知道该怎么说，就直接说：

```text
请用 gpt-taste 提升审美，用 impeccable 具体实现和打磨，用 baseline-ui 做 UI 质检，最后用 playwright 截图验收。
```

