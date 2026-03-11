import { Metadata } from 'next';
import Link from 'next/link';
import { Locale, locales } from '@/lib/i18n/config';

// 加载翻译文件
function getMessages(locale: string) {
  const messagesMap: Record<string, any> = {
    en: require('@/messages/en.json'),
    zh: require('@/messages/zh.json'),
    id: require('@/messages/id.json'),
    th: require('@/messages/th.json'),
    vi: require('@/messages/vi.json'),
    ar: require('@/messages/ar.json'),
  };
  return messagesMap[locale] || messagesMap.en;
}

// 静态产品列表（用于询盘表单多选）
const productOptions = [
  { id: 'chip-led', name: { en: 'CHIP LED', zh: 'CHIP LED' } },
  { id: 'plcc-led', name: { en: 'PLCC LED', zh: 'PLCC LED' } },
  { id: 'ir-sensors', name: { en: 'IR Sensors', zh: '红外传感器' } },
  { id: 'uv-led', name: { en: 'UV LED', zh: 'UV LED' } },
];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale);
  
  return {
    title: `${messages.navigation.contact} | GOPRO LED`,
    description: messages.metadata.description,
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const isRTL = locale === 'ar';

  const getLocalizedHref = (path: string) => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };

  // 地址根据语言切换
  const addressValue = locale === 'zh' 
    ? '厦门火炬高新区（翔安）产业区民安大道1800-1812号' 
    : 'No.1800-1812 Min\'an Avenue, Xiang\'an Torch High-tech Zone, Xiamen, China';
  const emailValue = 'sales@ledcoreco.com';

  // 从翻译文件获取标签文本
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // 表单标签
  const labels = {
    companyName: t('contact.companyName'),
    contactName: t('contact.contactName'),
    email: t('contact.email'),
    phone: t('contact.phone'),
    country: t('contact.country'),
    products: t('contact.products'),
    quantity: t('contact.quantity'),
    message: t('contact.message'),
    submit: t('contact.submit'),
    contactInfo: t('contact.contactInfo'),
    address: t('contact.address'),
    addressValue: addressValue,
    emailValue: emailValue,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <form className="space-y-6">
                {/* Company & Contact Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.companyName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={labels.companyName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.contactName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={labels.contactName}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.email} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('contact.placeholder.email')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {labels.phone} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('contact.placeholder.phone')}
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.country} <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('contact.selectCountry')}</option>
                    <option value="malaysia">Malaysia</option>
                    <option value="indonesia">Indonesia</option>
                    <option value="thailand">Thailand</option>
                    <option value="vietnam">Vietnam</option>
                    <option value="singapore">Singapore</option>
                    <option value="philippines">Philippines</option>
                    <option value="uae">UAE</option>
                    <option value="saudi-arabia">Saudi Arabia</option>
                    <option value="other">{locale === 'zh' ? '其他' : 'Other'}</option>
                  </select>
                </div>

                {/* Products of Interest */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {labels.products}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {productOptions.map((product) => (
                      <label key={product.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={product.id}
                          className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{product.name[locale as keyof typeof product.name] || product.name.en}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.quantity}
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">{t('contact.selectQuantity')}</option>
                    <option value="1k-10k">{t('contact.quantityOptions.1k-10k')}</option>
                    <option value="10k-50k">{t('contact.quantityOptions.10k-50k')}</option>
                    <option value="50k-100k">{t('contact.quantityOptions.50k-100k')}</option>
                    <option value="100k+">{t('contact.quantityOptions.100k+')}</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.message}
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={t('contact.placeholder.message')}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors"
                >
                  {labels.submit}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{labels.contactInfo}</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">{labels.address}</p>
                    <p className="text-sm text-gray-600 mt-1">{labels.addressValue}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-900 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">{labels.email}</p>
                    <p className="text-sm text-gray-600 mt-1">{labels.emailValue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t('footer.quickLinks')}
              </h3>
              <nav className="space-y-2">
                <Link href={getLocalizedHref('/products')} className="block text-blue-900 hover:underline">
                  → {messages.navigation.products}
                </Link>
                <Link href={getLocalizedHref('/about')} className="block text-blue-900 hover:underline">
                  → {messages.navigation.about}
                </Link>
                <Link href={getLocalizedHref('/support')} className="block text-blue-900 hover:underline">
                  → {messages.navigation.support}
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
