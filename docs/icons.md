# 本地图标系统

这个项目使用本地 SVG sprite 管理图标，资源文件在：

```text
assets/icons/sprite.svg
```

基础样式文件在：

```text
less/icons.less
```

动态图标创建工具在：

```text
js/modules/utils/createIcon.js
```

`icons.less` 已经接入 `less/index.less`：

```less
@import "./icons.less";
```

## 基本用法

有文字的按钮或链接：

```html
<button class="iconTextButton">
  <svg class="iconSvg iconSvg--md" aria-hidden="true">
    <use href="./assets/icons/sprite.svg#icon-add"></use>
  </svg>
  <span>上传</span>
</button>
```

只有图标的按钮必须写 `aria-label`：

```html
<button class="iconOnlyButton" aria-label="关闭">
  <svg class="iconSvg iconSvg--md" aria-hidden="true">
    <use href="./assets/icons/sprite.svg#icon-close"></use>
  </svg>
</button>
```

纯装饰图标使用 `aria-hidden="true"`，不要让读屏软件重复朗读。

## JavaScript 中使用

动态渲染 DOM 时，优先使用工具函数：

```js
import { createIcon } from "../utils/createIcon.js";

button.append(createIcon("icon-play", "iconSvg iconSvg--sm"), textNode);
```

## 图标清单

导航：

```text
icon-home
icon-life
icon-music
icon-study
```

通用操作：

```text
icon-add
icon-upload
icon-edit
icon-delete
icon-close
icon-check
```

账号：

```text
icon-login
icon-logout
icon-user
```

音乐：

```text
icon-play
icon-external-link
icon-feedback
icon-move-first
icon-move-last
```

学习：

```text
icon-note
icon-code
icon-css
icon-js
icon-server
icon-grid
```

状态：

```text
icon-empty
icon-warning
```

## 使用原则

- 图标默认跟随文字颜色，也就是 `currentColor`。
- 有文字的按钮中，图标只做辅助，不替代文字。
- 只有图标的按钮必须添加 `aria-label`。
- 删除、失败、警告类图标可以使用 `.iconDanger`。
- 普通弱提示图标可以使用 `.iconMuted`。
- 主要操作图标可以使用 `.iconPrimary`。
- 不要给图标单独添加复杂动效，交互反馈优先放在按钮本身。
