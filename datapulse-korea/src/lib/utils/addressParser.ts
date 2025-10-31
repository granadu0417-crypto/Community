/**
 * 주소 파싱 유틸리티
 *
 * 카카오 API 응답을 부동산 API가 인식할 수 있는 형식으로 변환
 */

/**
 * 주소에서 서울시 구 이름 추출
 *
 * @param address - 카카오 API에서 받은 주소 또는 장소명
 * @returns 구 이름 (예: "강남구") 또는 null
 *
 * @example
 * extractSeoulDistrict("서울특별시 강남구 역삼동") // "강남구"
 * extractSeoulDistrict("서울 강남구") // "강남구"
 * extractSeoulDistrict("강남구청") // "강남구"
 * extractSeoulDistrict("강남역") // null
 */
export function extractSeoulDistrict(address: string): string | null {
  if (!address) return null

  // 서울시 25개 구 목록
  const seoulDistricts = [
    '강남구', '강동구', '강북구', '강서구', '관악구',
    '광진구', '구로구', '금천구', '노원구', '도봉구',
    '동대문구', '동작구', '마포구', '서대문구', '서초구',
    '성동구', '성북구', '송파구', '양천구', '영등포구',
    '용산구', '은평구', '종로구', '중구', '중랑구'
  ]

  // 정확한 구 이름 찾기
  for (const district of seoulDistricts) {
    if (address.includes(district)) {
      return district
    }
  }

  return null
}

/**
 * 카카오 Geocoder 결과에서 지역명 추출
 *
 * @param placeName - 장소명 (예: "강남구청")
 * @param address - 주소 (예: "서울특별시 강남구 역삼동")
 * @returns 정규화된 지역명 (예: "강남구")
 */
export function normalizeRegionName(placeName: string | undefined, address: string): string | null {
  // 1. placeName에서 시도
  if (placeName) {
    const district = extractSeoulDistrict(placeName)
    if (district) return district
  }

  // 2. address에서 시도
  const district = extractSeoulDistrict(address)
  if (district) return district

  return null
}

/**
 * 주소가 서울인지 확인
 */
export function isSeoulAddress(address: string): boolean {
  return address.includes('서울') || address.includes('Seoul')
}

/**
 * 주소 정보를 로그로 출력 (디버깅용)
 */
export function debugAddressInfo(placeName: string | undefined, address: string) {
  console.log('=== 주소 파싱 디버그 ===')
  console.log('placeName:', placeName)
  console.log('address:', address)
  console.log('추출된 구:', normalizeRegionName(placeName, address))
  console.log('서울 주소:', isSeoulAddress(address))
  console.log('=====================')
}
