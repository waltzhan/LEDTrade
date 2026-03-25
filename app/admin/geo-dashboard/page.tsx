/**
 * GEO Dashboard - SEO 监控面板
 * 
 * 展示网站的 GEO 评分、审计报告和改进建议
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GEOScore {
  overall: number;
  citability: number;
  brandAuthority: number;
  contentQuality: number;
  technicalSEO: number;
  structuredData: number;
  platformOptimization: number;
}

interface AuditReport {
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    action: string;
    impact: 'High' | 'Medium' | 'Low';
    effort: 'Easy' | 'Medium' | 'Hard';
  }>;
}

export default function GEODashboard() {
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<GEOScore | null>(null);
  const [audit, setAudit] = useState<AuditReport | null>(null);

  useEffect(() => {
    fetchGEODashboard();
  }, []);

  async function fetchGEODashboard() {
    try {
      setLoading(true);
      
      // 获取 GEO 评分
      const scoreRes = await fetch('/api/geo/score?action=score');
      const scoreData = await scoreRes.json();
      setScore(scoreData.data.score);
      
      // 获取审计报告
      const auditRes = await fetch('/api/geo/score?action=audit');
      const auditData = await auditRes.json();
      setAudit(auditData.data);
    } catch (error) {
      console.error('Failed to fetch GEO data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GEO Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!score || !audit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Failed to load GEO data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GEO Dashboard</h1>
          <p className="text-gray-600">Generative Engine Optimization Monitoring Panel</p>
          <Link
            href="/admin"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm"
          >
            ← Back to Admin
          </Link>
        </div>

        {/* Overall Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 总分仪表盘 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Overall GEO Score</h2>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* 背景圆环 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  {/* 进度圆环 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={getScoreColor(score.overall)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${score.overall * 2.83} 283`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold" style={{ color: getScoreColor(score.overall) }}>
                      {Math.round(score.overall)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">out of 100</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <ScoreBar label="AI Citability" value={score.citability} weight={25} />
              <ScoreBar label="Brand Authority" value={score.brandAuthority} weight={20} />
              <ScoreBar label="Content Quality" value={score.contentQuality} weight={20} />
              <ScoreBar label="Technical SEO" value={score.technicalSEO} weight={15} />
              <ScoreBar label="Structured Data" value={score.structuredData} weight={10} />
              <ScoreBar label="Platform Optimization" value={score.platformOptimization} weight={10} />
            </div>
          </div>

          {/* 强项和弱项 */}
          <div className="space-y-6">
            {/* 强项 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Strengths
              </h3>
              <ul className="space-y-2">
                {audit.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 需要改进的地方 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {audit.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 建议行动 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended Actions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effort</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {audit.recommendations.map((rec, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{rec.action}</td>
                    <td className="px-6 py-4">
                      <ImpactBadge impact={rec.impact} />
                    </td>
                    <td className="px-6 py-4">
                      <EffortBadge effort={rec.effort} />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge impact={rec.impact} effort={rec.effort} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 快速链接 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickLinkCard
            title="llms.txt"
            description="AI crawler navigation file"
            href="/llms.txt"
            icon="📄"
          />
          <QuickLinkCard
            title="robots.txt"
            description="AI crawler management"
            href="/robots.txt"
            icon="🤖"
          />
          <QuickLinkCard
            title="GEO Score API"
            description="Programmatic access to GEO scores"
            href="/api/geo/score?action=audit"
            icon="📊"
          />
        </div>
      </div>
    </div>
  );
}

// 子组件：分数条
function ScoreBar({ label, value, weight }: { label: string; value: number; weight: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span>{Math.round(value)} / 100 (×{weight}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all`}
          style={{
            width: `${value}%`,
            backgroundColor: getScoreColor(value),
          }}
        ></div>
      </div>
    </div>
  );
}

// 辅助函数：根据分数返回颜色
function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#f59e0b'; // yellow
  if (score >= 40) return '#f97316'; // orange
  return '#ef4444'; // red
}

// 徽章组件
function ImpactBadge({ impact }: { impact: 'High' | 'Medium' | 'Low' }) {
  const colors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${colors[impact]}`}>
      {impact}
    </span>
  );
}

function EffortBadge({ effort }: { effort: 'Easy' | 'Medium' | 'Hard' }) {
  const colors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${colors[effort]}`}>
      {effort}
    </span>
  );
}

function PriorityBadge({ impact, effort }: { impact: 'High' | 'Medium' | 'Low'; effort: 'Easy' | 'Medium' | 'Hard' }) {
  let priority: 'P0' | 'P1' | 'P2' = 'P2';
  
  if (impact === 'High' && effort === 'Easy') priority = 'P0';
  else if (impact === 'High' || effort === 'Easy') priority = 'P1';
  
  const colors = {
    P0: 'bg-red-600 text-white',
    P1: 'bg-orange-500 text-white',
    P2: 'bg-gray-400 text-white',
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${colors[priority]} font-bold`}>
      {priority}
    </span>
  );
}

// 快速链接卡片
function QuickLinkCard({ title, description, href, icon }: { title: string; description: string; href: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center mb-3">
        <span className="text-3xl mr-3">{icon}</span>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
}
