/**
 * 新闻源独立配置文件
 * ============================================================
 * 维护指南：
 *   - 新增新闻源：在 NEWS_SOURCES 数组中添加新对象
 *   - 停用新闻源：设置 enabled: false（无需删除）
 *   - 调整优先级：修改 priority 值（数字越小优先级越高）
 *   - 仅RSS：设置 type: 'rss'，填写 rss 字段
 *   - 仅网页：设置 type: 'web'，填写 selector 字段
 * ============================================================
 */

export type SourceType = 'rss' | 'web' | 'rss+web';
export type SourceCategory = 'industry' | 'technical' | 'application';
export type SourceLanguage = 'zh' | 'en' | 'id' | 'th' | 'vi' | 'ar';

export interface NewsSource {
  /** 新闻源名称（唯一标识） */
  name: string;
  /** 新闻源首页URL */
  url: string;
  /** 抓取方式：rss / web / rss+web */
  type: SourceType;
  /** RSS feed 地址（type 包含 rss 时必填） */
  rss?: string;
  /** 网页抓取CSS选择器（type 包含 web 时必填） */
  selector?: string;
  /** 对应Sanity文章分类 */
  category: SourceCategory;
  /** 新闻源主要语言 */
  language: SourceLanguage;
  /** 优先级（1最高，数字越小越优先抓取） */
  priority: number;
  /** 是否启用（false=停用，不会被抓取） */
  enabled: boolean;
  /** 备注（维护说明、停用原因等） */
  notes?: string;
  /** 请求时携带的自定义 headers（部分网站需要UA伪装） */
  headers?: Record<string, string>;
}

/**
 * 新闻源配置列表
 * 维护时只需增删改此数组，无需改动抓取逻辑代码
 * 
 * 分类说明：
 *   industry - 综合产业资讯
 *   technical - 专业技术/学术论文
 *   application - 应用市场/产品评测
 */
