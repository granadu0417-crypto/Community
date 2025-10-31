/**
 * 부동산 API 유틸리티
 *
 * 국토교통부 아파트 매매 실거래가 API 연동
 */

import { RegionRealEstateStats, RealEstateApiResponse, ApartmentTransaction } from '@/types/realestate'
import {
  mockRealEstateData,
  getMockDataByRegionName,
  getMockDataByCoordinates,
} from '@/data/mockRealEstateData'

// API 모드: 'mock' 또는 'real'
const API_MODE = process.env.NEXT_PUBLIC_REALESTATE_API_MODE || 'real'

// 국토교통부 API 설정
const REALESTATE_API_KEY = process.env.NEXT_PUBLIC_REALESTATE_API_KEY ||
  'bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ=='
const REALESTATE_API_URL = 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev'

// 서울시 구별 법정동코드 매핑
const REGION_CODE_MAP: Record<string, string> = {
  '강남구': '11680',
  '강동구': '11740',
  '강북구': '11305',
  '강서구': '11500',
  '관악구': '11620',
  '광진구': '11215',
  '구로구': '11530',
  '금천구': '11545',
  '노원구': '11350',
  '도봉구': '11320',
  '동대문구': '11230',
  '동작구': '11590',
  '마포구': '11440',
  '서대문구': '11410',
  '서초구': '11650',
  '성동구': '11200',
  '성북구': '11290',
  '송파구': '11710',
  '양천구': '11470',
  '영등포구': '11560',
  '용산구': '11170',
  '은평구': '11380',
  '종로구': '11110',
  '중구': '11140',
  '중랑구': '11260',
}

// 지역별 좌표 (대략적인 중심 좌표)
const REGION_COORDS_MAP: Record<string, { lat: number; lng: number }> = {
  '11680': { lat: 37.4979, lng: 127.0276 }, // 강남구
  '11740': { lat: 37.5301, lng: 127.1238 }, // 강동구
  '11305': { lat: 37.6396, lng: 127.0253 }, // 강북구
  '11500': { lat: 37.5509, lng: 126.8495 }, // 강서구
  '11620': { lat: 37.4784, lng: 126.9516 }, // 관악구
  '11215': { lat: 37.5384, lng: 127.0822 }, // 광진구
  '11530': { lat: 37.4954, lng: 126.8874 }, // 구로구
  '11545': { lat: 37.4519, lng: 126.9023 }, // 금천구
  '11350': { lat: 37.6542, lng: 127.0568 }, // 노원구
  '11320': { lat: 37.6688, lng: 127.0471 }, // 도봉구
  '11230': { lat: 37.5744, lng: 127.0395 }, // 동대문구
  '11590': { lat: 37.5124, lng: 126.9393 }, // 동작구
  '11440': { lat: 37.5663, lng: 126.9019 }, // 마포구
  '11410': { lat: 37.5791, lng: 126.9368 }, // 서대문구
  '11650': { lat: 37.4837, lng: 127.0324 }, // 서초구
  '11200': { lat: 37.5633, lng: 127.0365 }, // 성동구
  '11290': { lat: 37.5894, lng: 127.0167 }, // 성북구
  '11710': { lat: 37.5145, lng: 127.1059 }, // 송파구
  '11470': { lat: 37.5168, lng: 126.8664 }, // 양천구
  '11560': { lat: 37.5264, lng: 126.8963 }, // 영등포구
  '11170': { lat: 37.5384, lng: 126.9654 }, // 용산구
  '11380': { lat: 37.6027, lng: 126.9291 }, // 은평구
  '11110': { lat: 37.5735, lng: 126.9790 }, // 종로구
  '11140': { lat: 37.5641, lng: 126.9979 }, // 중구
  '11260': { lat: 37.6063, lng: 127.0925 }, // 중랑구
}

/**
 * 지역명으로 부동산 데이터 조회
 */
