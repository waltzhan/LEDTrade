/**
 * 自动化新闻生成配置
 * ⚠️ 新闻源配置已迁移到独立文件：scripts/news-auto/news-sources.config.ts
 *     维护新闻源时请直接编辑该独立文件，无需改动此处。
 */
export const NEWS_CONFIG = {
  // 发布设置
  publish: {
    maxArticlesPerDay: 2,
    publishTimes: ['09:00', '15:00'], // 目标市场时区
    autoPublish: true,
  },

  // 关键词过滤 - 放宽条件以获取更多文章
  keywords: {
    required: ['LED', 'Micro LED', 'Mini LED', 'OLED', '半导体', '光电', '显示', '照明', '光运用', '光传感', '智能传感', '具身智能', 'Marvell', 'Mojo Vision', 'ams OSRAM', 'Eaglerise'],
    optional: ['光莆', 'GOPRO', '红外', '紫外', '可见光', 'UV', 'IR', '光学', '芯片', '封装', 'Mini LED', 'Micro LED'],
    exclude: ['股票', '股价', '投资', '理财', '赌博'],
  },

  // AI 改写配置
  ai: {
    model: 'qwen-turbo', // 通义千问模型
    maxTokens: 2000,
    temperature: 0.7,
  },

  // 内容质量阈值
  quality: {
    minWordCount: 500,
    maxWordCount: 2000,
    minKeywordDensity: 0.01,
  },
};

// 分类映射
export const CATEGORY_MAP: Record<string, string> = {
  'industry': '行业动态',
  'technical': '技术文章',
  'application': '应用案例',
};

// 目标语言
export const TARGET_LOCALES = ['zh', 'en', 'id', 'th', 'vi', 'ar'];
