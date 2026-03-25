/**
 * AI Crawler 配置与管理
 * 
 * 管理各类 AI 爬虫的访问权限
 * 参考：https://github.com/zubair-trabzada/geo-seo-claude/blob/main/skills/geo-crawlers/
 */

interface AICrawler {
  name: string;
  userAgent: string;
  description: string;
  recommended: 'allow' | 'block' | 'selective';
  purpose: string;
}

/**
 * 主流 AI 爬虫列表（2026 年）
 */
export const AI_CRAWLERS: AICrawler[] = [
  {
    name: 'ChatGPT (OpenAI)',
    userAgent: 'GPTBot',
    description: 'OpenAI 的爬虫，用于训练 ChatGPT',
    recommended: 'selective',
    purpose: 'AI 训练与引用'
  },
  {
    name: 'Claude (Anthropic)',
    userAgent: 'ClaudeBot',
    description: 'Anthropic 的 Claude AI 爬虫',
    recommended: 'allow',
    purpose: 'AI 训练与引用'
  },
  {
    name: 'Google AI Overviews',
    userAgent: 'Google-Extended',
    description: 'Google AI Overviews (SGE) 爬虫',
    recommended: 'allow',
    purpose: 'AI 搜索摘要'
  },
  {
    name: 'Perplexity',
    userAgent: 'PerplexityBot',
    description: 'Perplexity AI 搜索引擎',
    recommended: 'allow',
    purpose: 'AI 搜索与引用'
  },
  {
    name: 'Bing Chat',
    userAgent: 'bingbot',
    description: 'Microsoft Bing 搜索和 AI',
    recommended: 'allow',
    purpose: '搜索与 AI'
  },
  {
    name: 'You.com',
    userAgent: 'YouBot',
    description: 'You.com AI 搜索引擎',
    recommended: 'allow',
    purpose: 'AI 搜索'
  },
  {
    name: 'Common Crawl',
    userAgent: 'CCBot',
    description: 'Common Crawl 数据集（被多家 AI 公司使用）',
    recommended: 'allow',
    purpose: '开放数据集'
  },
  {
    name: 'Omgili',
    userAgent: 'omgili',
    description: '论坛和社区内容爬虫',
    recommended: 'selective',
    purpose: '社区内容聚合'
  },
  {
    name: 'Facebook Bot',
    userAgent: 'facebookexternalhit',
    description: 'Facebook/Meta 爬虫',
    recommended: 'allow',
    purpose: '社交媒体分享'
  },
  {
    name: 'Twitter Bot',
    userAgent: 'Twitterbot',
    description: 'Twitter/X 爬虫',
    recommended: 'allow',
    purpose: '社交媒体分享'
  },
  {
    name: 'LinkedIn Bot',
    userAgent: 'LinkedInBot',
    description: 'LinkedIn 爬虫',
    recommended: 'allow',
    purpose: '职业社交'
  },
];

/**
 * 生成 robots.txt 内容（AI 爬虫优化版）
 */
export function generateRobotsTxt(options?: {
  allowAICrawlers?: boolean;
  blockSpecificCrawlers?: string[];
}): string {
  const { allowAICrawlers = true, blockSpecificCrawlers = [] } = options || {};

  let content = `# Robots.txt for GOPRO LED
# Generated: ${new Date().toISOString()}
# Website: https://ledcoreco.com

# Sitemap
Sitemap: https://ledcoreco.com/sitemap.xml

# Default User-Agent
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /studio/
Disallow: /*?*
Disallow: /*.json$

# Crawl-delay for all bots
Crawl-delay: 1

`;

  if (allowAICrawlers) {
    // 允许有益的 AI 爬虫
    content += `# ========================================
# AI Crawlers - Allowed
# ========================================

# ChatGPT (OpenAI) - Selective access
User-agent: GPTBot
Allow: /en/
Allow: /products/
Allow: /news/
Disallow: /api/
Crawl-delay: 2

# Claude (Anthropic) - Full access
User-agent: ClaudeBot
Allow: /
Crawl-delay: 1

# Google AI Overviews
User-agent: Google-Extended
Allow: /
Crawl-delay: 1

# Perplexity AI
User-agent: PerplexityBot
Allow: /
Crawl-delay: 1

# You.com AI
User-agent: YouBot
Allow: /
Crawl-delay: 1

# Common Crawl (Open Dataset)
User-agent: CCBot
Allow: /
Crawl-delay: 5

`;
  } else {
    // 阻止所有 AI 爬虫
    content += `# ========================================
# AI Crawlers - Blocked
# ========================================

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: YouBot
Disallow: /

`;
  }

  // 阻止特定的爬虫
  if (blockSpecificCrawlers.length > 0) {
    content += `# ========================================
# Specifically Blocked Crawlers
# ========================================

`;
    blockSpecificCrawlers.forEach(ua => {
      content += `User-agent: ${ua}\nDisallow: /\n\n`;
    });
  }

  // 社交媒体爬虫（总是允许）
  content += `# ========================================
# Social Media Bots - Always Allowed
# ========================================

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

`;

  return content;
}

/**
 * 获取推荐的 AI 爬虫策略
 */
export function getRecommendedStrategy(): {
  allowed: string[];
  blocked: string[];
  selective: string[];
} {
  const allowed: string[] = [];
  const blocked: string[] = [];
  const selective: string[] = [];

  AI_CRAWLERS.forEach(crawler => {
    if (crawler.recommended === 'allow') {
      allowed.push(crawler.userAgent);
    } else if (crawler.recommended === 'block') {
      blocked.push(crawler.userAgent);
    } else {
      selective.push(crawler.userAgent);
    }
  });

  return { allowed, blocked, selective };
}

/**
 * 检查特定爬虫是否应该被允许
 */
export function shouldAllowCrawler(userAgent: string): boolean {
  const crawler = AI_CRAWLERS.find(
    c => c.userAgent.toLowerCase() === userAgent.toLowerCase()
  );

  if (!crawler) {
    return true; // 未知爬虫默认允许
  }

  return crawler.recommended !== 'block';
}

/**
 * 获取爬虫详细信息
 */
export function getCrawlerInfo(userAgent: string): AICrawler | null {
  return (
    AI_CRAWLERS.find(
      c => c.userAgent.toLowerCase() === userAgent.toLowerCase()
    ) || null
  );
}
