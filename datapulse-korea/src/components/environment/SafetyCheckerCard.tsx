'use client'

import type { LocationSafety } from '@/types/environment'
import { getAirQualityInfo, getSafetyLevelInfo } from '@/lib/data/mockEnvironmentData'

interface SafetyCheckerCardProps {
  data: LocationSafety
}

export default function SafetyCheckerCard({ data }: SafetyCheckerCardProps) {
  const { location, airQuality, weatherWarnings, recentDisasters, nearbyInfrastructure, safetyScore } = data
  const safetyLevelInfo = getSafetyLevelInfo(safetyScore.level)
  const airQualityInfo = airQuality ? getAirQualityInfo(airQuality.khaiGrade) : null

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">📍 {location.name}</h2>
          <span className="text-sm text-gray-500">
            {new Date(data.lastUpdated).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            업데이트
          </span>
        </div>
        <p className="text-sm text-gray-600">지금 당장 안전 체크</p>
      </div>

      {/* 종합 안전 점수 */}
      <div className={`mb-6 p-6 rounded-xl border-2 ${safetyLevelInfo.bgColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">종합 안전도</div>
            <div className="flex items-center gap-2">
              <span className="text-5xl font-bold text-gray-900">{safetyScore.overall}</span>
              <span className="text-2xl text-gray-500">/100</span>
            </div>
            <div className={`text-lg font-semibold mt-1 ${safetyLevelInfo.color}`}>
              {safetyLevelInfo.icon} {safetyScore.level}
            </div>
          </div>
          <div className="text-6xl">{safetyLevelInfo.icon}</div>
        </div>

        {/* 추천 메시지 */}
        <div className="p-3 bg-white/80 rounded-lg">
          <p className="text-sm font-medium text-gray-700">💡 {safetyScore.recommendation}</p>
        </div>
      </div>

      {/* 대기질 정보 */}
      {airQuality && airQualityInfo && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🌫️ 대기질</h3>
          <div className={`p-4 rounded-lg border-2 ${airQualityInfo.bgColor}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-gray-600">통합대기환경지수</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-3xl font-bold ${airQualityInfo.color}`}>{airQuality.khaiValue}</span>
                  <span className={`text-lg font-semibold ${airQualityInfo.color}`}>
                    {airQualityInfo.emoji} {airQualityInfo.label}
                  </span>
                </div>
              </div>
            </div>

            {/* 상세 수치 */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-white/80 rounded-lg">
                <div className="text-xs text-gray-600">미세먼지(PM10)</div>
                <div className="text-lg font-bold text-gray-900">{airQuality.pm10Value}㎍/㎥</div>
                <div className={`text-xs font-semibold ${getAirQualityInfo(airQuality.pm10Grade).color}`}>
                  {getAirQualityInfo(airQuality.pm10Grade).label}
                </div>
              </div>
              <div className="p-3 bg-white/80 rounded-lg">
                <div className="text-xs text-gray-600">초미세먼지(PM2.5)</div>
                <div className="text-lg font-bold text-gray-900">{airQuality.pm25Value}㎍/㎥</div>
                <div className={`text-xs font-semibold ${getAirQualityInfo(airQuality.pm25Grade).color}`}>
                  {getAirQualityInfo(airQuality.pm25Grade).label}
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              측정소: {airQuality.stationName} | {new Date(airQuality.dataTime).toLocaleString('ko-KR')}
            </div>
          </div>
        </div>
      )}

      {/* 기상특보 */}
      {weatherWarnings.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">⛈️ 기상특보</h3>
          <div className="space-y-2">
            {weatherWarnings.map((warning) => (
              <div key={warning.id} className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600 font-bold">{warning.warningType}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        warning.level === '경보' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                      }`}
                    >
                      {warning.level}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">
                    {new Date(warning.issueTime).toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{warning.content}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">⛈️ 기상특보</h3>
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-700 font-medium">✅ 현재 발효 중인 기상특보가 없습니다</p>
          </div>
        </div>
      )}

      {/* 긴급재난 */}
      {recentDisasters.length > 0 ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🚨 최근 24시간 긴급재난</h3>
          <div className="space-y-2">
            {recentDisasters.map((disaster) => (
              <div key={disaster.id} className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-600 font-bold">{disaster.msgType}</span>
                  <span className="text-xs text-gray-600">
                    {new Date(disaster.createDate).toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{disaster.content}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🚨 최근 24시간 긴급재난</h3>
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-700 font-medium">✅ 최근 24시간 긴급재난문자가 없습니다</p>
          </div>
        </div>
      )}

      {/* 안전 인프라 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📹 주변 안전 인프라</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
            <div className="text-3xl mb-2">📹</div>
            <div className="text-2xl font-bold text-blue-600">{nearbyInfrastructure.cctv}대</div>
            <div className="text-xs text-gray-600 mt-1">방범 CCTV</div>
            <div className="text-xs text-gray-500">반경 1km 내</div>
          </div>
          <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg text-center">
            <div className="text-3xl mb-2">💡</div>
            <div className="text-2xl font-bold text-yellow-600">{nearbyInfrastructure.securityLights}개</div>
            <div className="text-xs text-gray-600 mt-1">보안등</div>
            <div className="text-xs text-gray-500">반경 1km 내</div>
          </div>
        </div>
      </div>

      {/* 세부 점수 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 세부 점수</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">대기질</span>
              <span className="font-semibold text-gray-900">{safetyScore.airQuality}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${safetyScore.airQuality}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">기상 안전</span>
              <span className="font-semibold text-gray-900">{safetyScore.weather}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${safetyScore.weather}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">안전 인프라</span>
              <span className="font-semibold text-gray-900">{safetyScore.infrastructure}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${safetyScore.infrastructure}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">재난 안전</span>
              <span className="font-semibold text-gray-900">{safetyScore.disaster}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${safetyScore.disaster}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
