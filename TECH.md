# 技术文档

本文档面向开发者，说明 funAgent 官网的技术实现、架构决策和扩展指南。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | [Astro 5](https://astro.build) |
| 样式 | [Tailwind CSS 4](https://tailwindcss.com) |
| 语言 | [TypeScript](https://typescriptlang.org) |
| 部署 | [Vercel](https://vercel.com) |
| 内容管理 | [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) |

---

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/funAgent/fun-agent-app.git
cd fun-agent-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:4321

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

## 项目结构

```
fun-agent-app/
├── src/
│   ├── components/      # 可复用组件（Header、Footer、ProjectCard 等）
│   ├── content/
│   │   └── projects/    # 项目数据 YAML 文件（核心扩展点）
│   ├── i18n/           # 国际化文案（zh.ts / en.ts）
│   ├── layouts/        # 页面布局（Base.astro 含 SEO 模板）
│   ├── pages/          # 路由页面
│   │   └── [locale]/   # 动态语言路由
│   └── styles/         # 全局样式与 CSS 变量
├── public/             # 静态资源
│   └── projects/       # 各项目的 logo、截图、视频
├── astro.config.mjs    # Astro 配置（i18n、Vercel adapter）
└── vercel.json         # Vercel 部署配置
```

---

## 如何添加新项目

只需两步，无需修改任何代码：

### 1. 添加项目数据

在 `src/content/projects/` 创建 YAML 文件：

```yaml
# src/content/projects/my-project.yaml
name: My Project
slug: my-project
tagline:
  zh: 中文一句话描述
  en: English one-line description
description:
  zh: 详细的中文项目描述
  en: Detailed English project description
category: tool              # tool | course | experiment
status: released            # released | beta | wip
website: https://example.com
github: https://github.com/funAgent/my-project
download: https://github.com/funAgent/my-project/releases
logo: /projects/my-project/logo.png
screenshots:
  - /projects/my-project/screenshots/1.jpg
  - /projects/my-project/screenshots/2.jpg
techStack:
  - React
  - TypeScript
  - Vite
featured: true
order: 3
```

### 2. 放入静态资源

将图片/视频放入对应目录：

```
public/projects/my-project/
├── logo.png
└── screenshots/
    ├── 1.jpg
    └── 2.jpg
```

重新构建，新项目将自动出现在首页和项目列表页。

---

## 内容集合 Schema

项目数据通过 Zod Schema 校验，确保类型安全：

```typescript
// src/content.config.ts
const projects = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.object({ zh: z.string(), en: z.string() }),
    description: z.object({ zh: z.string(), en: z.string() }),
    category: z.enum(['tool', 'course', 'experiment']),
    status: z.enum(['released', 'beta', 'wip']),
    website: z.string().url().optional(),
    github: z.string().url(),
    // ... 更多字段
  }),
});
```

---

## i18n 实现

采用 Astro 原生 i18n 路由：

- **默认语言**: 中文 (`zh`)
- **备选语言**: 英文 (`en`)
- **URL 结构**: `/:locale/path`
- **回退策略**: 根路径 `/` 自动重定向到 `/zh/`

UI 文案集中管理于 `src/i18n/`：
- `zh.ts` — 中文界面文本
- `en.ts` — 英文界面文本
- `index.ts` — 工具函数与类型定义

---

## SEO 特性

- **多语言 hreflang** — 自动为每种语言生成 `hreflang` 和 `x-default` 标签
- **Open Graph** — 完整 OG 标签，支持社交分享卡片
- **Twitter Cards** — `summary_large_image` 格式
- **JSON-LD** — Organization、WebSite、BreadcrumbList 结构化数据
- **Sitemap** — 自动生成 `sitemap-index.xml`
- **Canonical URL** — 规范链接避免重复内容

---

## 部署

项目已配置 [Vercel](https://vercel.com) 适配器，支持：

- 自动静态站点生成 (`output: 'static'`)
- 构建时 Content Collections 同步
- 边缘网络全球分发

```bash
# 使用 Vercel CLI 部署
vercel --prod
```

---

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 开源协议

[MIT](../LICENSE) © funAgent
