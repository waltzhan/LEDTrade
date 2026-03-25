var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NEWS_CONFIG } from './config';
import { getEnabledSources } from './news-sources.config';
var rssParser = new Parser({
    // 自定义 XML 解析选项，避免 url.parse() 警告
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['content:encoded', 'contentEncoded'],
        ],
    },
});
// 从 RSS 源抓取
function fetchFromRSS(source) {
    return __awaiter(this, void 0, void 0, function () {
        var feedOptions, feed, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!source.rss)
                        return [2 /*return*/, []];
                    feedOptions = source.headers
                        ? { headers: source.headers }
                        : undefined;
                    return [4 /*yield*/, rssParser.parseURL(source.rss, feedOptions)];
                case 1:
                    feed = _a.sent();
                    return [2 /*return*/, feed.items.slice(0, 5).map(function (item) {
                            var _a, _b, _c;
                            // 尝试从 enclosure 或 content 中提取图片
                            var imageUrl = '';
                            if (((_a = item.enclosure) === null || _a === void 0 ? void 0 : _a.url) && ((_b = item.enclosure.type) === null || _b === void 0 ? void 0 : _b.startsWith('image/'))) {
                                imageUrl = item.enclosure.url;
                            }
                            else if ((_c = item['media:content']) === null || _c === void 0 ? void 0 : _c.$.url) {
                                imageUrl = item['media:content'].$.url;
                            }
                            else {
                                // 从 content 中提取第一张图片
                                var content = item['content:encoded'] || item.content || '';
                                var imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
                                if (imgMatch) {
                                    imageUrl = imgMatch[1];
                                }
                            }
                            return {
                                title: item.title || '',
                                link: item.link || '',
                                content: item['content:encoded'] || item.content || item.summary || '',
                                summary: item.summary || '',
                                publishDate: item.pubDate || new Date().toISOString(),
                                source: source.name,
                                category: source.category,
                                language: source.language,
                                imageUrl: imageUrl,
                            };
                        })];
                case 2:
                    error_1 = _a.sent();
                    console.error("RSS fetch error for ".concat(source.name, ":"), error_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 从网页抓取
function fetchFromWeb(source) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, response, $_1, articles_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!source.selector)
                        return [2 /*return*/, []];
                    headers = __assign({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, source.headers);
                    return [4 /*yield*/, axios.get(source.url, { headers: headers, timeout: 10000 })];
                case 1:
                    response = _a.sent();
                    $_1 = cheerio.load(response.data);
                    articles_1 = [];
                    $_1(source.selector).each(function (_, elem) {
                        var title = $_1(elem).find('h2, h3, .title, a').first().text().trim();
                        var link = $_1(elem).find('a').first().attr('href') || '';
                        var summary = $_1(elem).find('.summary, .desc, p').first().text().trim();
                        // 尝试提取图片
                        var imageUrl = '';
                        var imgElem = $_1(elem).find('img').first();
                        if (imgElem.length) {
                            imageUrl = imgElem.attr('src') || imgElem.attr('data-src') || '';
                            // 处理相对路径
                            if (imageUrl && !imageUrl.startsWith('http')) {
                                imageUrl = imageUrl.startsWith('/')
                                    ? "".concat(source.url).concat(imageUrl)
                                    : "".concat(source.url, "/").concat(imageUrl);
                            }
                        }
                        if (title && link) {
                            articles_1.push({
                                title: title,
                                link: link.startsWith('http') ? link : "".concat(source.url).concat(link),
                                content: summary,
                                summary: summary,
                                publishDate: new Date().toISOString(),
                                source: source.name,
                                category: source.category,
                                language: source.language,
                                imageUrl: imageUrl,
                            });
                        }
                    });
                    return [2 /*return*/, articles_1.slice(0, 5)];
                case 2:
                    error_2 = _a.sent();
                    console.error("Web fetch error for ".concat(source.name, ":"), error_2);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 关键词过滤
function filterByKeywords(articles) {
    var _a = NEWS_CONFIG.keywords, required = _a.required, exclude = _a.exclude;
    return articles.filter(function (article) {
        var text = "".concat(article.title, " ").concat(article.summary).toLowerCase();
        // 检查排除词
        if (exclude.some(function (word) { return text.includes(word.toLowerCase()); })) {
            return false;
        }
        // 检查必须包含的关键词（至少一个）
        var hasRequired = required.some(function (word) {
            return text.includes(word.toLowerCase());
        });
        return hasRequired;
    });
}
// 去重（基于链接）
function deduplicate(articles) {
    var seen = new Set();
    return articles.filter(function (article) {
        if (seen.has(article.link))
            return false;
        seen.add(article.link);
        return true;
    });
}
// 主抓取函数 —— 新闻源从 news-sources.config.ts 独立配置文件读取
export function crawlNews() {
    return __awaiter(this, void 0, void 0, function () {
        var enabledSources, allArticles, _i, enabledSources_1, source, articles, unique, filtered;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🕷️ Starting news crawl...');
                    enabledSources = getEnabledSources();
                    console.log("\uD83D\uDCCB ".concat(enabledSources.length, " source(s) enabled: ").concat(enabledSources.map(function (s) { return s.name; }).join(', ')));
                    allArticles = [];
                    _i = 0, enabledSources_1 = enabledSources;
                    _a.label = 1;
                case 1:
                    if (!(_i < enabledSources_1.length)) return [3 /*break*/, 7];
                    source = enabledSources_1[_i];
                    console.log("\uD83D\uDCE1 Fetching from ".concat(source.name, " [type=").concat(source.type, "]..."));
                    articles = [];
                    if (!(source.type === 'rss' || source.type === 'rss+web')) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetchFromRSS(source)];
                case 2:
                    articles = _a.sent();
                    _a.label = 3;
                case 3:
                    if (!(source.type === 'web' || (source.type === 'rss+web' && articles.length === 0))) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetchFromWeb(source)];
                case 4:
                    articles = _a.sent();
                    _a.label = 5;
                case 5:
                    console.log("  \u2714 Found ".concat(articles.length, " articles"));
                    allArticles.push.apply(allArticles, articles);
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    unique = deduplicate(allArticles);
                    console.log("\uD83D\uDCCA ".concat(unique.length, " unique articles after deduplication"));
                    filtered = filterByKeywords(unique);
                    console.log("\u2705 ".concat(filtered.length, " articles after keyword filtering"));
                    // 按新闻源优先级排序
                    filtered.sort(function (a, b) {
                        var _a, _b;
                        var sourceA = enabledSources.find(function (s) { return s.name === a.source; });
                        var sourceB = enabledSources.find(function (s) { return s.name === b.source; });
                        return ((_a = sourceA === null || sourceA === void 0 ? void 0 : sourceA.priority) !== null && _a !== void 0 ? _a : 99) - ((_b = sourceB === null || sourceB === void 0 ? void 0 : sourceB.priority) !== null && _b !== void 0 ? _b : 99);
                    });
                    return [2 /*return*/, filtered];
            }
        });
    });
}
