'use client'

import { SafetyStats } from '@/types/safety'
import { getSafetyLevel, getSafetyColor } from '@/lib/api/safetyApi'

interface SafetyCardProps {
  data: SafetyStats
}

export default function SafetyCard({ data }: SafetyCardProps) {
  const safetyLevel = getSafetyLevel(data.safetyScore)
  const safetyColor = getSafetyColor(data.safetyScore)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* 헤더 */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{data.regionName}</h2>
        <p className="text-sm text-gray-500 mt-1">범죄 통계 기반 안전도 분석</p>
      </div>

      {/* 종합 안전 점수 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">종합 안전 점수</div>
            <div className={`text-4xl font-bold ${safetyColor}`}>{data.safetyScore}점</div>
            <div className={`text-sm font-semibold mt-1 ${safetyColor}`}>{safetyLevel}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">총 범죄 발생</div>
            <div className="text-2xl font-bold text-gray-900">{data.totalCrimes}건</div>
          </div>
        </div>
      </div>

      {/* 전국 평균 비교 */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">전국 평균 대비</span>
          <span
            className={`font-semibold ${
              data.comparisonToNational < 0 ? 'text-green-600' : 'text-orange-600'
            }`}
          >
            {data.comparisonToNational > 0 ? '+' : ''}
            {data.comparisonToNational}%
            {data.comparisonToNational < 0 ? ' 더 안전' : ' 더 위험'}
          </span>
        </div>
      </div>

      {/* 범죄 유형별 상세 통계 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">범죄 유형별 발생 건수</h3>
        <div className="space-y-3">
          {/* 살인 */}
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-2">
              <span className="text-red-600">🔴</span>
              <div>
                <div className="font-medium text-gray-900">살인</div>
                <div className="text-xs text-gray-500">살인기수 + 살인미수</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{data.crimes.murder}건</div>
              <div className="text-xs text-gray-500">안전도: {data.murderScore}점</div>
            </div>
          </div>

          {/* 강도 */}
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-center gap-2">
              <span className="text-orange-600">🟠</span>
              <div>
                <div className="font-medium text-gray-900">강도</div>
                <div className="text-xs text-gray-500">강도 범죄</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{data.crimes.robbery}건</div>
              <div className="text-xs text-gray-500">안전도: {data.robberyScore}점</div>
            </div>
          </div>

          {/* 성폭력 */}
          <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-100">
            <div className="flex items-center gap-2">
              <span className="text-pink-600">🔴</span>
              <div>
                <div className="font-medium text-gray-900">성폭력</div>
                <div className="text-xs text-gray-500">강간 + 유사강간</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{data.crimes.sexualAssault}건</div>
              <div className="text-xs text-gray-500">안전도: {data.sexualAssaultScore}점</div>
            </div>
          </div>

          {/* 절도 */}
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">🟡</span>
              <div>
                <div className="font-medium text-gray-900">절도</div>
                <div className="text-xs text-gray-500">절도 범죄</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{data.crimes.theft}건</div>
              <div className="text-xs text-gray-500">안전도: {data.theftScore}점</div>
            </div>
          </div>

          {/* 폭력 */}
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2">
              <span className="text-purple-600">🟣</span>
              <div>
                <div className="font-medium text-gray-900">폭력</div>
                <div className="text-xs text-gray-500">폭력 범죄</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{data.crimes.violence}건</div>
              <div className="text-xs text-gray-500">안전도: {data.violenceScore}점</div>
            </div>
          </div>
        </div>
      </div>

      {/* 안전 점수 산출 방식 설명 */}
      <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 text-sm">ℹ️</span>
          <div className="text-xs text-blue-800">
            <div className="font-semibold mb-1">안전 점수 산출 방식</div>
            <div className="text-blue-600">
              범죄 유형별 가중치를 적용하여 계산합니다 (살인×10, 강도×5, 성폭력×4, 폭력×2, 절도×1)
              <br />
              점수가 높을수록 안전한 지역입니다 (0-100점)
            </div>
          </div>
        </div>
      </div>

      {/* 안전 추세 */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">안전 추세</span>
          <span
            className={`font-semibold ${
              data.trend === 'safer'
                ? 'text-green-600'
                : data.trend === 'dangerous'
                  ? 'text-red-600'
                  : 'text-gray-600'
            }`}
          >
            {data.trend === 'safer' ? '✅ 안전 개선' : data.trend === 'dangerous' ? '⚠️ 주의 필요' : '📊 유사'}
          </span>
        </div>
      </div>

      {/* 마지막 업데이트 */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        데이터 기준: {new Date(data.lastUpdated).toLocaleDateString('ko-KR')}
      </div>
    </div>
  )
}
