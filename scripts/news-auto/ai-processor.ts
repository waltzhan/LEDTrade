import axios from 'axios';
import { NEWS_CONFIG, TARGET_LOCALES } from './config';
import type { RawArticle } from './crawler';

export interface ProcessedArticle {
  title: Record<string, string>;
  excerpt: Record<string, string>;
  content: Record<string, string>;
  tags: string[]; // 英文标签，在所有语言版本下通用
  category: string;
  seo: {
    metaTitle: Record<string, string>;
    metaDescription: Record<string, string>;
    keywords: string[];
  };
}

export interface ArticleWithImage extends ProcessedArticle {
  generatedImageUrl?: string; // AI 生成的图片 URL
}

// 通义千问 API 调用（阿里云百炼大模型）
export async function callQwen(prompt: string): Promise<string> {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  
  if (!apiKey) {
    throw new Error('DASHSCOPE_API_KEY not found in environment variables');
  }
  
  try {
    const response = await axios.post(
      'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        model: 'qwen-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional LED industry content writer. Write in a professional, informative style suitable for B2B audiences.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: NEWS_CONFIG.ai.maxTokens,
        temperature: NEWS_CONFIG.ai.temperature,
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

// 改写文章内容
async function rewriteContent(article: RawArticle): Promise<string> {
  const prompt = `
请根据以下LED行业新闻，改写成一篇专业的中文行业资讯文章：

原标题：${article.title}
来源：${article.source}
原文摘要：${article.summary}

要求：
1. 标题要吸引人，突出核心信息，长度控制在20-30字
2. 正文500-800字，结构清晰，包含导语、主体、总结
3. 语言专业、客观，适合B2B读者
4. 保留关键数据和技术细节
5. 适当提及光莆电子(GOPRO LED)的相关产品或技术优势（如果相关）
6. 不要直接翻译，要用中文重新组织和表达

请直接输出改写后的文章正文，不需要标注标题。
`;

  return await callQwen(prompt);
}

// 生成多语言版本
async function translateContent(content: string, targetLang: string): Promise<string> {
  const langNames: Record<string, string> = {
    en: 'English',
    id: 'Bahasa Indonesia',
    th: 'Thai',
    vi: 'Vietnamese',
    ar: 'Arabic',
  };
  
  const prompt = `
请将以下中文LED行业文章翻译成${langNames[targetLang]}：

${content}

要求：
1. 保持专业术语准确
2. 符合当地商业写作习惯
3. 保留所有技术细节
4. 语言自然流畅

请直接输出翻译后的内容。
`;

  return await callQwen(prompt);
}

// 提取英文关键词（LED行业术语通用英文）
async function extractKeywords(content: string): Promise<string[]> {
  const prompt = `
Please extract 5-8 keywords from the following LED industry article in English:

${content.substring(0, 500)}

Requirements:
1. Keywords should cover the core topics of the article
2. Include technical terms and product categories
3. Suitable for SEO optimization
4. Output separated by commas
5. Output keywords only, no numbers or other explanations
6. Use English only, no Chinese characters

Examples of good keywords: MicroLED, Display Technology, Automotive Lighting, Data Center, High Brightness, Low Power, Long Lifespan, LED Chip, UV LED, Smart Lighting

Please output the keyword list directly.
`;

  const result = await callQwen(prompt);
  return result.split(/[,，、]/).map(k => k.trim()).filter(k => k.length > 0 && !/[\u4e00-\u9fa5]/.test(k));
}

// 生成摘要
async function generateExcerpt(content: string, maxLength: number = 150): Promise<string> {
  const prompt = `
请为以下文章生成一个简洁的摘要（${maxLength}字以内）：

${content.substring(0, 800)}

要求：
1. 概括文章核心内容
2. 吸引读者点击阅读
3. 适合用于列表展示

请直接输出摘要。
`;

  return await callQwen(prompt);
}

// 生成 AI 配图（通义万相）
export async function generateAIImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ DASHSCOPE_API_KEY not found, skipping AI image generation');
    return null;
  }
  
  try {
    console.log('🎨 Generating AI image...');
    
    // 第一步：提交任务
    const submitResponse = await axios.post(
      'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        model: 'wanx-v1',
        input: {
          prompt: prompt,
        },
        parameters: {
          style: '<auto>',
          size: '1024*768',
          n: 1,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-DashScope-Async': 'enable', // 异步任务
        },
        timeout: 30000,
      }
    );
    
    const taskId = submitResponse.data.output?.task_id;
    if (!taskId) {
      throw new Error('Failed to get task_id from Wanxiang API');
    }
    
    console.log(`  Task ID: ${taskId}`);
    
    // 第二步：轮询任务状态（最长等待 60 秒）
    let imageUrl: string | null = null;
    const maxAttempts = 30; // 30 * 2s = 60s
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 等待 2 秒
      
      const statusResponse = await axios.get(
        `https://dashscope-intl.aliyuncs.com/api/v1/tasks/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
          timeout: 10000,
        }
      );
      
      const taskStatus = statusResponse.data.output?.task_status;
      
      if (taskStatus === 'SUCCEEDED') {
        imageUrl = statusResponse.data.output?.results?.[0]?.url;
        console.log('  ✓ Image generated successfully');
        break;
      } else if (taskStatus === 'FAILED') {
        throw new Error(`Image generation failed: ${statusResponse.data.output?.message || 'Unknown error'}`);
      }
      
      console.log(`  Waiting for image... (${attempt + 1}/${maxAttempts})`);
    }
    
    return imageUrl;
  } catch (error) {
    console.error('✗ AI image generation error:', error);
    return null;
  }
}

// 根据文章内容生成图像 prompt
async function generateImagePrompt(article: ProcessedArticle): Promise<string> {
  const zhContent = article.content.zh || '';
  const zhTitle = article.title.zh || '';
  
  const prompt = `
请为以下 LED 行业文章生成一个专业的英文图像描述 prompt：

标题：${zhTitle}
内容摘要：${zhContent.substring(0, 300)}...

要求：
1. 用英文描述，简洁清晰（50-100 词）
2. 突出 LED 技术、产品或应用场景
3. 适合生成专业、现代的科技风格图片
4. 包含关键视觉元素：产品类型、颜色、光线效果、应用环境等
5. 避免抽象概念，聚焦具体可视化的物体

示例格式："Professional LED display technology, modern manufacturing facility, blue and white lighting, high-tech atmosphere, clean room environment, detailed product showcase"

请直接输出英文 prompt。
`;

  try {
    const imagePrompt = await callQwen(prompt);
    return imagePrompt.trim();
  } catch (error) {
    console.error('Failed to generate image prompt:', error);
    // fallback：使用简化的默认 prompt
    return `Professional LED technology and lighting products, modern industrial design, high quality commercial photography style`;
  }
}

// 主处理函数
export async function processArticle(article: RawArticle): Promise<ProcessedArticle> {
  console.log(`🤖 Processing article: ${article.title}`);
  
  // 1. 改写中文内容
  const zhContent = await rewriteContent(article);
  console.log('  ✓ Chinese content generated');
  
  // 2. 生成中文标题和摘要
  const zhTitle = await callQwen(`
请为以下文章生成一个吸引人的中文标题（20-30字）：
${zhContent.substring(0, 300)}
要求：突出核心信息，专业且有吸引力。直接输出标题。
`);
  
  const zhExcerpt = await generateExcerpt(zhContent);
  console.log('  ✓ Title and excerpt generated');
  
  // 3. 生成多语言版本
  const title: Record<string, string> = { zh: zhTitle.trim() };
  const excerpt: Record<string, string> = { zh: zhExcerpt };
  const content: Record<string, string> = { zh: zhContent };
  
  for (const lang of TARGET_LOCALES) {
    if (lang === 'zh') continue;
    
    try {
      content[lang] = await translateContent(zhContent, lang);
      title[lang] = await translateContent(zhTitle, lang);
      excerpt[lang] = await translateContent(zhExcerpt, lang);
      console.log(`  ✓ ${lang} translation completed`);
    } catch (error) {
      console.error(`  ✗ ${lang} translation failed:`, error);
      // 如果翻译失败，使用英文或中文作为fallback
      content[lang] = content['en'] || zhContent;
      title[lang] = title['en'] || zhTitle;
      excerpt[lang] = excerpt['en'] || zhExcerpt;
    }
  }
  
  // 4. 提取英文关键词（LED 行业术语通用英文）
  const keywords = await extractKeywords(zhContent);
  console.log('  ✓ Keywords extracted:', keywords);
    
  // 5. 生成 SEO 信息
  const seo = {
    metaTitle: title,
    metaDescription: excerpt,
    keywords: keywords,
  };
    
  const result: ProcessedArticle = {
    title,
    excerpt,
    content,
    tags: keywords, // 使用英文标签，在所有语言版本下通用
    category: article.category,
    seo,
  };
    
  // 6. 生成 AI 配图（总是生成高质量配图，覆盖原图）
  console.log('\n🎨 [AI 生图] 开始生成专业配图...');
  if (article.imageUrl) {
    console.log(`   ℹ️ 原文有图片：${article.imageUrl.substring(0, 80)}...`);
  } else {
    console.log('   ℹ️ 原文无图片，必须生成 AI 图');
  }
  
  const imagePrompt = await generateImagePrompt(result);
  console.log(`   📝 Prompt: ${imagePrompt.substring(0, 100)}...`);
    
  const generatedImageUrl = await generateAIImage(imagePrompt);
  if (generatedImageUrl) {
    console.log(`   ✅ [AI 生图] 成功：${generatedImageUrl}`);
    (result as ArticleWithImage).generatedImageUrl = generatedImageUrl;
  } else {
    // Fallback: 如果没有生成 AI 图且原图也没有，记录警告
    if (!article.imageUrl) {
      console.warn('   ⚠️ [AI 生图] 失败且无原图可用！');
    } else {
      console.log('   ℹ️ [AI 生图] 失败，使用原图');
    }
  }
    
  return result;
}

// 批量处理
// 注意：articles 传入前已由 scheduler.getPublishQuota() 限制数量
export async function processArticles(articles: RawArticle[]): Promise<ProcessedArticle[]> {
  const processed: ProcessedArticle[] = [];

  for (const article of articles) {
    try {
      const result = await processArticle(article);
      processed.push(result);

      // 避免API限流
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to process article: ${article.title}`, error);
    }
  }

  return processed;
}
