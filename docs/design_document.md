# ThingsBoard 通用业务交付工具 (Electron版) - 技术实施方案

## 1. 项目概述

本项目旨在开发一款跨平台（Windows/macOS/Linux）的桌面端工具，用于解决 ThingsBoard 业务现场交付过程中“配置繁琐、操作不直观”的痛点。
工具基于 **Electron** 框架，通过直观的 **Cyber-Industrial (赛博工业风)** 图形界面，提供租户管理、资产设备拓扑编排、一键免密登录Web端等核心功能。

## 2. 核心技术栈

### 2.1 架构选型

- **应用外壳**: `Electron` (最新稳定版) + `electron-builder`
- **前端框架**: `React 18` + `TypeScript`
- **构建工具**: `Vite` (提供秒级热更新)
- **路由管理**: `React Router v6` (HashRouter 模式)

### 2.2 UI 与 设计

- **设计风格**: **Cyber-Industrial Glassmorphism** (赛博工业玻璃拟态)
  - **多主题支持**: 内置多种主题风格（Cyber 赛博风、Deep Dark 深邃暗黑、Professional Light 专业亮色），支持一键切换。
  - 深色磨砂玻璃背景
  - 霓虹光晕状态指示
  - 科技感微交互动画
- **样式库**: `Tailwind CSS` (核心样式) + `clsx`/`tailwind-merge`
- **动画库**: `Framer Motion` (用于页面切换与弹窗动画)
- **图标库**: `Lucide React` (现代线性图标)
- **组件策略**: 基于 `Radix UI` Primitives 自定义封装，不使用现成UI库以保证视觉还原度。

### 2.3 状态与数据流

- **全局状态**: `Zustand` (轻量、高性能)
- **服务端状态**: `React Query` (自动处理缓存、重试、通过 hooks 管理 API 状态)
- **本地存储**: `electron-store` (存储环境配置、用户偏好)

### 2.4 可视化引擎 (拓扑图)

- **方案**: `React Flow`
- **用途**: 渲染 "租户 -> 资产 -> 设备" 的层级关系，支持节点拖拽重组。

---

## 3. 功能模块设计

### 3.1 多环境会话管理 (Session Manager)

- **功能**: 允许现场工程师保存多组 ThingsBoard 接入点（如：开发环境、生产环境 A、生产环境 B）。
- **安全**: 系统管理员的 Token 使用 Electron `safeStorage` API 进行加密存储。

### 3.2 租户工作台 (Tenant Workspace)

- **列表视图**: 展示租户的基本信息、激活状态（通过 API 轮询或 WebSocket 实时更新）。
- **一键跳转 (Magic Jump)**:
  - 通过 SysAdmin 身份获取目标租户 Token。
  - 调用系统默认浏览器打开 Web 界面，实现免密登录。

### 3.3 智能资产拓扑 (Smart Topology)

- **核心交互**:
  - 左侧展示动态加载的资产树。
  - 右侧属性面板随选中节点动态切换。
  - 支持右键菜单：新增子资产、批量添加设备、删除。
- **业务逻辑**:
  - 自动解析 ThingsBoard 的 `Contains` 关系。
  - 可视化创建关联：将“未分配设备”拖入指定资产节点即可建立关联。

### 3.4 快速交付向导 (Delivery Wizard)

- **批量导入**: 支持 Excel/CSV 导入设备 SN 列表。
- **模板实例化**: 预设 "标准资产结构" 模板，一键生成完整的 Asset + Device 结构。

---

## 4. 目录结构规范

```tree
src/
├── main/                 # Electron 主进程
│   ├── index.ts          # 入口
│   └── ipc/              # IPC 通信处理
├── preload/              # 预加载脚本
├── renderer/             # React 前端
│   ├── src/
│   │   ├── components/   # 通用 UI 组件 (GlassCard, NeonButton)
│   │   ├── features/     # 业务模块 (auth, topology, tenant)
│   │   ├── layouts/      # 布局容器
│   │   ├── lib/          # 工具库 (axios, theme)
│   │   └── stores/       # Zustand store
│   └── index.html
└── package.json
```

## 5. 开发里程碑 (Milestones)

- **P0**: 环境搭建，Electron + Vite + Tailwind 配置完成，主界面框架跑通。
- **P1**: 登录模块（多环境配置），租户列表与一键跳转功能。
- **P2**: 资产拓扑树的核心渲染与交互（查、增）。
- **P3**: 设备批量创建与关联逻辑。
- **P4**: 国际化适配与打包发布。

---

## 用户审查 (User Review)

> [!IMPORTANT]
> 此方案采用 **Electron** 构建，相比 Web 端会增加打包体积，但能提供更强的系统级能力（如本地文件读写、系统托盘、无限制的跨域访问）。

> [!TIP]
> UI 将严格按照“赛博工业风”进行定制开发，这意味着我们需要编写较多的自定义 CSS，而不是直接套用 Ant Design。

**请审阅以上设计。确认无误后，我们将开始 P0 阶段的开发。**
