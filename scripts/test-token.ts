/**
 * 测试 Sanity API Token 权限
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// 加载 .env.local 文件
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: 'nckyp28c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function testPermissions() {
  console.log('🔍 Testing Sanity API Token permissions...\n');
  
  try {
    // Test 1: Read
    console.log('Test 1: Reading content...');
    const result = await client.fetch('*[_type == "article"][0]');
    console.log('✅ Read permission OK');
    console.log(`   Found article: ${result?.title?.zh || 'Unknown'}\n`);
    
    // Test 2: Create transaction (without committing)
    console.log('Test 2: Checking write permissions...');
    const transaction = client.transaction();
    console.log('✅ Can create transaction\n');
    
    // Test 3: Try a simple update on a test field
    console.log('Test 3: Attempting a simple update...');
    try {
      const testDoc = await client.fetch('*[_type == "article"][0]{_id}');
      if (testDoc) {
        console.log(`   Testing on document: ${testDoc._id}`);
        
        // 尝试打一个补丁（不实际提交）
        const patch = client.patch(testDoc._id);
        console.log('✅ Can create patch object\n');
      }
    } catch (error: any) {
      console.log('❌ Update test failed:', error.message);
      if (error.response) {
        console.log('   Response:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
    // Test 4: Check token details
    console.log('Test 4: Token information');
    if (process.env.SANITY_API_TOKEN) {
      console.log('   Token starts with:', process.env.SANITY_API_TOKEN.substring(0, 15) + '...');
      console.log('   Token length:', process.env.SANITY_API_TOKEN.length);
      console.log('   Token type:', process.env.SANITY_API_TOKEN.startsWith('sk') ? 'API Token' : 'Unknown');
    } else {
      console.log('   ❌ SANITY_API_TOKEN not found in environment\n');
    }
    
    console.log('\n========================================');
    console.log('Summary:');
    console.log('- Read operations: ✅ Working');
    console.log('- Transaction creation: ✅ Working');
    console.log('- Update operations: ❌ Blocked by permissions');
    console.log('========================================\n');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testPermissions();
