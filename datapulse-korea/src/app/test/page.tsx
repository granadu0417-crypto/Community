'use client'

import { useState } from 'react'

export default function TestPage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      // 강남구, 2024년 10월
      const API_KEY = 'bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ=='
      const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey=${API_KEY}&LAWD_CD=11680&DEAL_YMD=202410&numOfRows=10`

      console.log('API 호출 URL:', url)

      const response = await fetch(url)
      const text = await response.text()

      console.log('응답 상태:', response.status)
      console.log('응답 데이터:', text)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`)
      }

      // XML 파싱
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(text, 'text/xml')

      // 결과 코드 확인
      const resultCode = xmlDoc.querySelector('resultCode')?.textContent
      const resultMsg = xmlDoc.querySelector('resultMsg')?.textContent

      console.log('결과 코드:', resultCode)
      console.log('결과 메시지:', resultMsg)

      if (resultCode !== '00') {
        throw new Error(`API 오류: ${resultCode} - ${resultMsg}`)
      }

      // 아이템 추출
      const items = xmlDoc.querySelectorAll('item')
      const transactions = Array.from(items).map(item => {
        const getData = (tagName: string) => item.querySelector(tagName)?.textContent || ''

        return {
          아파트명: getData('aptNm'),
          거래금액: getData('dealAmount'),
          전용면적: getData('excluUseAr'),
          층: getData('floor'),
          건축년도: getData('buildYear'),
          거래년월일: `${getData('dealYear')}.${getData('dealMonth')}.${getData('dealDay')}`,
          법정동: getData('umdNm'),
          지번: getData('jibun'),
        }
      })

      console.log('파싱된 거래 데이터:', transactions)

      setData({
        resultCode,
        resultMsg,
        totalCount: xmlDoc.querySelector('totalCount')?.textContent,
        transactions,
      })
    } catch (err) {
      console.error('에러 발생:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🏠 부동산 API 테스트</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API 정보</h2>
          <div className="space-y-2 text-sm">
            <p><strong>엔드포인트:</strong> RTMSDataSvcAptTradeDev</p>
            <p><strong>지역:</strong> 강남구 (11680)</p>
            <p><strong>기간:</strong> 2024년 10월</p>
            <p><strong>결과 수:</strong> 10건</p>
          </div>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
        >
          {loading ? '데이터 불러오는 중...' : 'API 호출 테스트'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">❌ 오류 발생</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {data && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-green-800 font-semibold mb-4">✅ API 호출 성공!</h3>
            <div className="space-y-2 text-sm mb-4">
              <p><strong>결과 코드:</strong> {data.resultCode}</p>
              <p><strong>결과 메시지:</strong> {data.resultMsg}</p>
              <p><strong>전체 건수:</strong> {data.totalCount}건</p>
              <p><strong>조회 건수:</strong> {data.transactions.length}건</p>
            </div>

            <h4 className="font-semibold mb-3 text-gray-800">📋 거래 내역</h4>
            <div className="space-y-4">
              {data.transactions.map((t: any, idx: number) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="font-semibold text-lg mb-2">{t.아파트명}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>💰 {t.거래금액}만원</div>
                    <div>📐 {t.전용면적}㎡</div>
                    <div>🏢 {t.층}층</div>
                    <div>🏗️ {t.건축년도}년</div>
                    <div>📅 {t.거래년월일}</div>
                    <div>📍 {t.법정동} {t.지번}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">💡 개발자 도구 확인</h3>
          <p className="text-sm text-gray-700">
            F12 → Console 탭에서 상세한 로그를 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
