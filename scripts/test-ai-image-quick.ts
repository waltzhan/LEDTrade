/**
 * 快速测试 AI 生图功能
 */

import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testAIImage() {
  console.log('🧪 Testing AI Image Generation...\n');
  
  const apiKey = process.env.DASHSCOPE_API_KEY;
  
  if (!apiKey) {
    console.error('❌ DASHSCOPE_API_KEY not found!');
    return;
  }
  
  console.log('✅ API Key loaded:', apiKey.substring(0, 10) + '...');
  
  try {
    // 测试 prompt
    const prompt = 'Professional LED technology manufacturing facility, modern factory with blue lighting, high-tech industrial environment, clean room, data center lighting';
    
    console.log('\n📝 Prompt:', prompt.substring(0, 50) + '...');
    console.log('⏳ Generating image... (this may take 30-60 seconds)\n');
    
    // 提交任务
    const submitResponse = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        model: 'wanx-v1',
        input: { prompt },
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
          'X-DashScope-Async': 'enable',
        },
        timeout: 30000,
      }
    );
    
    const taskId = submitResponse.data.output?.task_id;
    console.log('📋 Task ID:', taskId);
    
    if (!taskId) {
      throw new Error('Failed to get task_id');
    }
    
    // 轮询等待
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await axios.get(
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
        {
          headers: { 'Authorization': `Bearer ${apiKey}` },
          timeout: 10000,
        }
      );
      
      const status = statusResponse.data.output?.task_status;
      console.log(`   Status: ${status} (${i + 1}/30)`);
      
      if (status === 'SUCCEEDED') {
        const imageUrl = statusResponse.data.output?.results?.[0]?.url;
        console.log('\n✅ SUCCESS! Image URL:', imageUrl);
        return;
      } else if (status === 'FAILED') {
        console.error('\n❌ FAILED:', statusResponse.data.output?.message);
        return;
      }
    }
    
    console.log('\n⚠️ Timeout waiting for image');
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testAIImage();
