/**
 * GEO 评分 API
 * 
 * 提供网站的 GEO 评分和审计报告
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateGEOScore, generateGEOAudit, getCurrentSiteScore } from '@/lib/geo/geo-score';

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'score';

    if (action === 'score') {
      // 返回当前网站的 GEO 得分
      const score = getCurrentSiteScore();
      
      return NextResponse.json({
        success: true,
        data: {
          type: 'score',
          score,
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (action === 'audit') {
      // 返回完整的 GEO 审计报告
      const score = getCurrentSiteScore();
      const audit = generateGEOAudit(score);
      
      return NextResponse.json({
        success: true,
        data: {
          type: 'audit',
          ...audit,
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (action === 'calculate' && request.method === 'POST') {
      // 自定义计算 GEO 得分
      const body = await request.json();
      
      const score = calculateGEOScore(body);
      const audit = generateGEOAudit(score);
      
      return NextResponse.json({
        success: true,
        data: {
          type: 'custom',
          score,
          audit,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('GEO Score API error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate GEO score' },
      { status: 500 }
    );
  }
}

// 支持 POST 请求（用于自定义计算）
export async function POST(request: NextRequest) {
  return GET(request);
}
