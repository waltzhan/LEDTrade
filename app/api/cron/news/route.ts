import { NextRequest, NextResponse } from 'next/server';
import { runNewsAutomation } from '../../../../scripts/news-auto';

// Vercel Cron Job 调用此 API
export async function GET(request: NextRequest) {
  // 验证 Cron Secret（防止未授权访问）
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET?.trim();
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    console.log('🕐 Cron job triggered at:', new Date().toISOString());
    
    // 检查是否配置了 API Key
    if (!process.env.DASHSCOPE_API_KEY) {
      return NextResponse.json(
        { error: 'DASHSCOPE_API_KEY not configured' },
        { status: 500 }
      );
    }
    
    // 运行自动化流程
    await runNewsAutomation();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { 
        error: 'Automation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 支持 POST 请求（用于手动触发）
export async function POST(request: NextRequest) {
  return GET(request);
}
