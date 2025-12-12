# Vercel Cloud Drive

一个专为 Vercel 部署设计的现代化网盘系统。

## 🚀 项目状态

**当前阶段**: 需求探索与架构设计 (BMAD-METHOD Phase 1)

## 📋 项目概述

本项目旨在构建一个功能完整、用户友好、易于在 Vercel 上部署的云存储/网盘系统。

## 🛠️ 技术栈

- **运行时**: Node.js 18+
- **框架**: Next.js (App Router)
- **部署**: Vercel
- **语言**: TypeScript

## 📁 项目结构

```
FileMange/
├── docs/                    # 项目文档
│   ├── requirements/        # 需求文档
│   ├── architecture/        # 架构设计
│   └── api/                 # API 文档
├── src/                     # 源代码（App Router + TypeScript + Tailwind）
├── public/                  # 静态资源和构建产物出口（已创建，供 Vercel 识别）
├── tailwind.config.ts       # Tailwind 配置（内容范围指向 src/**/*）
├── postcss.config.mjs       # PostCSS + autoprefixer 配置
├── .eslintrc.json           # ESLint (Next core web vitals + Prettier)
├── .prettierrc              # Prettier 配置（含 Tailwind 插件）
├── package.json
└── README.md
```

## 🚦 开发路线图

- [x] 项目初始化
- [x] 建立 Git 仓库
- [x] 初始化 Next.js 应用骨架
- [ ] 需求探索 (BMAD-METHOD)
- [ ] 架构设计
- [ ] 核心功能开发
- [ ] 测试与优化
- [ ] Vercel 部署

> ℹ️ **Vercel 部署提示**：Vercel 项目当前的输出目录配置指向 `public/`。仓库已预先创建该目录（含占位说明），确保 `npm run build` 后平台能找到输出路径。如需调整输出目录，请同步更新 Vercel 项目设置或 `vercel.json`。

## 🏗️ 本地开发

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

打开 <http://localhost:3000> 即可查看包含项目简介与文档入口的首屏页面。

3. 代码质量与格式化：

```bash
npm run lint       # Next.js + ESLint 检查
npm run format     # 仅检查格式（Prettier + Tailwind 插件）
npm run format:fix # 自动格式化
```

4. 数据库（Neon + Drizzle）：

```bash
# 使用 Neon 连接串生成 SQL 迁移
DATABASE_URL="<neon_connection_string>" npm run db:generate

# 将迁移推送到数据库（需要具备连接权限）
DATABASE_URL="<neon_connection_string>" npm run db:push
```

## 🌱 环境变量约定

示例文件位于 `.env.example`，包含公开与服务端变量的划分：

- `NEXT_PUBLIC_*` 前缀的变量会暴露到浏览器，如 `NEXT_PUBLIC_APP_NAME`。
- 无前缀变量仅在服务端可见，如 `DATABASE_URL`、`STORAGE_BUCKET`。
- 本地开发可复制 `.env.example` 为 `.env.local` 并根据需要调整。

## 🎨 样式与 UI 基线

- Tailwind 已配置并扫描 `./src/**/*.{ts,tsx,mdx}`。
- 全局样式位于 `src/app/globals.css`，使用 `@tailwind base` / `components` / `utilities`。
- 推荐在组件中使用语义化的 `section-card`、`code-inline` 等辅助类保持一致的 UI 语言。

## 📖 文档

详细文档请查看 [docs](./docs) 目录，其中 [CI/CD 与 Vercel 部署流程](./docs/architecture/deployment.md) 记录了 GitHub Actions 的 lint/build 流程、Vercel Preview/Production 部署路径以及数据库迁移的推荐实践。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。

## 📄 许可证

MIT License
