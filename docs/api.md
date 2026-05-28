# 项目接口与数据文档

本文档记录当前项目中前端和后端之间的接口约定，以及前端本地 JSON 数据格式。

## 基础信息

- 前端服务地址：`http://localhost:5500`
- 后端服务地址：`http://localhost:3001`
- 后端接口前缀：`/api`
- 认证方式：暂无
- 请求数据格式：
  - 普通数据读取：`application/json`
  - 生活日记发布：`multipart/form-data`

说明：

- 首页、音乐、学习模块只依赖前端静态服务。
- 生活模块的日记读取、发布、图片上传、删除依赖后端服务。
- 后端上传图片会保存在 `backend/uploads/`，并通过 `/uploads` 路径暴露给前端访问。

## 生活日记接口

### 获取日记列表

```http
GET /api/life/diaries
```

用途：获取所有生活日记数据。

请求参数：无

成功响应：

```json
[
  {
    "id": 1,
    "mood": "🥰",
    "title": "今日工作",
    "content": "今天完成了生活板块页面。",
    "imageUrl": "/uploads/example.jpg",
    "imageRatio": "1.5",
    "createdAt": "Thu May 28 2026 18:00:00 GMT+0800 (中国标准时间)"
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
| imageUrl | string \| null | 图片相对地址 |
| imageRatio | string \| null | 图片宽高比 |
| createdAt | string | 创建时间 |

前端图片访问方式：

```js
const imageSrc = "http://localhost:3001" + imageUrl;
```

### 发布日记

```http
POST /api/life/diaries
```

用途：发布一条生活日记，可选择上传图片。

请求类型：`multipart/form-data`

请求字段：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| mood | string | 否 | 心情表情，默认值为 `🥰` |
| title | string | 否 | 日记标题 |
| content | string | 否 | 日记正文 |
| image | file | 否 | 上传图片，字段名固定为 `image` |
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
  "title": "今日工作",
  "content": "今天完成了生活板块页面。",
  "imageUrl": "/uploads/example.jpg",
  "imageRatio": "1.5",
  "createdAt": "Thu May 28 2026 18:00:00 GMT+0800 (中国标准时间)"
}
```

常见错误响应：

```json
{
  "message": "title/content/image required"
}
```

```json
{
  "message": "Only image files are allowed"
}
```

```json
{
  "message": "image size must be <= 2MB"
}
```

### 删除日记

```http
DELETE /api/life/diaries/:id
```

用途：删除指定 id 的生活日记。

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

错误响应示例：

```json
{
  "message": "invalid id"
}
```

说明：

- 删除日记时，如果该日记存在图片，后端会尝试同步删除本地图片文件。
- 当前删除接口无二次确认逻辑，前端需要自行控制删除确认或编辑模式。

## 前端本地数据格式

以下数据由前端通过 `fetch` 读取本地 JSON 文件，不属于后端接口。

### 音乐数据

文件路径：

```text
json/music.json
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
- 如果本地没有保存数据，再读取 `json/music.json`。

### 学习笔记数据

文件路径：

```text
json/study.json
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

生活模块联调时建议检查：

- 前端服务是否启动：`npm run dev:web`
- 后端服务是否启动：`npm run dev:api`
- `GET /api/life/diaries` 是否能返回数组
- 发布日记时 `FormData` 字段名是否为 `image`
- 上传图片是否小于 `2MB`
- 返回的 `imageUrl` 是否能通过 `http://localhost:3001/uploads/...` 访问

学习模块调试时建议检查：

- `json/study.json` 是否是合法 JSON
- `category` 是否和 `data-category` 一致
- `render.js` 中查询的容器类名是否为 `.studyNotesList`
