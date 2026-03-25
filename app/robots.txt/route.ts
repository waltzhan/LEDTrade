/**
 * robots.txt 路由处理器（AI 爬虫优化版）
 */

import { generateRobotsTxt } from '@/lib/geo/ai-crawlers';

export async function GET() {
  const robotsTxt = generateRobotsTxt({
    allowAICrawlers: true, // 允许有益的 AI 爬虫
    blockSpecificCrawlers: [], // 可以添加需要阻止的特定爬虫
  });

  return new Response(robotsTxt, {
    headers: {
      'content-type': 'text/plain',
      'cache-control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
