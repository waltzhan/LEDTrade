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

    // 3. 根据剩余配额限制处理数量
    const quota = await getPublishQuota();
    const articlesToProcess = rawArticles.slice(0, quota);
    console.log(`\n📝 Processing ${articlesToProcess.length} articles (quota: ${quota})`);

    // 3.5 预检查重复（在 AI 处理之前过滤掉已存在的文章）
    console.log(`\n🔍 Pre-checking for duplicates...`);
    const { nonDuplicate, duplicates } = await filterNonDuplicateArticles(articlesToProcess);
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

    // 4. AI 处理（只处理非重复的文章）
    const processedArticles = await processArticles(nonDuplicate);
    if (processedArticles.length === 0) {
      console.log('❌ Article processing failed');
      return;
    }

    // 5. 构建 sourceMap（使用非重复的文章列表）
    const sourceMap = new Map<string, { url: string; name: string; imageUrl?: string }>();
    nonDuplicate.forEach((raw, index) => {
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
