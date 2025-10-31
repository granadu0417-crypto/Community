/**
 * 실시간 환경 안전 관련 타입 정의
 */

// 대기질 등급
export type AirQualityGrade = 1 | 2 | 3 | 4 // 1:좋음 2:보통 3:나쁨 4:매우나쁨

// 미세먼지 데이터 (에어코리아 API)
export interface AirQualityData {
  stationName: string // 측정소명
  addr: string // 측정소 주소
  pm10Value: number // 미세먼지 농도
  pm10Grade: AirQualityGrade // 미세먼지 등급
  pm25Value: number // 초미세먼지 농도
  pm25Grade: AirQualityGrade // 초미세먼지 등급
  o3Value: number // 오존 농도
  o3Grade: AirQualityGrade // 오존 등급
  no2Value: number // 이산화질소 농도
  coValue: number // 일산화탄소 농도
  so2Value: number // 아황산가스 농도
  khaiValue: number // 통합대기환경지수
  khaiGrade: AirQualityGrade // 통합대기환경등급
  dataTime: string // 측정일시
  lat?: number // 위도
  lng?: number // 경도
}

// 기상특보 유형
export type WeatherWarningType =
  | '강풍'
  | '호우'
  | '대설'
  | '건조'
  | '폭풍해일'
  | '풍랑'
  | '태풍'
  | '황사'
  | '폭염'
  | '한파'

// 기상특보 단계
export type WeatherWarningLevel = '주의보' | '경보'

// 기상특보 데이터 (기상청 API)
export interface WeatherWarning {
  id: string
  location: string // 발표 지역
  warningType: WeatherWarningType // 특보 유형
  level: WeatherWarningLevel // 특보 단계
  issueTime: string // 발표 시각
  content: string // 특보 내용
}

// 긴급재난문자 데이터
export interface DisasterMessage {
  id: string
  msgType: string // 재난 유형
  location: string // 발생 지역
  content: string // 메시지 내용
  createDate: string // 생성일시
  lat?: number
  lng?: number
}

// CCTV 데이터
export interface CCTVData {
  id: string
  name: string // CCTV명
  address: string // 설치 주소
  purpose: string // 설치 목적 (방범, 교통 등)
  managementOrg: string // 관리 기관
  cameraCount: number // 카메라 대수
  lat: number
  lng: number
}

// 보안등 데이터
export interface SecurityLightData {
  id: string
  address: string
  lat: number
  lng: number
}

// 종합 안전 점수
export interface SafetyScore {
  overall: number // 종합 점수 (0-100)
  airQuality: number // 대기질 점수
  weather: number // 기상 점수
  infrastructure: number // 안전 인프라 점수
  disaster: number // 재난 점수
  recommendation: string // 추천 메시지
  level: '매우안전' | '안전' | '보통' | '주의' | '위험'
}

// 현재 위치 안전 정보
export interface LocationSafety {
  location: {
    name: string
    lat: number
    lng: number
  }
  airQuality: AirQualityData | null
  weatherWarnings: WeatherWarning[]
  recentDisasters: DisasterMessage[]
  nearbyInfrastructure: {
    cctv: number // 반경 1km CCTV 개수
    securityLights: number // 반경 1km 보안등 개수
  }
  safetyScore: SafetyScore
  lastUpdated: string
}

// 경로 안전 정보
export interface RouteSafety {
  routeId: string
  distance: number // 거리 (m)
  duration: number // 소요시간 (분)
  cctvCount: number // 경로상 CCTV 개수
  securityLightCount: number // 경로상 보안등 개수
  avgAirQuality: AirQualityGrade // 평균 대기질
  weatherWarnings: WeatherWarning[] // 경로 통과 지역 특보
  safetyScore: number // 안전도 점수 (0-100)
  recommendation: 'recommended' | 'normal' | 'caution' // 추천도
  path: Array<{ lat: number; lng: number }> // 경로 좌표
}

// API 응답 타입
export interface EnvironmentApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
