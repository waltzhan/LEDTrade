import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GOPRO LED - Professional LED Manufacturer',
  description: 'Leading manufacturer of IR LEDs, Visible Light LEDs, and UV LEDs.',
  openGraph: {
    title: 'GOPRO LED - Professional LED Manufacturer',
    description: 'Leading manufacturer of IR LEDs, Visible Light LEDs, and UV LEDs.',
    url: 'https://ledcoreco.com',
    siteName: 'GOPRO LED',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GOPRO LED - Professional LED Manufacturer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GOPRO LED - Professional LED Manufacturer',
    description: 'Leading manufacturer of IR LEDs, Visible Light LEDs, and UV LEDs.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
