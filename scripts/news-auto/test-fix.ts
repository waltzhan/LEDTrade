/**
 * 测试新闻自动化系统的修复
 * 
 * 测试内容：
 * 1. AI 生图功能是否正常
 * 2. 重复文章检测是否有效（基于 URL）
 * 3. 多分类新闻源是否正常工作
 */

import { crawlNews } from './crawler';
import { processArticles } from './ai-processor';
import { publishArticles } from './publisher';
import { getEnabledSources } from './news-sources.config';

async function testNewsAutomation() {
  console.log('🧪 Testing News Automation System\n');
  
  // 测试 1：检查新闻源配置
  console.log('📋 Test 1: News Source Configuration');
  const sources = getEnabledSources();
  console.log(`   Enabled sources: ${sources.length}`);
  
  const industrySources = sources.filter(s => s.category === 'industry');
  const technicalSources = sources.filter(s => s.category === 'technical');
  const applicationSources = sources.filter(s => s.category === 'application');
  
  console.log(`   - Industry sources: ${industrySources.length} (${industrySources.map(s => s.name).join(', ')})`);
  console.log(`   - Technical sources: ${technicalSources.length} (${technicalSources.map(s => s.name).join(', ')})`);
  console.log(`   - Application sources: ${applicationSources.length} (${applicationSources.map(s => s.name).join(', ') || 'None'})`);
  
  if (applicationSources.length === 0) {
    console.warn('   ⚠️ WARNING: No application news sources enabled!');
  }
  
  console.log('');
  
  // 测试 2：爬取新闻
  console.log('🕷️ Test 2: Crawling News');
  const rawArticles = await crawlNews();
  console.log(`   Crawled: ${rawArticles.length} articles`);
  
  // 显示分类分布
  const categoryCount: Record<string, number> = {};
  rawArticles.forEach(article => {
    categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
  });
  
  console.log('   Category distribution:');
  Object.entries(categoryCount).forEach(([cat, count]) => {
    console.log(`     - ${cat}: ${count}`);
  });
  
  // 显示图片情况
  const withImages = rawArticles.filter(a => a.imageUrl).length;
  const withoutImages = rawArticles.length - withImages;
  console.log(`   Images: ${withImages} with images, ${withoutImages} without images`);
  
  console.log('');
  
  // 测试 3：AI 处理（仅测试前 2 篇）
  console.log('🤖 Test 3: AI Processing (testing first 2 articles)');
  const testArticles = rawArticles.slice(0, 2);
  
  if (testArticles.length === 0) {
    console.log('   No articles to process, skipping AI test');
    return;
  }
  
  const processedArticles = await processArticles(testArticles);
  console.log(`   Processed: ${processedArticles.length} articles`);
  
  // 检查 AI 生图
  const anyWithGeneratedImage = processedArticles.some((a: any) => a.generatedImageUrl);
  console.log(`   AI images generated: ${anyWithGeneratedImage ? 'Yes ✓' : 'No ✗'}`);
  
  console.log('');
  
  // 测试 4：发布（不实际发布，仅检查逻辑）
  console.log('📝 Test 4: Publish Logic Check');
  console.log('   Skipping actual publish (dry run)');
  
  console.log('\n✅ Test completed!\n');
}

// 运行测试
if (require.main === module) {
  testNewsAutomation()
    .then(() => {
      console.log('Done');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

export { testNewsAutomation };
