'use client'

import { RegionRealEstateStats } from '@/types/realestate'
import { Card, Badge, Button } from '@/components/ui'
import { formatPrice, formatPriceChange, convertToPyeong } from '@/lib/api/realestateApi'

interface RealEstateCardProps {
  data: RegionRealEstateStats
}

export default function RealEstateCard({ data }: RealEstateCardProps) {
  const getTrendIcon = () => {
    if (data.trend === 'up') return '📈'
    if (data.trend === 'down') return '📉'
    return '➡️'
  }

  const getTrendColor = () => {
    if (data.trend === 'up') return 'text-red-600'
    if (data.trend === 'down') return 'text-blue-600'
    return 'text-gray-600'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-blue-500 to-green-500' // 매우 좋음
    if (score >= 60) return 'from-green-500 to-yellow-500' // 좋음
    if (score >= 40) return 'from-yellow-500 to-orange-500' // 보통
    return 'from-orange-500 to-red-500' // 비쌈
  }

  return (
    <Card variant="elevated" padding="lg" className="animate-slide-up">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-gray-900">🏠 {data.regionName.split(' ').pop()}</h3>
          {data.nationalRank && (
            <Badge variant="info" size="lg">
              전국 {data.nationalRank}위
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500">{data.regionName}</p>
      </div>

      {/* 데이터 기간 안내 */}
      <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 text-sm">ℹ️</span>
          <div className="text-xs text-blue-800">
            <div className="font-semibold mb-1">3-5개월 전 거래 데이터 기준</div>
            <div className="text-blue-600">
              총 {data.transactionCount}건 분석 • 정확한 정보를 위해 등록이 완료된 데이터만 표시합니다 (부동산 거래는 신고 후 1-3개월 지연 등록)
            </div>
          </div>
        </div>
      </div>

      {/* 종합 점수 */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="text-sm text-gray-600">부동산 종합 점수</div>
          <div className="group relative">
            <span className="text-gray-400 cursor-help text-sm">ℹ️</span>
            <div className="hidden group-hover:block absolute z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg -left-28 top-6">
              <div className="font-semibold mb-2">점수 계산 기준:</div>
              <ul className="space-y-1 text-left">
                <li>• <strong>가격 적정성</strong>: 전국 평균 대비 가격 (70%)</li>
                <li>• <strong>시장 유동성</strong>: 거래량 및 환금성 (30%)</li>
              </ul>
              <div className="mt-2 pt-2 border-t border-gray-700">
                점수가 높을수록 합리적인 투자 지역입니다
              </div>
            </div>
          </div>
        </div>
        <div
          className={`text-5xl font-bold bg-gradient-to-r ${getScoreColor(
            data.overallScore
          )} bg-clip-text text-transparent mb-1`}
        >
          {data.overallScore}
          <span className="text-3xl">/100</span>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {data.overallScore >= 80 && '매우 합리적인 가격'}
          {data.overallScore >= 60 && data.overallScore < 80 && '적정한 가격'}
          {data.overallScore >= 40 && data.overallScore < 60 && '다소 높은 가격'}
          {data.overallScore < 40 && '매우 높은 가격'}
        </div>

        {/* 점수 기준 설명 (항상 표시) */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span>💰 가격 적정성 ({data.priceScore}점)</span>
              <span className="text-gray-400">+</span>
              <span>📊 시장 유동성 ({data.liquidityScore}점)</span>
            </div>
            <div className="text-gray-500">
              = 종합 {data.overallScore}점 (가중평균)
            </div>
          </div>
        </div>
      </div>

      {/* 가격 정보 */}
      <div className="space-y-4 mb-6">
        <div className="p-4 bg-white rounded-xl border-2 border-blue-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">평균 매매가 (84㎡ 기준)</span>
            <span className={`text-sm font-bold ${getTrendColor()}`}>
              {getTrendIcon()} {formatPriceChange(data.priceChangePercent)}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatPrice(data.avgPrice)}</div>
          <div className="text-xs text-gray-500 mt-1">
            평당 {data.avgPricePerPyeong.toLocaleString()}만원
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">최저가</div>
            <div className="text-sm font-bold text-blue-600">
              {Math.floor(data.minPrice / 10000)}억
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">중앙값</div>
            <div className="text-sm font-bold text-purple-600">
              {Math.floor(data.medianPrice / 10000)}억
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">최고가</div>
            <div className="text-sm font-bold text-red-600">
              {Math.floor(data.maxPrice / 10000)}억
            </div>
          </div>
        </div>
      </div>

      {/* 세부 점수 */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-4">세부 분석</h4>

        {/* 가격 점수 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">💰 가격 적정성</span>
            <span className="text-sm font-bold text-gray-900">{data.priceScore}점</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${data.priceScore}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">
            점수가 높을수록 합리적인 가격입니다
          </div>
        </div>

        {/* 유동성 점수 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">📊 시장 유동성</span>
            <span className="text-sm font-bold text-gray-900">{data.liquidityScore}점</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${data.liquidityScore}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">
            최근 3개월 거래: {data.transactionCount}건
          </div>
        </div>
      </div>

      {/* 최근 거래 */}
      {data.recentTransactions.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">최근 실거래</h4>
          <div className="space-y-2">
            {data.recentTransactions.slice(0, 2).map((tx, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                <div className="font-medium text-gray-900 mb-1">{tx.aptNm}</div>
                <div className="flex justify-between items-start text-xs text-gray-600">
                  <div>
                    <div className="mb-0.5">
                      <span className="font-medium">전용</span> {tx.excluUseAr}㎡ ({convertToPyeong(parseFloat(tx.excluUseAr))}평)
                    </div>
                    <div className="text-gray-500">
                      <span className="font-medium">공급</span> {Math.round(parseFloat(tx.excluUseAr) * 1.3)}㎡ ({convertToPyeong(parseFloat(tx.excluUseAr) * 1.3)}평) · {tx.floor}층
                    </div>
                  </div>
                  <span className="font-bold text-blue-600 whitespace-nowrap">{tx.dealAmount}만원</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {tx.dealYear}.{tx.dealMonth}.{tx.dealDay} · {tx.umdNm}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
        <Button variant="primary" className="flex-1">
          상세 분석 보기
        </Button>
        <Button variant="outline" className="flex-1">
          주변 시세 비교
        </Button>
      </div>

      {/* 업데이트 정보 */}
      <div className="mt-4 text-center text-xs text-gray-400">
        마지막 업데이트: {new Date(data.lastUpdated).toLocaleDateString('ko-KR')}
      </div>
    </Card>
  )
}
