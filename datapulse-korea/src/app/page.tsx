'use client'

import { useState } from 'react'
import { Button, Card, Container, Badge } from '@/components/ui'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    { label: '데이터 소스', value: '12+' },
    { label: '공공 API', value: '20+' },
    { label: '지역 커버리지', value: '100%' },
    { label: '실시간 업데이트', value: '24/7' },
  ]

  const features = [
    {
      icon: '🏠',
      title: '생활 인텔리전스',
      desc: '부동산, 안전, 환경, 교통 정보를 지도 기반으로 통합 제공',
    },
    {
      icon: '💼',
      title: '권력 투명성',
      desc: '공직자 자산, 국회의원 활동, 세금 집행 내역을 실시간 추적',
    },
    {
      icon: '📊',
      title: '스마트 비교',
      desc: '지역간 비교, 시뮬레이터, 랭킹으로 데이터를 쉽게 이해',
    },
  ]

  const themes = [
    { icon: '🏠', label: '부동산', color: 'bg-blue-100 text-blue-600' },
    { icon: '🚨', label: '안전', color: 'bg-red-100 text-red-600' },
    { icon: '🌳', label: '환경', color: 'bg-green-100 text-green-600' },
    { icon: '💼', label: '공직자', color: 'bg-purple-100 text-purple-600' },
    { icon: '💰', label: '세금', color: 'bg-yellow-100 text-yellow-600' },
    { icon: '🗳️', label: '국회', color: 'bg-indigo-100 text-indigo-600' },
    { icon: '📚', label: '교육', color: 'bg-pink-100 text-pink-600' },
    { icon: '🏥', label: '의료', color: 'bg-cyan-100 text-cyan-600' },
    { icon: '🚗', label: '교통', color: 'bg-orange-100 text-orange-600' },
    { icon: '🎭', label: '문화', color: 'bg-rose-100 text-rose-600' },
    { icon: '📊', label: '인구', color: 'bg-teal-100 text-teal-600' },
    { icon: '📈', label: '예산', color: 'bg-lime-100 text-lime-600' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <Container>
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DataPulse Korea
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">홈</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">지역 분석</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">권력 투명성</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">정보</a>
            </nav>
            <Button variant="primary" size="md">
              로그인
            </Button>
          </div>
        </Container>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <Container className="text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            대한민국의 모든 공공데이터,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              한눈에
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in">
            복잡한 공공데이터를 쉽고 재미있게 탐색하세요.
            <br />
            부동산부터 권력 투명성까지, 모든 정보를 시각화합니다.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16 animate-slide-up">
            <div className="relative">
              <input
                type="text"
                placeholder="주소나 지역을 검색하세요 (예: 서울시 강남구)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-32 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition shadow-lg"
              />
              <Button
                variant="primary"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                검색
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20">
            {stats.map((stat, idx) => (
              <Card
                key={idx}
                variant="elevated"
                hover
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` } as React.CSSProperties}
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <Container>
          <h3 className="text-4xl font-bold text-center mb-16">
            주요 기능
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                variant="gradient"
                padding="lg"
                hover
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h4 className="text-2xl font-bold mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Themes Preview */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <Container>
          <h3 className="text-4xl font-bold text-center mb-4">
            12가지 테마로 보는 대한민국
          </h3>
          <p className="text-center text-gray-600 mb-16">
            다양한 관점에서 공공데이터를 탐색하세요
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {themes.map((theme, idx) => (
              <Card
                key={idx}
                variant="default"
                padding="md"
                hover
                className={`${theme.color} cursor-pointer`}
              >
                <div className="text-3xl mb-2">{theme.icon}</div>
                <div className="font-semibold">{theme.label}</div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <Container size="md" className="text-center">
          <h3 className="text-4xl font-bold mb-6">
            지금 시작해보세요
          </h3>
          <p className="text-xl mb-8 opacity-90">
            당신의 동네는 몇 점일까요? 지금 바로 확인해보세요!
          </p>
          <Button
            variant="outline"
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 border-0 shadow-2xl"
          >
            내 동네 점수 확인하기
          </Button>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <Container>
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">DataPulse Korea</h4>
              <p className="text-sm">
                대한민국 공공데이터를 누구나 쉽게 이해할 수 있도록 만듭니다.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">서비스</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">지역 분석</a></li>
                <li><a href="#" className="hover:text-white transition">권력 투명성</a></li>
                <li><a href="#" className="hover:text-white transition">데이터 API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">정보</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">사용 방법</a></li>
                <li><a href="#" className="hover:text-white transition">데이터 출처</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">법적 고지</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-white transition">이용약관</a></li>
                <li><a href="#" className="hover:text-white transition">면책조항</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 DataPulse Korea. All rights reserved.</p>
            <p className="mt-2 text-gray-500">
              모든 데이터는 공공데이터포털 및 관련 정부기관에서 제공됩니다.
            </p>
          </div>
        </Container>
      </footer>
    </main>
  )
}
