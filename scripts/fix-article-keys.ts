/**
 * 修复资讯文章缺少 _key 的问题
 * 
 * 使用方法：npx tsx scripts/fix-article-keys.ts
 */

import { createClient } from '@sanity/client';

// Sanity 客户端配置
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nckyp28c',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// 生成唯一的 _key
function generateKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 获取所有文章
async function getAllArticles() {
  const query = `*[_type == "article"]{
    _id,
    title,
    content
  }`;
  
  return await client.fetch(query);
}

// 修复单个语言的内容
function fixLanguageContent(content: any): boolean {
  if (!content || typeof content !== 'object') {
    return false;
  }
  
  let hasChanges = false;
  
  // 遍历每个语言字段
  for (const lang of ['zh', 'en', 'id', 'th', 'vi', 'ar']) {
    if (content[lang] && Array.isArray(content[lang])) {
      // 检查数组中的每一项是否有 _key
      let needsFix = false;
      
      for (const item of content[lang]) {
        if (item && typeof item === 'object' && !item._key) {
          needsFix = true;
          break;
        }
      }
      
      if (needsFix) {
        // 为没有 _key 的项添加 _key
        content[lang] = content[lang].map((item: any) => {
          if (item && typeof item === 'object' && !item._key) {
            hasChanges = true;
            return {
              ...item,
              _key: generateKey(),
            };
          }
          return item;
        });
        
        console.log(`    ✓ Fixed ${lang} content`);
      }
    }
  }
  
  return hasChanges;
}

// 主函数
async function main() {
  console.log('🔧 Starting to fix article content keys...\n');
  
  const articles = await getAllArticles();
  console.log(`Found ${articles.length} articles\n`);
  
  let fixedCount = 0;
  let errorCount = 0;
  
  for (const article of articles) {
    try {
      const articleName = article.title?.zh || article.title?.en || 'Unknown';
      console.log(`📄 Processing: ${articleName}`);
      
      if (!article.content) {
        console.log('   ℹ️  No content field, skipping\n');
        continue;
      }
      
      const hasChanges = fixLanguageContent(article.content);
      
      if (hasChanges) {
        // 使用 transaction 更新文档
        const transaction = client.transaction();
        transaction.patch(article._id, (patch: any) => patch.set({ content: article.content }));
        await transaction.commit();
        console.log(`   ✅ Fixed and updated\n`);
        fixedCount++;
      } else {
        console.log(`   ℹ️  No changes needed\n`);
      }
    } catch (error: any) {
      errorCount++;
      console.error(`   ❌ Error processing ${article.title?.zh}:`, error.message);
      console.error('');
    }
    
    // 避免 API 限流
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n========================================');
  console.log('✅ Fix completed!');
  console.log(`Total articles: ${articles.length}`);
  console.log(`Fixed: ${fixedCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log('========================================\n');
}

// 运行脚本
main().catch(console.error);
