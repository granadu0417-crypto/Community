'use client'

import { useState } from 'react'

export default function TestCrimeDataPage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const API_KEY = process.env.NEXT_PUBLIC_DATA_API_KEY
      const url = `https://api.odcloud.kr/api/3074462/v1/uddi:161740bd-8ec5-4734-9a3d-f7a2cde34942?serviceKey=${API_KEY}&page=1&perPage=100`

      console.log('🔍 API 호출 중...')
      const response = await fetch(url)
      const result = await response.json()

      console.log('📊 전체 응답:', result)
      console.log('📊 총 데이터 개수:', result.totalCount)

      if (result.data && result.data.length > 0) {
        console.log('📊 첫 번째 데이터:', result.data[0])
        console.log('📊 데이터 컬럼:', Object.keys(result.data[0]))

        // 연도 정보가 있는지 확인
        const firstItem = result.data[0]
        const yearFields = Object.keys(firstItem).filter(key =>
          key.includes('년') || key.includes('year') || key.includes('Year')
        )
        console.log('📅 연도 관련 필드:', yearFields)
      }

      setData(result)
    } catch (err) {
      console.error('❌ 에러:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 범죄 데이터 구조 확인</h1>

        <button
          onClick={fetchData}
          disabled={loading}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? '데이터 불러오는 중...' : 'API 데이터 확인'}
        </button>

        {data && (
          <div className="space-y-6">
            {/* 메타 정보 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">📊 메타 정보</h2>
              <div className="space-y-2 text-sm">
                <p><strong>총 데이터 개수:</strong> {data.totalCount}개</p>
                <p><strong>현재 페이지:</strong> {data.page}</p>
                <p><strong>페이지당 개수:</strong> {data.perPage}</p>
              </div>
            </div>

            {/* 컬럼 정보 */}
            {data.data && data.data.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">📋 데이터 컬럼 ({Object.keys(data.data[0]).length}개)</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {Object.keys(data.data[0]).map((key) => (
                    <div key={key} className="p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="font-mono text-xs">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 샘플 데이터 */}
            {data.data && data.data.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">📄 샘플 데이터 (처음 3개)</h2>
                <div className="space-y-4">
                  {data.data.slice(0, 3).map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded border border-gray-200">
                      <h3 className="font-semibold mb-2">데이터 #{idx + 1}</h3>
                      <pre className="text-xs overflow-auto max-h-96 bg-white p-3 rounded border">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 전체 원본 데이터 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">🗂️ 전체 원본 데이터</h2>
              <pre className="text-xs overflow-auto max-h-96 bg-gray-900 text-green-400 p-4 rounded">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="font-semibold mb-2">💡 확인 사항</p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>데이터에 연도 정보가 있는가?</li>
            <li>여러 연도의 데이터가 포함되어 있는가?</li>
            <li>각 범죄 유형별로 연도가 구분되어 있는가?</li>
            <li>최신 데이터는 몇 년도인가?</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
