# 项目接口与数据文档

本文档记录 ZJL Blog 当前前端与后端之间的接口约定，以及前端本地 JSON 数据格式。

## 基础信息

### 本地环境

- 前端服务地址：`http://localhost:5500`
- 后端服务地址：`http://localhost:3001`
- 后端接口前缀：`/api`

### 生产环境

- 前端地址：`https://zjl-blog.netlify.app`
- 后端地址：`https://zjl-blog-api.onrender.com`

前端会根据 `location.hostname` 自动选择接口地址：

```js
const LOCAL_API_URL = "http://localhost:3001";
const PROD_API_URL = "https://zjl-blog-api.onrender.com";
```

## 通用约定

### 认证方式

需要登录的接口使用 JWT：

```http
Authorization: Bearer <token>
```

登录和注册接口会返回 `token`。前端保存 token 后，在访问用户信息、生活日记、头像上传等接口时放到请求头中。

### 请求格式

- JSON 请求：`Content-Type: application/json`
- 文件上传：`multipart/form-data`

使用 `FormData` 上传文件时，不要手动设置 `Content-Type`，浏览器会自动带上 boundary。

### 图片访问方式

头像和生活日记图片存储在 Supabase Storage 私有桶中。数据库只保存图片路径，例如：

```text
user-1/1780412300277-b1f03d1f4a354.webp
```

接口返回前，后端会通过 Supabase 生成 signed URL，并放到 `imageUrl` 字段中。

signed URL 当前有效期为 1 小时。

## 认证接口

接口前缀：`/api/auth`

### 注册

```http
POST /api/auth/register
```

用途：创建新用户。

请求头：

```http
Content-Type: application/json
```

请求体：

