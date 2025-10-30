/**
 * 부동산 데이터 타입 정의
 */

// 아파트 매매 실거래 개별 거래 정보
export interface ApartmentTransaction {
  aptNm: string // 아파트명
  dealAmount: string // 거래금액 (만원)
  buildYear: string // 건축년도
  dealYear: string // 거래년도
  dealMonth: string // 거래월
  dealDay: string // 거래일
  excluUseAr: string // 전용면적 (㎡)
  floor: string // 층
  jibun: string // 지번
  roadNm?: string // 도로명
  umdNm: string // 법정동
  aptSeq?: string // 아파트일련번호
}

// 지역별 부동산 통계 정보
export interface RegionRealEstateStats {
  regionCode: string // 지역코드 (법정동코드)
  regionName: string // 지역명
  lat: number // 위도
  lng: number // 경도

  // 가격 정보
  avgPrice: number // 평균 거래가 (만원)
  medianPrice: number // 중앙값 (만원)
  minPrice: number // 최저가 (만원)
  maxPrice: number // 최고가 (만원)

  // 면적당 가격 (평당)
  avgPricePerPyeong: number // 평당 평균가 (만원)

  // 거래량
  transactionCount: number // 최근 3개월 거래 건수

  // 추이
  priceChangePercent: number // 전월 대비 변동률 (%)
  trend: 'up' | 'down' | 'stable' // 추세

  // 점수
  priceScore: number // 가격 점수 (0-100, 낮을수록 좋음)
  liquidityScore: number // 유동성 점수 (거래량 기반, 0-100)
  overallScore: number // 종합 점수 (0-100)

  // 랭킹
  nationalRank?: number // 전국 순위

  // 최근 거래 내역
  recentTransactions: ApartmentTransaction[]

  // 업데이트 정보
  lastUpdated: string // 마지막 업데이트 시간
}

// API 응답 타입
export interface RealEstateApiResponse {
  success: boolean
  data?: RegionRealEstateStats
  error?: string
}

// 부동산 점수 계산 옵션
export interface ScoreCalculationOptions {
  nationalAvgPrice: number // 전국 평균가
  maxPrice: number // 최고가 (정규화 기준)
  minPrice: number // 최저가 (정규화 기준)
}
