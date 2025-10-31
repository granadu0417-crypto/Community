'use client'

import { useState, useEffect } from 'react'
import { KakaoMap } from '@/components/map'
import SafetyCheckerCard from '@/components/environment/SafetyCheckerCard'
import {
  getMockLocationSafety,
  mockAirQualityData,
  mockCCTVData,
  getAirQualityInfo,
} from '@/lib/data/mockEnvironmentData'
import type { LocationSafety } from '@/types/environment'

export default function EnvironmentPage() {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 37.4979,
    lng: 127.0276,
  })
  const [locationSafety, setLocationSafety] = useState<LocationSafety | null>(null)
  const [showLayers, setShowLayers] = useState({
    airQuality: true,
    cctv: true,
    weatherWarning: true,
  })

  // 현재 위치 안전 정보 로드
  useEffect(() => {
    const safety = getMockLocationSafety(currentLocation.lat, currentLocation.lng)
    setLocationSafety(safety)
  }, [currentLocation])

  // 지도 로드 핸들러
  const handleMapLoad = (map: any, kakao: any) => {
    // 현재 위치 마커
    const currentMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      map: map,
    })

    const currentInfowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:10px;font-size:14px;font-weight:500;">📍 현재 위치</div>`,
    })
    currentInfowindow.open(map, currentMarker)

    // 미세먼지 측정소 마커
    if (showLayers.airQuality) {
      mockAirQualityData.forEach((station) => {
        if (station.lat && station.lng) {
          const airQualityInfo = getAirQualityInfo(station.khaiGrade)

          // 커스텀 마커 이미지 (색깔로 등급 표시)
          const markerImage = new kakao.maps.MarkerImage(
            'data:image/svg+xml;base64,' +
              btoa(`
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="${
                  station.khaiGrade === 1
                    ? '#3B82F6'
                    : station.khaiGrade === 2
                      ? '#10B981'
                      : station.khaiGrade === 3
                        ? '#F59E0B'
                        : '#EF4444'
                }" opacity="0.8"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🌫️</text>
              </svg>
            `),
            new kakao.maps.Size(40, 40)
          )

          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(station.lat, station.lng),
            map: map,
            image: markerImage,
          })

          const infowindow = new kakao.maps.InfoWindow({
            content: `
              <div style="padding:12px;min-width:200px;">
                <div style="font-weight:600;margin-bottom:8px;font-size:14px;">🌫️ ${station.stationName}</div>
                <div style="margin-bottom:4px;font-size:12px;">
                  <span style="color:${airQualityInfo.color.replace('text-', '')};" style="font-weight:600;">
                    ${airQualityInfo.emoji} ${airQualityInfo.label}
                  </span>
                </div>
                <div style="font-size:11px;color:#666;">
                  <div>PM10: ${station.pm10Value}㎍/㎥</div>
                  <div>PM2.5: ${station.pm25Value}㎍/㎥</div>
                  <div>통합지수: ${station.khaiValue}</div>
                </div>
              </div>
            `,
          })

          kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker)
          })
        }
      })
    }

    // CCTV 마커
    if (showLayers.cctv) {
      mockCCTVData.forEach((cctv) => {
        const markerImage = new kakao.maps.MarkerImage(
          'data:image/svg+xml;base64,' +
            btoa(`
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#6366F1" opacity="0.9"/>
              <text x="16" y="22" text-anchor="middle" fill="white" font-size="14">📹</text>
            </svg>
          `),
          new kakao.maps.Size(32, 32)
        )

        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(cctv.lat, cctv.lng),
          map: map,
          image: markerImage,
        })

        const infowindow = new kakao.maps.InfoWindow({
          content: `
            <div style="padding:10px;min-width:180px;">
              <div style="font-weight:600;margin-bottom:6px;font-size:13px;">📹 ${cctv.name}</div>
              <div style="font-size:11px;color:#666;line-height:1.5;">
                <div>관리: ${cctv.managementOrg}</div>
                <div>용도: ${cctv.purpose}</div>
                <div>카메라: ${cctv.cameraCount}대</div>
              </div>
            </div>
          `,
        })

        kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(map, marker)
        })
      })
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🌍 실시간 환경 안전 지도</h1>
              <p className="text-sm text-gray-600 mt-1">지금 당장 우리 동네는 안전한가요?</p>
            </div>

            {/* 레이어 토글 */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowLayers((prev) => ({ ...prev, airQuality: !prev.airQuality }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showLayers.airQuality
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                }`}
              >
                🌫️ 대기질
              </button>
              <button
                onClick={() => setShowLayers((prev) => ({ ...prev, cctv: !prev.cctv }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showLayers.cctv
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                }`}
              >
                📹 CCTV
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 지도 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <KakaoMap
                width="100%"
                height="600px"
                center={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                level={5}
                onLoad={handleMapLoad}
                key={`${showLayers.airQuality}-${showLayers.cctv}`}
              />
            </div>

            {/* 범례 */}
            <div className="mt-4 bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">🗺️ 지도 범례</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                    🌫️
                  </div>
                  <span className="text-gray-700">대기질 좋음</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                    🌫️
                  </div>
                  <span className="text-gray-700">대기질 보통</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">
                    🌫️
                  </div>
                  <span className="text-gray-700">대기질 나쁨</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm">
                    📹
                  </div>
                  <span className="text-gray-700">CCTV 위치</span>
                </div>
              </div>
            </div>
          </div>

          {/* 안전 체커 */}
          <div className="lg:col-span-1">
            {locationSafety ? (
              <SafetyCheckerCard data={locationSafety} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-600">안전 정보를 불러오는 중...</p>
              </div>
            )}
          </div>
        </div>

        {/* API 연동 안내 */}
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">목업 데이터로 표시 중</h4>
              <p className="text-sm text-yellow-800">
                현재는 목업 데이터로 UI를 표시하고 있습니다. 실제 API 연동 후:
              </p>
              <ul className="text-sm text-yellow-800 mt-2 space-y-1 list-disc list-inside">
                <li>에어코리아 API → 실시간 미세먼지 데이터</li>
                <li>기상청 API → 실시간 기상특보</li>
                <li>행정안전부 API → 긴급재난문자</li>
                <li>CCTV 표준데이터 → 전국 CCTV 위치</li>
              </ul>
              <p className="text-xs text-yellow-700 mt-2">
                📄 API 연동 가이드는 프로젝트 루트의 <code className="bg-yellow-100 px-1 rounded">API_SETUP_GUIDE.md</code>를 참고하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
