'use client'

import { Card, Badge } from '@/components/ui'

interface AreaScore {
  category: string
  score: number
  color: string
}

interface AreaScoreCardProps {
  areaName: string
  address: string
  totalScore: number
  rank?: number
  scores: AreaScore[]
}

/**
 * 지역 점수 카드 컴포넌트
 *
 * 선택한 지역의 종합 점수와 카테고리별 점수를 표시합니다.
 *
 * @example
 * ```tsx
 * <AreaScoreCard
 *   areaName="서울시 강남구"
 *   address="서울특별시 강남구"
 *   totalScore={87}
 *   rank={12}
 *   scores={[
 *     { category: '주거환경', score: 85, color: 'bg-blue-500' },
 *     { category: '안전도', score: 92, color: 'bg-green-500' },
 *   ]}
 * />
 * ```
 */
export default function AreaScoreCard({
  areaName,
  address,
  totalScore,
  rank,
  scores,
}: AreaScoreCardProps) {
  return (
    <Card variant="elevated" padding="lg" className="animate-slide-up">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-gray-900">{areaName}</h3>
          {rank && (
            <Badge variant="info" size="lg">
              전국 상위 {rank}%
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500">{address}</p>
      </div>

      {/* 종합 점수 */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl text-center">
        <div className="text-sm text-gray-600 mb-2">종합 점수</div>
        <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
          {totalScore}
          <span className="text-3xl">/100</span>
        </div>
        <div className="flex justify-center gap-1 mt-4">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded-full ${
                idx < Math.floor(totalScore / 20)
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 카테고리별 점수 */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 mb-4">세부 점수</h4>
        {scores.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{item.category}</span>
              <span className="text-sm font-bold text-gray-900">{item.score}점</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 액션 버튼 */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          상세 분석 보기
        </button>
        <button className="flex-1 px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium">
          주변 지역 비교
        </button>
      </div>
    </Card>
  )
}
