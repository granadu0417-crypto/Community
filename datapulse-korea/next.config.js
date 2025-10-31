/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 지원을 위한 설정
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Trailing slash 추가 (Cloudflare Pages 권장)
  trailingSlash: true,
  // 환경변수
  env: {
    NEXT_PUBLIC_KAKAO_MAP_KEY: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY,
    NEXT_PUBLIC_REALESTATE_API_MODE: process.env.NEXT_PUBLIC_REALESTATE_API_MODE,
    NEXT_PUBLIC_REALESTATE_API_KEY: process.env.NEXT_PUBLIC_REALESTATE_API_KEY,
    NEXT_PUBLIC_DATA_API_KEY: process.env.DATA_API_KEY, // 테스트용 - 공공데이터 API 키
  },
  // 정적 최적화
  reactStrictMode: true,
  // SWC 최적화
  swcMinify: true,
}

module.exports = nextConfig
