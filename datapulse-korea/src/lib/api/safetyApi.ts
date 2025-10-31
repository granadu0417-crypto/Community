/**
 * 안전 API 유틸리티
 *
 * 경찰청 범죄 발생 지역별 통계 API 연동
 */

import {
  SafetyStats,
  SafetyApiResponse,
  CrimeStats,
  CrimeDataApiResponse,
  CrimeDataItem,
} from '@/types/safety'

// API 설정
const SAFETY_API_KEY =
  process.env.NEXT_PUBLIC_SAFETY_API_KEY ||
  'bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ=='
const SAFETY_API_URL =
  'https://api.odcloud.kr/api/3074462/v1/uddi:161740bd-8ec5-4734-9a3d-f7a2cde34942'

// 서울시 구별 한글명 매핑 (부동산과 동일)
const REGION_NAME_MAP: Record<string, string> = {
  종로구: '서울종로구',
  중구: '서울중구',
  용산구: '서울용산구',
  성동구: '서울성동구',
  광진구: '서울광진구',
  동대문구: '서울동대문구',
  중랑구: '서울중랑구',
  성북구: '서울성북구',
  강북구: '서울강북구',
  도봉구: '서울도봉구',
  노원구: '서울노원구',
  은평구: '서울은평구',
  서대문구: '서울서대문구',
  마포구: '서울마포구',
  양천구: '서울양천구',
  강서구: '서울강서구',
  구로구: '서울구로구',
  금천구: '서울금천구',
  영등포구: '서울영등포구',
  동작구: '서울동작구',
  관악구: '서울관악구',
  서초구: '서울서초구',
  강남구: '서울강남구',
  송파구: '서울송파구',
  강동구: '서울강동구',
}

// 지역별 좌표 (부동산과 동일)
const REGION_COORDS: Record<string, { lat: number; lng: number }> = {
  종로구: { lat: 37.5735, lng: 126.979 },
  중구: { lat: 37.5641, lng: 126.9979 },
  용산구: { lat: 37.5384, lng: 126.9654 },
  성동구: { lat: 37.5633, lng: 127.0365 },
  광진구: { lat: 37.5384, lng: 127.0822 },
  동대문구: { lat: 37.5744, lng: 127.0395 },
  중랑구: { lat: 37.6063, lng: 127.0925 },
  성북구: { lat: 37.5894, lng: 127.0167 },
  강북구: { lat: 37.6396, lng: 127.0253 },
  도봉구: { lat: 37.6688, lng: 127.0471 },
  노원구: { lat: 37.6542, lng: 127.0568 },
  은평구: { lat: 37.6027, lng: 126.9291 },
  서대문구: { lat: 37.5791, lng: 126.9368 },
  마포구: { lat: 37.5663, lng: 126.9019 },
  양천구: { lat: 37.5168, lng: 126.8664 },
  강서구: { lat: 37.5509, lng: 126.8495 },
  구로구: { lat: 37.4954, lng: 126.8874 },
  금천구: { lat: 37.4519, lng: 126.9023 },
  영등포구: { lat: 37.5264, lng: 126.8963 },
  동작구: { lat: 37.5124, lng: 126.9393 },
  관악구: { lat: 37.4784, lng: 126.9516 },
  서초구: { lat: 37.4837, lng: 127.0324 },
  강남구: { lat: 37.4979, lng: 127.0276 },
  송파구: { lat: 37.5145, lng: 127.1059 },
  강동구: { lat: 37.5301, lng: 127.1238 },
}

/**
 * 지역명으로 안전 데이터 조회
 */
