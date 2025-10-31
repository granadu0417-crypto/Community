// 범죄 데이터 API 구조 확인용 유틸리티

// safetyApi.ts와 동일한 API 사용 (경찰청 범죄 통계)
const API_KEY = process.env.NEXT_PUBLIC_DATA_API_KEY ||
  'bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ=='
const CRIME_DATA_API_URL = 'https://api.odcloud.kr/api/3074462/v1/uddi:161740bd-8ec5-4734-9a3d-f7a2cde34942'

export interface CrimeDataResponse {
  page: number
  perPage: number
  totalCount: number
  currentCount: number
  data: any[]
}

/**
 * 범죄 데이터 API 원본 조회 (구조 확인용)
 */
export async function fetchRawCrimeData(page: number = 1, perPage: number = 100): Promise<CrimeDataResponse | null> {
  try {
    const url = new URL(CRIME_DATA_API_URL)
    url.searchParams.set('serviceKey', API_KEY)
    url.searchParams.set('page', page.toString())
    url.searchParams.set('perPage', perPage.toString())

    console.log('🔍 범죄 데이터 API 호출:', url.toString().replace(API_KEY, 'KEY_HIDDEN'))

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('❌ API 응답 오류:', response.status, response.statusText)
      return null
    }

    const result: CrimeDataResponse = await response.json()

    console.log('✅ API 호출 성공')
    console.log('📊 총 데이터 개수:', result.totalCount)
    console.log('📊 현재 페이지 데이터 개수:', result.currentCount)

    if (result.data && result.data.length > 0) {
      console.log('📋 데이터 컬럼:', Object.keys(result.data[0]))
      console.log('📄 첫 번째 데이터 샘플:', result.data[0])

      // 연도 관련 필드 확인
      const firstItem = result.data[0]
      const yearFields = Object.keys(firstItem).filter((key) => {
        const lowerKey = key.toLowerCase()
        return (
          lowerKey.includes('년') ||
          lowerKey.includes('year') ||
          /20\d{2}/.test(key) || // 2020, 2021 등의 패턴
          lowerKey.includes('date')
        )
      })

      if (yearFields.length > 0) {
        console.log('📅 연도 관련 필드 발견:', yearFields)
      } else {
        console.log('⚠️ 연도 관련 필드를 찾을 수 없습니다')
      }
    }

    return result
  } catch (error) {
    console.error('❌ 범죄 데이터 조회 오류:', error)
    return null
  }
}

/**
 * 데이터 구조 분석
 */
export function analyzeCrimeDataStructure(data: any[]): {
  columns: string[]
  yearFields: string[]
  categoryFields: string[]
  regionFields: string[]
  sampleData: any
} {
  if (!data || data.length === 0) {
    return {
      columns: [],
      yearFields: [],
      categoryFields: [],
      regionFields: [],
      sampleData: null,
    }
  }

  const firstItem = data[0]
  const columns = Object.keys(firstItem)

  // 연도 관련 필드
  const yearFields = columns.filter((key) => {
    const lowerKey = key.toLowerCase()
    return (
      lowerKey.includes('년') ||
      lowerKey.includes('year') ||
      /20\d{2}/.test(key) ||
      lowerKey.includes('date')
    )
  })

  // 범죄 카테고리 필드
  const categoryFields = columns.filter((key) => {
    return key.includes('범죄') || key.includes('분류') || key.includes('category')
  })

  // 지역 필드
  const regionFields = columns.filter((key) => {
    return (
      key.includes('구') ||
      key.includes('시') ||
      key.includes('region') ||
      key.includes('서울')
    )
  })

  return {
    columns,
    yearFields,
    categoryFields,
    regionFields,
    sampleData: firstItem,
  }
}
