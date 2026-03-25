/**
 * GEO 评分系统
 * 
 * 基于 geo-seo-claude 项目的评分方法论
 * 评估网站的 AI 搜索引擎优化水平
 */

interface GEOScore {
  overall: number;           // 总分 (0-100)
  citability: number;        // AI 引用性 (25%)
  brandAuthority: number;    // 品牌权威 (20%)
  contentQuality: number;    // 内容质量 (20%)
  technicalSEO: number;      // 技术 SEO (15%)
  structuredData: number;    // 结构化数据 (10%)
  platformOptimization: number; // 平台优化 (10%)
}

interface GEOAuditResult {
  score: GEOScore;
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
  }>;
}

/**
 * 计算 AI 引用性得分（25%）
 */
function calculateCitabilityScore(content: {
  hasAIOptimizedContent: boolean;
  hasFAQSection: boolean;
  hasStatistics: boolean;
  hasComparisons: boolean;
  hasDefinitions: boolean;
  avgParagraphLength: number;
}): number {
  let score = 0;

  // 基础分
  if (content.hasAIOptimizedContent) score += 30;
  if (content.hasFAQSection) score += 20;
  if (content.hasStatistics) score += 20;
  if (content.hasComparisons) score += 15;
  if (content.hasDefinitions) score += 15;

  // 段落长度优化（理想 134-167 词）
  const optimalLength = content.avgParagraphLength >= 134 && content.avgParagraphLength <= 167;
  if (optimalLength) score += 20;
  else if (content.avgParagraphLength >= 100 && content.avgParagraphLength <= 200) score += 10;

  return Math.min(100, score);
}

/**
 * 计算品牌权威得分（20%）
 */
function calculateBrandAuthorityScore(brand: {
  hasOrganizationSchema: boolean;
  hasLocalBusinessSchema: boolean;
  hasSocialProfiles: boolean;
  yearsInBusiness: number;
  hasCertifications: boolean;
  mentionsOnExternalSites: number;
}): number {
  let score = 0;

  if (brand.hasOrganizationSchema) score += 20;
  if (brand.hasLocalBusinessSchema) score += 15;
  if (brand.hasSocialProfiles) score += 15;
  
  // 经营年限
  if (brand.yearsInBusiness >= 30) score += 20;
  else if (brand.yearsInBusiness >= 10) score += 10;
  
  if (brand.hasCertifications) score += 20;
  
  // 外部提及（模拟值）
  if (brand.mentionsOnExternalSites >= 100) score += 10;
  else if (brand.mentionsOnExternalSites >= 10) score += 5;

  return Math.min(100, score);
}

/**
 * 计算内容质量得分（20%）
 */
function calculateContentQualityScore(content: {
  hasEEATSignals: boolean;
  hasAuthorCredentials: boolean;
  hasCitations: boolean;
  contentFreshness: number; // days since last update
  readabilityScore: number; // 0-100
}): number {
  let score = 0;

  if (content.hasEEATSignals) score += 25;
  if (content.hasAuthorCredentials) score += 20;
  if (content.hasCitations) score += 15;
  
  // 内容新鲜度
  if (content.contentFreshness <= 7) score += 20;
  else if (content.contentFreshness <= 30) score += 10;
  
  // 可读性
  score += (content.readabilityScore / 100) * 20;

  return Math.min(100, score);
}

/**
 * 计算技术 SEO 得分（15%）
 */
function calculateTechnicalSEOScore(technical: {
  hasSSL: boolean;
  mobileFriendly: boolean;
  coreWebVitals: 'good' | 'needs-improvement' | 'poor';
  hasSitemap: boolean;
  hasRobotsTxt: boolean;
  pageLoadTime: number; // seconds
}): number {
  let score = 0;

  if (technical.hasSSL) score += 20;
  if (technical.mobileFriendly) score += 20;
  
  if (technical.coreWebVitals === 'good') score += 25;
  else if (technical.coreWebVitals === 'needs-improvement') score += 10;
  
  if (technical.hasSitemap) score += 10;
  if (technical.hasRobotsTxt) score += 10;
  
  if (technical.pageLoadTime < 2) score += 15;
  else if (technical.pageLoadTime < 4) score += 8;

  return Math.min(100, score);
}

