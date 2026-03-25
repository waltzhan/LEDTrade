/**
 * LED 术语表页面
 * 
 * 展示 AI 引用优化的技术术语定义
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCategories, searchGlossary, getAIOptimizedDefinition } from '@/data/led-glossary';
import { AICitableContentBlock } from '@/components/products/ai-citability-block';

export const metadata: Metadata = {
  title: 'LED Terminology Glossary | GOPRO LED',
  description: 'Comprehensive LED terminology glossary with AI-optimized definitions for IR LEDs, UV LEDs, and related technologies.',
};

// ISR: 每 24 小时重新验证
export const revalidate = 86400;

export default async function GlossaryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const category = params.category || '';

  // 获取所有分类
  const categories = getAllCategories();

  // 搜索或筛选术语
  let filteredTerms = [];
  if (query) {
    filteredTerms = searchGlossary(query);
  } else if (category) {
    filteredTerms = require('@/data/led-glossary').getTermsByCategory(category);
  } else {
    filteredTerms = require('@/data/led-glossary').LED_GLOSSARY;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">LED Terminology Glossary</h1>
          <p className="text-lg text-gray-600 mb-6">
            Comprehensive definitions of LED industry terms, optimized for AI understanding and citation.
          </p>

          {/* 搜索框 */}
          <form className="flex gap-4">
            <input
              type="text"
              name="q"
              placeholder="Search terms (e.g., IR LED, UV, wavelength)..."
              defaultValue={query}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* 分类筛选 */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/glossary"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Terms
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/glossary?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* 搜索结果统计 */}
        {query && (
          <div className="mb-6 text-gray-600">
            Found <strong>{filteredTerms.length}</strong> term{filteredTerms.length !== 1 ? 's' : ''} matching &ldquo;{query}&rdquo;
          </div>
        )}

        {/* 术语列表 */}
        <div className="space-y-6">
          {filteredTerms.map((term: any) => {
            const aiContent = getAIOptimizedDefinition(term.term);
            
            return aiContent ? (
              <AICitableContentBlock
                key={term.term}
                question={aiContent.question}
                answer={aiContent.answer}
                dataPoints={aiContent.dataPoints}
                keywords={aiContent.keywords}
              />
            ) : null;
          })}
        </div>

        {/* 空状态 */}
        {filteredTerms.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No terms found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or browse all categories.
            </p>
            <Link
              href="/glossary"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Terms
            </Link>
          </div>
        )}

        {/* SEO 说明 */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-3">
            About This Glossary
          </h2>
          <p className="text-sm text-blue-800 leading-relaxed">
            This LED terminology glossary is optimized for AI search engines and large language models (LLMs). 
            Each definition follows GEO (Generative Engine Optimization) best practices, providing clear, 
            factual information in a format that AI systems can easily understand and cite. 
            The content structure enhances visibility in AI-powered search results including ChatGPT, 
            Claude, Google AI Overviews, and Perplexity.
          </p>
        </div>
      </div>
    </div>
  );
}
