/**
 * 안전 데이터 타입 정의
 */

// 범죄 유형별 발생 건수
export interface CrimeStats {
  murder: number // 살인 (살인기수 + 살인미수등)
  robbery: number // 강도
  sexualAssault: number // 성폭력 (강간 + 유사강간)
  theft: number // 절도
  violence: number // 폭력
}

// 지역별 안전 통계
export interface SafetyStats {
  regionCode: string // 지역코드
  regionName: string // 지역명
  lat: number // 위도
  lng: number // 경도

  // 범죄 통계
  crimes: CrimeStats
  totalCrimes: number // 총 범죄 발생 건수

  // 점수 (0-100, 높을수록 안전)
  safetyScore: number // 종합 안전 점수
  murderScore: number // 살인 안전도
  robberyScore: number // 강도 안전도
  sexualAssaultScore: number // 성폭력 안전도
  theftScore: number // 절도 안전도
  violenceScore: number // 폭력 안전도

  // 비교
  nationalRank?: number // 전국 순위 (낮을수록 안전)
  trend: 'safer' | 'similar' | 'dangerous' // 안전 추세
  comparisonToNational: number // 전국 평균 대비 (%) - 음수면 더 안전

  // 세부 정보
  populationPer10k?: number // 인구 만 명당 범죄 발생 건수
  lastUpdated: string // 마지막 업데이트
}

// API 응답 타입
export interface SafetyApiResponse {
  success: boolean
  data?: SafetyStats
  error?: string
}

// 공공데이터 API 원본 응답
export interface CrimeDataApiResponse {
  page: number
  perPage: number
  totalCount: number
  currentCount: number
  matchCount: number
  data: CrimeDataItem[]
}

export interface CrimeDataItem {
  범죄대분류: string
  범죄중분류: string
  [key: string]: string | number // 각 지역별 발생 건수
}
