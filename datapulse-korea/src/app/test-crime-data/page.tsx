'use client'

import { useState } from 'react'
import { fetchRawCrimeData, analyzeCrimeDataStructure } from '@/lib/api/crimeDataApi'

export default function TestCrimeDataPage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      console.log('🔍 API 호출 중...')
      const result = await fetchRawCrimeData(1, 100)

      if (result && result.data) {
        const dataAnalysis = analyzeCrimeDataStructure(result.data)
        setAnalysis(dataAnalysis)
        console.log('📊 데이터 분석 결과:', dataAnalysis)
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
                <p><strong>현재 페이지 데이터:</strong> {data.currentCount}개</p>
              </div>
            </div>

            {/* 데이터 분석 결과 */}
            {analysis && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">🔍 데이터 구조 분석</h2>
                <div className="space-y-4">
                  {/* 연도 필드 */}
                  <div className="p-4 bg-blue-50 rounded border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">📅 연도 관련 필드 ({analysis.yearFields.length}개)</h3>
                    {analysis.yearFields.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analysis.yearFields.map((field: string) => (
                          <span key={field} className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-xs font-mono">
                            {field}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-blue-700">⚠️ 연도 필드를 찾을 수 없습니다</p>
                    )}
                  </div>

                  {/* 범죄 카테고리 필드 */}
                  <div className="p-4 bg-red-50 rounded border border-red-200">
                    <h3 className="font-semibold text-red-900 mb-2">🚨 범죄 카테고리 필드 ({analysis.categoryFields.length}개)</h3>
                    {analysis.categoryFields.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analysis.categoryFields.map((field: string) => (
                          <span key={field} className="px-3 py-1 bg-red-200 text-red-900 rounded-full text-xs font-mono">
                            {field}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-red-700">카테고리 필드 없음</p>
                    )}
                  </div>

                  {/* 지역 필드 */}
                  <div className="p-4 bg-green-50 rounded border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">📍 지역 필드 ({analysis.regionFields.length}개)</h3>
                    {analysis.regionFields.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analysis.regionFields.map((field: string) => (
                          <span key={field} className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-xs font-mono">
                            {field}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-green-700">지역 필드 없음</p>
                    )}
                  </div>

                  {/* 전체 컬럼 */}
                  <div className="p-4 bg-gray-50 rounded border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">📋 전체 컬럼 ({analysis.columns.length}개)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {analysis.columns.map((col: string) => (
                        <span key={col} className="font-mono text-gray-700">{col}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 컬럼 정보 (기존) */}
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
