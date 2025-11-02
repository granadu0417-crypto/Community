/**
 * 실시간 환경 안전 API 호출 함수들
 * 목업 데이터를 이 파일의 함수로 교체하면 됩니다
 */

import type { AirQualityData, WeatherWarning, DisasterMessage, CCTVData } from '@/types/environment'
import { getStationLocation, SEOUL_STATIONS } from '@/lib/data/seoulStations'

// API 키 가져오기 (환경 변수가 없으면 fallback 값 사용)
const AIR_KOREA_KEY = process.env.NEXT_PUBLIC_AIR_KOREA_API_KEY || 'bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ=='
const KMA_KEY = process.env.NEXT_PUBLIC_KMA_API_KEY || 'bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ=='
const DISASTER_KEY = process.env.NEXT_PUBLIC_DISASTER_API_KEY || 'bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ=='

/**
 * 에어코리아 - 측정소별 실시간 대기질 조회
 */
export async function fetchAirQuality(stationName: string): Promise<AirQualityData | null> {
  try {
    if (!AIR_KOREA_KEY) {
      console.error('에어코리아 API 키가 설정되지 않았습니다')
      return null
    }

    const url = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty'
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

    const url = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnList'
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
 * 기상청 - 기상특보 조회 (실시간)
 *
 * 호우, 대설, 강풍, 풍랑, 태풍, 건조, 한파, 폭염 등 12개 기상현상에 대한
 * 실시간 특보 발표 정보 (주의보/경보)
 *
 * API: 기상청_기상특보 조회서비스
 * 최종 수정일: 2024-07-19
 * 신청: https://www.data.go.kr/data/15000415/openapi.do
 */
export async function fetchWeatherWarnings(
  areaCode?: string // 지역코드 (예: 11 = 서울)
): Promise<WeatherWarning[]> {
  try {
    if (!KMA_KEY) {
      console.warn('기상청 API 키가 설정되지 않았습니다')
      return []
    }

    // 기상특보목록조회 API
    const url = 'https://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList'
    const params = new URLSearchParams({
      serviceKey: KMA_KEY,
      numOfRows: '10',
      pageNo: '1',
      dataType: 'JSON',
    })

    // 지역코드가 있으면 추가
    if (areaCode) {
      params.append('areaCode', areaCode)
    }

    const response = await fetch(`${url}?${params}`, {
      next: { revalidate: 600 }, // 10분 캐시 (특보는 실시간 발표)
    })

    if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`)

    const data = await response.json()

    // 응답 구조: response.body.items.item[]
    const items = data.response?.body?.items?.item || []

    // 배열이 아닌 경우 (단일 항목)
    const itemArray = Array.isArray(items) ? items : [items]

    return itemArray.map((item: any, index: number) => ({
      id: `w${item.stnId || index}`,
      location: item.title || '전국', // 특보 제목 (예: "서울·인천·경기도")
      warningType: item.warnVar || '특보', // 특보종류 (예: "호우경보", "대설주의보")
      level: item.warnStress === '경보' ? '경보' : '주의보',
      issueTime: item.tmFc || new Date().toISOString(), // 발표시각
      content: item.warnMsg || '', // 특보 내용
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
    const url = 'https://apis.data.go.kr/...'
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
 * 서울 전체 측정소 실시간 대기질 조회 (시도별 API 사용)
 * 25개 측정소 데이터를 한 번에 가져와서 위치 정보와 매칭
 */
export async function fetchSeoulAllStations(): Promise<AirQualityData[]> {
  try {
    if (!AIR_KOREA_KEY) {
      console.error('에어코리아 API 키가 설정되지 않았습니다')
      return []
    }

    const url = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty'
    const params = new URLSearchParams({
      serviceKey: AIR_KOREA_KEY,
      returnType: 'json',
      numOfRows: '100', // 서울 25개 측정소 모두 가져오기
      pageNo: '1',
      sidoName: '서울',
      ver: '1.0',
    })

    const response = await fetch(`${url}?${params}`, {
      next: { revalidate: 3600 }, // 1시간 캐시
    })

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`)
    }

    const data = await response.json()

    if (data.response?.body?.items && Array.isArray(data.response.body.items)) {
      const items = data.response.body.items

      // API 데이터와 위치 정보 매칭
      return items
        .map((item: any) => {
          const location = getStationLocation(item.stationName)

          if (!location) {
            console.warn(`위치 정보 없음: ${item.stationName}`)
            return null
          }

          return {
            stationName: item.stationName,
            addr: location.addr,
            lat: location.lat,
            lng: location.lng,
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
        })
        .filter((data: AirQualityData | null): data is AirQualityData => data !== null)
    }

    return []
  } catch (error) {
    console.error('서울 전체 대기질 조회 실패:', error)
    return []
  }
}

/**
 * 서울 측정소명 목록 (하드코딩된 위치 데이터와 동일)
 */
export const SEOUL_STATION_NAMES = SEOUL_STATIONS.map((s) => s.stationName)
