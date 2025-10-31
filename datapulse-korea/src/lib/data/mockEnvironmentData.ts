/**
 * 목업 데이터 - API 연동 전 UI 테스트용
 * 실제 API 연동 시 이 파일은 제거하고 API 호출로 대체
 */

import type {
  AirQualityData,
  WeatherWarning,
  DisasterMessage,
  CCTVData,
  LocationSafety,
  RouteSafety,
} from '@/types/environment'

// 서울 주요 측정소 목업 데이터
export const mockAirQualityData: AirQualityData[] = [
  {
    stationName: '강남구',
    addr: '서울 강남구 학동로 426',
    pm10Value: 45,
    pm10Grade: 2, // 보통
    pm25Value: 25,
    pm25Grade: 2, // 보통
    o3Value: 0.028,
    o3Grade: 1,
    no2Value: 0.032,
    coValue: 0.5,
    so2Value: 0.004,
    khaiValue: 75,
    khaiGrade: 2,
    dataTime: new Date().toISOString(),
    lat: 37.4979,
    lng: 127.0276,
  },
  {
    stationName: '송파구',
    addr: '서울 송파구 백제고분로 42길 5',
    pm10Value: 87,
    pm10Grade: 3, // 나쁨
    pm25Value: 52,
    pm25Grade: 3, // 나쁨
    o3Value: 0.045,
    o3Grade: 2,
    no2Value: 0.048,
    coValue: 0.7,
    so2Value: 0.006,
    khaiValue: 105,
    khaiGrade: 3,
    dataTime: new Date().toISOString(),
    lat: 37.5145,
    lng: 127.1059,
  },
  {
    stationName: '서초구',
    addr: '서울 서초구 남부순환로 2584',
    pm10Value: 32,
    pm10Grade: 1, // 좋음
    pm25Value: 18,
    pm25Grade: 1, // 좋음
    o3Value: 0.022,
    o3Grade: 1,
    no2Value: 0.025,
    coValue: 0.4,
    so2Value: 0.003,
    khaiValue: 55,
    khaiGrade: 1,
    dataTime: new Date().toISOString(),
    lat: 37.4837,
    lng: 127.0324,
  },
]

// 기상특보 목업 데이터
export const mockWeatherWarnings: WeatherWarning[] = [
  {
    id: 'w1',
    location: '서울특별시',
    warningType: '호우',
    level: '주의보',
    issueTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
    content: '시간당 30mm 이상의 강한 비가 예상됩니다. 하천 범람 및 침수에 주의하시기 바랍니다.',
  },
  // 정상 상태일 때는 빈 배열
]

// 긴급재난문자 목업 데이터
export const mockDisasterMessages: DisasterMessage[] = [
  {
    id: 'd1',
    msgType: '폭우',
    location: '서울 강남구',
    content: '[안전안내] 집중호우로 인한 침수 우려 지역입니다. 지하 주차장 및 저지대 접근을 자제해주시기 바랍니다.',
    createDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30분 전
    lat: 37.4979,
    lng: 127.0276,
  },
  // 정상 상태일 때는 빈 배열
]

// CCTV 목업 데이터 (강남구 일부)
export const mockCCTVData: CCTVData[] = [
  {
    id: 'cctv1',
    name: '강남역 사거리',
    address: '서울 강남구 강남대로 지하396',
    purpose: '교통/방범',
    managementOrg: '강남구청',
    cameraCount: 4,
    lat: 37.498095,
    lng: 127.027610,
  },
  {
    id: 'cctv2',
    name: '역삼역 1번출구',
    address: '서울 강남구 역삼동 825',
    purpose: '방범',
    managementOrg: '강남구청',
    cameraCount: 2,
    lat: 37.500224,
    lng: 127.036456,
  },
  {
    id: 'cctv3',
    name: '선릉역 사거리',
    address: '서울 강남구 선릉로 428',
    purpose: '교통/방범',
    managementOrg: '서울경찰청',
    cameraCount: 6,
    lat: 37.504741,
    lng: 127.049099,
  },
  {
    id: 'cctv4',
    name: '테헤란로 522',
    address: '서울 강남구 테헤란로 522',
    purpose: '방범',
    managementOrg: '강남구청',
    cameraCount: 2,
    lat: 37.505208,
    lng: 127.053299,
  },
  {
    id: 'cctv5',
    name: '삼성역 2번출구',
    address: '서울 강남구 영동대로 513',
    purpose: '교통/방범',
    managementOrg: '강남구청',
    cameraCount: 3,
    lat: 37.508583,
    lng: 127.063722,
  },
]

