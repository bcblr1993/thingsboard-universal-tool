# 项目开发规范与 AI 协作准则 (Development Guidelines)

> [!IMPORTANT]
> **To AI Assistant (致 AI 助手):**
> 本文档是本项目的唯一真理来源 (Single Source of Truth)。在进行任何代码编写或架构决策前，**必须** 优先遵循本文档中的规则。
> 用户更新本文档后，你需要自动识别并应用最新的规则。

## 0. 核心原则 (Core Principles)

1. **语言**: 所有注释、文档、Git Commit Message 必须使用 **简体中文**。
2. **UI 风格**: 严格遵循 `Cyber-Industrial Glassmorphism` 设计语言。不使用通用组件库的默认样式。
3. **技术栈锁定**:
    - 运行时: Electron + React + Vite
    - 样式: Tailwind CSS (配合 `src/index.css` 的多主题变量)
    - 图标: Lucide React
4. **代码质量**:
    - 严禁任何 `any` 类型 (TypeScript strict mode)。
    - 所有新组件必须在 `src/components/ui` 或 `src/components/shared` 下。
    - 业务逻辑与 UI 必须分离 (自定义 Hooks)。

## 1. 目录结构规范

```
energy_delivery_tool/
├── electron/               # Electron 主进程相关
│   ├── main/               # 主进程代码
│   └── preload/            # IPC 预加载脚本
├── src/                    # React 渲染进程
│   ├── components/         # 通用组件
│   │   ├── ui/             # 基础 UI 组件 (原子级, 如 Button, Dialog)
│   │   └── shared/         # 业务复用组件 (如 TenantCard)
│   ├── hooks/              # 自定义 Hooks
│   ├── layouts/            # 页面布局
│   ├── lib/                # 工具函数 (utils, api client)
│   ├── locales/            # 国际化资源文件
│   ├── modules/            # 业务模块 (按功能划分: auth, tenant, device)
│   ├── store/              # Zustand 全局状态
│   └── types/              # TypeScript 类型定义
└── docs/                   # 项目文档
```

## 2. 命名规范

- **文件/文件夹**:采用 `kebab-case` (如 `tenant-card.tsx`, `auth-service.ts`)。
- **组件**: 采用 `PascalCase` (如 `TenantCard`, `NeonButton`)。
- **变量/函数**: 采用 `camelCase` (如 `fetchTenants`, `isLoggedIn`)。
- **常量**: 采用 `UPPER_SNAKE_CASE` (如 `MAX_RETRY_COUNT`, `DEFAULT_THEME`)。

## 3. UI 开发规范 (Theming & Styling)

本项目支持多主题切换（Cyber, Dark, Light），开发时必须遵循以下规则：

- **Tailwind CSS**: 优先使用 Tailwind 类名。
- **CSS Variables**: 颜色定义在 `index.css` 的 `:root` 和 `[data-theme="cyber"]` 中，通过 CSS 变量引用颜色（如 `bg-background`, `text-primary`）。
- **Glassmorphism**: 使用封装好的 `GlassCard` 组件，或使用 `@apply backdrop-blur-md bg-white/10` 工具类。
- **Icons**: 统一使用 `lucide-react`，大小默认 `size={20}`。

## 4. 国际化 (I18n)

> [!IMPORTANT]
> **严禁在代码中出现任何硬编码的字符串！**
> 所有用户可见的文本（包括按钮、标题、提示、错误信息）必须全面支持国际化。

- 所有用户可见文本由于 `src/locales` 下的 JSON 文件管理。
- 使用 `useTranslation()` hook 获取文本：`t('common.confirm')`。
- 新增功能必须同步添加 `zh-CN` 和 `en-US` 翻译。

## 5. UI 与主题一致性

> [!IMPORTANT]
> **必须严格保持赛博工业风格 (Cyber-Industrial Style)**
> 禁止引入不符合当前设计语言的 UI 元素。

- 使用 `GlassCard` 和 `NeonButton` 等现有组件。
- 遵循 `index.css` 定义的 CSS 变量。

## 5. 状态管理

- **Server State**: 使用 `React Query` (`useQuery`, `useMutation`) 管理 API 数据。
- **Global UI State**: 使用 `Zustand` 管理主题、当前租户、弹窗状态。

## 6. 弹窗与通知

- **Dialog**: 使用 `src/components/ui/dialog` 下封装的 Radix UI Dialog。
- **Toast**: 使用 `sonner` 或封装的 Toast 组件进行全局提示。
