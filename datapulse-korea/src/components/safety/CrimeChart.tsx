'use client'

import { CrimeStats } from '@/types/safety'

interface CrimeChartProps {
  crimes: CrimeStats
}

export default function CrimeChart({ crimes }: CrimeChartProps) {
  const crimeData = [
    { name: '살인', count: crimes.murder, color: 'bg-red-500', maxThreshold: 10 },
    { name: '강도', count: crimes.robbery, color: 'bg-orange-500', maxThreshold: 20 },
    { name: '성폭력', count: crimes.sexualAssault, color: 'bg-pink-500', maxThreshold: 50 },
    { name: '폭력', count: crimes.violence, color: 'bg-purple-500', maxThreshold: 300 },
    { name: '절도', count: crimes.theft, color: 'bg-yellow-500', maxThreshold: 200 },
  ]

  // 최대값 계산 (차트 스케일용)
  const maxCount = Math.max(...crimeData.map(d => d.count), 1)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 범죄 유형별 분포</h3>
      <div className="space-y-4">
        {crimeData.map((crime) => {
          const percentage = (crime.count / maxCount) * 100
          const relativeLevel = (crime.count / crime.maxThreshold) * 100

          return (
            <div key={crime.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{crime.name}</span>
                <span className="text-sm font-bold text-gray-900">{crime.count}건</span>
              </div>
              <div className="relative w-full h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${crime.color} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                  style={{ width: `${Math.max(percentage, 2)}%` }}
                >
                  {percentage > 15 && (
                    <span className="text-xs font-semibold text-white">{crime.count}</span>
                  )}
                </div>
              </div>
              {/* 위험도 표시 */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">
                  위험도: {relativeLevel > 100 ? '매우 높음' : relativeLevel > 70 ? '높음' : relativeLevel > 40 ? '보통' : '낮음'}
                </span>
                <span className="text-xs text-gray-400">
                  기준: {crime.maxThreshold}건
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* 총계 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">총 범죄 발생</span>
          <span className="text-xl font-bold text-gray-900">
            {Object.values(crimes).reduce((sum, count) => sum + count, 0)}건
          </span>
        </div>
      </div>

      {/* 설명 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">💡 해석 방법:</span> 막대 길이는 다른 범죄 유형과의 상대적 비율을 나타냅니다.
          위험도는 각 범죄 유형별 안전 기준값 대비 수치입니다.
        </p>
      </div>
    </div>
  )
}
