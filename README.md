# ZJL Blog

一个用于练习前端三件套和基础后端能力的个人博客项目。

项目目前以原生 `HTML`、`CSS / Less` 和 `JavaScript` 为主，配合 `Express`、`SQLite` 完成部分生活日记数据存储。主要目标是通过真实页面练习布局、模块化、DOM 操作、事件处理、数据渲染、本地存储、接口请求和文件上传。

## 项目简介

这是我的个人博客练习项目，页面包含首页、生活、音乐、学习等模块。

目前音乐模块用于练习本地 JSON 渲染、编辑模式和 `localStorage` 持久化；生活模块用于练习后端接口、图片上传和 SQLite 数据存储；学习模块用于沉淀学习笔记，并通过 `json/study.json` 渲染笔记列表和分类筛选。

这个项目不会一开始就追求“大而全”，更像是一个持续迭代的前端练习场：边写边学，边改边沉淀。

## 技术栈

- `HTML5`
- `CSS3`
- `Less`
- `JavaScript ES Modules`
- `localStorage`
- `fetch`
- `Express`
- `SQLite`
- `Multer`

项目依赖中目前包含：

- `jquery`
- `swiper`
- `express`
- `sqlite3`
- `multer`
- `cors`
- `live-server`

## 已实现功能

- 顶部导航切换不同页面模块
- 首页快捷入口跳转到对应模块
- 音乐收藏卡片渲染
- 从 `json/music.json` 读取默认音乐数据
- 新增音乐收藏
- 编辑模式下选择音乐卡片
- 删除选中的音乐卡片
- 将选中的音乐卡片移动到最前或最后
- 使用 `localStorage` 保存本地修改
- 生活日记从后端接口读取
- 发布生活日记并上传图片
- 编辑模式下选择生活日记卡片
- 删除选中的生活日记
- 学习笔记从 `json/study.json` 读取并渲染
- 学习笔记按分类筛选
- 使用模块化 JavaScript 拆分首页、导航、音乐、生活、学习等逻辑

## 项目结构

```text
ZJL-Blog/
├─ index.html              # 页面入口
├─ package.json            # 项目依赖配置
├─ README.md               # 项目说明
├─ css/                    # 编译后的样式文件
│  ├─ reset.css
│  └─ index.css
├─ less/                   # Less 源文件
│  ├─ common.less
│  ├─ home.less
│  ├─ index.less
│  ├─ life.less
│  ├─ layout.less
│  ├─ model.less
│  ├─ music.less
│  └─ study.less
├─ js/                     # JavaScript 源码
│  ├─ main.js
│  └─ modules/
│     ├─ home/
│     ├─ life/
│     ├─ music/
│     ├─ nav/
│     ├─ study/
│     └─ utils/
├─ json/
│  ├─ music.json           # 默认音乐数据
│  └─ study.json           # 默认学习笔记数据
├─ backend/                # 生活日记后端服务
│  └─ src/
│     ├─ app.js
│     ├─ server.js
│     ├─ config/
│     ├─ controllers/
│     ├─ middleware/
│     ├─ models/
│     └─ routes/
├─ assets/                 # 上传或用户相关资源
└─ imgs/                   # 图片资源
```

## 本地运行

由于项目使用了 `type="module"` 和 `fetch` 读取本地 JSON，建议通过本地服务器运行，不建议直接双击打开 `index.html`。

安装依赖：

```bash
npm install
```

启动前端页面：

```bash
npm run dev:web
```

启动生活日记后端接口：

```bash
npm run dev:api
```

说明：

- 首页、音乐、学习模块只需要前端服务器即可运行。
- 生活模块的日记读取、发布、图片上传和删除依赖后端服务。
- 修改 Less 后，需要把 `less/index.less` 编译到 `css/index.css`。

## 后续计划

- 继续优化学习模块的布局、分类筛选和笔记展示
- 优化移动端适配
- 补充博客文章列表和文章详情页
- 增加更多交互效果
- 优化音乐模块的表单校验和编辑体验
- 整理 Less 编译脚本
- 继续沉淀前端学习笔记

## 项目定位

这个项目主要用于个人学习和练习，不是完整的生产级博客系统。它会随着我对前端基础、工程化和交互设计理解的提升不断更新。

慢慢写，慢慢改，慢慢把它变成一个真正属于自己的博客。
