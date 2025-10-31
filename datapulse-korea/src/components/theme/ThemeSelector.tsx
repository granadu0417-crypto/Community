'use client'

import { THEMES, Theme, ThemeType } from '@/types/theme'

interface ThemeSelectorProps {
  selectedTheme: ThemeType
  onThemeChange: (theme: ThemeType) => void
  regionName?: string
}

export default function ThemeSelector({ selectedTheme, onThemeChange, regionName }: ThemeSelectorProps) {
  return (
    <div className="mb-8">
      {/* 헤더 */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {regionName ? `${regionName} 종합 분석` : '지역 데이터 분석'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          관심있는 테마를 선택하세요
        </p>
      </div>

      {/* 테마 그리드 */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => {
              if (theme.status === 'active') {
                onThemeChange(theme.id)
              }
            }}
            disabled={theme.status !== 'active'}
            className={`
              relative p-3 rounded-xl border-2 transition-all duration-200
              ${
                selectedTheme === theme.id
                  ? `${theme.bgColor} border-current ${theme.color} shadow-lg scale-105`
                  : theme.status === 'active'
                  ? 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'
              }
            `}
          >
            {/* 아이콘 */}
            <div className="text-2xl mb-1">{theme.icon}</div>

            {/* 라벨 */}
            <div className="text-xs font-semibold truncate">
              {theme.label}
            </div>

            {/* 상태 배지 */}
            {theme.status !== 'active' && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                Soon
              </div>
            )}
          </button>
        ))}
      </div>

      {/* 선택된 테마 설명 */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            {THEMES.find(t => t.id === selectedTheme)?.icon}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {THEMES.find(t => t.id === selectedTheme)?.label}
            </div>
            <div className="text-sm text-gray-600">
              {THEMES.find(t => t.id === selectedTheme)?.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
