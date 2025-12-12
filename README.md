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
├── src/                     # 源代码（待创建）
├── public/                  # 静态资源和构建产物出口（已创建，供 Vercel 识别）
├── .claude.md               # AI 助手指南
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

## 📖 文档

详细文档请查看 [docs](./docs) 目录。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。

## 📄 许可证

MIT License