/**
 * 计算结构化数据得分（10%）
 */
function calculateStructuredDataScore(schema: {
  hasProductSchema: boolean;
  hasOrganizationSchema: boolean;
  hasArticleSchema: boolean;
  hasBreadcrumbSchema: boolean;
  hasLocalBusinessSchema: boolean;
  hasFAQSchema: boolean;
}): number {
  let score = 0;

  if (schema.hasProductSchema) score += 25;
  if (schema.hasOrganizationSchema) score += 20;
  if (schema.hasArticleSchema) score += 20;
  if (schema.hasBreadcrumbSchema) score += 15;
  if (schema.hasLocalBusinessSchema) score += 10;
  if (schema.hasFAQSchema) score += 10;

  return Math.min(100, score);
}

/**
 * 计算平台优化得分（10%）
 */
function calculatePlatformOptimizationScore(platforms: {
  hasLLMsTxt: boolean;
  aiCrawlerAccessConfigured: boolean;
  hasAPIDocumentation: boolean;
  multiLanguageSupport: boolean;
  socialMediaIntegration: boolean;
}): number {
  let score = 0;

  if (platforms.hasLLMsTxt) score += 30;
  if (platforms.aiCrawlerAccessConfigured) score += 25;
  if (platforms.hasAPIDocumentation) score += 15;
  if (platforms.multiLanguageSupport) score += 15;
  if (platforms.socialMediaIntegration) score += 15;

  return Math.min(100, score);
}

/**
 * 计算综合 GEO 得分
 */
export function calculateGEOScore(data: {
  citability: Parameters<typeof calculateCitabilityScore>[0];
  brandAuthority: Parameters<typeof calculateBrandAuthorityScore>[0];
  contentQuality: Parameters<typeof calculateContentQualityScore>[0];
  technicalSEO: Parameters<typeof calculateTechnicalSEOScore>[0];
  structuredData: Parameters<typeof calculateStructuredDataScore>[0];
  platformOptimization: Parameters<typeof calculatePlatformOptimizationScore>[0];
}): GEOScore {
  const citability = calculateCitabilityScore(data.citability);
  const brandAuthority = calculateBrandAuthorityScore(data.brandAuthority);
  const contentQuality = calculateContentQualityScore(data.contentQuality);
  const technicalSEO = calculateTechnicalSEOScore(data.technicalSEO);
  const structuredData = calculateStructuredDataScore(data.structuredData);
  const platformOptimization = calculatePlatformOptimizationScore(data.platformOptimization);

  // 加权平均
  const overall = 
    citability * 0.25 +
    brandAuthority * 0.20 +
    contentQuality * 0.20 +
    technicalSEO * 0.15 +
    structuredData * 0.10 +
    platformOptimization * 0.10;

  return {
    overall: Math.round(overall),
    citability: Math.round(citability),
    brandAuthority: Math.round(brandAuthority),
    contentQuality: Math.round(contentQuality),
    technicalSEO: Math.round(technicalSEO),
    structuredData: Math.round(structuredData),
    platformOptimization: Math.round(platformOptimization),
  };
}

/**
 * 生成 GEO 审计报告
 */
