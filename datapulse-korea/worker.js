/**
 * Cloudflare Worker - 공공데이터 API 프록시
 *
 * 배포 방법:
 * 1. Cloudflare Dashboard → Workers & Pages → Create Worker
 * 2. 이 코드를 복사하여 붙여넣기
 * 3. 환경변수 설정:
 *    - AIR_KOREA_API_KEY
 *    - KMA_API_KEY
 *    - DISASTER_API_KEY
 * 4. 배포 후 Worker URL을 메모 (예: https://api-proxy.your-name.workers.dev)
 */

// CORS 헤더
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request, env) {
    // CORS preflight 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      })
    }

    const url = new URL(request.url)
    const path = url.pathname

    try {
      // 1. 서울 전체 측정소 대기질 조회
      if (path === '/api/air-quality/seoul') {
        return await fetchAirQualitySeoul(env)
      }

      // 2. 특정 측정소 대기질 조회
      if (path === '/api/air-quality/station') {
        const stationName = url.searchParams.get('name')
        if (!stationName) {
          return jsonResponse({ error: '측정소명이 필요합니다' }, 400)
        }
        return await fetchAirQualityStation(env, stationName)
      }

      // 3. 기상특보 조회
      if (path === '/api/weather-warnings') {
        const areaCode = url.searchParams.get('areaCode')
        return await fetchWeatherWarnings(env, areaCode)
      }

      // 4. 측정소 목록 조회
      if (path === '/api/stations') {
        const addr = url.searchParams.get('addr') || '서울'
        return await fetchStations(env, addr)
      }

      // 404
      return jsonResponse({ error: 'Not Found' }, 404)
    } catch (error) {
      console.error('Worker Error:', error)
      return jsonResponse({ error: error.message }, 500)
    }
  },
}

// 서울 전체 측정소 대기질 조회
async function fetchAirQualitySeoul(env) {
  const apiKey = env.AIR_KOREA_API_KEY

  if (!apiKey) {
    return jsonResponse({ error: 'API 키가 설정되지 않았습니다' }, 500)
  }

  // HTTP 사용 (원본 API 엔드포인트)
  const apiUrl = new URL('http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty')

  // 파라미터 추가 (serviceKey는 자동으로 URL 인코딩됨)
  apiUrl.searchParams.append('serviceKey', apiKey)
  apiUrl.searchParams.append('returnType', 'json')
  apiUrl.searchParams.append('numOfRows', '100')
  apiUrl.searchParams.append('pageNo', '1')
  apiUrl.searchParams.append('sidoName', '서울')
  apiUrl.searchParams.append('ver', '1.0')

  console.log('📡 요청 URL:', apiUrl.toString())

  const response = await fetch(apiUrl.toString())

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ API 에러:', {
      status: response.status,
      body: errorText.substring(0, 500),
    })
    return jsonResponse(
      {
        error: `API 호출 실패: ${response.status}`,
        details: errorText.substring(0, 200),
      },
      response.status
    )
  }

  const data = await response.json()
  console.log('✅ API 응답 성공:', {
    itemsCount: data.response?.body?.items?.length || 0,
  })

  return jsonResponse(data)
}

// 특정 측정소 대기질 조회
async function fetchAirQualityStation(env, stationName) {
  const apiKey = env.AIR_KOREA_API_KEY

  if (!apiKey) {
    return jsonResponse({ error: 'API 키가 설정되지 않았습니다' }, 500)
  }

  const apiUrl = new URL('http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty')
  apiUrl.searchParams.append('serviceKey', apiKey)
  apiUrl.searchParams.append('returnType', 'json')
  apiUrl.searchParams.append('numOfRows', '1')
  apiUrl.searchParams.append('pageNo', '1')
  apiUrl.searchParams.append('stationName', stationName)
  apiUrl.searchParams.append('dataTerm', 'DAILY')
  apiUrl.searchParams.append('ver', '1.0')

  const response = await fetch(apiUrl.toString())

  if (!response.ok) {
    const errorText = await response.text()
    return jsonResponse(
      {
        error: `API 호출 실패: ${response.status}`,
        details: errorText.substring(0, 200),
      },
      response.status
    )
  }

  const data = await response.json()
  return jsonResponse(data)
}

// 기상특보 조회
async function fetchWeatherWarnings(env, areaCode) {
  const apiKey = env.KMA_API_KEY

  if (!apiKey) {
    return jsonResponse({ error: 'API 키가 설정되지 않았습니다' }, 500)
  }

  const apiUrl = new URL('http://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList')
  apiUrl.searchParams.append('serviceKey', apiKey)
  apiUrl.searchParams.append('numOfRows', '10')
  apiUrl.searchParams.append('pageNo', '1')
  apiUrl.searchParams.append('dataType', 'JSON')

  if (areaCode) {
    apiUrl.searchParams.append('areaCode', areaCode)
  }

  const response = await fetch(apiUrl.toString())

  if (!response.ok) {
    const errorText = await response.text()
    return jsonResponse(
      {
        error: `API 호출 실패: ${response.status}`,
        details: errorText.substring(0, 200),
      },
      response.status
    )
  }

  const data = await response.json()
  return jsonResponse(data)
}

// 측정소 목록 조회
async function fetchStations(env, addr) {
  const apiKey = env.AIR_KOREA_API_KEY

  if (!apiKey) {
    return jsonResponse({ error: 'API 키가 설정되지 않았습니다' }, 500)
  }

  const apiUrl = new URL('http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnList')
  apiUrl.searchParams.append('serviceKey', apiKey)
  apiUrl.searchParams.append('returnType', 'json')
  apiUrl.searchParams.append('numOfRows', '100')
  apiUrl.searchParams.append('pageNo', '1')
  apiUrl.searchParams.append('addr', addr)

  const response = await fetch(apiUrl.toString())

  if (!response.ok) {
    const errorText = await response.text()
    return jsonResponse(
      {
        error: `API 호출 실패: ${response.status}`,
        details: errorText.substring(0, 200),
      },
      response.status
    )
  }

  const data = await response.json()
  return jsonResponse(data)
}

// JSON 응답 헬퍼
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}