// 현재 위치 안전 정보 목업
export function getMockLocationSafety(lat: number, lng: number): LocationSafety {
  // 가장 가까운 측정소 찾기 (간단히 첫 번째 사용)
  const nearestStation = mockAirQualityData[0]

  return {
    location: {
      name: '강남구 역삼동',
      lat,
      lng,
    },
    airQuality: nearestStation,
    weatherWarnings: mockWeatherWarnings,
    recentDisasters: mockDisasterMessages,
    nearbyInfrastructure: {
      cctv: 34, // 반경 1km 내 CCTV 개수
      securityLights: 87, // 반경 1km 내 보안등 개수
    },
    safetyScore: {
      overall: 72,
      airQuality: 65, // 보통
      weather: 70, // 주의보 발령
      infrastructure: 85, // 인프라 양호
      disaster: 60, // 최근 재난문자 있음
      recommendation: '외출 시 우산 지참, 미세먼지는 보통 수준입니다.',
      level: '보통',
    },
    lastUpdated: new Date().toISOString(),
  }
}

// 경로 안전 정보 목업
export const mockRouteSafety: RouteSafety[] = [
  {
    routeId: 'route1',
    distance: 1200,
    duration: 15,
    cctvCount: 34,
    securityLightCount: 87,
    avgAirQuality: 2, // 보통
    weatherWarnings: [],
    safetyScore: 92,
    recommendation: 'recommended',
    path: [
      { lat: 37.498095, lng: 127.027610 },
      { lat: 37.500224, lng: 127.036456 },
      { lat: 37.504741, lng: 127.049099 },
    ],
  },
  {
    routeId: 'route2',
    distance: 800,
    duration: 10,
    cctvCount: 5,
    securityLightCount: 12,
    avgAirQuality: 2,
    weatherWarnings: [],
    safetyScore: 45,
    recommendation: 'caution',
    path: [
      { lat: 37.498095, lng: 127.027610 },
      { lat: 37.502, lng: 127.035 },
      { lat: 37.504741, lng: 127.049099 },
    ],
  },
  {
    routeId: 'route3',
    distance: 1500,
    duration: 18,
    cctvCount: 22,
    securityLightCount: 56,
    avgAirQuality: 2,
    weatherWarnings: [],
    safetyScore: 75,
    recommendation: 'normal',
    path: [
      { lat: 37.498095, lng: 127.027610 },
      { lat: 37.499, lng: 127.032 },
      { lat: 37.503, lng: 127.045 },
      { lat: 37.504741, lng: 127.049099 },
    ],
  },
]

// 대기질 등급별 정보
export function getAirQualityInfo(grade: 1 | 2 | 3 | 4) {
  const info = {
    1: { label: '좋음', color: 'text-blue-600', bgColor: 'bg-blue-50', emoji: '😊' },
    2: { label: '보통', color: 'text-green-600', bgColor: 'bg-green-50', emoji: '🙂' },
    3: { label: '나쁨', color: 'text-orange-600', bgColor: 'bg-orange-50', emoji: '😷' },
    4: { label: '매우나쁨', color: 'text-red-600', bgColor: 'bg-red-50', emoji: '😱' },
  }
  return info[grade]
}

// 안전 레벨별 정보
export function getSafetyLevelInfo(level: string) {
  const info = {
    매우안전: { color: 'text-blue-600', bgColor: 'bg-blue-50', icon: '✅' },
    안전: { color: 'text-green-600', bgColor: 'bg-green-50', icon: '👍' },
    보통: { color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: '⚠️' },
    주의: { color: 'text-orange-600', bgColor: 'bg-orange-50', icon: '⚠️' },
    위험: { color: 'text-red-600', bgColor: 'bg-red-50', icon: '🚨' },
  }
  return info[level as keyof typeof info] || info['보통']
}
