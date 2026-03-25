/**
 * 自动化新闻生成配置
 * ⚠️ 新闻源配置已迁移到独立文件：scripts/news-auto/news-sources.config.ts
 *     维护新闻源时请直接编辑该独立文件，无需改动此处。
 */
export var NEWS_CONFIG = {
    // 发布设置
    publish: {
        maxArticlesPerDay: 2,
        publishTimes: ['09:00', '15:00'], // 目标市场时区
        autoPublish: true,
    },
    // 关键词过滤 - 中英文自动识别，支持更广泛的 LED 行业术语
    keywords: {
        // 必需关键词（中英文混合，自动匹配）
        required: [
            // LED 技术类
            'LED', 'Micro LED', 'Mini LED', 'OLED', 'AMOLED',
            'QD-LED', 'QLED', '量子点', 'Quantum Dot',
            // 半导体/光电类
            '半导体', 'Semiconductor', '光电', 'Optoelectronics', '光子', 'Photonics',
            // 显示/照明类
            '显示', 'Display', '照明', 'Lighting', '背光', 'Backlight',
            // 光学/传感类
            '光运用', '光传感', '智能传感', 'Smart Sensor', '光学', 'Optical',
            '具身智能', 'Embodied AI',
            // 红外/紫外/可见光
            '红外', 'Infrared', 'IR', '紫外', 'Ultraviolet', 'UV', '可见光', 'Visible Light',
            // 芯片/封装
            '芯片', 'Chip', '封装', 'Packaging', '晶圆', 'Wafer',
            // 特定公司/品牌
            'Marvell', 'Mojo Vision', 'ams OSRAM', 'Eaglerise', '光莆', 'GOPRO',
        ],
        // 可选关键词（用于评分排序，非必需）
        optional: [
            // 技术术语
            '波长', 'Wavelength', '亮度', 'Brightness', '流明', 'Lumen',
            '色温', 'Color Temperature', '显指', 'CRI', 'Ra',
            '效率', 'Efficiency', '节能', 'Energy Saving',
            '智能', 'Smart', 'IoT', '物联网', 'Internet of Things',
            '汽车', 'Automotive', '车载', 'Vehicle',
            '医疗', 'Medical', '健康', 'Health',
            '植物照明', 'Plant Lighting', '农业', 'Agriculture',
        ],
        // 排除关键词（包含即过滤）
        exclude: [
            '赌博',
            'Gambling',
        ],
    },
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
export var CATEGORY_MAP = {
    'industry': '行业动态',
    'technical': '技术文章',
    'application': '应用案例',
};
// 目标语言
export var TARGET_LOCALES = ['zh', 'en', 'id', 'th', 'vi', 'ar'];
