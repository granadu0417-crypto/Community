'use client'

import { useEffect, useRef, useState } from 'react'
import { loadKakaoMap } from '@/lib/utils/kakaoMapLoader'
import { Loading } from '@/components/ui'

interface KakaoMapProps {
  width?: string | number
  height?: string | number
  center?: { lat: number; lng: number }
  level?: number
  className?: string
  onLoad?: (map: any, kakao: any) => void
}

/**
 * Kakao Map 컴포넌트
 *
 * @param width - 지도 너비 (기본값: '100%')
 * @param height - 지도 높이 (기본값: '400px')
 * @param center - 지도 중심 좌표 (기본값: 서울 시청)
 * @param level - 지도 확대 레벨 (1-14, 기본값: 3)
 * @param className - 추가 CSS 클래스
 * @param onLoad - 지도 로드 완료 후 콜백
 *
 * @example
 * ```tsx
 * <KakaoMap
 *   width="100%"
 *   height="500px"
 *   center={{ lat: 37.5665, lng: 126.9780 }}
 *   level={3}
 *   onLoad={(map, kakao) => {
 *     // 마커 추가 등 추가 작업
 *   }}
 * />
 * ```
 */
export default function KakaoMap({
  width = '100%',
  height = '400px',
  center = { lat: 37.5665, lng: 126.9780 }, // 서울 시청
  level = 3,
  className = '',
  onLoad,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const initMap = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Kakao Map SDK 로드
        const kakao = await loadKakaoMap()

        // 지도 옵션
        const options = {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: level,
        }

        // 지도 생성
        const map = new kakao.maps.Map(mapRef.current, options)

        // 지도 타입 컨트롤 추가
        const mapTypeControl = new kakao.maps.MapTypeControl()
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT)

        // 줌 컨트롤 추가
        const zoomControl = new kakao.maps.ZoomControl()
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

        setIsLoading(false)

        // 로드 완료 콜백 실행
        if (onLoad) {
          onLoad(map, kakao)
        }
      } catch (err) {
        console.error('지도 초기화 실패:', err)
        setError(err instanceof Error ? err.message : '지도를 불러오는데 실패했습니다.')
        setIsLoading(false)
      }
    }

    initMap()
  }, [center.lat, center.lng, level, onLoad])

  // 스타일 객체
  const mapStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div className={`relative ${className}`} style={mapStyle}>
      {/* 지도 컨테이너 */}
      <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden shadow-lg" />

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
          <div className="text-center">
            <Loading size="lg" />
            <p className="mt-4 text-gray-600">지도를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-2xl">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium mb-2">지도를 불러올 수 없습니다</p>
            <p className="text-sm text-gray-600">{error}</p>
            {error.includes('API 키') && (
              <div className="mt-4 text-xs text-left bg-white p-4 rounded-lg">
                <p className="font-medium mb-2">해결 방법:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Kakao Developers에서 JavaScript 키 발급</li>
                  <li>.env.local 파일에 키 추가</li>
                  <li>개발 서버 재시작 (npm run dev)</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
