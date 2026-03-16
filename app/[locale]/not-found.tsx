import Link from 'next/link';
import { locales, defaultLocale } from '@/lib/i18n/config';

// 翻译内容
const translations: Record<string, {
  title: string;
  description: string;
  backHome: string;
  contactUs: string;
  popularLinks: string;
  products: string;
  about: string;
  contact: string;
}> = {
  en: {
    title: 'Page Not Found',
    description: 'Sorry, the page you are looking for does not exist. It might have been moved or deleted.',
    backHome: 'Back to Home',
    contactUs: 'Contact Us',
    popularLinks: 'Popular Links',
    products: 'Products',
    about: 'About Us',
    contact: 'Contact',
  },
  zh: {
    title: '页面未找到',
    description: '抱歉，您访问的页面不存在。可能已被移动或删除。',
    backHome: '返回首页',
    contactUs: '联系我们',
    popularLinks: '热门链接',
    products: '产品中心',
    about: '关于我们',
    contact: '联系方式',
  },
  id: {
    title: 'Halaman Tidak Ditemukan',
    description: 'Maaf, halaman yang Anda cari tidak ada. Mungkin telah dipindahkan atau dihapus.',
    backHome: 'Kembali ke Beranda',
    contactUs: 'Hubungi Kami',
    popularLinks: 'Tautan Populer',
    products: 'Produk',
    about: 'Tentang Kami',
    contact: 'Kontak',
  },
  th: {
    title: 'ไม่พบหน้า',
    description: 'ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา อาจถูกย้ายหรือลบออก',
    backHome: 'กลับสู่หน้าหลัก',
    contactUs: 'ติดต่อเรา',
    popularLinks: 'ลิงก์ยอดนิยม',
    products: 'สินค้า',
    about: 'เกี่ยวกับเรา',
    contact: 'ติดต่อ',
  },
  vi: {
    title: 'Không Tìm Thấy Trang',
    description: 'Xin lỗi, trang bạn đang tìm kiếm không tồn tại. Có thể đã bị di chuyển hoặc xóa.',
    backHome: 'Về Trang Chủ',
    contactUs: 'Liên Hệ',
    popularLinks: 'Liên Kết Phổ Biến',
    products: 'Sản Phẩm',
    about: 'Về Chúng Tôi',
    contact: 'Liên Hệ',
  },
  ar: {
    title: 'الصفحة غير موجودة',
    description: 'عذراً، الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها.',
    backHome: 'العودة للرئيسية',
    contactUs: 'اتصل بنا',
    popularLinks: 'روابط شائعة',
    products: 'المنتجات',
    about: 'من نحن',
    contact: 'اتصل',
  },
};

export default async function NotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: paramLocale } = await params;
  const locale = locales.includes(paramLocale as any) ? paramLocale : defaultLocale;
  const t = translations[locale] || translations.en;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* 404 图标 */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-100 select-none">404</div>
          <div className="relative -mt-16">
            <svg
              className="w-32 h-32 mx-auto text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* 错误信息 */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          {t.description}
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t.backHome}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t.contactUs}
          </Link>
        </div>

        {/* 热门链接 */}
        <div className="border-t pt-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            {t.popularLinks}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/products`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {t.products}
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href={`/${locale}/about`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {t.about}
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href={`/${locale}/contact`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {t.contact}
            </Link>
          </div>
        </div>

        {/* SEO 优化：添加结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: t.title,
              description: t.description,
              url: `https://ledcoreco.com/${locale}/404`,
              isPartOf: {
                '@type': 'WebSite',
                name: 'GOPRO LED',
                url: 'https://ledcoreco.com',
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
