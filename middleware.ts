import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n/config';

// 浏览器语言到网站语言的映射（全部小写）
const browserLocaleMap: Record<string, string> = {
  'zh': 'zh',
  'zh-cn': 'zh',
  'zh-tw': 'zh',
  'zh-hk': 'zh',
  'id': 'id',
  'ms': 'id',
  'th': 'th',
  'vi': 'vi',
  'ar': 'ar',
  'en': 'en',
  'en-us': 'en',
  'en-gb': 'en',
};

function getBrowserLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const parts = lang.trim().split(';');
      const code = parts[0].trim().toLowerCase();
      const q = parts[1] ? parseFloat(parts[1].replace('q=', '')) : 1.0;
      return { code, priority: isNaN(q) ? 1.0 : q };
    })
    .sort((a, b) => b.priority - a.priority);

  for (const { code } of languages) {
    if (browserLocaleMap[code]) return browserLocaleMap[code];
    const prefix = code.split('-')[0];
    if (browserLocaleMap[prefix]) return browserLocaleMap[prefix];
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过静态资源和 API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 检查路径是否已包含语言前缀
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 已有语言前缀，直接放行
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 根路径 / 或其他无语言前缀路径，检测语言重定向
  const browserLocale = getBrowserLocale(request);
  const newUrl = new URL(`/${browserLocale}${pathname === '/' ? '' : pathname}`, request.url);

  // 使用 302 临时重定向，并禁用缓存
  const response = NextResponse.redirect(newUrl, 302);
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}

export const config = {
  matcher: [
    // 匹配根路径
    '/',
    // 匹配所有非语言前缀、非静态资源路径
    '/((?!_next/|api/|static/|favicon\.ico|robots\.txt|sitemap\.xml|.*\.).*)',
  ],
};
