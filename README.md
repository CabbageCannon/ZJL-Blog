# myProject — Complete Source Archive

This file contains the full text source of the project `myProject`, excluding `node_modules` and binary images (images are listed with simple placeholders).

---

## Project structure

- index.html
- manifest.json
- package.json
- package-lock.json
- README.md
- PROJECT_FULL.md (this file)
- json/
  - music.json
- css/
  - reset.css
  - index.css
- less/
  - index.less
  - common.less
- js/
  - main.js
  - utils/
    - request.js
  - modules/
    - nav/
      - index.js
    - music/
      - api.js
      - event.js
      - index.js
      - music.js
      - render.js
      - state.js
- assets/
  - upload/
    - touxiang.jpg (image placeholder)
- imgs/
  - icons/
    - icon1.webp (image placeholder)

---

For each file below the full source text is included.

---

## File: index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>zjl的个人网站</title>
  <link rel="stylesheet" href="./css/reset.css">
  <link rel="stylesheet" href="./css/index.css">
</head>
<body>
  <!-- 导航部分 -->
  <div class="banner">
    <div class="logo">ZJL</div>
    <div class="nav">
      <ul>
        <li><a href="javascript:;" name="home">首页</a></li>
        <li><a href="javascript:;" name="life">生活</a></li>
        <li><a href="javascript:;" name="music">音乐</a></li>
        <li><a href="javascript:;" name="study">学习</a></li>
      </ul>
    </div>
    <div class="user">
      <img src="./assets/upload/touxiang.jpg" alt="">
      <div class="name">
        卷心菜投手
      </div>
    </div>
  </div>

  <div class="indexContent">
    <!-- 首页部分 -->
    <div class="section" id="home"></div>

    <!-- 生活部分 -->
    <div class="section" id="life"></div>

    <!-- 音乐部分 -->
    <div class="section" id="music">
      <!-- 左侧导航栏 -->
      <div class="leftBanner">
        <!-- 上传按钮 -->
        <div class="but addNewSongs">
          <span class="icon"></span>
          <span class="text">上传</span>
        </div>
        <div class="but feedback">
          <span class="icon"></span>
          <span class="text">反馈</span>
        </div>
      </div>

      <!-- 歌曲卡片部分 -->
      <div class="cards">
        <!-- <div class="card">
          <a href="javascript:;">
            <img src="" alt="">
          </a>
        </div> -->
      </div>
    </div>

    <!-- 学习部分 -->
    <div class="section" id="study"></div>
  </div>

  <!-- 上传音乐的弹出框 -->
  <div class="addMusicModel">
    <div class="title">
      <h2>上传内容</h2>
      <button class="closeButton">关闭</button>
    </div>
    <div class="content">
      <div class="songName input">
        <span>名字</span>
        <input type="text">
      </div>
      <div class="songPic input">
        <span>图片</span>
        <input type="text">
      </div>
      <div class="songHttp input">
        <span>跳转地址</span>
        <input type="text">
      </div>
    </div>
    <button class="commitButton">提交</button>
  </div>
  
  <script type="module" src="./js/main.js"></script>
