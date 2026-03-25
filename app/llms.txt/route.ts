/**
 * llms.txt 路由处理器
 * 
 * 为 AI 爬虫提供网站结构导航
 */

import { generateLLMsTxt } from '@/lib/geo/llmstxt';

export async function GET() {
  const config = {
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
      'x-robots-tag': 'noindex', // Don't index this page itself
    },
  });
}
