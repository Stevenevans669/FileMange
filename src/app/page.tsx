import Link from 'next/link';

const roadmapItems = [
  {
    title: '需求探索 (BMAD Phase 1)',
    items: ['用户故事细化', '用例/优先级评审', '开放问题收敛'],
  },
  {
    title: '架构设计 (BMAD Phase 2)',
    items: ['技术栈确认', '系统架构草图', '安全/合规基线'],
  },
  {
    title: 'MVP 开发 (BMAD Phase 3)',
    items: ['上传/下载最小闭环', '基本账号体系', 'CI/CD 与质量门禁'],
  },
];

export default function HomePage() {
  return (
    <main>
      <div className="container">
        <header>
          <div>
            <span className="badge">Vercel Cloud Drive</span>
            <h1>打造为 Vercel 优化的现代化网盘</h1>
            <p>
              轻量、可扩展、以 BMAD 方法论驱动的文件存储方案，当前处于需求探索阶段。
            </p>
          </div>
          <Link href="/docs" prefetch={false} aria-label="项目文档入口">
            查看文档
          </Link>
        </header>

        <section className="section-grid">
          <div className="card">
            <h3>为什么选择这个项目？</h3>
            <p>
              针对 Vercel 部署优化，提供 App Router 架构、TypeScript 严格模式，以及未来与
              Vercel 原生存储的无缝集成能力。
            </p>
          </div>

          <div className="card">
            <h3>当前阶段</h3>
            <p>
              需求探索 & 架构预研。你可以查看 <Link href="/docs" prefetch={false}>docs</Link>{' '}
              目录了解用户故事、API 构想与架构草图。
            </p>
          </div>

          <div className="card">
            <h3>开发规范</h3>
            <ul className="list">
              <li>TypeScript + Next.js 14 App Router</li>
              <li>遵循 ESLint / Prettier，组件使用函数式 + Hooks</li>
              <li>Git 提交遵循 <code>type(scope): description</code> 约定</li>
            </ul>
          </div>
        </section>

        <section className="section-grid">
          {roadmapItems.map((item) => (
            <div className="card" key={item.title}>
              <h3>{item.title}</h3>
              <ul className="list">
                {item.items.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <div className="footer">
          <span>下一步：</span>
          <strong>完成需求评审，敲定 MVP 范围并启动开发冲刺。</strong>
        </div>
      </div>
    </main>
  );
}
