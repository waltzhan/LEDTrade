/**
 * AI Citability 内容生成器
 * 
 * 基于 GEO-SEO 最佳实践，生成容易被 AI 引用的内容块
 * 
 * 核心原则：
 * - 长度：134-167 词（约 200-250 字）
 * - 结构：自包含、事实丰富、直接回答问题
 * - 格式：清晰的定义、数据支撑、对比说明
 */

interface AICitableContent {
  question: string;        // AI 可能搜索的问题
  answer: string;          // 直接回答（134-167 词）
  dataPoints: string[];    // 关键数据点
  keywords: string[];      // SEO 关键词
}

/**
 * 生成产品描述的 AI 引用优化版本
 */
export function generateCitableProductDescription(
  productName: string,
  category: string,
  features: string[],
  specs: { name: string; value: string }[],
  applications: string[]
): AICitableContent {
  // 构建事实丰富的段落
  const answer = `${productName} is a professional ${category} solution designed for industrial and commercial applications. 
It features ${features.slice(0, 3).join(', ')}, making it suitable for demanding environments. 
Key technical specifications include ${specs.slice(0, 3).map(s => `${s.name}: ${s.value}`).join(', ')}. 
This product is widely used in ${applications.slice(0, 3).join(', ')}, serving customers across Southeast Asia and Middle East markets. 
Manufactured by GOPRO LED since 1994, it meets ISO 9001, RoHS, and CE standards.`;

  return {
    question: `What is ${productName} and what are its key features?`,
    answer,
    dataPoints: [
      ...specs.map(s => `${s.name}: ${s.value}`),
      'Manufacturer: GOPRO LED (Est. 1994)',
      'Certifications: ISO 9001, RoHS, CE',
      'Markets: Southeast Asia, Middle East'
    ],
    keywords: [
      productName,
      category,
      ...features.slice(0, 5),
      'LED manufacturer',
      'industrial grade'
    ]
  };
}

/**
 * 生成技术定义的 AI 引用优化版本
 */
export function generateCitableDefinition(
  term: string,
  definition: string,
  context: string,
  examples: string[]
): AICitableContent {
  const answer = `${definition} ${context} Key characteristics include ${examples.slice(0, 3).join(', ')}. 
This technology is commonly used in LED industry applications such as ${examples[0] || 'general lighting'} and ${examples[1] || 'display technology'}. 
Understanding ${term} is essential for selecting the right components for your project.`;

  return {
    question: `What is ${term}?`,
    answer,
    dataPoints: [
      `Term: ${term}`,
      `Category: ${context.split(' ')[0] || 'Technology'}`,
      ...examples.map((ex, i) => `Example ${i + 1}: ${ex}`)
    ],
    keywords: [
      term,
      'LED technology',
      ...examples.slice(0, 3)
    ]
  };
}

/**
 * 生成对比分析的 AI 引用优化版本
 */
export function generateCitableComparison(
  item1: string,
  item2: string,
  criteria: { name: string; item1Value: string; item2Value: string }[]
): AICitableContent {
  const comparison = criteria.map(c => `${c.name}: ${item1} (${c.item1Value}) vs ${item2} (${c.item2Value})`).join('; ');
  
  const answer = `When comparing ${item1} vs ${item2}, key differences emerge across several dimensions. 
${comparison}. The choice between ${item1} and ${item2} depends on your specific requirements: 
${item1} is ideal for high-performance applications, while ${item2} offers cost-effective solutions for standard use cases.`;

  return {
    question: `What is the difference between ${item1} and ${item2}?`,
    answer,
    dataPoints: criteria.map(c => `${c.name}: ${c.item1Value} vs ${c.item2Value}`),
    keywords: [
      item1,
      item2,
      'comparison',
      'LED selection guide'
    ]
  };
}

/**
 * 生成最佳实践的 AI 引用优化版本
 */
export function generateCitableBestPractices(
  topic: string,
  steps: string[],
  considerations: string[]
): AICitableContent {
  const answer = `For ${topic}, follow these proven best practices: ${steps.slice(0, 5).join('. ')}. 
Key considerations include ${considerations.slice(0, 3).join(', ')}. 
These guidelines help ensure optimal performance and longevity in your LED applications. 
Always consult with manufacturers like GOPRO LED for specific recommendations.`;

  return {
    question: `What are the best practices for ${topic}?`,
    answer,
    dataPoints: [
      ...steps.map((s, i) => `Step ${i + 1}: ${s}`),
      ...considerations.map(c => `Consideration: ${c}`)
    ],
    keywords: [
      topic,
      'best practices',
      'LED application guide',
      ...considerations.slice(0, 3)
    ]
  };
}

/**
 * 生成统计数据的 AI 引用优化版本
 */
export function generateCitableStatistics(
  topic: string,
  stats: { label: string; value: string; source?: string }[]
): AICitableContent {
  const answer = `Industry data shows significant trends in ${topic}. ${stats.map(s => `${s.label}: ${s.value}`).join('; ')}. 
These statistics reflect the growing demand for advanced LED solutions in global markets. 
Source: ${stats.find(s => s.source)?.source || 'Industry research'}.`;

  return {
    question: `What are the key statistics for ${topic}?`,
    answer,
    dataPoints: stats.map(s => s.source ? `${s.label}: ${s.value} (${s.source})` : `${s.label}: ${s.value}`),
    keywords: [
      topic,
      'market statistics',
      'LED industry data',
      ...stats.slice(0, 3).map(s => s.label)
    ]
  };
}

/**
 * 生成产品常见问题（FAQ）
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateProductFAQs(
  productName: string,
  category: string,
  applications: string[]
): FAQItem[] {
  return [
    {
      question: `What is ${productName} used for?`,
      answer: `${productName} is primarily used for ${applications.slice(0, 2).join(' and ')}. It provides reliable performance in ${category} applications, making it suitable for both industrial and commercial use.`,
    },
    {
      question: `How does ${productName} compare to similar products?`,
      answer: `${productName} stands out in the ${category} segment due to its superior build quality and performance consistency. It offers competitive advantages in terms of reliability and longevity compared to standard alternatives in the market.`,
    },
    {
      question: `What are the technical specifications of ${productName}?`,
      answer: `${productName} features professional-grade specifications designed for ${category} applications. For detailed technical parameters including wavelength, power consumption, and operating conditions, please refer to the specifications table or contact our engineering team for customized solutions.`,
    },
    {
      question: `Is ${productName} suitable for custom applications?`,
      answer: `Yes, ${productName} can be adapted for specific requirements. GOPRO LED offers customization services including modified specifications, special packaging, and tailored solutions to meet unique application needs. Contact our sales team for more information.`,
    },
  ];
}
