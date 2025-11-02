'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { KakaoMap } from '@/components/map'
import SafetyCheckerCard from '@/components/environment/SafetyCheckerCard'
import {
  getMockLocationSafety,
  mockAirQualityData,
  mockCCTVData,
  getAirQualityInfo,
} from '@/lib/data/mockEnvironmentData'
import { fetchSeoulAllStations } from '@/lib/api/environmentApi'
import { findAllDistrictsByKeyword } from '@/lib/data/seoulLocationMapping'
import { logger } from '@/lib/utils/logger'
import type { LocationSafety, AirQualityData } from '@/types/environment'

export default function EnvironmentPage() {
  // 서울 중심 (시청) 좌표로 시작
  const [currentLocation, setCurrentLocation] = useState({
    lat: 37.5665,
    lng: 126.9780,
  })
  const [locationSafety, setLocationSafety] = useState<LocationSafety | null>(null)
  const [showLayers, setShowLayers] = useState({
    airQuality: true,
    cctv: true,
    weatherWarning: true,
  })
  const [realAirQualityData, setRealAirQualityData] = useState<AirQualityData[]>([])
  const [isLoadingRealData, setIsLoadingRealData] = useState(false)
  const [useRealData, setUseRealData] = useState(false) // 실제 API 사용 여부
  const [selectedStation, setSelectedStation] = useState<AirQualityData | null>(null) // 선택된 측정소
  const [searchQuery, setSearchQuery] = useState('') // 검색어
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('') // 디바운스된 검색어
  const [showSearchResults, setShowSearchResults] = useState(false) // 검색 결과 표시 여부

  // 실제 대기질 데이터 로드 (서울 전체 25개 측정소)
  useEffect(() => {
    if (useRealData) {
      logger.log('🔄 실제 데이터 로드 시작...')
      setIsLoadingRealData(true)
      // 서울 전체 측정소 데이터 가져오기 (25개, 위치 정보 포함)
      fetchSeoulAllStations()
        .then((data) => {
          logger.log(`✅ 서울 ${data.length}개 측정소 데이터 로드 완료`, data)
          setRealAirQualityData(data)
          setIsLoadingRealData(false)
        })
        .catch((error) => {
          logger.error('❌ 실제 대기질 데이터 로드 실패:', error)
          setIsLoadingRealData(false)
        })
    }
  }, [useRealData])

  // 현재 위치 안전 정보 로드
  useEffect(() => {
    const safety = getMockLocationSafety(currentLocation.lat, currentLocation.lng)
    setLocationSafety(safety)
  }, [currentLocation])

  // 검색 디바운싱 (300ms 지연)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // 스마트 검색 결과 필터링 (메모이제이션으로 성능 최적화)
  const filteredStations = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return []

    const query = debouncedSearchQuery.trim()
    const results = new Set<AirQualityData>()

    logger.log(`🔍 검색: "${query}", 전체 데이터: ${realAirQualityData.length}개`)

    realAirQualityData.forEach((station) => {
      // 1. 구 이름 직접 검색
      if (station.stationName.includes(query)) {
        logger.log(`  ✓ 구 이름 매칭: ${station.stationName}`)
        results.add(station)
      }

      // 2. 주소 검색
      if (station.addr && station.addr.includes(query)) {
        logger.log(`  ✓ 주소 매칭: ${station.addr}`)
        results.add(station)
      }
    })

    // 3. 매핑된 키워드 검색 (동, 역, 랜드마크)
    const mappedDistricts = findAllDistrictsByKeyword(query)
    if (mappedDistricts.length > 0) {
      logger.log(`  ➜ 매핑된 구: ${mappedDistricts.join(', ')}`)
      realAirQualityData.forEach((station) => {
        if (mappedDistricts.includes(station.stationName)) {
          logger.log(`  ✓ 매핑 매칭: ${station.stationName}`)
          results.add(station)
        }
      })
    }

    logger.log(`  결과: ${results.size}개`)
    return Array.from(results)
  }, [debouncedSearchQuery, realAirQualityData])

  // 측정소 선택 핸들러 (메모이제이션)
  const handleSelectStation = useCallback((station: AirQualityData) => {
    setSelectedStation(station)
    setCurrentLocation({ lat: station.lat!, lng: station.lng! })
    setSearchQuery('')
    setShowSearchResults(false)
  }, [])

  // 검색 엔터 키 핸들러 (메모이제이션)
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredStations.length > 0) {
      // 엔터 누르면 첫 번째 검색 결과 선택
      handleSelectStation(filteredStations[0])
    }
  }, [filteredStations, handleSelectStation])

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
      const airQualityDataToUse = useRealData ? realAirQualityData : mockAirQualityData
      airQualityDataToUse.forEach((station) => {
        if (station.lat && station.lng) {
          const airQualityInfo = getAirQualityInfo(station.khaiGrade)

          // 커스텀 마커 이미지 (색깔로 등급 표시)
          const svgString = `
            <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="${
                station.khaiGrade === 1
                  ? '#3B82F6'
                  : station.khaiGrade === 2
                    ? '#10B981'
                    : station.khaiGrade === 3
                      ? '#F59E0B'
                      : '#EF4444'
              }" opacity="0.8" stroke="white" stroke-width="2"/>
              <circle cx="20" cy="20" r="6" fill="white"/>
            </svg>
          `
          const markerImage = new kakao.maps.MarkerImage(
            'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString),
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
            // 인포윈도우 열기
            infowindow.open(map, marker)
            // 해당 측정소 선택 → 오른쪽 카드 업데이트
            setSelectedStation(station)
            // 지도 중심 이동
            setCurrentLocation({ lat: station.lat!, lng: station.lng! })
          })
        }
      })
    }

    // CCTV 마커
    if (showLayers.cctv) {
      mockCCTVData.forEach((cctv) => {
        const cctvSvgString = `
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#6366F1" opacity="0.9" stroke="white" stroke-width="2"/>
            <rect x="10" y="12" width="12" height="8" fill="white" rx="2"/>
            <polygon points="22,14 26,12 26,20 22,18" fill="white"/>
          </svg>
        `
        const markerImage = new kakao.maps.MarkerImage(
          'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(cctvSvgString),
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🌍 실시간 환경 안전 지도</h1>
              <p className="text-sm text-gray-600 mt-1">지금 당장 우리 동네는 안전한가요?</p>
            </div>

            {/* 레이어 토글 */}
            <div className="flex gap-2">
              <button
                onClick={() => setUseRealData(!useRealData)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  useRealData
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                }`}
                disabled={isLoadingRealData}
              >
                {isLoadingRealData ? '⏳ 로딩중...' : useRealData ? '✅ 실제 데이터' : '🔄 목업 데이터'}
              </button>
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

          {/* 검색창 */}
          {useRealData && (
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="위치 검색 (예: 강남구, 역삼동, 강남역, 코엑스...)"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSearchResults(e.target.value.length > 0)
                    }}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                    className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                </div>
              </div>

              {/* 검색 결과 (자동완성) */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-20">
                  {isLoadingRealData ? (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <div className="text-2xl mb-2">⏳</div>
                      <div className="font-medium text-gray-700">데이터 로딩 중...</div>
                      <div className="text-sm mt-1">잠시만 기다려주세요</div>
                    </div>
                  ) : realAirQualityData.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <div className="text-2xl mb-2">⚠️</div>
                      <div className="font-medium text-gray-700">데이터를 불러올 수 없습니다</div>
                      <div className="text-sm mt-1">
                        "✅ 실제 데이터" 버튼을 다시 클릭해보세요
                      </div>
                      <div className="text-xs mt-2 text-gray-400">
                        문제가 계속되면 브라우저 콘솔(F12)을 확인해주세요
                      </div>
                    </div>
                  ) : filteredStations.length > 0 ? (
                    filteredStations.map((station) => {
                      const airInfo = getAirQualityInfo(station.khaiGrade)
                      return (
                        <button
                          key={station.stationName}
                          onClick={() => handleSelectStation(station)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-gray-900">{station.stationName}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              PM10: {station.pm10Value}㎍/㎥ | PM2.5: {station.pm25Value}㎍/㎥
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{airInfo.emoji}</span>
                            <span className={`text-sm font-semibold ${airInfo.color}`}>{airInfo.label}</span>
                          </div>
                        </button>
                      )
                    })
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <div className="text-2xl mb-2">🔍</div>
                      <div className="font-medium text-gray-700">"{searchQuery}" 검색 결과가 없습니다</div>
                      <div className="text-sm mt-1">
                        구 이름, 동 이름, 지하철역, 랜드마크 등으로 검색해보세요
                      </div>
                      <div className="text-xs mt-2 text-gray-400">
                        예: 강남구, 역삼동, 강남역, 코엑스, 여의도, 홍대 등
                      </div>
                      <div className="text-xs mt-2 text-blue-600">
                        데이터 개수: {realAirQualityData.length}개 측정소
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
                level={8}
                onLoad={handleMapLoad}
                key={`${showLayers.airQuality}-${showLayers.cctv}-${useRealData}-${realAirQualityData.length}`}
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
            {selectedStation && useRealData ? (
              // 선택된 측정소 정보 표시
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedStation.stationName}</h3>
                  <p className="text-sm text-gray-600">{selectedStation.dataTime}</p>
                </div>

                {/* 대기질 등급 */}
                <div
                  className={`mb-6 p-6 rounded-xl border-2 ${
                    selectedStation.khaiGrade === 1
                      ? 'bg-blue-50 border-blue-300'
                      : selectedStation.khaiGrade === 2
                        ? 'bg-green-50 border-green-300'
                        : selectedStation.khaiGrade === 3
                          ? 'bg-orange-50 border-orange-300'
                          : 'bg-red-50 border-red-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">{selectedStation.khaiValue}</div>
                    <div
                      className={`text-lg font-semibold ${
                        selectedStation.khaiGrade === 1
                          ? 'text-blue-700'
                          : selectedStation.khaiGrade === 2
                            ? 'text-green-700'
                            : selectedStation.khaiGrade === 3
                              ? 'text-orange-700'
                              : 'text-red-700'
                      }`}
                    >
                      {getAirQualityInfo(selectedStation.khaiGrade).emoji}{' '}
                      {getAirQualityInfo(selectedStation.khaiGrade).label}
                    </div>
                  </div>
                </div>

                {/* 상세 정보 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">미세먼지 (PM10)</span>
                    <span className="text-lg font-bold text-gray-900">
                      {selectedStation.pm10Value} ㎍/㎥
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">초미세먼지 (PM2.5)</span>
                    <span className="text-lg font-bold text-gray-900">
                      {selectedStation.pm25Value} ㎍/㎥
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">오존 (O₃)</span>
                    <span className="text-lg font-bold text-gray-900">{selectedStation.o3Value} ppm</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStation(null)}
                  className="mt-6 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  ← 목록으로 돌아가기
                </button>
              </div>
            ) : locationSafety ? (
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
        {!useRealData && (
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
        )}

        {useRealData && (
          <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h4 className="font-semibold text-green-900 mb-1">실시간 데이터 사용 중</h4>
                <p className="text-sm text-green-800">
                  에어코리아 API를 통해 실시간 대기질 데이터를 표시하고 있습니다.
                </p>
                <ul className="text-sm text-green-800 mt-2 space-y-1 list-disc list-inside">
                  <li>✅ 에어코리아 API - 서울 주요 측정소 10곳</li>
                  <li>🔄 기상청 API - 준비 중</li>
                  <li>🔄 긴급재난문자 API - 준비 중</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
