import type { Metadata } from 'next'
import './globals.css'

// 빌드 버전: 2024-10-30 - 환경변수 적용 확인
export const metadata: Metadata = {
  title: 'DataPulse Korea - 대한민국 공공데이터 시각화 플랫폼',
  description: '복잡한 공공데이터를 누구나 쉽게 이해하고 활용할 수 있는 인터랙티브 플랫폼',
  keywords: ['공공데이터', '시각화', '부동산', '안전', '환경', '정치', '투명성'],
  authors: [{ name: 'DataPulse Team' }],
  openGraph: {
    title: 'DataPulse Korea',
    description: '대한민국의 모든 공공데이터, 한눈에',
    url: 'https://datapulse.dev',
    siteName: 'DataPulse Korea',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DataPulse Korea',
    description: '대한민국 공공데이터 시각화 플랫폼',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
