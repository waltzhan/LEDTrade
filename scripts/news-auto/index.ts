import { crawlNews } from './crawler';
import { processArticles } from './ai-processor';
import { publishArticles, checkDuplicate } from './publisher';
import { shouldPublish, getPublishQuota } from './scheduler';
import type { RawArticle } from './crawler';
import type { ProcessedArticle } from './ai-processor';

// 预检查重复文章（不重复的才进行 AI 处理）
async function filterNonDuplicateArticles(
  articles: RawArticle[]
): Promise<{ nonDuplicate: RawArticle[]; duplicates: string[] }> {
  const nonDuplicate: RawArticle[] = [];
  const duplicates: string[] = [];
  
  for (const article of articles) {
    const isDuplicate = await checkDuplicate(article.title, article.link);
    if (isDuplicate) {
      duplicates.push(article.title);
      console.log(`  ⏭️  跳过重复文章：${article.title.substring(0, 40)}...`);
    } else {
      nonDuplicate.push(article);
    }
  }
  
  return { nonDuplicate, duplicates };
}

// 主流程
export async function runNewsAutomation(): Promise<void> {
  console.log('🚀 Starting news automation...');
  console.log(`⏰ ${new Date().toLocaleString()} (UTC)`);
  console.log(`🌏 Beijing Time: ${new Date(Date.now() + 8 * 60 * 60 * 1000).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);

  try {
    // 1. 检查是否应该发布（时间窗口 + 每日限额）
    const publishCheck = await shouldPublish();
    console.log(`\n📋 Publish check: ${publishCheck.reason}`);
    console.log(`   Remaining quota: ${publishCheck.remaining}`);

    if (!publishCheck.should) {
      console.log('⏹️ Skipping automation:', publishCheck.reason);
      return;
    }

    // 2. 抓取新闻
    const rawArticles = await crawlNews();
    if (rawArticles.length === 0) {
      console.log('📭 No new articles found');
      return;
    }

    // 3. 先全量去重，再按配额取（修复：原来先切片再去重导致配额内全重复时发布0篇）
    const quota = await getPublishQuota();
    console.log(`\n🔍 Pre-checking for duplicates (total: ${rawArticles.length})...`);
    const { nonDuplicate, duplicates } = await filterNonDuplicateArticles(rawArticles);
    console.log(`   ✓ Non-duplicate articles: ${nonDuplicate.length}`);
    console.log(`   ⏭️  Duplicates found: ${duplicates.length}`);

    if (nonDuplicate.length === 0) {
      console.log('\n⚠️  No new articles to process (all are duplicates)');
      console.log('\n📊 ====== 任务完成摘要 ======');
      console.log(`  🕷️  抓取：${rawArticles.length} 篇`);
      console.log(`  ⏭️  重复跳过：${duplicates.length} 篇`);
      console.log(`  🤖 AI 处理：0 篇`);
      console.log(`  ✅ 发布成功：0 篇`);
      console.log('============================\n');
      return;
    }

    // 4. 从非重复文章中按配额取，再 AI 处理
    const articlesToProcess = nonDuplicate.slice(0, quota);
    console.log(`\n📝 Processing ${articlesToProcess.length} articles (quota: ${quota}, available: ${nonDuplicate.length})`);

    const processedArticles = await processArticles(articlesToProcess);
    if (processedArticles.length === 0) {
      console.log('❌ Article processing failed');
      return;
    }

    // 5. 构建 sourceMap
    const sourceMap = new Map<string, { url: string; name: string; imageUrl?: string }>();
    articlesToProcess.forEach((raw, index) => {
      if (processedArticles[index]) {
        sourceMap.set(processedArticles[index].title.zh, {
          url: raw.link,
          name: raw.source,
          imageUrl: raw.imageUrl,
        });
      }
    });

    // 6. 发布到 Sanity
    const published = await publishArticles(processedArticles, sourceMap);

    console.log('\n📊 ====== 任务完成摘要 ======');
    console.log(`  🕷️  抓取：${rawArticles.length} 篇`);
    console.log(`  ⏭️  重复跳过：${duplicates.length} 篇`);
    console.log(`  🤖 AI 处理：${processedArticles.length} 篇`);
    console.log(`  ✅ 发布成功：${published} 篇`);
    console.log(`  💾 剩余配额：${quota - published} 篇`);
    
    // 显示发布的文章详情
    if (published > 0) {
      console.log('\n📋 已发布文章列表:');
      processedArticles.slice(0, published).forEach((article, idx) => {
        console.log(`  ${idx + 1}. ${article.title.zh}`);
      });
    }
    console.log('============================\n');

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
