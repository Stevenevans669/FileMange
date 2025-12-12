# CI/CD 与 Vercel 部署流程

> BMAD-METHOD Phase 2: 架构设计 · US-026

本文档描述了仓库的持续集成检查、Vercel Preview/Production 部署路径，以及数据库迁移的推荐执行流程。

## GitHub Actions：Lint + Build

- **触发条件**：针对 `main` 分支的 `push` 与 `pull_request`。
- **Node 版本**：使用 `actions/setup-node@v4` 配置 Node.js 20，并启用 npm 缓存。
- **流水线阶段**：
  1. **Lint**：`npm ci` 安装依赖后运行 `npm run lint`，确保代码风格与 ESLint 规则通过。
  2. **Build**：在 Lint 通过后执行 `npm run build`，并设置 `NEXT_TELEMETRY_DISABLED=1` 以避免构建时的遥测。
- **并发控制**：`concurrency` 会按分支/PR 取消过时的运行，保证最新提交优先。

## Vercel 部署路径

1. **预览环境 (Preview)**
   - 每个 PR/分支推送都会触发 Vercel Preview Deploy，提供独立 URL 供验收。
   - Preview 环境应使用与生产隔离的密钥/数据库实例，避免测试数据污染生产。
2. **生产环境 (Production)**
   - 合并到 `main` 后自动触发 Production Deploy。
   - 保持与 Preview 一致的 `env` 键名，仅在 Vercel 控制台设置不同的值。
3. **环境变量管理**
   - 使用 `vercel env pull .env.local` 同步远程环境配置到本地。
   - 将 `.env.local` 加入 `.gitignore`，避免敏感信息入库。

## 数据库迁移流程

> 适用于基于 ORM/迁移工具（如 Prisma/Drizzle）的工作流；请在对应脚本准备好后替换命令。

1. **编写与审查迁移**
   - 在本地创建迁移（示例：`npm run db:migrate:dev`），并提交迁移文件到仓库。
   - 在 PR 中审查迁移文件，确认表结构/数据变更符合预期。
2. **预览环境验证**
   - 将迁移命令添加到 Preview 部署前的手动或自动步骤（如通过 `vercel env pull` + `npm run db:migrate:deploy` 连接预览数据库）。
   - 验证核心用例在 Preview 环境上正常运行。
3. **生产环境执行**
   - 合并到 `main` 后，在部署前/后执行生产迁移（CI 手动批准或在 Vercel Project Settings 中配置部署前钩子）。
   - 如需回滚，使用对应 ORM 的回滚命令（例如 `npm run db:migrate:rollback`）。
4. **状态追踪**
   - 在 PR 模板/描述中记录迁移命令、目标数据库和验证结果。
   - 重大变更建议在合并前获取额外批准，并在发布说明中列出。

