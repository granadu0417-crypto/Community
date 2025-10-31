'use client'

import { useState } from 'react'
import { getSafetyByRegion } from '@/lib/api/safetyApi'
import { SafetyStats } from '@/types/safety'
import SafetyCard from '@/components/safety/SafetyCard'

export default function TestSafetyPage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SafetyStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState('강남구')

  const regions = [
    '종로구',
    '중구',
    '용산구',
    '성동구',
    '광진구',
    '동대문구',
    '중랑구',
    '성북구',
    '강북구',
    '도봉구',
    '노원구',
    '은평구',
    '서대문구',
    '마포구',
    '양천구',
    '강서구',
    '구로구',
    '금천구',
    '영등포구',
    '동작구',
    '관악구',
    '서초구',
    '강남구',
    '송파구',
    '강동구',
  ]

  const fetchSafetyData = async () => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      console.log(`🔍 안전 데이터 조회 시작: ${selectedRegion}`)
      const result = await getSafetyByRegion(selectedRegion)

      if (result.success && result.data) {
        console.log('✅ 안전 데이터 조회 성공:', result.data)
        setData(result.data)
      } else {
        throw new Error(result.error || '데이터 조회 실패')
      }
    } catch (err) {
      console.error('❌ 에러 발생:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🛡️ 안전 테마 API 테스트</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API 정보</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>데이터 출처:</strong> 경찰청 범죄 발생 지역별 통계
            </p>
            <p>
              <strong>API:</strong> api.odcloud.kr
            </p>
            <p>
              <strong>범죄 유형:</strong> 살인, 강도, 성폭력, 절도, 폭력 (강력범죄 중심)
            </p>
            <p className="text-blue-600 italic text-xs mt-2">
              💡 안전 점수는 범죄 유형별 가중치를 적용하여 계산됩니다 (0-100점, 높을수록 안전)
            </p>
          </div>
        </div>

        {/* 지역 선택 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">지역 선택</h2>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                서울특별시 {region}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchSafetyData}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
        >
          {loading ? '데이터 불러오는 중...' : '안전 데이터 조회'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">❌ 오류 발생</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {data && (
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="text-green-800 font-semibold">✅ API 호출 성공!</h3>
            </div>
            <SafetyCard data={data} />
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">💡 개발자 도구 확인</h3>
          <p className="text-sm text-gray-700">
            F12 → Console 탭에서 상세한 로그를 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