```json
{
  "username": "zjl",
  "password": "123456",
  "nickname": "ZJL"
}
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| username | string | 是 | 用户名，不能重复 |
| password | string | 是 | 密码，至少 6 位 |
| nickname | string | 否 | 昵称 |

成功响应：

```json
{
  "user": {
    "id": 1,
    "username": "zjl",
    "nickname": "ZJL",
    "createdAt": "Sun Jun 21 2026 15:00:00 GMT+0800 (中国标准时间)",
    "imagePath": null,
    "imageUrl": null
  },
  "token": "jwt token"
}
```

常见错误：

```json
{ "message": "用户名和密码不能为空" }
```

```json
{ "message": "密码至少需要 6 位" }
```

```json
{ "message": "用户名已存在" }
```

### 登录

```http
POST /api/auth/login
```

用途：校验用户名和密码，返回用户信息和 token。

请求头：

```http
Content-Type: application/json
```

请求体：

```json
{
  "username": "zjl",
  "password": "123456"
}
```

成功响应：

```json
{
  "user": {
    "id": 1,
    "username": "zjl",
    "nickname": "ZJL",
    "createdAt": "Sun Jun 21 2026 15:00:00 GMT+0800 (中国标准时间)",
    "imagePath": "user-1/avatar.webp",
    "imageUrl": "https://...signed-url..."
  },
  "token": "jwt token"
}
```

常见错误：

```json
{ "message": "用户名和密码不能为空" }
```

```json
{ "message": "用户名或密码错误" }
```

### 获取当前用户

```http
GET /api/auth/me
```

用途：通过 token 获取当前登录用户信息。

请求头：

```http
Authorization: Bearer <token>
```

成功响应：

```json
{
  "user": {
    "id": 1,
    "username": "zjl",
    "nickname": "ZJL",
    "createdAt": "Sun Jun 21 2026 15:00:00 GMT+0800 (中国标准时间)",
    "imagePath": "user-1/avatar.webp",
    "imageUrl": "https://...signed-url..."
  }
}
```

常见错误：

```json
{ "message": "未登录" }
```

```json
{ "message": "登录已过期" }
```

```json
{ "message": "用户不存在" }
```

### 更新昵称

```http
PATCH /api/auth/me
```

用途：更新当前用户昵称。

请求头：

```http
Content-Type: application/json
Authorization: Bearer <token>
```

请求体：

```json
{
  "nickname": "新的昵称"
}
```

成功响应：

```json
{
  "user": {
    "id": 1,
    "username": "zjl",
    "nickname": "新的昵称",
    "createdAt": "Sun Jun 21 2026 15:00:00 GMT+0800 (中国标准时间)",
    "imagePath": "user-1/avatar.webp",
    "imageUrl": "https://...signed-url..."
  },
  "token": "jwt token"
}
```

常见错误：

```json
{ "message": "昵称不能为空" }
```

```json
{ "message": "昵称不能超过 20 个字符" }
```

### 上传头像

```http
POST /api/auth/me/avatar
```

用途：上传并更新当前用户头像。

请求头：

```http
Authorization: Bearer <token>
```

请求类型：`multipart/form-data`

请求字段：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| avatar | file | 是 | 头像图片文件，字段名固定为 `avatar` |

成功响应：

```json
{
  "user": {
    "id": 1,
    "username": "zjl",
    "nickname": "ZJL",
    "createdAt": "Sun Jun 21 2026 15:00:00 GMT+0800 (中国标准时间)",
    "imagePath": "user-1/1780412300277-avatar.webp",
    "imageUrl": "https://...signed-url..."
  },
  "token": "jwt token"
}
```

说明：

- 后端使用 `multer.memoryStorage()` 接收图片。
- 图片上传到 Supabase 头像私有桶。
- 数据库保存 `imagePath`。
- 如果用户已有旧头像，新头像上传并写库成功后，后端会尝试删除旧头像。

常见错误：

```json
{ "message": "请选择头像图片" }
```

```json
{ "message": "Only image files are allowed" }
```

```json
{ "message": "image size must be <= 2MB" }
```

## 生活日记接口

接口前缀：`/api/life/diaries`

生活日记接口全部需要登录。

### 获取日记列表

```http
GET /api/life/diaries
```

用途：获取当前登录用户自己的生活日记。

请求头：

```http
Authorization: Bearer <token>
```

成功响应：

```json
[
  {
    "id": 1,
    "mood": "🥰",
    "title": "今日记录",
    "content": "今天完成了生活模块的接口联调。",
    "imagePath": "user-1/1780412300277-diary.webp",
    "imageUrl": "https://...signed-url...",
    "imageRatio": "1.5",
    "createdAt": "Sun Jun 21 2026 15:00:00 GMT+0800 (中国标准时间)"
  }
]
```

字段说明：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 日记 id |
| mood | string | 心情表情 |
| title | string | 日记标题 |
| content | string | 日记正文 |
| imagePath | string \| null | Supabase Storage 中的图片路径 |
| imageUrl | string \| null | 后端生成的 signed URL |
| imageRatio | string \| null | 图片宽高比 |
| createdAt | string | 创建时间 |

### 发布日记

```http
POST /api/life/diaries
```

用途：发布一条生活日记，可选择上传图片。

请求头：

```http
Authorization: Bearer <token>
```

请求类型：`multipart/form-data`

请求字段：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| mood | string | 否 | 心情表情，默认值为 `🙂` |
| title | string | 否 | 日记标题 |
| content | string | 否 | 日记正文 |
| image | file | 否 | 日记图片，字段名固定为 `image` |
| imageRatio | number/string | 否 | 图片宽高比，有图片时建议传入 |

校验规则：

- `title`、`content`、`image` 至少需要有一个。
- `image` 只能上传图片文件。
- `image` 文件大小不能超过 `2MB`。

成功响应：

```json
{
  "id": 1,
  "mood": "🥰",
  "title": "今日记录",
  "content": "今天完成了生活模块的接口联调。",
  "imagePath": "user-1/1780412300277-diary.webp",
  "imageUrl": "https://...signed-url...",
  "imageRatio": "1.5",
  "createdAt": "Sun Jun 21 2026 15:00:00 GMT+0800 (中国标准时间)"
}
```

说明：

- 后端会将图片上传到 Supabase 日记图片私有桶。
- 如果图片上传成功但数据库写入失败，后端会尝试清理已上传图片，避免产生无用文件。

常见错误：

```json
{ "message": "title/content/image required" }
```

```json
{ "message": "Only image files are allowed" }
```

```json
{ "message": "image size must be <= 2MB" }
```

### 删除日记

```http
DELETE /api/life/diaries/:id
```

用途：删除当前登录用户自己的指定日记。

请求头：

```http
Authorization: Bearer <token>
```

路径参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | number | 是 | 要删除的日记 id |

成功响应：

```json
{
  "success": true
}
```

常见错误：

```json
{ "message": "invalid id" }
```

```json
{ "message": "日记不存在或无权删除" }
```

说明：

- 删除时会同时校验 `id` 和当前用户 id，避免删除其他用户的日记。
- 如果该日记存在图片，数据库删除成功后，后端会尝试删除 Supabase Storage 中的图片。

## 前端本地数据格式

以下数据由前端通过 `fetch` 读取本地 JSON 文件，不属于后端接口。

### 音乐数据

文件路径：

```text
frontend/json/music.json
```

数据示例：

```json
[
  {
    "id": 1,
    "name": "歌曲名称",
    "cover": "https://example.com/cover.jpg",
    "link": "https://example.com"
  }
]
```

字段说明：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 音乐卡片 id |
| name | string | 歌曲名称 |
| cover | string | 封面图片地址 |
| link | string | 跳转播放地址 |

说明：

- 音乐模块会优先读取 `localStorage` 中保存的数据。
- 如果本地没有保存数据，再读取 `frontend/json/music.json`。

### 学习笔记数据

文件路径：

```text
frontend/json/study.json
```

数据示例：

```json
[
  {
    "id": 1,
    "title": "Less 样式拆分练习",
    "category": "CSS",
    "date": "2026-05-28",
    "summary": "整理 common、layout、home、study 等 Less 文件的职责。"
  }
]
```

字段说明：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | number | 学习笔记 id |
| title | string | 笔记标题 |
| category | string | 笔记分类 |
| date | string | 笔记日期 |
| summary | string | 笔记摘要 |

分类筛选说明：

- `category` 需要和学习卡片上的 `data-category` 保持一致。
- 当前已使用的分类包括：`CSS`、`JavaScript`、`后端基础`。
- `all` 是前端筛选用的特殊值，不需要写进 `study.json`。

## 联调检查清单

### 前端

- 前端服务是否启动：`npm run dev:web`
- `frontend/index.html` 是否通过本地服务器访问。
- 修改 Less 后是否重新生成 `frontend/css/index.css`。
- `frontend/js/config/apiConfig.js` 是否指向正确后端地址。

### 后端

- 后端服务是否启动：`npm run dev:api`
- `.env` 是否配置 `DATABASE_URL`。
- `.env` 是否配置 Supabase 相关变量。
- 数据库中是否存在 `users`、`diaries` 表。
- Supabase Storage 中是否存在头像桶和日记图片桶。

### 认证接口

- 注册是否能返回 `user` 和 `token`。
- 登录是否能返回 `user` 和 `token`。
- 带 token 请求 `/api/auth/me` 是否能返回当前用户。
- token 过期或缺失时是否返回 `401`。

### 生活日记接口

- `GET /api/life/diaries` 是否必须登录。
- 发布日记时 `FormData` 字段名是否为 `image`。
- 上传图片是否小于 `2MB`。
- 返回的 `imageUrl` 是否是 signed URL。
- 删除日记是否只能删除当前用户自己的数据。

### 本地 JSON

- `frontend/json/music.json` 是否是合法 JSON。
- `frontend/json/study.json` 是否是合法 JSON。
- 学习笔记的 `category` 是否和页面中的 `data-category` 一致。
