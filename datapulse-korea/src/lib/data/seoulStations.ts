/**
 * 서울시 25개 구 대기질 측정소 위치 데이터
 * 출처: 에어코리아 및 서울시 행정구역 중심 좌표
 */

export interface SeoulStation {
  stationName: string // 측정소명 (구 이름)
  lat: number // 위도
  lng: number // 경도
  addr: string // 주소
}

export const SEOUL_STATIONS: SeoulStation[] = [
  { stationName: '종로구', lat: 37.5735, lng: 126.9792, addr: '서울 종로구' },
  { stationName: '중구', lat: 37.5641, lng: 126.9979, addr: '서울 중구' },
  { stationName: '용산구', lat: 37.5326, lng: 126.9904, addr: '서울 용산구' },
  { stationName: '성동구', lat: 37.5634, lng: 127.0371, addr: '서울 성동구' },
  { stationName: '광진구', lat: 37.5385, lng: 127.0823, addr: '서울 광진구' },
  { stationName: '동대문구', lat: 37.5744, lng: 127.0400, addr: '서울 동대문구' },
  { stationName: '중랑구', lat: 37.6063, lng: 127.0926, addr: '서울 중랑구' },
  { stationName: '성북구', lat: 37.5894, lng: 127.0169, addr: '서울 성북구' },
  { stationName: '강북구', lat: 37.6398, lng: 127.0256, addr: '서울 강북구' },
  { stationName: '도봉구', lat: 37.6688, lng: 127.0471, addr: '서울 도봉구' },
  { stationName: '노원구', lat: 37.6542, lng: 127.0567, addr: '서울 노원구' },
  { stationName: '은평구', lat: 37.6028, lng: 126.9292, addr: '서울 은평구' },
  { stationName: '서대문구', lat: 37.5794, lng: 126.9368, addr: '서울 서대문구' },
  { stationName: '마포구', lat: 37.5663, lng: 126.9018, addr: '서울 마포구' },
  { stationName: '양천구', lat: 37.5172, lng: 126.8664, addr: '서울 양천구' },
  { stationName: '강서구', lat: 37.5510, lng: 126.8495, addr: '서울 강서구' },
  { stationName: '구로구', lat: 37.4954, lng: 126.8876, addr: '서울 구로구' },
  { stationName: '금천구', lat: 37.4563, lng: 126.8954, addr: '서울 금천구' },
  { stationName: '영등포구', lat: 37.5264, lng: 126.8962, addr: '서울 영등포구' },
  { stationName: '동작구', lat: 37.5124, lng: 126.9393, addr: '서울 동작구' },
  { stationName: '관악구', lat: 37.4784, lng: 126.9516, addr: '서울 관악구' },
  { stationName: '서초구', lat: 37.4837, lng: 127.0324, addr: '서울 서초구' },
  { stationName: '강남구', lat: 37.5172, lng: 127.0473, addr: '서울 강남구' },
  { stationName: '송파구', lat: 37.5145, lng: 127.1059, addr: '서울 송파구' },
  { stationName: '강동구', lat: 37.5301, lng: 127.1238, addr: '서울 강동구' },
]

/**
 * 측정소명으로 위치 정보 찾기
 */
export function getStationLocation(stationName: string): SeoulStation | undefined {
  return SEOUL_STATIONS.find((station) => station.stationName === stationName)
}

/**
 * 좌표로부터 가장 가까운 측정소 찾기
 * @param lat 위도
 * @param lng 경도
 * @returns 가장 가까운 측정소
 */
export function getNearestStation(lat: number, lng: number): SeoulStation {
  let nearest = SEOUL_STATIONS[0]
  let minDistance = getDistance(lat, lng, nearest.lat, nearest.lng)

  SEOUL_STATIONS.forEach((station) => {
    const distance = getDistance(lat, lng, station.lat, station.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearest = station
    }
  })

  return nearest
}

/**
 * 두 좌표 사이의 거리 계산 (Haversine formula)
 * @returns 거리 (km)
 */
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
