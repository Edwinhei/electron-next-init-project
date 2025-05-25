# Electron + Next.js 桌面应用模板

这是一个集成了 Electron 和 Next.js 的基础桌面应用模板。它允许你使用 Next.js 的强大前端能力（包括文件系统路由、页面级代码分割、React 最新特性）来构建桌面应用的用户界面，并通过 Electron 提供跨平台的原生桌面功能。

这个项目是手动从零搭建的，旨在帮助开发者理解 Electron 和 Next.js 如何协同工作。

## 🚀 快速启动

按照以下步骤，快速克隆项目、安装依赖并运行应用程序。

### 1\. 克隆仓库

首先，将本项目克隆到你的本地机器：

```bash
git clone git@github.com:Edwinhei/electron-next-init-project.git
# 或者使用 HTTPS
# git clone https://github.com/Edwinhei/electron-next-init-project.git
```

进入项目目录：

```bash
cd electron-next-init-project
```

### 2\. 安装依赖

本项目使用 `pnpm` 作为包管理器。请确保你的系统已安装 `pnpm` (如果未安装，可以运行 `npm install -g pnpm`)。

安装所有必要的项目依赖：

```bash
pnpm install
```

### 3\. 下载必要的构建资源 (图标)

本项目为了保持仓库精简，`.gitignore` 配置为不跟踪 `assets/` 文件夹内的实际图标文件。
**在进行打包之前，你需要手动将应用程序图标文件放入 `assets/` 文件夹。**

请在 `assets/` 文件夹内放置以下图标文件：

  * `icon.ico`: 用于 Windows 平台的图标 (通常为 256x256 或更高分辨率的 ICO 文件)。
  * `icon.icns`: 用于 macOS 平台的图标 (ICNS 文件)。
  * `icon.png`: 用于 Linux 平台或作为其他平台备用的 PNG 图标 (建议尺寸至少为 512x512 像素)。

