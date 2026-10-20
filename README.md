
# HK_Bus · 全港实时巴士到站 & 内置小游戏

> 一个开箱即用的纯前端 Web 应用（PWA）：实时查看全港巴士路线的到站信息，并内置一款「巴士大亨」小游戏。无需安装、无需后端，打开浏览器即可使用，也可一键安装到手机 / 桌面主屏幕。
>
> **在线体验：<https://akifinn3.github.io/HK_Bus/>**

![license](https://img.shields.io/badge/Language-HTML%20%2F%20JS-orange) ![PWA](https://img.shields.io/badge/PWA-Installable-brightgreen) ![Static](https://img.shields.io/badge/Backend-None-blue)

---

## 目录

- [项目简介](#项目简介)
- [核心功能](#核心功能)
- [在线体验](#在线体验)
- [快速开始](#快速开始)
- [文件结构](#文件结构)
- [技术栈](#技术栈)
- [安装为应用（PWA）](#安装为应用pwa)
- [部署](#部署)
- [常见问题](#常见问题)
- [开源许可](#开源许可)

---

## 项目简介

**HK_Bus** 最初源于一个 **B3A 巴士到站看板** 的小工具，现已扩展为覆盖 **全港巴士路线** 的实时到站信息平台，并附带一款轻松上手的「巴士大亨」小游戏。

整个项目是**纯静态前端**实现，不依赖任何服务器或数据库，全部逻辑运行在浏览器中。通过 GitHub Pages 即可免费托管，并借助 Service Worker + Web App Manifest 升级为可离线安装、可全屏运行的 PWA（渐进式 Web 应用）。

## 核心功能

### 🚌 全港实时巴士到站

- 覆盖全港多家巴士公司路线，集中查询、一站管理。
- 展示各班次的实时到站 / 预计到达信息，方便候车安排。
- 路线数据与界面分离（数据封装在 `mtr-bus-data.js` 中），便于维护与扩展新路线。
- 看板式排版，信息一目了然，适合挂在屏幕上持续刷新查看。

### 🎮 内置「巴士大亨」小游戏

- 在 `game.html` 中提供一款即开即玩的巴士主题小游戏，候车 / 摸鱼两不误。
- 纯前端实现，无需额外依赖，与主站共享同一份部署。

### 📱 可安装 PWA

- 提供 `manifest.webmanifest` 与应用图标（192 / 512 / maskable）。
- 通过 `sw.js`（Service Worker）实现资源缓存与基础离线能力。
- 支持「添加到主屏幕」，安装后以独立窗口全屏运行，体验接近原生 App。

## 在线体验

| 入口 | 地址 |
| --- | --- |
| 主页 | <https://akifinn3.github.io/HK_Bus/> |
| 全港巴士路线 | <https://akifinn3.github.io/HK_Bus/hk-buses.html> |
| 巴士大亨小游戏 | <https://akifinn3.github.io/HK_Bus/game.html> |

## 快速开始

本项目是静态站点，无需构建、无需安装依赖。

```bash
# 1. 克隆仓库
git clone https://github.com/AkiFinn3/HK_Bus.git
cd HK_Bus

# 2. 任选一种方式在本地启动（任一静态服务器均可）
python3 -m http.server 8000        # 方式 A：Python
# 或
npx serve .                        # 方式 B：Node serve

# 3. 浏览器打开 http://localhost:8000
```

## 文件结构

```text
HK_Bus/
├── index.html              # 应用主页 / 导航入口
├── hk-buses.html           # 全港巴士实时到站页面
├── game.html               # 「巴士大亨」小游戏
├── mtr-bus-data.js         # 巴士路线数据（数据与视图分离）
├── manifest.webmanifest    # PWA 应用清单（名称、图标、启动方式）
├── sw.js                   # Service Worker（缓存与离线）
├── icon-192.png            # 应用图标 192×192
├── icon-512.png            # 应用图标 512×512
├── icon-maskable-512.png   # 自适应遮罩图标 512×512
└── README.md
```

## 技术栈

| 层 | 选型 | 说明 |
| --- | --- | --- |
| 标记 | HTML5 | 页面结构 |
| 样式 | CSS | 内联于 HTML 文件 |
| 脚本 | JavaScript（原生） | 实时到站逻辑与小游戏，无框架、无构建 |
| 数据 | 静态 JS 数据文件 | `mtr-bus-data.js` 维护路线信息 |
| 应用化 | PWA | `manifest.webmanifest` + `sw.js` |
| 托管 | GitHub Pages | 免费静态托管与自动部署 |

## 安装为应用（PWA）

1. 用手机或桌面浏览器打开在线地址。
2. 浏览器地址栏出现「安装 / 添加到主屏幕」提示时点击，或：
   - **iOS Safari**：分享按钮 → 「添加到主屏幕」。
   - **Android Chrome**：菜单 → 「安装应用 / 添加到主屏幕」。
   - **桌面 Chrome / Edge**：地址栏右侧的安装图标。
3. 安装后即可从主屏幕以独立窗口启动，全屏运行。

## 部署

项目通过 **GitHub Pages** 自动部署，把代码推送到 `main` 分支即可生效。

手动部署（部署到 `docs/` 或仓库根目录）：

1. 进入仓库 **Settings → Pages**。
2. Source 选择 `Deploy from a branch`，Branch 选择 `main`、目录 `/ (root)`。
3. 保存后访问 `https://<用户名>.github.io/HK_Bus/`。

> 提示：修改 Service Worker（`sw.js`）后，请同步更新其中的缓存版本号，以便客户端刷新缓存。

## 常见问题

- **实时到站数据从何而来？** 路线数据维护在 `mtr-bus-data.js` 中，可按需增删路线或对接实时接口。
- **需要安装依赖或编译吗？** 不需要。纯静态站点，用任意静态服务器或直接打开 HTML 即可。
- **能离线使用吗？** 已配置 Service Worker，对已访问过的页面与资源提供缓存能力，具体离线范围由 `sw.js` 缓存策略决定。

## 开源许可

本项目由 [AkiFinn3](https://github.com/AkiFinn3) 维护。如需作为示例或二次开发使用，请遵循仓库所声明的许可条款。

---

*Made with a pure front-end stack · Deployed on GitHub Pages · Installable as a PWA.*