export async function getSafetyByRegion(regionName: string): Promise<SafetyApiResponse> {
  try {
    // API 호출
    const apiRegionName = REGION_NAME_MAP[regionName]
    if (!apiRegionName) {
      return {
        success: false,
        error: `지원하지 않는 지역입니다: ${regionName}`,
      }
    }

    // 전체 범죄 데이터 조회
    const crimeData = await fetchCrimeData()
    if (!crimeData) {
      return {
        success: false,
        error: '범죄 통계 데이터를 불러올 수 없습니다.',
      }
    }

    // 지역별 통계 계산
    const stats = calculateSafetyStats(regionName, apiRegionName, crimeData)

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('안전 데이터 조회 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '데이터 조회 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 범죄 데이터 API 호출
 */
async function fetchCrimeData(): Promise<CrimeDataItem[] | null> {
  try {
    const url = new URL(SAFETY_API_URL)
    url.searchParams.set('serviceKey', SAFETY_API_KEY)
    url.searchParams.set('page', '1')
    url.searchParams.set('perPage', '100') // 전체 데이터 가져오기

    console.log('🔍 범죄 데이터 API 호출:', url.toString())

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`)
    }

    const result: CrimeDataApiResponse = await response.json()
    console.log(`✅ 범죄 데이터 조회 성공: ${result.totalCount}개 항목`)

    return result.data
  } catch (error) {
    console.error('범죄 데이터 조회 실패:', error)
    return null
  }
}

/**
 * 지역별 안전 통계 계산
 */
function calculateSafetyStats(
  regionName: string,
  apiRegionName: string,
  crimeData: CrimeDataItem[]
): SafetyStats {
  // 범죄 유형별 집계
  const crimes: CrimeStats = {
    murder: 0,
    robbery: 0,
    sexualAssault: 0,
    theft: 0,
    violence: 0,
  }

  // 강력범죄만 필터링
  const violentCrimes = crimeData.filter((item) => item.범죄대분류 === '강력범죄')

  for (const crime of violentCrimes) {
    const count = (crime[apiRegionName] as number) || 0
    const category = crime.범죄중분류

    // 범죄 유형별 분류
    if (category === '살인기수' || category === '살인미수등') {
      crimes.murder += count
    } else if (category === '강도') {
      crimes.robbery += count
    } else if (category === '강간' || category === '유사강간') {
      crimes.sexualAssault += count
    } else if (category.includes('절도')) {
      crimes.theft += count
    } else if (category.includes('폭력')) {
      crimes.violence += count
    }
  }

  const totalCrimes = Object.values(crimes).reduce((sum, count) => sum + count, 0)

  // 안전 점수 계산 (0-100, 높을수록 안전)
  const safetyScore = calculateSafetyScore(crimes, totalCrimes)
  const murderScore = calculateCrimeScore(crimes.murder, 'murder')
  const robberyScore = calculateCrimeScore(crimes.robbery, 'robbery')
  const sexualAssaultScore = calculateCrimeScore(crimes.sexualAssault, 'sexualAssault')
  const theftScore = calculateCrimeScore(crimes.theft, 'theft')
  const violenceScore = calculateCrimeScore(crimes.violence, 'violence')

  // 전국 평균 대비 (음수면 더 안전)
  const nationalAvg = 200 // 임시 전국 평균
  const comparisonToNational = ((totalCrimes - nationalAvg) / nationalAvg) * 100

  // 추세 판단
  let trend: 'safer' | 'similar' | 'dangerous' = 'similar'
  if (comparisonToNational < -20) trend = 'safer'
  else if (comparisonToNational > 20) trend = 'dangerous'

  // 좌표
  const coords = REGION_COORDS[regionName] || { lat: 37.5665, lng: 126.978 }

  return {
    regionCode: regionName,
    regionName: `서울특별시 ${regionName}`,
    lat: coords.lat,
    lng: coords.lng,
    crimes,
    totalCrimes,
    safetyScore,
    murderScore,
    robberyScore,
    sexualAssaultScore,
    theftScore,
    violenceScore,
    trend,
    comparisonToNational: Math.round(comparisonToNational),
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * 종합 안전 점수 계산
 */
function calculateSafetyScore(crimes: CrimeStats, totalCrimes: number): number {
  // 범죄가 적을수록 높은 점수
  // 가중치: 살인 > 강도 > 성폭력 > 폭력 > 절도
  const weightedScore =
    crimes.murder * 10 +
    crimes.robbery * 5 +
    crimes.sexualAssault * 4 +
    crimes.violence * 2 +
    crimes.theft * 1

  // 정규화 (0-100)
  const maxScore = 500 // 가정: 최악의 경우
  const score = Math.max(0, 100 - (weightedScore / maxScore) * 100)

  return Math.round(score)
}

/**
 * 범죄 유형별 안전 점수
 */
function calculateCrimeScore(count: number, type: keyof CrimeStats): number {
  // 범죄 유형별 기준값
  const thresholds: Record<keyof CrimeStats, number> = {
    murder: 5, // 살인 5건 이상이면 위험
    robbery: 10,
    sexualAssault: 30,
    theft: 100,
    violence: 200,
  }

  const threshold = thresholds[type]
  const score = Math.max(0, 100 - (count / threshold) * 100)

  return Math.round(score)
}

/**
 * 유틸리티 함수
 */
export function getSafetyLevel(score: number): string {
  if (score >= 80) return '매우 안전'
  if (score >= 60) return '안전'
  if (score >= 40) return '보통'
  if (score >= 20) return '주의'
  return '위험'
}

export function getSafetyColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-blue-600'
  if (score >= 40) return 'text-yellow-600'
  if (score >= 20) return 'text-orange-600'
  return 'text-red-600'
}
