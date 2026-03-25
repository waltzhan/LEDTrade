# 多行业模板部署指南

## 🎯 快速部署（30 分钟上线）

### 第一步：选择行业（1 分钟）

```bash
# 制造业
npm run setup:industry manufacturing

# 服务业
npm run setup:industry service

# 零售业
npm run setup:industry retail

# 科技行业
npm run setup:industry technology
```

### 第二步：配置 Sanity（5 分钟）

1. **访问** https://www.sanity.io/manage
2. **创建新项目**
   - 项目名称：Your Company CMS
   - 选择空白项目
3. **获取 Project ID**
   - 在项目设置中找到 Project ID
4. **创建 API Token**
   - 进入 Settings → API
   - 点击 "Add API token"
   - 名称：Website Token
   - 权限：Editor
   - 复制生成的 token

### 第三步：环境变量（2 分钟）

编辑 `.env.local`：

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=你的 project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=你的 api_token
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 第四步：启动开发（2 分钟）

```bash
# 终端 1：启动网站
npm run dev

# 终端 2：启动 CMS
npm run sanity
```

访问：
- http://localhost:3000 （网站）
- http://localhost:3333 （CMS 后台）

### 第五步：添加内容（10 分钟）

在 Sanity Studio 中：
1. 添加产品分类
2. 添加产品
3. 添加关于页面内容
4. 发布内容

### 第六步：部署上线（10 分钟）

#### Vercel 部署

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Vercel 部署**
   - 访问 https://vercel.com
   - Import GitHub Repository
   - 选择你的项目
   - 添加环境变量（复制 .env.local 的内容）
   - 点击 Deploy

3. **配置域名**
   - 在 Vercel Settings → Domains
   - 添加你的域名

---

## 🔧 自定义配置

### 修改品牌色

编辑 `tailwind.config.js`：

```javascript
colors: {
  primary: {
    500: '#你的颜色', // 主色调
  },
}
```

### 修改公司名称

编辑 `lib/config/industry.ts`：

```typescript
export const SITE_CONFIG: SiteConfig = {
  siteName: '你的公司名称',
  siteDescription: '公司描述',
};
```

### 添加更多语言

1. 编辑 `lib/config/industry.ts`：
```typescript
locales: ['zh', 'en', 'es', 'fr']
```

2. 在 `messages/` 目录创建对应的翻译文件

### 禁用不需要的功能

编辑 `lib/config/industry.ts`：

```typescript
enabledFeatures: {
  products: false,    // 不需要产品中心
  news: false,        // 不需要资讯中心
  geoSeo: true,       // 保留 SEO 优化
}
```

---

## 📦 行业特定配置

### 🏭 制造业

**特点**：产品展示为主，技术参数详细

**推荐配置**：
- ✅ 产品中心
- ✅ 产品分类
- ✅ 技术规格
- ✅ 联系表单
- ⚠️ 资讯（可选）

### 💼 服务业

**特点**：案例展示、专业内容

**推荐配置**：
- ✅ 案例研究
- ✅ 服务介绍
- ✅ 专家团队
- ✅ 联系表单
- ❌ 产品（通常不需要）

### 🛍️ 零售业

**特点**：产品目录、在线购买引导

**推荐配置**：
- ✅ 产品目录
- ✅ 产品分类
- ✅ 高清图库
- ✅ 购买链接
- ⚠️ 购物车（需额外开发）

### 💻 科技行业

**特点**：产品介绍、技术文档

**推荐配置**：
- ✅ 产品/SaaS
- ✅ 技术文档
- ✅ 案例展示
- ✅ SEO 优化
- ✅ API 文档（可选）

---

## 🚀 性能优化建议

### 图片优化

所有图片使用 WebP 格式：

```bash
# 批量转换图片
npm install -g sharp-cli
sharp input.jpg -f webp -o output.webp
```

### SEO 优化

1. **Meta 标签**：每个页面都有独特的 title 和 description
2. **Open Graph**：社交媒体分享优化
3. **Structured Data**：JSON-LD 结构化数据
4. **Sitemap**：自动生成 sitemap.xml

### 缓存策略

生产环境已配置 ISR：
- 产品页：1 小时缓存
- 新闻页：5 分钟缓存
- 静态页：24 小时缓存

---

## 🆘 常见问题

### Q: Sanity Studio 无法访问？

A: 检查是否启动了开发服务器：
```bash
cd sanity
npm run dev
```

### Q: 如何添加新产品？

A: 访问 http://localhost:3333 → 产品 → 新建产品

### Q: 如何修改导航菜单？

A: 编辑 `components/layout/navbar.tsx`

### Q: 如何更改域名？

A: 
1. 修改 `.env.local` 中的 `NEXT_PUBLIC_SITE_URL`
2. 在 Vercel Settings → Domains 添加新域名

---

## 📞 技术支持

- GitHub Issues: https://github.com/waltzhan/ledcoreco-website/issues
- 文档：TEMPLATE_README.md

---

**恭喜！您的企业官网已成功部署！** 🎉
