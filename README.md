# ZJL Blog

一个用于练习前端三件套的个人博客项目。

项目目前以原生 `HTML`、`CSS / Less` 和 `JavaScript` 为主，主要目标是通过真实页面练习布局、模块化、DOM 操作、事件处理、数据渲染和本地存储。后续会继续完善博客内容、页面功能和交互体验。

## 项目简介

这是我的个人博客练习项目，页面包含首页、生活、音乐、学习等模块。目前重点实现了音乐收藏模块，可以从本地 JSON 读取数据，并支持新增、编辑、删除和移动音乐卡片。

这个项目不会一开始就追求“大而全”，更像是一个持续迭代的前端练习场：边写边学，边改边沉淀。

## 技术栈

- `HTML5`
- `CSS3`
- `Less`
- `JavaScript ES Modules`
- `localStorage`
- `fetch`

项目依赖中目前包含：

- `jquery`
- `swiper`

后续如果页面交互或轮播模块需要，会继续接入和完善。

## 已实现功能

- 顶部导航切换不同页面模块
- 音乐收藏卡片渲染
- 从 `json/music.json` 读取默认音乐数据
- 新增音乐收藏
- 编辑模式下选择音乐卡片
- 删除选中的音乐卡片
- 将选中的音乐卡片移动到最前或最后
- 使用 `localStorage` 保存本地修改
- 使用模块化 JavaScript 拆分音乐、导航、请求和存储逻辑

## 项目结构

```text
ZJL-Blog/
├─ index.html              # 页面入口
├─ package.json            # 项目依赖配置
├─ css/                    # 编译后的样式文件
│  ├─ reset.css
│  └─ index.css
├─ less/                   # Less 源文件
│  ├─ common.less
│  ├─ index.less
│  ├─ layout.less
│  ├─ model.less
│  └─ music.less
├─ js/                     # JavaScript 源码
│  ├─ main.js
│  ├─ utils/
│  │  └─ request.js
│  └─ modules/
│     ├─ nav/
│     │  └─ index.js
│     └─ music/
│        ├─ api.js
│        ├─ event.js
│        ├─ index.js
│        ├─ render.js
│        ├─ state.js
│        └─ storage.js
├─ json/
│  └─ music.json           # 默认音乐数据
├─ assets/                 # 上传或用户相关资源
└─ imgs/                   # 图片资源
```

## 本地运行

由于项目使用了 `type="module"` 和 `fetch` 读取本地 JSON，建议通过本地服务器运行，不建议直接双击打开 `index.html`。

推荐方式：

1. 使用 VS Code 安装 `Live Server` 插件
2. 右键 `index.html`
3. 选择 `Open with Live Server`

如果需要安装依赖：

```bash
npm install
```

## 后续计划

- 完善首页、生活、学习模块内容
- 优化移动端适配
- 补充博客文章列表和文章详情页
- 增加更多交互效果
- 优化音乐模块的表单校验和编辑体验
- 整理 Less 编译流程
- 继续沉淀前端学习笔记

## 项目定位

这个项目主要用于个人学习和练习，不是完整的生产级博客系统。它会随着我对前端基础、工程化和交互设计理解的提升不断更新。

慢慢写，慢慢改，慢慢把它变成一个真正属于自己的博客。
