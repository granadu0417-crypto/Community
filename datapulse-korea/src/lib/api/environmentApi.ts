/**
 * 실시간 환경 안전 API 호출 함수들
 * 목업 데이터를 이 파일의 함수로 교체하면 됩니다
 */

import type { AirQualityData, WeatherWarning, DisasterMessage, CCTVData } from '@/types/environment'

// API 키 가져오기
const AIR_KOREA_KEY = process.env.NEXT_PUBLIC_AIR_KOREA_API_KEY
const KMA_KEY = process.env.NEXT_PUBLIC_KMA_API_KEY
const DISASTER_KEY = process.env.NEXT_PUBLIC_DISASTER_API_KEY

/**
 * 에어코리아 - 측정소별 실시간 대기질 조회
 */
export async function fetchAirQuality(stationName: string): Promise<AirQualityData | null> {
  try {
    if (!AIR_KOREA_KEY) {
      console.error('에어코리아 API 키가 설정되지 않았습니다')
      return null
    }

    const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty'
    const params = new URLSearchParams({
      serviceKey: AIR_KOREA_KEY,
      returnType: 'json',
      numOfRows: '1',
      pageNo: '1',
      stationName: stationName,
      dataTerm: 'DAILY',
      ver: '1.0',
    })

    const response = await fetch(`${url}?${params}`, {
      next: { revalidate: 3600 }, // 1시간 캐시
    })

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`)
    }

    const data = await response.json()

    if (data.response?.body?.items?.[0]) {
      const item = data.response.body.items[0]

      return {
        stationName: item.stationName,
        addr: item.mangName || '',
        pm10Value: Number(item.pm10Value) || 0,
        pm10Grade: Number(item.pm10Grade) as 1 | 2 | 3 | 4,
        pm25Value: Number(item.pm25Value) || 0,
        pm25Grade: Number(item.pm25Grade) as 1 | 2 | 3 | 4,
        o3Value: Number(item.o3Value) || 0,
        o3Grade: Number(item.o3Grade) as 1 | 2 | 3 | 4,
        no2Value: Number(item.no2Value) || 0,
        coValue: Number(item.coValue) || 0,
        so2Value: Number(item.so2Value) || 0,
        khaiValue: Number(item.khaiValue) || 0,
        khaiGrade: Number(item.khaiGrade) as 1 | 2 | 3 | 4,
        dataTime: item.dataTime,
      }
    }

    return null
  } catch (error) {
    console.error('대기질 조회 실패:', error)
    return null
  }
}

/**
 * 에어코리아 - 측정소 목록 조회
 */
export async function fetchStationList(addr: string): Promise<any[]> {
  try {
    if (!AIR_KOREA_KEY) return []

    const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnList'
    const params = new URLSearchParams({
      serviceKey: AIR_KOREA_KEY,
      returnType: 'json',
      numOfRows: '100',
      pageNo: '1',
      addr: addr,
    })

    const response = await fetch(`${url}?${params}`, {
      next: { revalidate: 86400 }, // 1일 캐시
    })

    if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`)

    const data = await response.json()
    return data.response?.body?.items || []
  } catch (error) {
    console.error('측정소 목록 조회 실패:', error)
    return []
  }
}

/**
 * 기상청 - 기상특보 조회
 */
export async function fetchWeatherWarnings(): Promise<WeatherWarning[]> {
  try {
    if (!KMA_KEY) {
      console.warn('기상청 API 키가 설정되지 않았습니다')
      return []
    }

    // 기상청 API 엔드포인트 (실제 URL은 발급 후 확인 필요)
    const url = 'http://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList'
    const params = new URLSearchParams({
      serviceKey: KMA_KEY,
      numOfRows: '10',
      pageNo: '1',
      dataType: 'JSON',
      stnId: '108', // 서울
    })

    const response = await fetch(`${url}?${params}`, {
      next: { revalidate: 600 }, // 10분 캐시
    })

    if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`)

    const data = await response.json()

    // 응답 구조는 실제 API 응답에 따라 수정 필요
    const items = data.response?.body?.items?.item || []

    return items.map((item: any, index: number) => ({
      id: `w${index}`,
      location: item.areaName || '서울',
      warningType: item.title || '특보',
      level: item.level === '경보' ? '경보' : '주의보',
      issueTime: item.tmFc || new Date().toISOString(),
      content: item.other || '',
    }))
  } catch (error) {
    console.error('기상특보 조회 실패:', error)
    return []
  }
}

/**
 * 긴급재난문자 조회
 */
export async function fetchDisasterMessages(): Promise<DisasterMessage[]> {
  try {
    if (!DISASTER_KEY) {
      console.warn('긴급재난문자 API 키가 설정되지 않았습니다')
      return []
    }

    // 재난문자 API 엔드포인트 (실제 URL은 발급 후 확인 필요)
    const url = 'http://apis.data.go.kr/...'
    const params = new URLSearchParams({
      serviceKey: DISASTER_KEY,
      numOfRows: '10',
      pageNo: '1',
      type: 'json',
    })

    const response = await fetch(`${url}?${params}`, {
      next: { revalidate: 300 }, // 5분 캐시
    })

    if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`)

    const data = await response.json()

    // 응답 구조는 실제 API 응답에 따라 수정 필요
    const items = data.data || []

    return items.map((item: any) => ({
      id: item.id || `d${Date.now()}`,
      msgType: item.dsstr_se_nm || '재난',
      location: item.rcptn_rgn_nm || '',
      content: item.msg_cn || '',
      createDate: item.creat_dt || new Date().toISOString(),
    }))
  } catch (error) {
    console.error('긴급재난문자 조회 실패:', error)
    return []
  }
}

/**
 * CORS 우회를 위한 서버사이드 API Route 사용 예시
 * 만약 CORS 에러가 발생하면 Next.js API Routes를 만들어야 합니다
 *
 * 파일: /src/app/api/air-quality/route.ts
 *
 * export async function GET(request: Request) {
 *   const { searchParams } = new URL(request.url)
 *   const stationName = searchParams.get('stationName')
 *
 *   const data = await fetchAirQuality(stationName)
 *   return Response.json(data)
 * }
 */

/**
 * 여러 측정소의 대기질을 한번에 조회
 */
export async function fetchMultipleStationsAirQuality(
  stationNames: string[]
): Promise<AirQualityData[]> {
  try {
    const promises = stationNames.map((name) => fetchAirQuality(name))
    const results = await Promise.all(promises)
    return results.filter((data): data is AirQualityData => data !== null)
  } catch (error) {
    console.error('여러 측정소 조회 실패:', error)
    return []
  }
}

/**
 * 서울 주요 측정소 목록
 */
export const SEOUL_STATIONS = [
  '강남구',
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '마포구',
  '서대문구',
  '서초구',
  '성동구',
  '성북구',
  '송파구',
  '양천구',
  '영등포구',
  '용산구',
  '은평구',
  '종로구',
  '중구',
  '중랑구',
]