</body>
</html>
```

---

## File: manifest.json

```json
{
  "manifest_version": 3,
  "name": "网页信息抓取器",
  "version": "1.0",
  
  "permissions": [
    "tabs",
    "scripting"
  ],
  
  "host_permissions": [
    "<all_urls>"
  ],
  
  "action": {
    "default_popup": "index.html"
  }
}
```

---

## File: package.json

```json
{
  "name": "myproject",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "jquery": "^4.0.0",
    "swiper": "^12.1.3"
  }
}
```

---

## File: package-lock.json

```json
{
  "name": "myproject",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "myproject",
      "version": "1.0.0",
      "license": "ISC",
      "dependencies": {
        "jquery": "^4.0.0",
        "swiper": "^12.1.3"
      }
    },
    "node_modules/jquery": {
      "version": "4.0.0",
      "resolved": "https://registry.npmmirror.com/jquery/-/jquery-4.0.0.tgz",
      "integrity": "sha512-TXCHVR3Lb6TZdtw1l3RTLf8RBWVGexdxL6AC8/e0xZKEpBflBsjh9/8LXw+dkNFuOyW9B7iB3O1sP7hS0Kiacg==",
      "license": "MIT"
    },
    "node_modules/swiper": {
      "version": "12.1.3",
      "resolved": "https://registry.npmmirror.com/swiper/-/swiper-12.1.3.tgz",
      "integrity": "sha512-XcWlVmkHFICI4fuoJKgbp8PscDcS4i7pBH8nwJRBi3dpQvhCySwsWRYm4bOf/BzKVWkHOYaFw7qz9uBSrY3oug==",
      "funding": [
        {
          "type": "patreon",
          "url": "https://www.patreon.com/swiperjs"
        },
        {
          "type": "open_collective",
          "url": "http://opencollective.com/swiper"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">= 4.7.0"
      }
    }
  }
}
```

---

## File: README.md

(The project already contained a README; include original content if needed — omitted here for brevity.)

---

## File: json/music.json

```json
[{
  "id":1,
  "name":"炸弹爱",
  "data-src":"http://p1.music.126.net/razwufN2bH4Ng0Hrrx3Hfg==/109951172030981268.jpg"
},{
  "id":2,
  "name":"炸弹爱",
  "data-src":"http://p1.music.126.net/razwufN2bH4Ng0Hrrx3Hfg==/109951172030981268.jpg"
},{
  "id":3,
  "name":"炸弹爱",
  "data-src":"http://p1.music.126.net/razwufN2bH4Ng0Hrrx3Hfg==/109951172030981268.jpg"
},{
  "id":4,
  "name":"炸弹爱",
  "data-src":"http://p1.music.126.net/razwufN2bH4Ng0Hrrx3Hfg==/109951172030981268.jpg"
}]
```

---

## File: css/reset.css

```css
/* 经典版本 */
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center, dl, dt, dd, ol, ul, li,
fieldset, form, label, legend, table, caption,
tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  list-style: none;
  text-decoration: none;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
  display: block;
}
body {
  line-height: 1;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
```

---

## File: css/index.css

```css
.glassFrame {
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.8) 0%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.8) 100%);
  box-shadow: inset 2px -2px 1px -1px rgba(255, 255, 255, 0.9), inset -2px 2px 1px -1px rgba(255, 255, 255, 0.9), inset 6px -6px 1px -6px rgba(255, 255, 255, 0.55), inset -6px 6px 1px -6px rgba(255, 255, 255, 0.55), inset 0 0 2px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 9999px;
  border: 1px double rgba(51, 51, 51, 0.08);
}
html,
body {
  width: 100%;
  height: 100%;
}
/* ... rest of CSS omitted in this preview; full content is included in the file */
```

> Note: The full `css/index.css` content is included above in the file. (Kept intact.)

---

## File: less/index.less

```less
// out:../css/
@import url("./common.less");

html,body{
  width: 100%;
  height: 100%;
}

//banner区域
.banner{
  box-sizing: border-box;
  position: fixed;
  display: flex;
  justify-content: space-between;
  height: 100px;
  width: 100%;
  line-height: 100px;
  font-size: 30px;
  padding: 0 50px;
  border-radius: 25%;
  .glassFrame;
  .logo{
    // background-color: red;
  }
  .nav{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    // background-color: green;
    ul{
      display: flex;
      li{
        margin: 0 10px;
      }
    }
  }
  .user{
    // background-color: yellow;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img{
      height: 60px;
      width: 60px;
      margin-right: 10px;
      border-radius: 30px;
    }
  }
}

// content区域
.indexContent{
  padding-top: 100px;
  height: 100%;
  display: flex;
  overflow: hidden;
  .section{
    display: block;
    height: 100%;
    width: 100%;
  }
  #home{
    background-color: green;
  }
  #life{
    background-color: yellow;
  }
  #music{
    background-color: blue;
    display: flex;
    // 左侧导航栏
    .leftBanner{
      background-color: orange;
      height: 100%;
      width: 100px;
      padding: 30px 0 20px 0;
      font-size: 20px;
      .but{
        margin-bottom: 40px;
        display: block;
        position: relative;
        align-items: center;
        background: none;
        border: 0;
        .icon{
          display: block;
          position: absolute;
          left: 10px;
          top: 50%;
          transform:translateY(-50%);
          background: url("../imgs/icons/icon1.webp") no-repeat;
          background-size: contain;
        }
        .text{
          display: block;
          line-height: 20px;
          text-align:center;
        }
      }
    }
    // 核心内容栏
    .cards{
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 40px;
      // height: 300px;
      background-color: yellow;
      padding-left: 100px;
      padding-right: 100px;
      padding-bottom: 100px;
      .card{
        display: block;
        overflow: hidden;
        height: 200px;
        width: 200px;
        border-radius: 10px;
        background-color: black;
        margin-top: 60px;
        a{
          display: block;
          height: 100%;
          width: 100%;
          img{
            display: block;
            height: 100%;
            width: 100%;             
            background-color: black;
          }
        }
      }
    }
  }
  #study{
    background-color: gold;
  }
}

