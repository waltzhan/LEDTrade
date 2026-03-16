"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlNews = crawlNews;
const rss_parser_1 = __importDefault(require("rss-parser"));
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const config_1 = require("./config");
const rssParser = new rss_parser_1.default();
// 从 RSS 源抓取
async function fetchFromRSS(source) {
    try {
        if (!source.rss)
            return [];
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
    }
    catch (error) {
        console.error(`RSS fetch error for ${source.name}:`, error);
        return [];
    }
}
// 从网页抓取
async function fetchFromWeb(source) {
    try {
        if (!source.selector)
            return [];
        const response = await axios_1.default.get(source.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            timeout: 10000,
        });
        const $ = cheerio.load(response.data);
        const articles = [];
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
    }
    catch (error) {
        console.error(`Web fetch error for ${source.name}:`, error);
        return [];
    }
}
// 关键词过滤
function filterByKeywords(articles) {
    const { required, optional, exclude } = config_1.NEWS_CONFIG.keywords;
    return articles.filter(article => {
        const text = `${article.title} ${article.summary}`.toLowerCase();
        // 检查排除词
        if (exclude.some(word => text.includes(word.toLowerCase()))) {
            return false;
        }
        // 检查必须包含的关键词（至少一个）
        const hasRequired = required.some(word => text.includes(word.toLowerCase()));
        return hasRequired;
    });
}
// 去重（基于链接）
function deduplicate(articles) {
    const seen = new Set();
    return articles.filter(article => {
        if (seen.has(article.link)) {
            return false;
        }
        seen.add(article.link);
        return true;
    });
}
// 主抓取函数
async function crawlNews() {
    console.log('🕷️ Starting news crawl...');
    const allArticles = [];
    for (const source of config_1.NEWS_CONFIG.sources) {
        console.log(`📡 Fetching from ${source.name}...`);
        let articles = [];
        if (source.rss) {
            articles = await fetchFromRSS(source);
        }
        else if (source.selector) {
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
        const sourceA = config_1.NEWS_CONFIG.sources.find(s => s.name === a.source);
        const sourceB = config_1.NEWS_CONFIG.sources.find(s => s.name === b.source);
        return (sourceA?.priority || 99) - (sourceB?.priority || 99);
    });
    return filtered;
}
