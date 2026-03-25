/**
 * AI 配图功能测试脚本
 * 
 * 测试通义万相 API 的稳定性和响应时间
 * 使用方法：npx tsx scripts/test-ai-image.ts
 */

import { generateAIImage } from './news-auto/ai-processor';

interface TestResult {
  testNumber: number;
  prompt: string;
  success: boolean;
  imageUrl?: string;
  duration: number;
  error?: string;
}

// 测试用的 prompt 列表（模拟不同类型的文章）
const TEST_PROMPTS = [
  'Professional LED display technology for data centers, modern manufacturing facility with blue and white lighting, high-tech clean room environment',
  'UV LED sterilization module for water treatment, industrial equipment, stainless steel chamber with purple UV light',
  'IR LED night vision camera system, security surveillance, infrared illumination in darkness, professional safety equipment',
  'Automotive LED headlight system, modern car lighting technology, bright white LED beams, automotive industry application',
  'Smart LED grow lights for indoor farming, agricultural greenhouse with red and blue spectrum, plant growth lighting',
];

async function runTests() {
  console.log('🧪 Starting AI Image Generation Tests\n');
  console.log('========================================\n');
  
  const results: TestResult[] = [];
  
  for (let i = 0; i < TEST_PROMPTS.length; i++) {
    const testNumber = i + 1;
    const prompt = TEST_PROMPTS[i];
    
    console.log(`📸 Test ${testNumber}/${TEST_PROMPTS.length}`);
    console.log(`   Prompt: ${prompt.substring(0, 80)}...`);
    
    const startTime = Date.now();
    
    try {
      // 测试直接生成图片（跳过 prompt 生成，使用固定 prompt）
      const imageUrl = await generateAIImage(prompt);
      const duration = Date.now() - startTime;
      
      if (imageUrl) {
        console.log(`   ✅ Success! Duration: ${duration}ms`);
        console.log(`   🖼️  Image URL: ${imageUrl}`);
        
        results.push({
          testNumber,
          prompt,
          success: true,
          imageUrl,
          duration,
        });
      } else {
        console.log(`   ⚠️  Returned null (API may have issues)`);
        results.push({
          testNumber,
          prompt,
          success: false,
          duration,
          error: 'Returned null',
        });
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.log(`   ❌ Failed: ${error.message}`);
      
      results.push({
        testNumber,
        prompt,
        success: false,
        duration,
        error: error.message,
      });
    }
    
    console.log('');
    
    // 等待 3 秒避免 API 限流
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // 输出测试报告
  console.log('\n========================================');
  console.log('📊 Test Report');
  console.log('========================================\n');
  
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  
  console.log(`Total tests: ${results.length}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`⏱️  Average duration: ${Math.round(avgDuration)}ms`);
  console.log(`📈 Success rate: ${((successCount / results.length) * 100).toFixed(1)}%`);
  console.log('');
  
  if (successCount > 0) {
    console.log('🖼️  Generated Images:');
    results.filter(r => r.success).forEach(r => {
      console.log(`   Test ${r.testNumber}: ${r.imageUrl}`);
    });
  }
  
  if (failCount > 0) {
    console.log('\n⚠️  Failed Tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   Test ${r.testNumber}: ${r.error}`);
    });
  }
  
  console.log('\n========================================\n');
  
  // 给出建议
  if (successCount === results.length) {
    console.log('🎉 All tests passed! API is working perfectly.');
  } else if (successCount >= results.length * 0.6) {
    console.log('⚠️  API is mostly functional, but some instability detected.');
    console.log('   Suggestions:');
    console.log('   1. Check API key quota and limits');
    console.log('   2. Verify network connection stability');
    console.log('   3. Consider implementing retry logic');
  } else {
    console.log('❌ API has serious issues. Please check:');
    console.log('   1. DASHSCOPE_API_KEY environment variable');
    console.log('   2. API endpoint URL correctness');
    console.log('   3. Network connectivity and firewall');
    console.log('   4. API service status and quota');
  }
  
  console.log('');
}

// 运行测试
runTests().catch(console.error);