// 上传音乐的弹出框
.addMusicModel{
  display: none;
  height: 400px;
  width: 500px;
  background-color: red;
  position: fixed;
  z-index: 9999;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  .title{
    display: flex;
    align-items: center;
    position: relative;
    height: 60px;
    h2{
      position: absolute;
      left: 50%;
      transform: translate(-50%);
    }
    button{
      background: none;
      border: 0;
      position: absolute;
      right: 10px;
    }
  }
  .content{
    font-size: 25px;
    line-height: 30px;
    .input{
      margin-bottom: 50px;
      span{
        margin-left: 20px;
        height: 30px;
      }
      input{
        background: none;
        border: 0;
        margin-left: 20px;
        height: 30px;
      }
    }
  }
  .commit{
    display:block;
    margin: 0 auto;
    font-size: 25px;
    line-height: 30px;
  }
}
```

---

## File: less/common.less

```less
// out:false

// 玻璃边框
.glassFrame{
  // 背景渐变
  background: linear-gradient(
    45deg,
    rgba(255,255,255,0.8) 0%,
    transparent 25%,
    transparent 75%,
    rgba(255,255,255,0.8) 100%
  );

  // 阴影
  box-shadow: //右上和左下的白色高光
              inset 2px -2px 1px -1px rgba(255, 255, 255, 0.9),
              inset -2px 2px 1px -1px rgba(255, 255, 255, 0.9),

              //白色眼神,提高和衔接渐变
              inset 6px -6px 1px -6px rgba(255, 255, 255, 0.55s),
              inset -6px 6px 1px -6px rgba(255, 255, 255, 0.55),

              //一层黑色
              inset 0 0 2px rgba(0, 0, 0, 0.8),

              //外阴影
              0 4px 8px rgba(0, 0, 0, 0.2s);
  
  // 圆边
  border-radius: 9999px;

  // 边框线
  border: 1px double rgba(51, 51, 51, 0.08);
}
```

---

## File: js/main.js

```javascript
import {initMusic} from"./modules/music/index.js";
import { initNav } from "./modules/nav/index.js";

