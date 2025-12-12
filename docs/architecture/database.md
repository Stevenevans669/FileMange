# 数据库基础（Neon + Drizzle）

> BMAD-METHOD Phase 3: Implementation · PR-04

本文档描述了数据库选型、表结构以及迁移流程，便于在 Vercel/Neon 上快速落地持久化能力。

## 选型

- **数据库**：Neon Serverless Postgres（兼容 PostgreSQL 15+，支持 SSL）。
- **ORM / 迁移**：Drizzle ORM + drizzle-kit。
- **驱动**：`@neondatabase/serverless`，支持无连接池、HTTP fetch 连接，适合 Vercel 无服务器运行时。

## 目录

```
src/lib/db/
├── client.ts   # Neon 连接 + Drizzle 初始化
├── index.ts    # 便捷导出
└── schema.ts   # 表结构定义
```

### 基础迁移 SQL（由 drizzle-kit 自动生成）

摘录自 `./drizzle/0000_chubby_the_enforcers.sql`，涵盖用户、会话、文件系统、分享、API Key、变更 feed 与审计日志：

```sql
-- enums
DO $$ BEGIN
    CREATE TYPE "resource_type" AS ENUM ('user', 'session', 'file', 'folder', 'share', 'api_key');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TYPE "share_target" AS ENUM ('file', 'folder');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- core tables
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar(255) NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "name" varchar(120),
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "session_token" varchar(255) NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);

CREATE TABLE IF NOT EXISTS "folders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "parent_id" uuid,
  "name" varchar(255) NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "files" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "folder_id" uuid,
  "name" varchar(255) NOT NULL,
  "mime_type" varchar(255) NOT NULL,
  "size" integer NOT NULL,
  "storage_key" varchar(255) NOT NULL,
  "checksum" varchar(128),
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "files_storage_key_unique" UNIQUE("storage_key")
);

CREATE TABLE IF NOT EXISTS "shares" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "created_by" uuid NOT NULL,
  "target_type" "share_target" NOT NULL,
  "file_id" uuid,
  "folder_id" uuid,
  "token" varchar(255) NOT NULL,
  "password_hash" varchar(255),
  "expires_at" timestamptz,
  "max_downloads" integer,
  "download_count" integer DEFAULT 0 NOT NULL,
  "allow_preview" boolean DEFAULT false NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "shares_token_unique" UNIQUE("token")
);

CREATE TABLE IF NOT EXISTS "api_keys" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "name" varchar(255) NOT NULL,
  "hashed_key" varchar(255) NOT NULL,
  "last_used_at" timestamptz,
  "revoked_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "api_keys_hashed_key_unique" UNIQUE("hashed_key")
);

CREATE TABLE IF NOT EXISTS "change_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "resource_type" "resource_type" NOT NULL,
  "resource_id" uuid NOT NULL,
  "action" varchar(128) NOT NULL,
  "metadata" jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "actor_id" uuid NOT NULL,
  "action" varchar(128) NOT NULL,
  "target_type" "resource_type" NOT NULL,
  "target_id" uuid,
  "ip_address" varchar(64),
  "user_agent" text,
  "metadata" jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

-- fkeys
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_id_folders_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "files" ADD CONSTRAINT "files_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "shares" ADD CONSTRAINT "shares_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "shares" ADD CONSTRAINT "shares_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "shares" ADD CONSTRAINT "shares_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "change_events" ADD CONSTRAINT "change_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
```

## 运行迁移

- **生成迁移**（基于 schema.ts）

```bash
DATABASE_URL="<neon_connection_string>" npm run db:generate
```

- **推送到数据库**（需要具备写入权限）

```bash
DATABASE_URL="<neon_connection_string>" npm run db:push
```

- **Vercel 部署建议**
  - 在 Preview/Production 环境中均配置 `DATABASE_URL`（使用 Neon pooled 连接）。
  - 先在 Preview 上执行 `db:push` 验证，再上线 Production。
  - 变更表结构时，将迁移文件一并提交，避免配置漂移。

## 变更记录表（用途摘要）

- **users / sessions**：认证、会话管理。
- **folders / files**：用户的树状文件层级与元数据，`storage_key` 关联到 Blob/S3。
- **shares**：支持文件/文件夹分享，包含过期/下载次数控制与可选密码。
- **api_keys**：面向第三方/CLI 的访问凭证，可撤销并追踪最近使用时间。
- **change_events**：供前端/客户端同步的变更 feed（如实时刷新列表）。
- **audit_logs**：安全审计用途，记录关键操作的来源 IP/User-Agent。
