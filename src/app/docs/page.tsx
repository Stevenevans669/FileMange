import Link from 'next/link';

const docLinks = [
  {
    title: '用户故事',
    href: 'https://github.com/your-org/vercel-cloud-drive/tree/main/docs/requirements/user-stories.md',
    description: '初步需求与优先级矩阵，位于 docs/requirements/user-stories.md。',
  },
  {
    title: '架构草图',
    href: 'https://github.com/your-org/vercel-cloud-drive/tree/main/docs/architecture',
    description: '后续会在 docs/architecture 中补充的技术方案与系统设计。',
  },
  {
    title: 'API 设计',
    href: 'https://github.com/your-org/vercel-cloud-drive/tree/main/docs/api',
    description: '预留的接口契约与交互约定，位于 docs/api。',
  },
];

export default function DocsLandingPage() {
  return (
    <main>
      <div className="container">
        <header>
          <div>
            <span className="badge">项目文档</span>
            <h1>了解 Vercel Cloud Drive 的规划</h1>
            <p>以下链接指向仓库中的文档目录，帮助你快速对齐需求与设计思路。</p>
          </div>
          <Link href="/" prefetch={false} aria-label="返回首页">
            返回首页
          </Link>
        </header>

        <section className="section-grid">
          {docLinks.map((link) => (
            <div className="card" key={link.title}>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
              <Link href={link.href} prefetch={false} aria-label={link.title}>
                查看文档
              </Link>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
