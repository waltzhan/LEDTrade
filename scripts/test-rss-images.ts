/**
 * 测试 RSS 源是否有图片
 */

import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import axios from 'axios';

const rssParser = new Parser();

async function testRSSImages() {
  const rssSources = [
    'https://www.ledinside.com/rss',
    'https://www.leds Magazine.com/rss',
    // 添加其他 RSS 源
  ];
  
  for (const rssUrl of rssSources) {
    console.log(`\n📰 Testing: ${rssUrl}\n`);
    
    try {
      const feed = await rssParser.parseURL(rssUrl);
      
      // 检查前 3 篇文章
      const items = feed.items.slice(0, 3);
      
      items.forEach((item, index) => {
        console.log(`Article ${index + 1}: ${item.title}`);
        
        let hasImage = false;
        
        // 检查 enclosure
        if (item.enclosure?.url) {
          console.log(`  ✓ Enclosure image: ${item.enclosure.url}`);
          hasImage = true;
        }
        
        // 检查 media:content
        if ((item as any)['media:content']?.$?.url) {
          console.log(`  ✓ Media content: ${(item as any)['media:content'].$.url}`);
          hasImage = true;
        }
        
        // 检查 content 中的图片
        const content = (item as any)['content:encoded'] || item.content || '';
        const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch) {
          console.log(`  ✓ Image in content: ${imgMatch[1]}`);
          hasImage = true;
        }
        
        if (!hasImage) {
          console.log(`  ❌ No image found`);
        }
        
        console.log('');
      });
    } catch (error: any) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }
}

testRSSImages();
