"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TARGET_LOCALES = exports.CATEGORY_MAP = exports.NEWS_CONFIG = void 0;
// 自动化新闻生成配置
exports.NEWS_CONFIG = {
    // 发布设置
    publish: {
        maxArticlesPerDay: 2,
        publishTimes: ['09:00', '15:00'], // 目标市场时区
        autoPublish: true,
    },
    // 关键词过滤
    keywords: {
        required: ['LED', '半导体', '光运用', '光传感', '智能传感', '具身智能'],
        optional: ['光莆', 'GOPRO', '红外', '紫外', '可见光', '照明', '显示', 'Mini LED', 'Micro LED'],
        exclude: ['股票', '股价', '投资', '理财', '赌博'],
    },
    // 新闻源配置
    sources: [
        {
            name: 'LEDs Magazine',
            url: 'https://www.ledsmagazine.com',
            rss: 'https://www.ledsmagazine.com/rss.xml',
            category: 'industry',
            language: 'en',
            priority: 1,
        },
        {
            name: 'Compound Semiconductor',
            url: 'https://www.compoundsemiconductor.net',
            rss: 'https://www.compoundsemiconductor.net/rss.xml',
            category: 'technical',
            language: 'en',
            priority: 2,
        },
        {
            name: '高工LED',
            url: 'https://www.gg-led.com',
            selector: '.news-list .item',
            category: 'industry',
            language: 'zh',
            priority: 1,
        },
        {
            name: 'LEDinside',
            url: 'https://www.ledinside.com',
            rss: 'https://www.ledinside.com/rss.xml',
            category: 'industry',
            language: 'zh',
            priority: 1,
        },
        {
            name: '半导体照明网',
            url: 'http://www.china-led.net',
            selector: '.news-item',
            category: 'technical',
            language: 'zh',
            priority: 2,
        },
    ],
    // AI 改写配置
    ai: {
        model: 'qwen-turbo', // 通义千问模型
        maxTokens: 2000,
        temperature: 0.7,
    },
    // 内容质量阈值
    quality: {
        minWordCount: 500,
        maxWordCount: 2000,
        minKeywordDensity: 0.01,
    },
};
// 分类映射
exports.CATEGORY_MAP = {
    'industry': '行业动态',
    'technical': '技术文章',
    'application': '应用案例',
};
// 目标语言
exports.TARGET_LOCALES = ['zh', 'en', 'id', 'th', 'vi', 'ar'];
