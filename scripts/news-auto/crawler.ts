import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NEWS_CONFIG } from './config';

const rssParser = new Parser();

export interface RawArticle {
  title: string;
  link: string;
  content: string;
  summary: string;
  publishDate: string;
  source: string;
  category: string;
  language: string;
}

// 从 RSS 源抓取
async function fetchFromRSS(source: typeof NEWS_CONFIG.sources[0]): Promise<RawArticle[]> {
  try {
    if (!source.rss) return [];
    
    const feed = await rssParser.parseURL(source.rss);
    
    return feed.items.slice(0, 5).map(item => ({
      title: item.title || '',
      link: item.link || '',
      content: item['content:encoded'] || item.content || item.summary || '',
      summary: item.summary || '',
      publishDate: item.pubDate || new Date().toISOString(),
      source: source.name,
      category: source.category,
      language: source.language,
    }));
  } catch (error) {
    console.error(`RSS fetch error for ${source.name}:`, error);
    return [];
  }
}

// 从网页抓取
async function fetchFromWeb(source: any): Promise<RawArticle[]> {
  try {
    if (!source.selector) return [];
    
    const response = await axios.get(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });
    
    const $ = cheerio.load(response.data);
    const articles: RawArticle[] = [];
    
    $(source.selector).each((_, elem) => {
      const title = $(elem).find('h2, h3, .title, a').first().text().trim();
      const link = $(elem).find('a').first().attr('href') || '';
      const summary = $(elem).find('.summary, .desc, p').first().text().trim();
      
      if (title && link) {
        articles.push({
          title,
          link: link.startsWith('http') ? link : `${source.url}${link}`,
          content: summary,
          summary,
          publishDate: new Date().toISOString(),
          source: source.name,
          category: source.category,
          language: source.language,
        });
      }
    });
    
    return articles.slice(0, 5);
  } catch (error) {
    console.error(`Web fetch error for ${source.name}:`, error);
    return [];
  }
}

// 关键词过滤
function filterByKeywords(articles: RawArticle[]): RawArticle[] {
  const { required, optional, exclude } = NEWS_CONFIG.keywords;
  
  return articles.filter(article => {
    const text = `${article.title} ${article.summary}`.toLowerCase();
    
    // 检查排除词
    if (exclude.some(word => text.includes(word.toLowerCase()))) {
      return false;
    }
    
    // 检查必须包含的关键词（至少一个）
    const hasRequired = required.some(word => 
      text.includes(word.toLowerCase())
    );
    
    return hasRequired;
  });
}

// 去重（基于链接）
function deduplicate(articles: RawArticle[]): RawArticle[] {
  const seen = new Set<string>();
  return articles.filter(article => {
    if (seen.has(article.link)) {
      return false;
    }
    seen.add(article.link);
    return true;
  });
}

// 主抓取函数
export async function crawlNews(): Promise<RawArticle[]> {
  console.log('🕷️ Starting news crawl...');
  
  const allArticles: RawArticle[] = [];
  
  for (const source of NEWS_CONFIG.sources) {
    console.log(`📡 Fetching from ${source.name}...`);
    
    let articles: RawArticle[] = [];
    
    if (source.rss) {
      articles = await fetchFromRSS(source as any);
    } else if ((source as any).selector) {
      articles = await fetchFromWeb(source);
    }
    
    console.log(`  Found ${articles.length} articles`);
    allArticles.push(...articles);
  }
  
  // 去重
  const unique = deduplicate(allArticles);
  console.log(`📊 ${unique.length} unique articles after deduplication`);
  
  // 关键词过滤
  const filtered = filterByKeywords(unique);
  console.log(`✅ ${filtered.length} articles after keyword filtering`);
  
  // 按优先级排序
  filtered.sort((a, b) => {
    const sourceA = NEWS_CONFIG.sources.find(s => s.name === a.source);
    const sourceB = NEWS_CONFIG.sources.find(s => s.name === b.source);
    return (sourceA?.priority || 99) - (sourceB?.priority || 99);
  });
  
  return filtered;
}