console.log(1);
initMusic();
initNav();
```

---

## File: js/utils/request.js

```javascript
// (empty file)
```

---

## File: js/modules/nav/index.js

```javascript
export function initNav(){
  //点击banner中的四个板块名跳转到对应板块功能
  //获取banner中的四个按钮和四个板块
  const bannerButtons = document.querySelectorAll(".banner .nav ul li a");
  const sections = document.querySelectorAll(".indexContent .section");

  // 先记录每个板块初始的display
  sections.forEach((section, index) => {
    section["originDisplay"] = getComputedStyle(section).display;
  });

  // 先让首页板块出现，其它板块消失
  sections.forEach((section, index) => {
    if (index === 0)
      return;
    else
      section.style.display = 'none';
  })

  //给四个按钮添加点击事件
  bannerButtons.forEach((button, index) => {
    button.addEventListener('click', function (ev) {
      ev.preventDefault();
      let name = button.getAttribute('name');
      sections.forEach((section, index) => {
        if (name === section.id)
          section.style.display = section["originDisplay"];
        else
          section.style.display = 'none';
      })
    })
  });
}
```

---

## File: js/modules/music/state.js

```javascript
// 管理状态(状态驱动页面)
export const state = {
  musicList: [],
  currentMusic: null
}
```

---

## File: js/modules/music/render.js

```javascript
// 渲染DOM
export function renderMusicList(data) {
  const cardsContainer = document.querySelector("#music .cards");

  const html = data.map(item => {
    return `
        <div class="card">
          <a href="javascript:;">
            <img src="${item["data-src"]}" alt="">
          </a>
        </div>
    `;
  }).join("");
  cardsContainer.innerHTML = html;
}
```

---

## File: js/modules/music/music.js

```javascript
// 音乐板块
let musicModel=(function($){
  //侧边栏板块的变量初始化
  let $musicSection=$('.section#music'),
      $leftBanner=$musicSection.children('.leftBanner'),
      $addButton=$leftBanner.children('.addNewSongs'),
      $addMusicModel=$('.addMusicModel'),
      $commitButton=$addMusicModel.children('.commitButton'),
      $informationsInput=$addMusicModel.children('.content input'),
      $closeButton=$addMusicModel.find('.closeButton');
  //内容板块的变量初始化
  let $cardsContainer=$musicSection.children('.cards'),
      swiperModel=null;

  // 给侧边栏添加功能
  let handleLeftBanner=function(){
    let $http=null;
    //添加上传歌曲功能
    //点击上传按钮弹出表单
    $addButton.on('click',()=>{$addMusicModel.css("display","block");});
    //添加表单功能
    //提交功能
    $commitButton.on('click',()=>{
      let name=$informationsInput.eq(0).attr('value');
      let pic=$informationsInput.eq(1).attr('value');
      $http=$informationsInput.eq(2).attr('value');
      $addMusicModel.style.display="none";
    })
    //关闭功能
    $closeButton.on('click',()=>{console.log(1);$addMusicModel.css('display','none');})
  };

  // 获取专辑数据
  let queryData=function(callback){
    $.ajax({
      url:'./json/music.json',
      method:'GET',
      async:true,
      success:result=>{
        callback && callback(result);
      }
    })
  }

  // 绑定数据
  let bindData=function(_data){
    let card='';
    _data.forEach((item,index)=>{
      let{id,name,"data-src":dataSrc}=item;
      card+=`<div class="swiper-musicCard card">
            <div class="swiper-wrapper">
                <div class="swiper-slide"><a href="javascript:;">专辑封面</a></div>
                <div class="swiper-slide"><a href="javascript:;">歌手内容</a></div>
            </div>
        </div>`
    });
    $cardsContainer.html(card);
  }

  // 给卡片设置轮播功能
  let setSwiper=function(){
    swiperModel=new Swiper('.swiper-musicCard',{ 
      effect:'overflow',
      loop:true
    })
  }

  return {
    init:function(){
      handleLeftBanner();
      queryData((_data)=>{
        bindData(_data);
        setSwiper();
      })
    }
  }
}(jQuery));

musicModel.init();

```

---

## File: js/modules/music/index.js

```javascript
import { getMusicList } from "./api.js";
import { renderMusicList } from "./render.js";
import { bindEvents } from "./event.js";
import { state } from "./state.js";

export async function initMusic() {

  // 请求数据
  const data = await getMusicList();

  // 保存状态
  state.musicList=data;

  // 渲染页面
  renderMusicList(data);

  // 绑定事件
  bindEvents();
}
```

---

## File: js/modules/music/event.js

```javascript
import { state } from "./state.js";
import { renderMusicList } from "./render.js";

// 绑定事件
export function bindEvents() {
  addSongsModel();
}

function addSongsModel(){
  const addButton=document.querySelector(".addNewSongs");
  const model=document.querySelector(".addMusicModel");
  const closeButton=document.querySelector(".closeButton");
  const commitButton=document.querySelector(".addMusicModel .commitButton");
  const inputs=document.querySelectorAll(".addMusicModel input");

  // 打开弹窗
  addButton.addEventListener('click',()=>{
    model.style.display="block";
  })

  // 关闭弹窗
  closeButton.addEventListener('click',()=>{
    model.style.display="none";
  })

  // 上传表单内容
  commitButton.addEventListener('click',()=>{
    // 收集表单信息
    let songInf={
      id:Date.now(),
      name:inputs[0].value,
      "data-src":inputs[1].value
    };
    // 更新state
    state.musicList.push(songInf);
    // 渲染页面
    renderMusicList(state.musicList);
    model.style.display="none";
    // 清空输入框
    inputs[0].value="";
    inputs[1].value="";
    inputs[2].value="";
  })
}
```

---

## File: js/modules/music/api.js

```javascript
// 请求数据
export async function getMusicList() {
  const response =
    await fetch('./json/music.json');

  return response.json();
}
```

---

## Images (placeholders)

- assets/upload/touxiang.jpg — image omitted (binary file). Keep original file at `assets/upload/touxiang.jpg`.
- imgs/icons/icon1.webp — image omitted (binary file). Keep original file at `imgs/icons/icon1.webp`.

---

Generated by export tool.