export function generateGEOAudit(score: GEOScore): GEOAuditResult {
  const result: GEOAuditResult = {
    score,
    strengths: [],
    weaknesses: [],
    recommendations: [],
  };

  // 分析强项
  if (score.citability >= 80) result.strengths.push('优秀的 AI 引用优化内容');
  if (score.brandAuthority >= 80) result.strengths.push('强大的品牌权威信号');
  if (score.contentQuality >= 80) result.strengths.push('高质量 E-E-A-T 内容');
  if (score.technicalSEO >= 80) result.strengths.push('出色的技术 SEO 基础');
  if (score.structuredData >= 80) result.strengths.push('完善的结构化数据');
  if (score.platformOptimization >= 80) result.strengths.push('优秀的 AI 平台优化');

  // 分析弱项和建议
  if (score.citability < 60) {
    result.weaknesses.push('AI 引用优化不足');
    result.recommendations.push({
      priority: 'high',
      action: '添加 AI Citability 优化内容块（定义、对比、统计数据）',
      impact: '显著提升 AI 引用率',
      effort: 'medium',
    });
  }

  if (score.brandAuthority < 60) {
    result.weaknesses.push('品牌权威信号弱');
    result.recommendations.push({
      priority: 'high',
      action: '完善 Organization 和 LocalBusiness Schema，添加认证信息',
      impact: '增强 AI 对品牌的信任度',
      effort: 'low',
    });
  }

  if (score.contentQuality < 60) {
    result.weaknesses.push('内容 E-E-A-T 信号不足');
    result.recommendations.push({
      priority: 'medium',
      action: '添加作者资质、引用来源、更新日期',
      impact: '提升内容可信度',
      effort: 'medium',
    });
  }

  if (score.structuredData < 60) {
    result.weaknesses.push('结构化数据不完整');
    result.recommendations.push({
      priority: 'high',
      action: '为所有产品页添加完整 Product Schema',
      impact: '提升 AI 理解与展示',
      effort: 'medium',
    });
  }

  if (score.platformOptimization < 60) {
    result.weaknesses.push('AI 平台优化缺失');
    result.recommendations.push({
      priority: 'high',
      action: '创建 llms.txt 文件，配置 AI 爬虫访问规则',
      impact: '帮助 AI 爬虫更好理解网站',
      effort: 'low',
    });
  }

  return result;
}

/**
 * 获取当前网站的 GEO 得分（示例）
 */
export function getCurrentSiteScore(): GEOScore {
  // 基于我们项目的实际情况评估
  return calculateGEOScore({
    citability: {
      hasAIOptimizedContent: true,      // 已有 AI 生成功能
      hasFAQSection: false,             // TODO: 添加
      hasStatistics: false,             // TODO: 添加
      hasComparisons: false,            // TODO: 添加
      hasDefinitions: false,            // TODO: 添加
      avgParagraphLength: 150,          // 估计值
    },
    brandAuthority: {
      hasOrganizationSchema: true,      // ✅ 已有
      hasLocalBusinessSchema: true,     // ✅ 已有
      hasSocialProfiles: true,          // 假设有
      yearsInBusiness: 30,              // 1994 年成立
      hasCertifications: true,          // ISO, RoHS, CE
      mentionsOnExternalSites: 50,      // 估计值
    },
    contentQuality: {
      hasEEATSignals: true,             // 有企业信息
      hasAuthorCredentials: false,      // TODO: 添加
      hasCitations: false,              // TODO: 添加
      contentFreshness: 1,              // 每日更新新闻
      readabilityScore: 75,             // 估计值
    },
    technicalSEO: {
      hasSSL: true,                     // ✅ HTTPS
      mobileFriendly: true,             // ✅ 响应式
      coreWebVitals: 'good',            // Next.js 性能好
      hasSitemap: true,                 // ✅ 有 sitemap
      hasRobotsTxt: true,               // ✅ 有 robots.txt
      pageLoadTime: 1.5,                // Next.js 快
    },
    structuredData: {
      hasProductSchema: true,           // ✅ 已有
      hasOrganizationSchema: true,      // ✅ 已有
      hasArticleSchema: true,           // ✅ 已有
      hasBreadcrumbSchema: true,        // ✅ 已有
      hasLocalBusinessSchema: true,     // ✅ 已有
      hasFAQSchema: false,              // TODO: 添加
    },
    platformOptimization: {
      hasLLMsTxt: false,                // 🆕 刚创建，待部署
      aiCrawlerAccessConfigured: false, // TODO: 配置
      hasAPIDocumentation: false,       // TODO: 添加
      multiLanguageSupport: true,       // ✅ 6 种语言
      socialMediaIntegration: true,     // 假设有
    },
  });
}
