import { client } from '../../lib/sanity/client';
import type { ProcessedArticle, ArticleWithImage } from './ai-processor';

// 生成 slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// 检查文章是否已存在（基于中文标题或原始 URL）
async function checkDuplicate(title: string, sourceUrl?: string): Promise<boolean> {
  // 1. 先检查原始 URL 是否已存在（最准确）
  if (sourceUrl) {
    const urlQuery = `*[_type == "article" && source.url == "${sourceUrl}"][0]`;
    const existingByUrl = await client.fetch(urlQuery);
    if (existingByUrl) {
      console.log(`  ⚠️ [重复检测] URL 已存在：${sourceUrl}`);
      return true;
    }
  }
  
  // 2. 再检查中文标题是否重复
  const titleQuery = `*[_type == "article" && title.zh == "${title}"][0]`;
  const existingByTitle = await client.fetch(titleQuery);
  if (existingByTitle) {
    console.log(`  ⚠️ [重复检测] 标题已存在：${title}`);
    return true;
  }
  
  console.log(`  ✓ [重复检测] 通过（非重复文章）`);
  return false;
}

// 获取分类 ID
async function getCategoryId(categorySlug: string): Promise<string | null> {
  const query = `*[_type == "articleCategory" && slug.current == "${categorySlug}"][0]._id`;
  return await client.fetch(query);
}

// 上传图片到 Sanity
async function uploadImageFromUrl(imageUrl: string): Promise<string | null> {
  try {
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return null;
    }
    
    // 下载图片
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`  ✗ Failed to download image: ${response.status}`);
      return null;
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // 使用 Sanity 的 assets API 上传图片
    const doc = await client.assets.upload('image', buffer, {
      source: {
        name: 'news-auto',
        id: imageUrl,
      },
    });
    
    return doc._id;
  } catch (error) {
    console.error('  ✗ Image upload failed:', error);
    return null;
  }
}

// 发布文章到 Sanity
export async function publishArticle(
  processed: ProcessedArticle,
  sourceUrl: string,
  sourceName: string,
  imageUrl?: string
): Promise<boolean> {
  try {
    // 检查重复（优先使用 URL 检查）
    const isDuplicate = await checkDuplicate(processed.title.zh, sourceUrl);
    if (isDuplicate) {
      console.log(`  ⚠️ Article already exists: ${processed.title.zh}`);
      return false;
    }
    
    // 获取分类 ID
    const categoryId = await getCategoryId(processed.category);
    if (!categoryId) {
      console.error(`  ✗ [发布失败] 分类不存在：${processed.category}`);
      console.error(`     请检查 Sanity 中是否有此分类`);
      return false;
    }
    console.log(`  ✓ [分类检查] 通过：${processed.category} (ID: ${categoryId})`);
    
    // 上传图片（如果有）
    let coverImage = null;
    if (imageUrl) {
      console.log(`  📷 [图片上传] 开始上传：${imageUrl.substring(0, 80)}...`);
      const imageAssetId = await uploadImageFromUrl(imageUrl);
      if (imageAssetId) {
        coverImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAssetId,
          },
        };
        console.log('  ✅ [图片上传] 成功');
      } else {
        console.warn('  ⚠️ [图片上传] 失败，文章将无配图');
      }
    }
    
    // 构建 Sanity 文档
    const doc: any = {
      _type: 'article',
      title: processed.title,
      slug: {
        current: generateSlug(processed.title.zh),
      },
      category: {
        _type: 'reference',
        _ref: categoryId,
      },
      tags: processed.tags,
      excerpt: processed.excerpt,
      ...(coverImage && { coverImage }),
      content: {
        zh: [
          {
            _key: 'zh_block_1',
            _type: 'block',
            style: 'normal',
            children: [
              {
                _key: 'zh_span_1',
                _type: 'span',
                text: processed.content.zh,
              },
            ],
          },
        ],
        en: [
          {
            _key: 'en_block_1',
            _type: 'block',
            style: 'normal',
            children: [
              {
                _key: 'en_span_1',
                _type: 'span',
                text: processed.content.en || processed.content.zh,
              },
            ],
          },
        ],
        id: [
          {
            _key: 'id_block_1',
            _type: 'block',
            style: 'normal',
            children: [
              {
                _key: 'id_span_1',
                _type: 'span',
                text: processed.content.id || processed.content.en || processed.content.zh,
              },
            ],
          },
        ],
        th: [
          {
            _key: 'th_block_1',
            _type: 'block',
            style: 'normal',
            children: [
              {
                _key: 'th_span_1',
                _type: 'span',
                text: processed.content.th || processed.content.en || processed.content.zh,
              },
            ],
          },
        ],
        vi: [
          {
            _key: 'vi_block_1',
            _type: 'block',
            style: 'normal',
            children: [
              {
                _key: 'vi_span_1',
                _type: 'span',
                text: processed.content.vi || processed.content.en || processed.content.zh,
              },
            ],
          },
        ],
        ar: [
          {
            _key: 'ar_block_1',
            _type: 'block',
            style: 'normal',
            children: [
              {
                _key: 'ar_span_1',
                _type: 'span',
                text: processed.content.ar || processed.content.en || processed.content.zh,
              },
            ],
          },
        ],
      },
      publishedAt: new Date().toISOString(),
      status: 'published',
      author: {
        name: 'GOPRO LED',
      },
      source: {
        url: sourceUrl,
        name: sourceName,
        isAutoGenerated: true,
      },
      seo: {
        metaTitle: processed.seo.metaTitle,
        metaDescription: processed.seo.metaDescription,
        keywords: processed.seo.keywords,
      },
      viewCount: 0,
      isFeatured: false,
    };
    
    // 创建文档
    const result = await client.create(doc);
    console.log(`  ✅ [发布成功] ID: ${result._id}`);
    console.log(`     标题：${processed.title.zh}`);
    console.log(`     分类：${processed.category}`);
    if (imageUrl) {
      console.log(`     图片：已上传`);
    } else {
      console.log(`     图片：无`);
    }
    
    return true;
  } catch (error) {
    console.error('  ✗ Publish failed:', error);
    return false;
  }
}

// 批量发布
export async function publishArticles(
  articles: ProcessedArticle[],
  sourceMap: Map<string, { url: string; name: string; imageUrl?: string }>
): Promise<number> {
  let published = 0;
  
  for (const article of articles) {
    // 找到对应的 source 信息
    const source = sourceMap.get(article.title.zh);
    if (!source) {
      console.log(`  ⚠️ Source not found for: ${article.title.zh}`);
      continue;
    }
    
    // 优先使用原图，如果没有则使用 AI 生成的图片
    let imageUrlToUse = source.imageUrl;
    if (!imageUrlToUse && (article as ArticleWithImage).generatedImageUrl) {
      imageUrlToUse = (article as ArticleWithImage).generatedImageUrl;
      console.log(`   Using AI-generated image`);
    }
    
    const success = await publishArticle(article, source.url, source.name, imageUrlToUse);
    if (success) {
      published++;
    }
    
    // 避免 API 限流
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return published;
}