export const NEWS_SOURCES: NewsSource[] = [

  // ── 中文新闻源 ─────────────────────────────────────────────
  {
    name: 'LEDinside',
    url: 'https://www.ledinside.com',
    type: 'rss',
    rss: 'https://www.ledinside.com/rss.xml',
    category: 'industry',
    language: 'zh',
    priority: 1,
    enabled: true,
    notes: '主要中文 LED 行业媒体，RSS 稳定可用',
  },
  {
    name: '半导体行业观察',
    url: 'https://www.semi.org.cn',
    type: 'rss',
    rss: 'https://www.semi.org.cn/index.php?m=content&c=index&a=lists&catid=1', // 修正：尝试使用实际分类 RSS
    category: 'industry',
    language: 'zh',
    priority: 2,
    enabled: false, // 暂停使用，等待验证
    notes: '⚠️ RSS 地址待验证，暂时禁用',
  },
  {
    name: 'OFweek 半导体照明',
    url: 'https://www.ofweek.com',
    type: 'rss',
    rss: 'https://www.ofweek.com/Feed/RssList.aspx', // 修正：使用 OFweek 主站 RSS
    category: 'technical',
    language: 'zh',
    priority: 3,
    enabled: true,
    notes: 'OFweek 主站 RSS，已启用',
  },
  {
    name: '中国照明网',
    url: 'https://www.lightingchina.com',
    type: 'rss',
    rss: 'https://www.lightingchina.com/rss/',
    category: 'technical',
    language: 'zh',
    priority: 4,
    enabled: true,
    notes: '中国照明行业门户，已启用',
  },
  {
    name: '机器之心',
    url: 'https://www.jiqizhixin.com',
    type: 'rss',
    rss: 'https://www.jiqizhixin.com/feed',
    category: 'technical',
    language: 'zh',
    priority: 5,
    enabled: true,
    notes: '中文 AI 与机器人资讯，涵盖具身智能',
  },
  {
    name: '盖世汽车新能源',
    url: 'https://auto.gasgoo.com/newenergy/',
    type: 'rss',
    rss: 'https://auto.gasgoo.com/newenergy/rss',
    category: 'application',
    language: 'zh',
    priority: 6,
    enabled: true,
    notes: '新能源汽车产业链动态，LED 车灯应用',
  },
  {
    name: 'DeepTech 深科技',
    url: 'https://www.deeptechchina.com',
    type: 'rss',
    rss: 'https://www.deeptechchina.com/feed',
    category: 'technical',
    language: 'zh',
    priority: 7,
    enabled: true,
    notes: '硬科技媒体，涵盖半导体、新能源材料',
  },
  {
    name: '中国新能源网',
    url: 'https://www.china-nengyuan.com',
    type: 'rss',
    rss: 'https://www.china-nengyuan.com/news/rss.php',
    category: 'technical',
    language: 'zh',
    priority: 8,
    enabled: false, // 暂停使用，连接超时
    notes: '⚠️ 连接超时（116.62.30.152:443），可能需要 UA 伪装或代理',
  },
  {
    name: '半导体照明网',
    url: 'http://www.china-led.net',
    type: 'web',
    selector: '.news-item',
    category: 'technical',
    language: 'zh',
    priority: 9,
    enabled: true,
    notes: '技术专业媒体，已启用',
  },
  {
    name: '百度新闻 - LED/半导体',
    url: 'https://news.baidu.com',
    type: 'rss',
    rss: 'https://news.baidu.com/ns?word=LED+%E5%8D%8A%E5%AF%BC%E4%BD%93&tn=news&rn=20&ie=utf-8&out=utf-8',
    category: 'industry',
    language: 'zh',
    priority: 10,
    enabled: false,
    notes: '⚠️ RSS XML 格式错误，暂停使用',
  },

  // ── 英文新闻源 ─────────────────────────────────────────────
  {
    name: 'IEEE Spectrum',
    url: 'https://spectrum.ieee.org',
    type: 'rss',
    rss: 'https://spectrum.ieee.org/rss.xml', // 修正：使用正确的 RSS 地址
    category: 'technical',
    language: 'en',
    priority: 1,
    enabled: true,
    notes: 'IEEE 旗下综合科技媒体，涵盖半导体、LED、机器人',
  },
  {
    name: 'EE Times',
    url: 'https://www.eetimes.com',
    type: 'rss',
    rss: 'https://www.eetimes.com/feed/',
    category: 'technical',
    language: 'en',
    priority: 2,
    enabled: true,
    notes: '电子工程专辑，半导体产业新闻',
  },
  {
    name: 'LEDs Magazine',
    url: 'https://www.ledsmagazine.com',
    type: 'web',
    selector: '.article-teaser',
    category: 'industry',
    language: 'en',
    priority: 3,
    enabled: false,
    notes: '⚠️ RSS 解析错误，暂时禁用（Web 模式待实现）',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  },
  {
    name: 'AnandTech',
    url: 'https://www.anandtech.com',
    type: 'rss',
    rss: 'https://www.anandtech.com/rss.aspx',
    category: 'application',
    language: 'en',
    priority: 4,
    enabled: false, // 暂停使用，XML 格式有问题
    notes: '⚠️ RSS XML 格式不规范（Attribute without value），暂时禁用',
  },
  {
    name: 'Tom\'s Hardware',
    url: 'https://www.tomshardware.com',
    type: 'rss',
    rss: 'https://www.tomshardware.com/feeds/all',
    category: 'application',
    language: 'en',
    priority: 5,
    enabled: true,
    notes: '半导体硬件新闻与评测',
  },
  {
    name: 'Nature Electronics',
    url: 'https://www.nature.com/natelectron/',
    type: 'rss',
    rss: 'https://www.nature.com/natelectron.rss',
    category: 'technical',
    language: 'en',
    priority: 6,
    enabled: true,
    notes: '自然期刊电子技术子刊，学术研究',
  },
  {
    name: 'ScienceDirect - Materials Science',
    url: 'https://www.sciencedirect.com',
    type: 'rss',
    rss: 'https://rss.sciencedirect.com/public/journals/10743',
    category: 'technical',
    language: 'en',
    priority: 7,
    enabled: true,
    notes: '爱思唯尔材料科学期刊，新能源材料',
  },
  {
    name: 'IEEE Robotics & Automation',
    url: 'https://www.ieee-ras.org/publications',
    type: 'rss',
    rss: 'https://www.ieee-ras.org/publications/rss-feed',
    category: 'technical',
    language: 'en',
    priority: 8,
    enabled: true,
    notes: '机器人顶会期刊，具身智能相关',
  },
  {
    name: 'Robohub',
    url: 'https://robohub.org',
    type: 'rss',
    rss: 'https://robohub.org/feed/',
    category: 'technical',
    language: 'en',
    priority: 9,
    enabled: true,
    notes: '机器人学术动态，具身智能研究',
  },
  {
    name: 'PV Magazine',
    url: 'https://www.pv-magazine.com',
    type: 'rss',
    rss: 'https://www.pv-magazine.com/feed/',
    category: 'technical',
    language: 'en',
    priority: 10,
    enabled: true,
    notes: '光伏材料全球资讯，新能源材料',
  },
  {
    name: 'Imec Insights',
    url: 'https://www.imec-int.com/en/imec-magazine',
    type: 'rss',
    rss: 'https://www.imec-int.com/en/rss-feeds',
    category: 'technical',
    language: 'en',
    priority: 11,
    enabled: true,
    notes: '比利时微电子中心，先进制程研发',
  },
  {
    name: 'SemiWiki',
    url: 'https://www.semiwiki.com',
    type: 'rss',
    rss: 'https://www.semiwiki.com/forum/rss.php',
    category: 'technical',
    language: 'en',
    priority: 12,
    enabled: true,
    notes: '半导体制造技术讨论社区',
  },
  {
    name: 'Google News - LED Technology',
    url: 'https://news.google.com',
    type: 'rss',
    rss: 'https://news.google.com/rss/search?q=LED+technology+OR+semiconductor+OR+optoelectronics&hl=en-US&gl=US&ceid=US:en',
    category: 'industry',
    language: 'en',
    priority: 13,
    enabled: false,
    notes: '⚠️ 中国大陆访问受限，暂停使用',
  },
  {
    name: 'Google News - Mini/Micro LED',
    url: 'https://news.google.com',
    type: 'rss',
    rss: 'https://news.google.com/rss/search?q=Mini+LED+OR+Micro+LED+OR+display+technology&hl=en-US&gl=US&ceid=US:en',
    category: 'technical',
    language: 'en',
    priority: 14,
    enabled: false,
    notes: '⚠️ 中国大陆访问受限，暂停使用',
  },
  {
    name: 'Compound Semiconductor',
    url: 'https://www.compoundsemiconductor.net',
    type: 'rss',
    rss: 'https://www.compoundsemiconductor.net/rss.xml',
    category: 'technical',
    language: 'en',
    priority: 15,
    enabled: false,
    notes: '⚠️ RSS 404 错误，暂停使用',
  },
  {
    name: 'Laser Focus World',
    url: 'https://www.laserfocusworld.com',
    type: 'rss',
    rss: 'https://www.laserfocusworld.com/rss.xml',
    category: 'technical',
    language: 'en',
    priority: 16,
    enabled: false,
    notes: '光电技术专业媒体，待测试',
  },
];

/**
 * 获取所有已启用的新闻源（按优先级排序）
 */
export function getEnabledSources(): NewsSource[] {
  return NEWS_SOURCES
    .filter(s => s.enabled)
    .sort((a, b) => a.priority - b.priority);
}

/**
 * 获取指定分类的已启用新闻源
 */
export function getSourcesByCategory(category: SourceCategory): NewsSource[] {
  return getEnabledSources().filter(s => s.category === category);
}

/**
 * 获取指定语言的已启用新闻源
 */
export function getSourcesByLanguage(language: SourceLanguage): NewsSource[] {
  return getEnabledSources().filter(s => s.language === language);
}
