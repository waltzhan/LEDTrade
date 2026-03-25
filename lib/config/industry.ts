/**
 * 行业配置 - 可根据不同行业快速定制
 * 
 * 使用方法：
 * 1. 修改 INDUSTRY_PRESET 选择行业预设
 * 2. 自定义 SITE_CONFIG 中的站点信息
 * 3. 运行 npm run setup:industry 应用配置
 */

export interface IndustryPreset {
  name: string;
  description: string;
  features: string[];
  contentTypes: string[];
}

export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  industry: string;
  primaryColor: string;
  locales: string[];
  enabledFeatures: {
    products: boolean;
    news: boolean;
    newsAutoPublish: boolean;
    geoSeo: boolean;
    contactForm: boolean;
    analytics: boolean;
  };
}

// ========== 行业预设（选择一个）==========
const INDUSTRY_PRESET: IndustryPreset = {
  name: 'manufacturing', // 制造业（默认）
  description: 'LED、电子、机械等制造企业',
  features: ['products', 'news', 'geo_seo', 'contact_form'],
  contentTypes: ['product', 'category', 'article'],
};

// ========== 站点配置（自定义修改这里）==========
export const SITE_CONFIG: SiteConfig = {
  siteName: 'Your Company Name', // 公司名称
  siteDescription: 'Professional solutions for your industry', // 网站描述
  industry: INDUSTRY_PRESET.name,
  primaryColor: '#3B82F6', // 主色调（Tailwind 颜色类）
  locales: ['zh', 'en'], // 支持的语言
  
  enabledFeatures: {
    products: true,      // 产品中心
    news: true,          // 资讯中心
    newsAutoPublish: false, // 资讯自动发布（需要配置 RSS 源）
    geoSeo: true,        // GEO-SEO 优化
    contactForm: true,   // 联系表单
    analytics: false,    // Google Analytics（可选）
  },
};

// ========== 多语言配置 ==========
export const SUPPORTED_LOCALES = SITE_CONFIG.locales;
export const DEFAULT_LOCALE = SUPPORTED_LOCALES[0] || 'en';

// ========== 功能开关 ==========
export const FEATURES = SITE_CONFIG.enabledFeatures;
