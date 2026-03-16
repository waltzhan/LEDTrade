import { crawlNews } from './crawler';
import { processArticles } from './ai-processor';
import { publishArticles } from './publisher';
import type { RawArticle } from './crawler';
import type { ProcessedArticle } from './ai-processor';

// 主流程
export async function runNewsAutomation(): Promise<void> {
  console.log('🚀 Starting news automation...');
  console.log(`⏰ ${new Date().toLocaleString()}`);
  
  try {
    // 1. 抓取新闻
    const rawArticles = await crawlNews();
    if (rawArticles.length === 0) {
      console.log('📭 No new articles found');
      return;
    }
    
    // 2. AI 处理
    const processedArticles = await processArticles(rawArticles);
    if (processedArticles.length === 0) {
      console.log('❌ Article processing failed');
      return;
    }
    
    // 3. 构建 sourceMap
    const sourceMap = new Map<string, { url: string; name: string }>();
    rawArticles.forEach((raw, index) => {
      if (processedArticles[index]) {
        sourceMap.set(processedArticles[index].title.zh, {
          url: raw.link,
          name: raw.source,
        });
      }
    });
    
    // 4. 发布到 Sanity
    const published = await publishArticles(processedArticles, sourceMap);
    
    console.log('\n📊 Summary:');
    console.log(`  Crawled: ${rawArticles.length}`);
    console.log(`  Processed: ${processedArticles.length}`);
    console.log(`  Published: ${published}`);
    
  } catch (error) {
    console.error('💥 Automation failed:', error);
    throw error;
  }
}

// 如果是直接运行此文件
if (require.main === module) {
  runNewsAutomation()
    .then(() => {
      console.log('✅ Done');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed:', error);
      process.exit(1);
    });
}
