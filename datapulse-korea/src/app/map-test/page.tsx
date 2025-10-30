'use client'

import { useState } from 'react'
import { KakaoMap } from '@/components/map'
import { Container, Card, Button, Badge } from '@/components/ui'

export default function MapTestPage() {
  const [selectedLocation, setSelectedLocation] = useState({
    name: '서울 시청',
    lat: 37.5665,
    lng: 126.9780,
  })

  const locations = [
    { name: '서울 시청', lat: 37.5665, lng: 126.9780 },
    { name: '강남역', lat: 37.4979, lng: 127.0276 },
    { name: '여의도', lat: 37.5219, lng: 126.9245 },
    { name: '부산 해운대', lat: 35.1585, lng: 129.1603 },
  ]

  const handleMapLoad = (map: any, kakao: any) => {
    console.log('✅ 지도 로드 완료!')
    console.log('Map 객체:', map)
    console.log('Kakao 객체:', kakao)

    // 지도 중앙에 마커 추가
    const markerPosition = new kakao.maps.LatLng(selectedLocation.lat, selectedLocation.lng)
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    })
    marker.setMap(map)

    // 인포윈도우 추가
    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:10px;font-size:14px;">${selectedLocation.name}</div>`,
    })
    infowindow.open(map, marker)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <Container>
        {/* 헤더 */}
        <div className="text-center mb-12">
          <Badge variant="info" className="mb-4">테스트 페이지</Badge>
          <h1 className="text-4xl font-bold mb-4">🗺️ Kakao Map 테스트</h1>
          <p className="text-gray-600">
            지도가 정상적으로 표시되는지 확인하세요
          </p>
        </div>

        {/* 위치 선택 */}
        <Card variant="elevated" className="mb-8">
          <h2 className="text-xl font-bold mb-4">📍 위치 선택</h2>
          <div className="flex flex-wrap gap-3">
            {locations.map((location) => (
              <Button
                key={location.name}
                variant={selectedLocation.name === location.name ? 'primary' : 'outline'}
                onClick={() => setSelectedLocation(location)}
              >
                {location.name}
              </Button>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>현재 위치:</strong> {selectedLocation.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              위도: {selectedLocation.lat}, 경도: {selectedLocation.lng}
            </p>
          </div>
        </Card>

        {/* 지도 */}
        <Card variant="elevated" padding="none">
          <KakaoMap
            width="100%"
            height="600px"
            center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            level={3}
            onLoad={handleMapLoad}
          />
        </Card>

        {/* 안내 사항 */}
        <Card variant="bordered" className="mt-8">
          <h3 className="text-lg font-bold mb-4">✅ 체크리스트</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">1️⃣</span>
              <span>지도가 정상적으로 표시되나요?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2️⃣</span>
              <span>마우스 드래그로 지도를 이동할 수 있나요?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3️⃣</span>
              <span>오른쪽 줌 컨트롤로 확대/축소가 되나요?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4️⃣</span>
              <span>위 버튼을 클릭하면 지도 위치가 변경되나요?</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">5️⃣</span>
              <span>지도 중앙에 마커(핀)가 표시되나요?</span>
            </li>
          </ul>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-2">
              ⚠️ 만약 지도가 표시되지 않는다면:
            </p>
            <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
              <li>.env.local 파일에 NEXT_PUBLIC_KAKAO_MAP_KEY가 올바르게 설정되었는지 확인</li>
              <li>Kakao Developers에서 localhost:3000을 플랫폼에 등록했는지 확인</li>
              <li>개발 서버를 재시작 (Ctrl+C 후 npm run dev)</li>
              <li>브라우저 콘솔(F12)에서 에러 메시지 확인</li>
            </ol>
          </div>
        </Card>

        {/* 홈으로 버튼 */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            ← 홈으로 돌아가기
          </Button>
        </div>
      </Container>
    </main>
  )
}
