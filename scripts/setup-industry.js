#!/usr/bin/env node

/**
 * 行业模板初始化脚本
 * 
 * 使用方法：
 * npm run setup:industry [industry-name]
 * 
 * 示例：
 * npm run setup:industry manufacturing
 * npm run setup:industry service
 * npm run setup:industry retail
 */

const fs = require('fs');
const path = require('path');

const INDUSTRY_PRESETS = {
  manufacturing: {
    name: '制造业',
    features: ['products', 'news', 'geo_seo', 'contact_form'],
    contentTypes: ['product', 'category', 'article'],
    removeFiles: [],
  },
  service: {
    name: '服务业',
    features: ['news', 'geo_seo', 'contact_form'],
    contentTypes: ['article'],
    removeFiles: ['sanity/schemas/product.ts', 'sanity/schemas/productSpec.ts', 'sanity/schemas/category.ts'],
  },
  retail: {
    name: '零售业',
    features: ['products', 'news', 'contact_form'],
    contentTypes: ['product', 'category'],
    removeFiles: ['scripts/news-auto'],
  },
  technology: {
    name: '科技行业',
    features: ['products', 'news', 'geo_seo'],
    contentTypes: ['product', 'article'],
    removeFiles: [],
  },
};

function main() {
  const industry = process.argv[2];
  
  if (!industry) {
    console.log('❌ 请指定行业类型');
    console.log('可用选项：manufacturing, service, retail, technology\n');
    console.log('示例：npm run setup:industry manufacturing\n');
    process.exit(1);
  }
  
  const preset = INDUSTRY_PRESETS[industry];
  if (!preset) {
    console.log(`❌ 未找到行业预设：${industry}`);
    console.log('可用选项：manufacturing, service, retail, technology\n');
    process.exit(1);
  }
  
  console.log(`🚀 正在初始化 ${preset.name} 行业模板...\n`);
  
  // 1. 更新行业配置文件
  updateIndustryConfig(industry, preset);
  
  // 2. 移除不需要的文件
  if (preset.removeFiles.length > 0) {
    console.log('\n📦 移除非必须的文件...');
    preset.removeFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      try {
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            fs.rmSync(filePath, { recursive: true });
            console.log(`   ✓ 删除目录：${file}`);
          } else {
            fs.unlinkSync(filePath);
            console.log(`   ✓ 删除文件：${file}`);
          }
        }
      } catch (error) {
        console.log(`   ⚠️ 无法删除 ${file}: ${error.message}`);
      }
    });
  }
  
  // 3. 复制环境变量模板
  console.log('\n📋 创建环境变量配置...');
  const templatePath = path.join(process.cwd(), '.env.local.template');
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(templatePath)) {
    fs.copyFileSync(templatePath, envPath);
    console.log('   ✓ 已创建 .env.local 文件');
  }
  
  console.log('\n✅ 行业模板初始化完成！\n');
  console.log('下一步操作：');
  console.log('1. 编辑 lib/config/industry.ts 自定义站点配置');
  console.log('2. 编辑 .env.local 配置环境变量');
  console.log('3. 运行 npm run dev 启动开发服务器');
  console.log('4. 访问 http://localhost:3333 启动 Sanity Studio\n');
}

function updateIndustryConfig(industry, preset) {
  const configPath = path.join(process.cwd(), 'lib/config/industry.ts');
  
  if (!fs.existsSync(configPath)) {
    console.log('   ⚠️ 找不到行业配置文件');
    return;
  }
  
  let content = fs.readFileSync(configPath, 'utf8');
  
  // 更新行业预设
  content = content.replace(
    /name: '[^']+', \/\/ 制造业 \(默认\)/,
    `name: '${industry}', // ${preset.name}`
  );
  
  // 更新功能列表
  const featuresStr = preset.features.map(f => `'${f}'`).join(', ');
  content = content.replace(
    /features: \[[^\]]+\],/,
    `features: [${featuresStr}],`
  );
  
  // 更新内容类型
  const contentTypesStr = preset.contentTypes.map(t => `'${t}'`).join(', ');
  content = content.replace(
    /contentTypes: \[[^\]]+\],/,
    `contentTypes: [${contentTypesStr}],`
  );
  
  // 更新功能开关
  preset.features.forEach(feature => {
    const featureMap = {
      products: 'products',
      news: 'news',
      geo_seo: 'geoSeo',
      contact_form: 'contactForm',
    };
    
    const configKey = featureMap[feature];
    if (configKey) {
      content = content.replace(
        new RegExp(`${configKey}: (true|false),`, 'g'),
        `${configKey}: ${preset.features.includes(feature)},`
      );
    }
  });
  
  fs.writeFileSync(configPath, content);
  console.log('   ✓ 已更新行业配置文件');
}

main();
