/**
 * AI Citability 内容展示组件
 * 
 * 在产品页面展示 AI 引用优化的内容块
 */

'use client';

import { useState } from 'react';

interface AICitableContentProps {
  question: string;
  answer: string;
  dataPoints?: string[];
  keywords?: string[];
}

/**
 * AI 引用优化内容块
 */
export function AICitableContentBlock({ question, answer, dataPoints = [], keywords = [] }: AICitableContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-600">
      {/* 问题标题（H2 标签，SEO 友好） */}
      <h2 
        className="text-xl font-bold text-gray-900 mb-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </h2>

      {/* AI 优化的回答 */}
      <div className={`prose max-w-none ${isExpanded ? 'block' : 'line-clamp-3'}`}>
        <p className="text-gray-700 leading-relaxed">{answer}</p>
      </div>

      {/* 数据点列表（可展开） */}
      {dataPoints.length > 0 && isExpanded && (
        <div className="mt-4 bg-blue-50 rounded-md p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Key Facts:</h3>
          <ul className="space-y-1">
            {dataPoints.map((point, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 关键词标签 */}
      {keywords.length > 0 && isExpanded && (
        <div className="mt-4 flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}

      {/* 展开/收起提示 */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
        >
          Read more
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </section>
  );
}

/**
 * 技术规格对比表组件
 */
interface ComparisonTableProps {
  item1: string;
  item2: string;
  criteria: Array<{
    name: string;
    item1Value: string;
    item2Value: string;
  }>;
}

export function ComparisonTable({ item1, item2, criteria }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Feature</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{item1}</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{item2}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {criteria.map((criterion, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{criterion.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{criterion.item1Value}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{criterion.item2Value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * FAQ 列表组件（AI 引用优化）
 */
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQListProps {
  faqs: FAQItem[];
}

export function FAQList({ faqs }: FAQListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
            <button
              className="flex justify-between items-center w-full text-left"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-lg font-medium text-gray-900">{faq.question}</span>
              <svg
                className={`w-5 h-5 transition-transform ${openIndex === index ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openIndex === index && (
              <div className="mt-3 prose max-w-none">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
