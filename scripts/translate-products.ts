/**
 * 产品数据多语言翻译脚本
 * 
 * 功能：为 Sanity CMS 中的产品数据补充 id/th/vi/ar 语言翻译
 * 使用方法：npx tsx scripts/translate-products.ts
 */

import { createClient } from '@sanity/client';
import axios from 'axios';

// Sanity 客户端配置
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nckyp28c',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// 通义千问 API 调用
async function callQwen(prompt: string): Promise<string> {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  
  if (!apiKey) {
    throw new Error('DASHSCOPE_API_KEY not found in environment variables');
  }
  
  try {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional LED product translator. Translate accurately and maintain technical terminology.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );
    
    return response.data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Qwen API error:', error);
    throw error;
  }
}

// 翻译单个字段
async function translateField(
  sourceText: string,
  targetLang: string,
  fieldName: string
): Promise<string> {
  const langNames: Record<string, string> = {
    id: 'Bahasa Indonesia',
    th: 'Thai',
    vi: 'Vietnamese',
    ar: 'Arabic',
  };
  
  const prompt = `Please translate the following LED product ${fieldName} from Chinese/English to ${langNames[targetLang]}:

Source text: ${sourceText}

Requirements:
1. Maintain technical accuracy for LED industry terms
2. Use natural commercial language suitable for B2B context
3. Keep proper nouns (brand names, model numbers) unchanged
4. Output translation only, no explanations

Translation:`;

  try {
    const result = await callQwen(prompt);
    return result.trim();
  } catch (error) {
    console.error(`Translation failed for ${targetLang}:`, error);
    // Fallback: return English or Chinese
    return sourceText;
  }
}

// 获取所有需要翻译的产品
async function getProductsNeedingTranslation() {
  const query = `*[_type == "product"]{
    _id,
    name,
    description,
    shortDescription,
    features,
    applications,
    seo { metaTitle, metaDescription }
  }`;
  
  return await client.fetch(query);
}

// 检查产品是否缺少某种语言的翻译
function needsTranslation(product: any, lang: string): boolean {
  // 检查名称是否有该语言版本
  if (!product.name?.[lang]) return true;
  
  // 检查描述是否有该语言版本
  if (!product.description?.[lang]) return true;
  
  return false;
}

// 为单个产品生成翻译
async function translateProduct(product: any, targetLang: string) {
  console.log(`\n📦 Translating product: ${product.name?.en || product.name?.zh}`);
  console.log(`   Target language: ${targetLang}`);
  
  const updates: any = {};
  
  // 翻译产品名称
  if (product.name?.en && !product.name?.[targetLang]) {
    const enName = product.name.en;
    const translatedName = await translateField(enName, targetLang, 'product name');
    updates[`name.${targetLang}`] = translatedName;
    console.log(`   ✓ Name translated: ${translatedName.substring(0, 50)}...`);
  }
  
  // 翻译产品描述
  if (product.description?.en && !product.description?.[targetLang]) {
    const enDesc = product.description.en;
    const translatedDesc = await translateField(enDesc, targetLang, 'product description');
    updates[`description.${targetLang}`] = translatedDesc;
    console.log(`   ✓ Description translated`);
  }
  
  // 翻译简短描述
  if (product.shortDescription?.en && !product.shortDescription?.[targetLang]) {
    const enShort = product.shortDescription.en;
    const translatedShort = await translateField(enShort, targetLang, 'short description');
    updates[`shortDescription.${targetLang}`] = translatedShort;
    console.log(`   ✓ Short description translated`);
  }
  
  // 翻译产品特性（数组）
  if (product.features?.en && Array.isArray(product.features.en)) {
    const translatedFeatures = [];
    for (const feature of product.features.en) {
      const translated = await translateField(feature, targetLang, 'feature');
      translatedFeatures.push(translated);
    }
    updates[`features.${targetLang}`] = translatedFeatures;
    console.log(`   ✓ Features translated (${translatedFeatures.length} items)`);
  }
  
  // 翻译应用场景（数组）
  if (product.applications?.en && Array.isArray(product.applications.en)) {
    const translatedApps = [];
    for (const app of product.applications.en) {
      const translated = await translateField(app, targetLang, 'application');
      translatedApps.push(translated);
    }
    updates[`applications.${targetLang}`] = translatedApps;
    console.log(`   ✓ Applications translated (${translatedApps.length} items)`);
  }
  
  // 翻译 SEO Meta 标题
  if (product.seo?.metaTitle?.en && !product.seo.metaTitle?.[targetLang]) {
    const enMeta = product.seo.metaTitle.en;
    const translatedMeta = await translateField(enMeta, targetLang, 'SEO meta title');
    updates[`seo.metaTitle.${targetLang}`] = translatedMeta;
    console.log(`   ✓ SEO meta title translated`);
  }
  
  // 翻译 SEO Meta 描述
  if (product.seo?.metaDescription?.en && !product.seo.metaDescription?.[targetLang]) {
    const enMetaDesc = product.seo.metaDescription.en;
    const translatedMetaDesc = await translateField(enMetaDesc, targetLang, 'SEO meta description');
    updates[`seo.metaDescription.${targetLang}`] = translatedMetaDesc;
    console.log(`   ✓ SEO meta description translated`);
  }
  
  // 如果有更新，执行 Sanity API 调用
  if (Object.keys(updates).length > 0) {
    try {
      await client.patch(product._id).set(updates).commit();
      console.log(`   ✅ Product updated successfully`);
      return true;
    } catch (error) {
      console.error(`   ✗ Failed to update product:`, error);
      return false;
    }
  } else {
    console.log(`   ℹ️ No updates needed`);
    return false;
  }
}

// 主函数
async function main() {
  console.log('🚀 Starting product translation...\n');
  
  // 目标语言列表
  const TARGET_LANGS = ['id', 'th', 'vi', 'ar'];
  
  // 获取所有产品
  const products = await getProductsNeedingTranslation();
  console.log(`Found ${products.length} products\n`);
  
  let totalUpdates = 0;
  let successCount = 0;
  let errorCount = 0;
  
  // 遍历每个产品和语言
  for (const product of products) {
    for (const lang of TARGET_LANGS) {
      if (needsTranslation(product, lang)) {
        totalUpdates++;
        try {
          const success = await translateProduct(product, lang);
          if (success) successCount++;
          
          // API 限流控制
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          errorCount++;
          console.error(`Error translating ${product.name?.en} to ${lang}:`, error);
        }
      }
    }
  }
  
  console.log('\n========================================');
  console.log('✅ Translation completed!');
  console.log(`Total updates attempted: ${totalUpdates}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  console.log('========================================\n');
}

// 运行脚本
main().catch(console.error);
