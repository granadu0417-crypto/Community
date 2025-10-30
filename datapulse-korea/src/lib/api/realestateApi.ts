/**
 * 부동산 API 유틸리티
 *
 * 현재: 목업 데이터 사용
 * 향후: 실제 국토교통부 API로 교체
 */

import { RegionRealEstateStats, RealEstateApiResponse } from '@/types/realestate'
import {
  mockRealEstateData,
  getMockDataByRegionName,
  getMockDataByCoordinates,
} from '@/data/mockRealEstateData'

// API 모드: 'mock' 또는 'real'
const API_MODE = process.env.NEXT_PUBLIC_REALESTATE_API_MODE || 'mock'

// 실제 API 키 (나중에 환경변수로 추가)
const API_KEY = process.env.NEXT_PUBLIC_REALESTATE_API_KEY || ''

/**
 * 지역명으로 부동산 데이터 조회
 */
export async function getRealEstateByRegion(
  regionName: string
): Promise<RealEstateApiResponse> {
  try {
    if (API_MODE === 'mock') {
      // 목업 데이터 사용
      await delay(300) // 네트워크 지연 시뮬레이션
      const data = getMockDataByRegionName(regionName)

      if (data) {
        return {
          success: true,
          data,
        }
      } else {
        return {
          success: false,
          error: '해당 지역의 데이터를 찾을 수 없습니다.',
        }
      }
    } else {
      // 실제 API 호출 (구현 예정)
      return await fetchRealApiData(regionName)
    }
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
    if (API_MODE === 'mock') {
      // 목업 데이터 사용
      await delay(300)
      const data = getMockDataByCoordinates(lat, lng)

      if (data) {
        return {
          success: true,
          data,
        }
      } else {
        return {
          success: false,
          error: '해당 좌표의 데이터를 찾을 수 없습니다.',
        }
      }
    } else {
      // 실제 API 호출 (구현 예정)
      return await fetchRealApiDataByCoords(lat, lng)
    }
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
  if (API_MODE === 'mock') {
    await delay(500)
    return Object.values(mockRealEstateData)
  } else {
    // 실제 API 호출 (구현 예정)
    return []
  }
}

/**
 * 실제 API 호출 함수 (향후 구현)
 */
async function fetchRealApiData(regionName: string): Promise<RealEstateApiResponse> {
  // TODO: 실제 국토교통부 API 호출 구현
  // 1. 지역명 → 법정동코드 변환
  // 2. API 호출
  // 3. XML 파싱
  // 4. 데이터 가공 및 점수 계산

  throw new Error('실제 API 기능은 아직 구현되지 않았습니다.')
}

async function fetchRealApiDataByCoords(
  lat: number,
  lng: number
): Promise<RealEstateApiResponse> {
  // TODO: 실제 API 구현
  // 1. 좌표 → 법정동코드 역변환 (Kakao API 활용)
  // 2. 국토교통부 API 호출
  // 3. 데이터 처리

  throw new Error('실제 API 기능은 아직 구현되지 않았습니다.')
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