你可以从 [这里](https://www.google.com/search?q=https://github.com/saltyshiomix/nextron/tree/main/assets) (例如 Nextron 仓库的 assets 文件夹) 或其他图标资源网站获取合适的图标文件，并将其命名为上述名称后放置到 `assets/` 目录下。

### 4\. 运行开发模式

在开发模式下，Next.js 开发服务器和 Electron 应用将同时启动，并支持热模块重载（HMR），让你在修改代码时能即时看到效果。

```bash
pnpm run electron:dev
```

运行此命令后，你将看到：

1.  Next.js 开发服务器启动，并显示 `http://localhost:3000` 的地址。
2.  稍后，一个 Electron 桌面窗口将会弹出，并加载 Next.js 应用。

### 5\. 构建和打包生产版本

当你准备发布应用时，首先确保你已完成 [步骤 3](https://www.google.com/search?q=%233-%E4%B8%8B%E8%BD%BD%E5%BF%85%E8%A6%81%E7%9A%84%E6%9E%84%E5%BB%BA%E8%B5%84%E6%BA%90-%E5%9B%BE%E6%A0%87)。然后使用以下命令将应用程序打包成可分发的安装包（如 Windows `.exe`，macOS `.dmg`，Linux `AppImage` 等）。

```bash
pnpm run electron:build
```

构建完成后，你将在项目根目录的 `release/` 文件夹中找到生成的安装包。

## 💡 项目结构概览

```
electron-next-app/
├── node_modules/         # 项目依赖
├── public/               # Next.js 静态资源
├── app/                  # Next.js App Router 页面和组件 (前端 UI)
│   ├── layout.tsx
│   ├── page.module.css
│   └── page.tsx
├── electron/             # Electron 相关代码
│   ├── main.cjs          # Electron 主进程入口 (负责原生功能和窗口管理)
│   └── preload.cjs       # 预加载脚本 (主进程与渲染进程的安全桥梁)
├── assets/               # Electron Builder 用于打包的资源 (如应用图标)。
│   │                     # **注意：此文件夹中的实际图标文件不在 Git 跟踪范围内，需要手动放置。**
│   └── .gitkeep          # 确保文件夹被 Git 跟踪的空文件
├── out/                  # Next.js `next export` 命令生成的静态文件输出目录 (生产模式加载)
├── .next/                # Next.js 临时文件和构建缓存
├── next-env.d.ts         # Next.js 环境类型声明
├── next.config.mjs       # Next.js 配置
├── package.json          # 项目元数据和脚本配置
├── tsconfig.json         # TypeScript 配置文件
└── src/global.d.ts       # 全局类型声明 (例如 Electron API 暴露给渲染进程的类型)
```

## ⚙️ 核心配置解释

### `package.json`

这是项目的核心配置文件，包含了重要的脚本和构建设置：

  * **`"main": "electron/main.cjs"`**:
    指定 Electron 应用的主入口文件。使用 `.cjs` 扩展名确保它被 Node.js 视为 CommonJS 模块，以兼容 `require()` 语法。
  * **`"scripts"`**:
      * `"dev": "next dev"`: 启动 Next.js 前端开发服务器。
      * `"build": "next build && next export"`: 构建 Next.js 应用的生产版本，并将其导出为静态 HTML/CSS/JS 文件到 `out/` 目录。
      * `"electron:dev": "cross-env IS_DEV=true concurrently \"npm run dev\" \"npm run electron-start\""`:
        这是开发 Electron 应用的入口脚本。
          * `cross-env IS_DEV=true`: 设置环境变量 `IS_DEV` 为 `true`，供 Electron 主进程判断是否处于开发模式。
          * `concurrently`: 并行运行多个 npm 脚本。
          * `"npm run dev"`: 启动 Next.js 开发服务器。
          * `"npm run electron-start"`: 启动 Electron 应用。
      * `"electron-start": "wait-on http://localhost:3000 && electron ."`:
        一个辅助脚本，在 Electron 启动前确保 Next.js 开发服务器 (`http://localhost:3000`) 已经完全就绪。
      * `"electron:build": "npm run build && electron-builder"`:
        用于构建 Electron 生产版本应用的脚本。它首先构建 Next.js 应用，然后使用 `electron-builder` 进行桌面应用打包。
      * `"postinstall": "electron-builder install-app-deps"`:
        在 `pnpm install` 后自动执行，用于确保 Electron 的原生模块依赖正确编译。
  * **`"build"` (Electron Builder 配置)**:
    这是 `electron-builder` 的配置块，定义了应用打包的各项设置，如 `appId`、要包含的文件、输出目录、以及针对不同操作系统的打包目标和图标等。
      * `"files": ["out/**/*", "electron/**/*"]`: 确保 Next.js 的静态输出 (`out/`) 和 Electron 主进程代码 (`electron/`) 都被包含在最终的打包中。

### `electron/main.cjs` (Electron 主进程)

  * 这是 Electron 应用的起点。它负责创建浏览器窗口 (`BrowserWindow`)、管理应用生命周期、以及处理主进程与渲染进程之间的 IPC 通信。
  * **开发模式**：通过 `mainWindow.loadURL('http://localhost:3000')` 加载 Next.js 的开发服务器。
  * **生产模式**：通过 `mainWindow.loadURL(url.format({ pathname: path.join(__dirname, '../out/index.html'), protocol: 'file:', slashes: true }))` 加载 `next export` 导出的静态 HTML 文件。
  * `isDev` 变量用于根据运行环境调整行为 (例如是否打开开发者工具)。

### `electron/preload.cjs` (预加载脚本)

  * 这是一个在 Electron 渲染进程的全局上下文被加载之前运行的脚本。它拥有 Node.js 环境的完整权限。
  * **安全实践**：通过 `contextBridge.exposeInMainWorld()` 安全地将 Electron API 暴露给渲染进程 (Next.js 应用)，避免直接启用 `nodeIntegration`。这大大增强了应用的安全性。

### `app/page.tsx` (Next.js 渲染进程 UI)

  * 这是一个 Next.js 的客户端组件（通过 `'use client'` 声明）。
  * 它通过 `window.electronAPI` 对象（由 `preload.cjs` 暴露）来调用 Electron 主进程的功能，实现双向通信。
  * `useEffect` 钩子用于在组件加载时注册 IPC 监听器，确保能接收主进程的异步回复。
  * `page.module.css` 提供了基础的样式，使得界面更加美观。

### `src/global.d.ts`

  * 这个 TypeScript 声明文件用于为 `window.electronAPI` 对象提供类型定义，以便在 Next.js 应用中安全地使用 Electron API，获得类型检查和代码提示。

### `assets/` 文件夹和 `.gitignore`

  * `assets/`: 用于存放 Electron 应用的图标等构建资源。
  * `.gitkeep`: 因为 Git 不跟踪空文件夹，所以在 `assets/` 文件夹中放置一个 `.gitkeep` 文件，确保这个文件夹本身被 Git 跟踪并推送到远程仓库。
  * `.gitignore` 中的 `assets/*` 和 `!assets/.gitkeep` 规则组合，实现了只跟踪 `assets/` 文件夹，而忽略其中所有内容的需求。

## 🤝 贡献与反馈

欢迎任何形式的贡献和反馈！如果你在使用过程中遇到问题或有改进建议，请随时提交 Issue 或 Pull Request。
