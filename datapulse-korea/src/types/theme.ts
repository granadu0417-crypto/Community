/**
 * 테마 시스템 타입 정의
 *
 * DataPulse Korea의 12개 테마를 관리
 */

export type ThemeType =
  | 'realestate'   // 부동산
  | 'safety'       // 안전
  | 'environment'  // 환경
  | 'education'    // 교육
  | 'healthcare'   // 의료
  | 'transport'    // 교통
  | 'culture'      // 문화
  | 'population'   // 인구
  | 'budget'       // 예산
  | 'officials'    // 공직자
  | 'tax'          // 세금
  | 'assembly'     // 국회

export interface Theme {
  id: ThemeType
  icon: string
  label: string
  color: string
  bgColor: string
  description: string
  status: 'active' | 'coming-soon' | 'planned'
}

export const THEMES: Theme[] = [
  {
    id: 'realestate',
    icon: '🏠',
    label: '부동산',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '아파트 실거래가, 전월세, 가격 적정성',
    status: 'active',
  },
  {
    id: 'safety',
    icon: '🚨',
    label: '안전',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: '범죄율, 치안, CCTV 밀집도',
    status: 'coming-soon',
  },
  {
    id: 'environment',
    icon: '🌳',
    label: '환경',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: '미세먼지, 공원, 녹지율',
    status: 'coming-soon',
  },
  {
    id: 'education',
    icon: '📚',
    label: '교육',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    description: '학군, 학교 정보, 학원가',
    status: 'coming-soon',
  },
  {
    id: 'healthcare',
    icon: '🏥',
    label: '의료',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    description: '병원 접근성, 의료시설',
    status: 'coming-soon',
  },
  {
    id: 'transport',
    icon: '🚗',
    label: '교통',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: '대중교통, 지하철 접근성',
    status: 'coming-soon',
  },
  {
    id: 'culture',
    icon: '🎭',
    label: '문화',
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    description: '문화시설, 공연장, 전시관',
    status: 'coming-soon',
  },
  {
    id: 'population',
    icon: '📊',
    label: '인구',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    description: '인구 통계, 연령대, 유동인구',
    status: 'coming-soon',
  },
  {
    id: 'officials',
    icon: '💼',
    label: '공직자',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: '공직자 재산, 이해충돌',
    status: 'planned',
  },
  {
    id: 'tax',
    icon: '💰',
    label: '세금',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: '세금 집행 내역, 투명성',
    status: 'planned',
  },
  {
    id: 'assembly',
    icon: '🗳️',
    label: '국회',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    description: '국회의원 활동, 법안 발의',
    status: 'planned',
  },
  {
    id: 'budget',
    icon: '📈',
    label: '예산',
    color: 'text-lime-600',
    bgColor: 'bg-lime-100',
    description: '지역 예산 배정, 집행률',
    status: 'planned',
  },
]

export function getThemeById(id: ThemeType): Theme | undefined {
  return THEMES.find(theme => theme.id === id)
}

export function getActiveThemes(): Theme[] {
  return THEMES.filter(theme => theme.status === 'active')
}

export function getComingSoonThemes(): Theme[] {
  return THEMES.filter(theme => theme.status === 'coming-soon')
}
