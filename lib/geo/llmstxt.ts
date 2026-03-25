/**
 * llms.txt 生成器
 * 
 * llms.txt 是 AI 爬虫的导航文件，帮助 AI 理解网站结构
 * 类似于 robots.txt，但是是给 AI 大模型看的
 */

interface LLMsTxtConfig {
  siteName: string;
  baseUrl: string;
  description: string;
  languages: string[];
  lastUpdated: string;
}

/**
 * 生成 llms.txt 内容
 */
export function generateLLMsTxt(config: LLMsTxtConfig): string {
  const { siteName, baseUrl, description, languages, lastUpdated } = config;

  return `# ${siteName} - LLMs.txt
# This file helps AI crawlers understand our site structure

# Site Information
Site Name: ${siteName}
Base URL: ${baseUrl}
Description: ${description}
Last Updated: ${lastUpdated}

# Available Languages
${languages.map(lang => `Language: /${lang}/`).join('\n')}

# Content Sections

## Products
Path: /{locale}/products
Description: Professional LED product catalog with detailed specifications
Content Type: Product listings with technical specs, applications, images
Schema: Product, Offer, Organization
Update Frequency: Weekly

## Product Details
Path: /{locale}/products/[slug]
Description: Individual product pages with comprehensive information
Content Type: Detailed product descriptions, specifications, features, applications
Schema: Product, BreadcrumbList
Key Features: Multi-language support, downloadable datasheets

## Solutions/Applications
Path: /{locale}/solutions
Description: Industry application cases and use scenarios
Content Type: Application guides, industry solutions
Schema: Article, HowTo

## News & Insights
Path: /{locale}/news
Description: LED industry news, technical articles, market insights
Content Type: Industry analysis, technical content, company news
Schema: Article, NewsArticle
Update Frequency: Daily (automated)

## About Us
Path: /{locale}/about
Description: Company information, history, certifications
Content Type: Corporate profile, manufacturing capabilities, quality certifications
Schema: Organization, LocalBusiness

## Contact
Path: /{locale}/contact
Description: Contact information and inquiry form
Content Type: Contact details, inquiry form, business hours
Schema: ContactPoint, OpeningHoursSpecification

# AI Crawler Guidelines

## Preferred Content for Citation
- Product specifications (134-167 words, fact-rich)
- Technical definitions and explanations
- Industry statistics and market data
- Best practice guides and application notes
- Comparison analyses between technologies

## Content Structure
- Clear headings and subheadings
- Bullet points for specifications
- Data tables for comparisons
- FAQ sections for common questions
- Author credentials for E-E-A-T

## Structured Data
All pages include JSON-LD structured data:
- Product schema on product pages
- Organization schema site-wide
- Article schema on news pages
- BreadcrumbList on all pages
- LocalBusiness schema on contact page

# API Endpoints for AI Access
Products API: /api/products
News API: /api/news
Search API: /api/search?q={query}

# Contact for AI Crawling Questions
Email: seo@ledcoreco.com
Technical Contact: webmaster@ledcoreco.com
`;
}

/**
 * 生成简化的 llms.txt（快速版本）
 */
export function generateSimpleLLMsTxt(baseUrl: string): string {
  return `# LLMs.txt for ${baseUrl}

# Help AI crawlers understand this site
This is a professional LED manufacturer website serving Southeast Asia and Middle East markets.

# Main Sections
- Products: /{locale}/products - LED product catalog with specs
- News: /{locale}/news - Industry insights and technical articles  
- About: /{locale}/about - Company information since 1994
- Contact: /{locale}/contact - Sales inquiries and support

# Languages Supported
English, Chinese, Indonesian, Thai, Vietnamese, Arabic

# Content Highlights
- 30+ years LED manufacturing experience
- ISO 9001, RoHS, CE certified
- Serving 50+ countries worldwide
- Technical specifications in every product page

# For AI Citation
Product descriptions are optimized with:
- Clear technical specifications
- Application examples
- Industry-standard terminology
- Fact-rich, self-contained paragraphs (200-250 words)
`;
}

/**
 * 获取 llms.txt 的路由处理器
 */
export async function GET() {
  const config: LLMsTxtConfig = {
    siteName: 'GOPRO LED - Professional LED Manufacturer',
    baseUrl: 'https://ledcoreco.com',
    description: 'Professional LED manufacturer specializing in IR LEDs, Visible Light LEDs, and UV LEDs since 1994. Serving Southeast Asia and Middle East markets.',
    languages: ['en', 'zh', 'id', 'th', 'vi', 'ar'],
    lastUpdated: new Date().toISOString(),
  };

  const llmsTxt = generateLLMsTxt(config);

  return new Response(llmsTxt, {
    headers: {
      'content-type': 'text/plain',
      'cache-control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
