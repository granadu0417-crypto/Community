/**
 * Kakao 주소 검색 (Geocoding) 유틸리티
 *
 * 주소나 장소명을 좌표로 변환합니다.
 */

import { loadKakaoMap } from './kakaoMapLoader'

export interface GeocoderResult {
  address: string
  roadAddress?: string
  lat: number
  lng: number
  placeName?: string
}

/**
 * 주소나 장소명으로 좌표 검색
 *
 * @param query - 검색할 주소나 장소명 (예: "서울시 강남구", "강남역")
 * @returns 검색 결과 배열 (최대 10개)
 *
 * @example
 * ```ts
 * const results = await searchAddress('서울 강남구')
 * if (results.length > 0) {
 *   console.log(results[0].lat, results[0].lng)
 * }
 * ```
 */
export const searchAddress = async (query: string): Promise<GeocoderResult[]> => {
  if (!query || query.trim().length === 0) {
    return []
  }

  try {
    const kakao = await loadKakaoMap()

    return new Promise((resolve, reject) => {
      const geocoder = new kakao.maps.services.Geocoder()

      // 주소로 검색
      geocoder.addressSearch(query, (result: any, status: any) => {
        if (status === kakao.maps.services.Status.OK) {
          const results: GeocoderResult[] = result.map((item: any) => ({
            address: item.address_name,
            roadAddress: item.road_address_name,
            lat: parseFloat(item.y),
            lng: parseFloat(item.x),
          }))
          resolve(results)
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          // 주소 검색 실패 시 키워드 검색 시도
          const places = new kakao.maps.services.Places()

          places.keywordSearch(query, (placeResult: any, placeStatus: any) => {
            if (placeStatus === kakao.maps.services.Status.OK) {
              const results: GeocoderResult[] = placeResult.map((item: any) => ({
                address: item.address_name,
                roadAddress: item.road_address_name,
                lat: parseFloat(item.y),
                lng: parseFloat(item.x),
                placeName: item.place_name,
              }))
              resolve(results)
            } else {
              resolve([])
            }
          })
        } else {
          resolve([])
        }
      })
    })
  } catch (error) {
    console.error('주소 검색 실패:', error)
    return []
  }
}

/**
 * 좌표로 주소 검색 (Reverse Geocoding)
 *
 * @param lat - 위도
 * @param lng - 경도
 * @returns 주소 정보
 */
export const getAddressFromCoords = async (
  lat: number,
  lng: number
): Promise<GeocoderResult | null> => {
  try {
    const kakao = await loadKakaoMap()

    return new Promise((resolve, reject) => {
      const geocoder = new kakao.maps.services.Geocoder()
      const coord = new kakao.maps.LatLng(lat, lng)

      geocoder.coord2Address(coord.getLng(), coord.getLat(), (result: any, status: any) => {
        if (status === kakao.maps.services.Status.OK && result.length > 0) {
          const item = result[0]
          resolve({
            address: item.address.address_name,
            roadAddress: item.road_address?.address_name,
            lat,
            lng,
          })
        } else {
          resolve(null)
        }
      })
    })
  } catch (error) {
    console.error('역지오코딩 실패:', error)
    return null
  }
}
