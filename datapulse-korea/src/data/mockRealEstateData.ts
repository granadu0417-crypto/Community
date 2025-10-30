/**
 * 부동산 목업 데이터
 * 실제 API가 활성화되면 이 데이터를 실제 API 호출로 교체
 */

import { RegionRealEstateStats } from '@/types/realestate'

// 서울 주요 지역 부동산 데이터
export const mockRealEstateData: Record<string, RegionRealEstateStats> = {
  // 강남구
  gangnam: {
    regionCode: '11680',
    regionName: '서울특별시 강남구',
    lat: 37.4979,
    lng: 127.0276,
    avgPrice: 185000,
    medianPrice: 170000,
    minPrice: 95000,
    maxPrice: 350000,
    avgPricePerPyeong: 6100,
    transactionCount: 342,
    priceChangePercent: 2.3,
    trend: 'up',
    priceScore: 25, // 매우 비쌈
    liquidityScore: 92, // 거래 활발
    overallScore: 58,
    nationalRank: 3,
    recentTransactions: [
      {
        aptNm: '래미안대치팰리스',
        dealAmount: '235,000',
        buildYear: '2018',
        dealYear: '2024',
        dealMonth: '10',
        dealDay: '15',
        excluUseAr: '84.95',
        floor: '12',
        jibun: '942',
        umdNm: '대치동',
      },
      {
        aptNm: '아크로리버뷰',
        dealAmount: '198,000',
        buildYear: '2020',
        dealYear: '2024',
        dealMonth: '10',
        dealDay: '12',
        excluUseAr: '59.98',
        floor: '18',
        jibun: '678',
        umdNm: '논현동',
      },
    ],
    lastUpdated: new Date().toISOString(),
  },

  // 서초구
  seocho: {
    regionCode: '11650',
    regionName: '서울특별시 서초구',
    lat: 37.4837,
    lng: 127.0324,
    avgPrice: 172000,
    medianPrice: 165000,
    minPrice: 88000,
    maxPrice: 320000,
    avgPricePerPyeong: 5680,
    transactionCount: 298,
    priceChangePercent: 1.8,
    trend: 'up',
    priceScore: 28,
    liquidityScore: 88,
    overallScore: 60,
    nationalRank: 5,
    recentTransactions: [
      {
        aptNm: '반포자이',
        dealAmount: '215,000',
        buildYear: '2016',
        dealYear: '2024',
        dealMonth: '10',
        dealDay: '18',
        excluUseAr: '84.91',
        floor: '15',
        jibun: '1234',
        umdNm: '반포동',
      },
    ],
    lastUpdated: new Date().toISOString(),
  },

  // 송파구
  songpa: {
    regionCode: '11710',
    regionName: '서울특별시 송파구',
    lat: 37.5145,
    lng: 127.1059,
    avgPrice: 145000,
    medianPrice: 138000,
    minPrice: 72000,
    maxPrice: 280000,
    avgPricePerPyeong: 4780,
    transactionCount: 445,
    priceChangePercent: 1.2,
    trend: 'up',
    priceScore: 42,
    liquidityScore: 95,
    overallScore: 68,
    nationalRank: 8,
    recentTransactions: [
      {
        aptNm: '헬리오시티',
        dealAmount: '158,000',
        buildYear: '2019',
        dealYear: '2024',
        dealMonth: '10',
        dealDay: '20',
        excluUseAr: '84.97',
        floor: '25',
        jibun: '289',
        umdNm: '송파동',
      },
    ],
    lastUpdated: new Date().toISOString(),
  },

  // 용산구
  yongsan: {
    regionCode: '11170',
    regionName: '서울특별시 용산구',
    lat: 37.5311,
    lng: 126.9810,
    avgPrice: 168000,
    medianPrice: 160000,
    minPrice: 82000,
    maxPrice: 310000,
    avgPricePerPyeong: 5540,
    transactionCount: 256,
    priceChangePercent: 3.1,
    trend: 'up',
    priceScore: 30,
    liquidityScore: 82,
    overallScore: 56,
    nationalRank: 6,
    recentTransactions: [
      {
        aptNm: '한강자이',
        dealAmount: '205,000',
        buildYear: '2017',
        dealYear: '2024',
        dealMonth: '10',
        dealDay: '10',
        excluUseAr: '84.93',
        floor: '20',
        jibun: '567',
        umdNm: '한강로동',
      },
    ],
    lastUpdated: new Date().toISOString(),
  },

  // 마포구
  mapo: {
    regionCode: '11440',
    regionName: '서울특별시 마포구',
    lat: 37.5663,
    lng: 126.9019,
    avgPrice: 128000,
    medianPrice: 122000,
    minPrice: 65000,
    maxPrice: 245000,
    avgPricePerPyeong: 4220,
    transactionCount: 387,
    priceChangePercent: 0.8,
    trend: 'stable',
    priceScore: 52,
    liquidityScore: 91,
    overallScore: 72,
    nationalRank: 12,
    recentTransactions: [
      {
        aptNm: '마포래미안푸르지오',
        dealAmount: '142,000',
        buildYear: '2015',
        dealYear: '2024',
        dealMonth: '10',
        dealDay: '08',
        excluUseAr: '84.88',
        floor: '14',
        jibun: '789',
        umdNm: '공덕동',
      },
    ],
    lastUpdated: new Date().toISOString(),
  },

  // 강동구 (상대적으로 저렴)
  gangdong: {
    regionCode: '11740',
    regionName: '서울특별시 강동구',
    lat: 37.5301,
    lng: 127.1238,
    avgPrice: 95000,
    medianPrice: 91000,
    minPrice: 52000,
    maxPrice: 165000,
    avgPricePerPyeong: 3130,
    transactionCount: 412,
    priceChangePercent: -0.3,
    trend: 'stable',
    priceScore: 72,
    liquidityScore: 93,
    overallScore: 82,
    nationalRank: 25,
    recentTransactions: [
      {
        aptNm: '고덕아르테온',
        dealAmount: '102,000',
        buildYear: '2019',
        dealYear: '2024',
        dealMonth: '10',
        dealDay: '22',
        excluUseAr: '84.96',
        floor: '10',
        jibun: '456',
        umdNm: '고덕동',
      },
    ],
    lastUpdated: new Date().toISOString(),
  },

  // 노원구 (저렴)
  nowon: {
    regionCode: '11350',
    regionName: '서울특별시 노원구',
    lat: 37.6542,
    lng: 127.0568,
    avgPrice: 82000,
    medianPrice: 78000,
    minPrice: 45000,
    maxPrice: 142000,
    avgPricePerPyeong: 2700,
    transactionCount: 523,
    priceChangePercent: 0.2,
    trend: 'stable',
    priceScore: 82,
    liquidityScore: 97,
    overallScore: 89,
    nationalRank: 38,
    recentTransactions: [
      {
        aptNm: '상계주공',
        dealAmount: '75,000',
        buildYear: '1995',
        dealYear: '2024',
        dealMonth: '10',
        dealDay: '25',
        excluUseAr: '84.90',
        floor: '8',
        jibun: '234',
        umdNm: '상계동',
      },
    ],
    lastUpdated: new Date().toISOString(),
  },
}

// 지역명으로 데이터 가져오기 헬퍼 함수
export function getMockDataByRegionName(regionName: string): RegionRealEstateStats | null {
  // 지역명 일치 검색
  const entry = Object.entries(mockRealEstateData).find(([_, data]) =>
    data.regionName.includes(regionName) || regionName.includes(data.regionName.split(' ')[1])
  )
  return entry ? entry[1] : null
}

// 좌표로 가장 가까운 지역 찾기
export function getMockDataByCoordinates(lat: number, lng: number): RegionRealEstateStats | null {
  let closestRegion: RegionRealEstateStats | null = null
  let minDistance = Infinity

  Object.values(mockRealEstateData).forEach((region) => {
    const distance = Math.sqrt(
      Math.pow(region.lat - lat, 2) + Math.pow(region.lng - lng, 2)
    )
    if (distance < minDistance) {
      minDistance = distance
      closestRegion = region
    }
  })

  return closestRegion
}
