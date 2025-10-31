import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_AIR_KOREA_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'API 키가 설정되지 않았습니다' }, { status: 500 })
  }

  try {
    const url = new URL('http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty')
    url.searchParams.append('serviceKey', apiKey)
    url.searchParams.append('returnType', 'json')
    url.searchParams.append('numOfRows', '1')
    url.searchParams.append('pageNo', '1')
    url.searchParams.append('stationName', '강남구')
    url.searchParams.append('dataTerm', 'DAILY')
    url.searchParams.append('ver', '1.0')

    console.log('요청 URL:', url.toString())

    const response = await fetch(url.toString())
    const text = await response.text()

    console.log('응답 상태:', response.status)
    console.log('응답 내용:', text.substring(0, 500))

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      data: text,
      url: url.toString().replace(apiKey, 'API_KEY_HIDDEN'),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    )
  }
}
