# 多行业企业官网模板 🚀

基于 Next.js 14 + Sanity CMS 的现代化企业官网模板，支持快速部署到多个行业。

## ✨ 特性

### 核心功能
- ✅ **Next.js 14 App Router** - 现代 React 框架
- ✅ **Sanity CMS** - 灵活的无头 CMS
- ✅ **多语言支持** - i18n 国际化（默认中英文）
- ✅ **Tailwind CSS** - 原子化 CSS 框架
- ✅ **SEO 优化** - 内置 GEO-SEO 技术
- ✅ **响应式设计** - 移动端优先

### 可选模块
- 📦 **产品中心** - 适合制造业、零售业
- 📰 **资讯中心** - 支持手动发布和自动采集
- 🤖 **AI 内容生成** - 通义千问集成（可选）
- 📧 **联系表单** - 询盘/咨询表单
- 📊 **数据分析** - Google Analytics 集成
- 🔍 **GEO-SEO** - AI 搜索引擎优化

## 🎯 行业预设

支持 6 种行业预设配置：

| 行业 | 适用场景 | 包含模块 |
|------|---------|---------|
| 🏭 **制造业** | LED、电子、机械制造 | 产品、资讯、联系表单 |
| 💼 **服务业** | 咨询、法律、会计 | 资讯、联系表单 |
| 🛍️ **零售业** | 电商、品牌零售 | 产品、资讯、联系表单 |
| 💻 **科技行业** | 软件、SaaS、AI | 产品、资讯、SEO |
| 🏥 **医疗健康** | 医院、诊所 | 资讯、联系表单 |
| 🎓 **教育培训** | 学校、培训机构 | 资讯、联系表单 |

## 🚀 快速开始

### 1. 选择行业模板

```bash
# 制造业（默认）
npm run setup:industry manufacturing

# 服务业
npm run setup:industry service

# 零售业
npm run setup:industry retail

# 科技行业
npm run setup:industry technology
```

### 2. 配置环境变量

编辑 `.env.local` 文件：

```env
# Sanity CMS 配置
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token

# 网站 URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动开发服务器

```bash
# 启动网站
npm run dev

# 启动 Sanity Studio（新终端）
npm run sanity
```

访问：
- 网站：http://localhost:3000
- CMS 后台：http://localhost:3333

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── [locale]/          # 多语言路由
│   │   ├── products/      # 产品页面
│   │   ├── news/          # 新闻页面
│   │   ├── about/         # 关于页面
│   │   └── contact/       # 联系页面
│   └── api/               # API 路由
├── components/            # React 组件
├── lib/
│   ├── config/           # 配置文件
│   │   └── industry.ts   # 行业配置
│   ├── sanity/           # Sanity 客户端
│   └── i18n/             # 国际化配置
├── sanity/               # Sanity Studio
│   └── schemas/          # 内容模型
├── scripts/              # 工具脚本
│   └── setup-industry.js # 行业初始化
├── messages/             # 翻译文件
└── public/               # 静态资源
```

## ⚙️ 自定义配置

### 修改行业配置

编辑 `lib/config/industry.ts`：

```typescript
export const SITE_CONFIG: SiteConfig = {
  siteName: 'Your Company',
  siteDescription: 'Professional solutions',
  industry: 'manufacturing',
  primaryColor: '#3B82F6',
  locales: ['zh', 'en'],
  
  enabledFeatures: {
    products: true,
    news: true,
    geoSeo: true,
    contactForm: true,
  },
};
```

### 添加新语言

1. 在 `lib/config/industry.ts` 中添加语言代码
2. 在 `messages/` 目录创建对应的翻译文件

## 🎨 主题定制

### 修改主色调

编辑 `tailwind.config.js`：

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6', // 修改这里
        600: '#2563eb',
      },
    },
  },
}
```

## 📦 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 自动部署

### Sanity 部署

```bash
cd sanity
sanity deploy
```

## 🛠️ 开发脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 初始化行业模板
npm run setup:industry <industry>

# 启动 Sanity Studio
npm run sanity
```

## 📝 许可证

MIT License

## 👥 支持

GitHub: https://github.com/waltzhan

## 🎯 下一步

- [ ] 根据行业预设配置内容模型
- [ ] 自定义站点信息和品牌色
- [ ] 配置 Sanity CMS 项目
- [ ] 添加实际内容
- [ ] 部署到生产环境

---

**基于此模板，您可以在 30 分钟内部署一个专业的企业官网！** 🚀
