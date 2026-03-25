/**
 * 水暖卫浴行业配置
 * Plumbing & Sanitary Ware Industry Configuration
 */

import { IndustryPreset, SiteConfig } from './industry';

// 水暖卫浴行业预设
export const PLUMBING_PRESET: IndustryPreset = {
  name: 'plumbing',
  description: '水暖卫浴、厨卫设备、五金洁具制造企业',
  features: ['products', 'news', 'geo_seo', 'contact_form'],
  contentTypes: ['product', 'category', 'article'],
};

// 水暖卫浴行业站点配置
export const PLUMBING_CONFIG: SiteConfig = {
  siteName: 'PlumbCore Industries',
  siteDescription: 'Professional manufacturer of plumbing fixtures, sanitary ware, and bathroom solutions for residential and commercial applications.',
  industry: 'plumbing',
  primaryColor: '#0ea5e9', // 天蓝色，代表水和清洁
  locales: ['zh', 'en'],
  enabledFeatures: {
    products: true,      // 产品中心（水龙头、花洒、马桶等）
    news: true,          // 资讯中心（行业动态、产品资讯）
    newsAutoPublish: false, // 暂时关闭自动发布
    geoSeo: true,        // GEO-SEO 优化
    contactForm: true,   // 联系表单/询盘
    analytics: false,    // Google Analytics（可选）
  },
};

// 水暖卫浴行业产品分类示例
export const PLUMBING_CATEGORIES = [
  'Faucets & Taps',           // 水龙头
  'Showers & Accessories',    // 花洒及配件
  'Toilets & Bidets',         // 马桶和净身盆
  'Basins & Sinks',           // 面盆和水槽
  'Bathroom Furniture',       // 浴室家具
  'Sanitary Ware',            // 卫生陶瓷
  'Plumbing Fixtures',        // 水暖五金
  'Kitchen Solutions',        // 厨房解决方案
];

// 水暖卫浴行业关键词
export const PLUMBING_KEYWORDS = {
  zh: [
    '水暖器材',
    '卫浴设备',
    '卫生洁具',
    '水龙头',
    '花洒',
    '智能马桶',
    '浴室柜',
    '厨卫五金',
    '水暖厂家',
    '卫浴批发',
  ],
  en: [
    'plumbing fixtures',
    'sanitary ware',
    'bathroom faucets',
    'shower systems',
    'toilets',
    'smart toilet',
    'basin mixer',
    'kitchen sink',
    'bathroom accessories',
    'plumbing manufacturer',
  ],
};

// 水暖卫浴行业术语库（用于 AI 翻译和优化）
export const PLUMBING_TERMS = {
  zh: {
    '水龙头': 'faucet',
    '花洒': 'shower head',
    '马桶': 'toilet',
    '智能马桶盖': 'smart toilet seat',
    '浴室柜': 'bathroom cabinet',
    '面盆': 'basin',
    '水槽': 'sink',
    '地漏': 'floor drain',
    '角阀': 'angle valve',
    '软管': 'flexible hose',
    '恒温花洒': 'thermostatic shower',
    '节水型': 'water-saving',
    '抗菌': 'antibacterial',
    '304 不锈钢': '304 stainless steel',
    '全铜': 'solid brass',
    '陶瓷阀芯': 'ceramic cartridge',
    '表面电镀': 'surface plating',
    '拉丝镍': 'brushed nickel',
    '镀铬': 'chrome plated',
    '黑色哑光': 'matte black',
  },
  en: {
    'faucet': '水龙头',
    'shower head': '花洒',
    'toilet': '马桶',
    'smart toilet seat': '智能马桶盖',
    'bathroom cabinet': '浴室柜',
    'basin': '面盆',
    'sink': '水槽',
    'floor drain': '地漏',
    'angle valve': '角阀',
    'flexible hose': '软管',
    'thermostatic shower': '恒温花洒',
    'water-saving': '节水型',
    'antibacterial': '抗菌',
    '304 stainless steel': '304 不锈钢',
    'solid brass': '全铜',
    'ceramic cartridge': '陶瓷阀芯',
    'surface plating': '表面电镀',
    'brushed nickel': '拉丝镍',
    'chrome plated': '镀铬',
    'matte black': '黑色哑光',
  },
};