export async function getRealEstateByRegion(
  regionName: string
): Promise<RealEstateApiResponse> {
  try {
    // 실제 API 호출
    return await fetchRealApiData(regionName)
  } catch (error) {
    console.error('부동산 데이터 조회 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '데이터 조회 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 좌표로 부동산 데이터 조회
 */
export async function getRealEstateByCoordinates(
  lat: number,
  lng: number
): Promise<RealEstateApiResponse> {
  try {
    // 실제 API 호출
    return await fetchRealApiDataByCoords(lat, lng)
  } catch (error) {
    console.error('부동산 데이터 조회 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '데이터 조회 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 모든 지역 데이터 조회
 */
export async function getAllRegionsRealEstate(): Promise<RegionRealEstateStats[]> {
  // 실제 API는 지역별로 개별 호출해야 하므로
  // 이 함수는 사용하지 않음
  return []
}

/**
 * 실제 API 호출 함수
 */
async function fetchRealApiData(regionName: string): Promise<RealEstateApiResponse> {
  try {
    // 1. 지역명 → 법정동코드 변환
    const regionCode = REGION_CODE_MAP[regionName]
    if (!regionCode) {
      return {
        success: false,
        error: `지원하지 않는 지역입니다: ${regionName}`,
      }
    }

    // 2. 3-5개월 전 데이터 수집 (등록 지연 고려)
    // 부동산 거래는 신고 후 1-3개월 지연되어 등록되므로
    // 확실하게 등록된 3-5개월 전 데이터를 조회합니다
    const currentDate = new Date()
    const transactions: ApartmentTransaction[] = []

    for (let i = 3; i <= 5; i++) {
      const targetDate = new Date(currentDate)
      targetDate.setMonth(currentDate.getMonth() - i)

      const year = targetDate.getFullYear()
      const month = String(targetDate.getMonth() + 1).padStart(2, '0')
      const dealYmd = `${year}${month}`

      console.log(`📅 조회 기간: ${year}년 ${month}월 (${i}개월 전)`)

      // API 호출
      const monthTransactions = await fetchTransactionsByMonth(regionCode, dealYmd)
      transactions.push(...monthTransactions)
    }

    // 데이터가 적어도 있는 만큼 표시 (완전히 없을 때만 에러)
    if (transactions.length === 0) {
      return {
        success: false,
        error: '해당 지역의 최근 거래 데이터가 아직 등록되지 않았습니다. 부동산 거래는 신고 후 1-3개월 지연되어 등록됩니다.',
      }
    }

    // 3. 통계 계산
    const stats = calculateRegionStats(regionCode, regionName, transactions)

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('실제 API 호출 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'API 호출 중 오류가 발생했습니다.',
    }
  }
}

async function fetchRealApiDataByCoords(
  lat: number,
  lng: number
): Promise<RealEstateApiResponse> {
  // 좌표로는 일단 목업 데이터 반환 (Kakao 역지오코딩 구현 필요)
  const data = getMockDataByCoordinates(lat, lng)
  if (data) {
    return { success: true, data }
  }
  return { success: false, error: '해당 좌표의 데이터를 찾을 수 없습니다.' }
}

/**
 * 월별 거래 데이터 조회
 */
async function fetchTransactionsByMonth(
  regionCode: string,
  dealYmd: string
): Promise<ApartmentTransaction[]> {
  try {
    const url = new URL(REALESTATE_API_URL)
    url.searchParams.set('serviceKey', REALESTATE_API_KEY)
    url.searchParams.set('LAWD_CD', regionCode)
    url.searchParams.set('DEAL_YMD', dealYmd)
    url.searchParams.set('pageNo', '1') // 페이지번호 (필수)
    url.searchParams.set('numOfRows', '1000') // 최대 1000건

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`)
    }

    const xmlText = await response.text()

    // XML 파싱
    const transactions = parseXmlTransactions(xmlText)
    return transactions
  } catch (error) {
    console.error(`거래 데이터 조회 실패 (${dealYmd}):`, error)
    return []
  }
}

/**
 * XML 응답 파싱
 */
function parseXmlTransactions(xmlText: string): ApartmentTransaction[] {
  const transactions: ApartmentTransaction[] = []

  try {
    // <item> 태그들 추출
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    const items = xmlText.match(itemRegex) || []

    for (const itemXml of items) {
      const transaction: ApartmentTransaction = {
        aptNm: extractXmlValue(itemXml, 'aptNm'),
        dealAmount: extractXmlValue(itemXml, 'dealAmount').replace(/,/g, '').trim(),
        buildYear: extractXmlValue(itemXml, 'buildYear'),
        dealYear: extractXmlValue(itemXml, 'dealYear'),
        dealMonth: extractXmlValue(itemXml, 'dealMonth'),
        dealDay: extractXmlValue(itemXml, 'dealDay'),
        excluUseAr: extractXmlValue(itemXml, 'excluUseAr'),
        floor: extractXmlValue(itemXml, 'floor'),
        jibun: extractXmlValue(itemXml, 'jibun'),
        umdNm: extractXmlValue(itemXml, 'umdNm'),
      }

      const roadNm = extractXmlValue(itemXml, 'roadNm')
      if (roadNm) transaction.roadNm = roadNm

      transactions.push(transaction)
    }
  } catch (error) {
    console.error('XML 파싱 실패:', error)
  }

  return transactions
}

/**
 * XML 태그 값 추출
 */
function extractXmlValue(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`)
  const match = xml.match(regex)
  return match ? match[1].trim() : ''
}

/**
 * 지역 통계 계산
 */
function calculateRegionStats(
  regionCode: string,
  regionName: string,
  transactions: ApartmentTransaction[]
): RegionRealEstateStats {
  // 가격 배열 (만원 단위)
  const prices = transactions.map((t) => parseInt(t.dealAmount))
  const sortedPrices = [...prices].sort((a, b) => a - b)

  // 기본 통계
  const avgPrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length)
  const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)]
  const minPrice = sortedPrices[0]
  const maxPrice = sortedPrices[sortedPrices.length - 1]

  // 평당 가격 계산
  const pricesPerPyeong = transactions
    .map((t) => {
      const area = parseFloat(t.excluUseAr)
      const price = parseInt(t.dealAmount)
      const pyeong = area * 0.3025
      return price / pyeong
    })
    .filter((p) => !isNaN(p) && p > 0)

  const avgPricePerPyeong = Math.round(
    pricesPerPyeong.reduce((sum, p) => sum + p, 0) / pricesPerPyeong.length
  )

  // 점수 계산
  const nationalAvgPrice = 80000 // 전국 평균 약 8억 (임시값)
  const priceScore = calculatePriceScore(avgPrice, nationalAvgPrice)
  const liquidityScore = calculateLiquidityScore(transactions.length)
  const overallScore = Math.round(priceScore * 0.7 + liquidityScore * 0.3)

  // 추세 계산 (임시: stable)
  const trend: 'up' | 'down' | 'stable' = 'stable'
  const priceChangePercent = 0

  // 좌표
  const coords = REGION_COORDS_MAP[regionCode] || { lat: 37.5665, lng: 126.9780 }

  // 최근 거래 5건
  const recentTransactions = transactions.slice(0, 5)

  return {
    regionCode,
    regionName,
    lat: coords.lat,
    lng: coords.lng,
    avgPrice,
    medianPrice,
    minPrice,
    maxPrice,
    avgPricePerPyeong,
    transactionCount: transactions.length,
    priceChangePercent,
    trend,
    priceScore,
    liquidityScore,
    overallScore,
    recentTransactions,
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * 가격 적정성 점수 계산 (0-100, 낮을수록 좋음)
 */
function calculatePriceScore(avgPrice: number, nationalAvg: number): number {
  const ratio = avgPrice / nationalAvg

  if (ratio <= 0.5) return 100 // 전국 평균의 50% 이하 - 매우 저렴
  if (ratio <= 0.75) return 90
  if (ratio <= 1.0) return 80
  if (ratio <= 1.5) return 70
  if (ratio <= 2.0) return 60
  if (ratio <= 2.5) return 50
  if (ratio <= 3.0) return 40
  return Math.max(0, 40 - Math.floor((ratio - 3.0) * 10)) // 3배 이상은 급격히 감소
}

/**
 * 시장 유동성 점수 계산 (0-100, 높을수록 좋음)
 */
function calculateLiquidityScore(transactionCount: number): number {
  // 3개월간 거래 건수 기준
  if (transactionCount >= 500) return 100
  if (transactionCount >= 300) return 90
  if (transactionCount >= 200) return 80
  if (transactionCount >= 100) return 70
  if (transactionCount >= 50) return 60
  if (transactionCount >= 30) return 50
  if (transactionCount >= 20) return 40
  if (transactionCount >= 10) return 30
  if (transactionCount >= 5) return 20
  return 10
}

/**
 * 지연 함수 (네트워크 지연 시뮬레이션)
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 가격을 포맷팅 (억/만원 단위)
 */
export function formatPrice(price: number): string {
  if (price >= 10000) {
    const eok = Math.floor(price / 10000)
    const man = price % 10000
    if (man === 0) {
      return `${eok}억`
    }
    return `${eok}억 ${man.toLocaleString()}만`
  }
  return `${price.toLocaleString()}만원`
}

/**
 * 평수 계산 (제곱미터 → 평)
 */
export function convertToPyeong(squareMeter: number): number {
  return Math.round(squareMeter * 0.3025 * 10) / 10
}

/**
 * 가격 변동률 포맷팅
 */
export function formatPriceChange(percent: number): string {
  const sign = percent >= 0 ? '+' : ''
  return `${sign}${percent.toFixed(1)}%`
}
