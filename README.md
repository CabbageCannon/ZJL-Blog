# ZJL Blog

ZJL Blog 是一个用于练习前端基础、后端接口和完整业务闭环的个人博客项目。项目从静态页面出发，逐步接入登录注册、用户资料、生活日记、图片上传、私有对象存储、数据库和线上部署。

项目当前前端使用原生 `HTML5`、`Less`、`JavaScript ES Modules`，后端使用 `Express`，认证使用 `JWT + bcryptjs`，结构化数据存储在 `Postgres`，图片文件存储在 `Supabase Storage` 私有桶中，并通过后端生成签名 URL 返回给前端展示。

## 在线预览

- 前端页面：<https://zjl-blog.netlify.app>
- 后端接口：`https://zjl-blog-api.onrender.com`

## 项目定位

这个项目主要用于个人学习和面试展示，不是完整的生产级博客系统。它更像一个持续迭代的练习项目：

- 通过原生 JavaScript 练习 DOM、事件、模块拆分、状态管理和数据渲染。
- 通过 Express 练习 REST API、路由、中间件、错误处理和文件上传。
- 通过 JWT、Postgres、Supabase Storage 练习登录鉴权、数据隔离和私有图片访问。
- 通过 Netlify 和 Render 练习前后端分离部署。

## 技术栈

### 前端

- `HTML5`
- `Less`
- `CSS3`
- `JavaScript ES Modules`
- `fetch`
- `localStorage`
- `FormData`

### 后端

- `Node.js`
- `Express`
- `cors`
- `jsonwebtoken`
- `bcryptjs`
- `multer`
- `pg`
- `@supabase/supabase-js`

### 存储与部署

- `Postgres`：保存用户、日记、图片路径等结构化数据。
- `Supabase Storage`：保存头像和日记图片，使用私有桶。
- `Netlify`：托管前端静态资源。
- `Render`：运行 Express API 服务。

## 已实现功能

### 首页

- 项目介绍和能力展示。
- 快捷入口跳转到生活、音乐、学习等模块。
- 基于 hash 的模块切换。

### 用户认证

- 用户注册。
- 用户登录。
- JWT 登录态保存。
- 获取当前用户信息。
- 退出登录。
- 更新昵称。
- 上传头像。
- 头像使用 Supabase 私有桶保存，并通过 signed URL 展示。

### 生活日记

- 登录后读取当前用户自己的日记。
- 发布日记，支持标题、内容、心情和图片。
- 前端压缩图片并计算图片比例。
- 后端接收 `multipart/form-data`，上传图片到 Supabase Storage。
- 数据库只保存图片路径，接口返回前生成 signed URL。
- 编辑模式下选择日记卡片。
- 删除选中的日记。
- 删除日记时同步清理 Storage 中对应图片。

### 音乐收藏

- 从本地 JSON 读取默认音乐数据。
- 新增音乐收藏。
- 编辑模式下选择音乐卡片。
- 删除选中的音乐卡片。
- 将选中的音乐卡片移动到最前或最后。
- 使用 `localStorage` 保存本地修改。
- 点击卡片更新唱片台预览。

### 学习笔记

- 从 `frontend/json/study.json` 读取学习笔记。
- 渲染学习笔记列表。
- 按分类筛选笔记。

### 前端结构优化

- 使用 `header`、`nav`、`main`、`section`、`button`、`form`、`label` 等标签整理静态页面语义。
- 导航使用 `data-page`，首页快捷入口使用 `data-target`。
- 表单提交逻辑逐步从按钮 `click` 调整为监听 `submit` 事件。

## 项目结构

```text
ZJL-Blog/
├─ README.md
├─ package.json
├─ docs/
│  ├─ api.md                 # 接口与数据文档
│  └─ icons.md               # 图标系统说明
├─ frontend/
│  ├─ index.html
│  ├─ assets/
│  │  └─ icons/
│  │     └─ sprite.svg
│  ├─ css/
│  │  ├─ reset.css
│  │  └─ index.css
│  ├─ imgs/
│  │  └─ defaultTouxiang.png
│  ├─ json/
│  │  ├─ music.json
│  │  └─ study.json
│  ├─ js/
│  │  ├─ main.js
│  │  ├─ config/
│  │  └─ modules/
│  │     ├─ auth/
│  │     ├─ home/
│  │     ├─ life/
│  │     ├─ music/
│  │     ├─ nav/
│  │     ├─ router/
│  │     ├─ settings/
│  │     ├─ study/
│  │     └─ utils/
│  └─ less/
│     ├─ common.less
│     ├─ icons.less
│     ├─ layout.less
│     ├─ auth.less
│     ├─ home.less
│     ├─ life.less
│     ├─ music.less
│     ├─ settings.less
│     ├─ study.less
│     └─ index.less
└─ backend/
   └─ src/
      ├─ app.js
      ├─ server.js
      ├─ config/
      ├─ controllers/
      ├─ middleware/
      ├─ models/
      ├─ routes/
      └─ utils/
```

## 本地运行

安装依赖：

```bash
npm install
```

启动前端页面：

```bash
npm run dev:web
```

启动后端接口：

```bash
npm run dev:api
```

前端本地地址：

```text
http://localhost:5500
```

后端本地地址：

```text
http://localhost:3001
```

## 环境变量

后端运行前需要配置环境变量。常见变量包括：

```text
DATABASE_URL=postgres connection string
JWT_SELECT=jwt secret
SUPABASE_URL=supabase project url
SUPABASE_SERVICE_ROLE_KEY=supabase service role key
SUPABASE_STORAGE_BUCKET=diary image bucket
SUPABASE_AVATAR_BUCKET=avatar image bucket
NODE_ENV=development | production
```

说明：

- `DATABASE_URL` 用于连接 Postgres。
- `JWT_SELECT` 用于签发和验证 JWT。
- `SUPABASE_STORAGE_BUCKET` 用于生活日记图片。
- `SUPABASE_AVATAR_BUCKET` 用于用户头像。
- Supabase bucket 当前按私有桶设计，前端通过后端生成的 signed URL 访问图片。

## 接口文档

接口路径、请求字段、响应格式和本地 JSON 数据格式见：

- [docs/api.md](docs/api.md)

## 开发说明

- 前端使用 `type="module"` 和 `fetch`，建议通过本地服务器访问，不建议直接双击打开 HTML。
- 修改 Less 后，需要重新编译 `frontend/less/index.less` 到 `frontend/css/index.css`。
- 生活日记、账号资料、头像上传等功能依赖后端服务和登录态。
- 音乐模块主要依赖本地 JSON 和 `localStorage`，不依赖后端接口。

## 后续计划

- 整理 Less 编译脚本，减少手动编译成本。
- 完善表单校验和错误提示。
- 补充接口测试和关键前端逻辑测试。
- 完善移动端布局。
- 增加博客文章列表和文章详情页。
- 根据项目复杂度评估是否迁移到 Vue 或 React。
