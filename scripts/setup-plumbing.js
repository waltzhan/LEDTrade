#!/usr/bin/env node
/**
 * 水暖卫浴行业项目初始化脚本
 * Plumbing & Sanitary Ware Industry Setup Script
 * 
 * Usage: node scripts/setup-plumbing.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n========================================');
console.log('🚿 水暖卫浴行业项目初始化');
console.log('   Plumbing & Sanitary Ware Setup');
console.log('========================================\n');

// 1. 复制环境变量模板
console.log('📝 Step 1: Creating environment file...');
const envTemplate = fs.readFileSync(path.join(__dirname, '../.env.plumbing.template'), 'utf8');
const envContent = envTemplate
  .replace('your_project_id_here', 'YOUR_PROJECT_ID')
  .replace('your_sanity_token_here', 'YOUR_SANITY_TOKEN')
  .replace('sk-your_api_key_here', 'sk-YOUR_API_KEY')
  .replace('https://your-domain.com', 'https://plumbcore.com')
  .replace('info@your-domain.com', 'info@plumbcore.com');

fs.writeFileSync(path.join(__dirname, '../.env.local'), envContent);
console.log('   ✅ .env.local created\n');

// 2. 更新 lib/config/industry.ts
console.log('⚙️  Step 2: Updating industry configuration...');
const industryConfigPath = path.join(__dirname, '../lib/config/industry.ts');

if (fs.existsSync(industryConfigPath)) {
  let content = fs.readFileSync(industryConfigPath, 'utf8');
  
  // 添加导入语句
  if (!content.includes("import { PLUMBING_PRESET } from './industry.plumbing'")) {
    content = content.replace(
      "import type { IndustryPreset, SiteConfig } from './types';",
      `import type { IndustryPreset, SiteConfig } from './types';
import { PLUMBING_PRESET, PLUMBING_CONFIG, PLUMBING_CATEGORIES, PLUMBING_KEYWORDS, PLUMBING_TERMS } from './industry.plumbing';`
    );
  }
  
  // 更新默认预设
  content = content.replace(
    "// Change this to switch industries:\nexport const SELECTED_INDUSTRY: IndustryPreset = manufacturingPreset;",
    "// Change this to switch industries:\nexport const SELECTED_INDUSTRY: IndustryPreset = PLUMBING_PRESET;"
  );
  
  // 更新站点配置
  content = content.replace(
    "// Change this to match your company:\nexport const SITE_CONFIG: SiteConfig = MANUFACTURING_CONFIG;",
    "// Change this to match your company:\nexport const SITE_CONFIG: SiteConfig = PLUMBING_CONFIG;"
  );
  
  fs.writeFileSync(industryConfigPath, content);
  console.log('   ✅ Industry config updated\n');
} else {
  console.log('   ⚠️  Industry config not found, skipping...\n');
}

// 3. 创建产品分类数据（可选）
console.log('📦 Step 3: Creating category suggestions...');
const categories = [
  'Faucets & Taps',
  'Showers & Accessories',
  'Toilets & Bidets',
  'Basins & Sinks',
  'Bathroom Furniture',
  'Sanitary Ware',
  'Plumbing Fixtures',
  'Kitchen Solutions',
];

console.log('\n   📋 Suggested Categories:');
categories.forEach(cat => console.log(`      - ${cat}`));
console.log('');

// 4. 提供下一步指引
console.log('========================================');
console.log('✅ Initialization Complete!\n');
console.log('📝 Next Steps:\n');
console.log('1. Configure Sanity CMS:');
console.log('   - Run: npm run sanity');
console.log('   - Create categories based on the list above');
console.log('   - Add products in Sanity Studio\n');
console.log('2. Update Environment Variables:');
console.log('   - Edit .env.local with your actual values');
console.log('   - Get Sanity API Token from sanity.io/manage');
console.log('   - Get DASHSCOPE_API_KEY from aliyun.com/bailian\n');
console.log('3. Customize Content:');
console.log('   - Update lib/config/industry.plumbing.ts');
console.log('   - Modify keywords and descriptions for SEO');
console.log('   - Add your company information\n');
console.log('4. Start Development:');
console.log('   npm run dev\n');
console.log('========================================\n');
