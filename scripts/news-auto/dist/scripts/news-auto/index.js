"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runNewsAutomation = runNewsAutomation;
const crawler_1 = require("./crawler");
const ai_processor_1 = require("./ai-processor");
const publisher_1 = require("./publisher");
// 主流程
async function runNewsAutomation() {
    console.log('🚀 Starting news automation...');
    console.log(`⏰ ${new Date().toLocaleString()}`);
    try {
        // 1. 抓取新闻
        const rawArticles = await (0, crawler_1.crawlNews)();
        if (rawArticles.length === 0) {
            console.log('📭 No new articles found');
            return;
        }
        // 2. AI 处理
        const processedArticles = await (0, ai_processor_1.processArticles)(rawArticles);
        if (processedArticles.length === 0) {
            console.log('❌ Article processing failed');
            return;
        }
        // 3. 构建 sourceMap
        const sourceMap = new Map();
        rawArticles.forEach((raw, index) => {
            if (processedArticles[index]) {
                sourceMap.set(processedArticles[index].title.zh, {
                    url: raw.link,
                    name: raw.source,
                });
            }
        });
        // 4. 发布到 Sanity
        const published = await (0, publisher_1.publishArticles)(processedArticles, sourceMap);
        console.log('\n📊 Summary:');
        console.log(`  Crawled: ${rawArticles.length}`);
        console.log(`  Processed: ${processedArticles.length}`);
        console.log(`  Published: ${published}`);
    }
    catch (error) {
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
