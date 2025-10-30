/**
 * Kakao Map API 동적 로더
 *
 * 사용법:
 * ```ts
 * const kakao = await loadKakaoMap()
 * const map = new kakao.maps.Map(container, options)
 * ```
 */

declare global {
  interface Window {
    kakao: any
  }
}

let isLoading = false
let isLoaded = false

export const loadKakaoMap = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되었으면 바로 반환
    if (isLoaded && window.kakao && window.kakao.maps) {
      resolve(window.kakao)
      return
    }

    // 이미 로딩 중이면 대기
    if (isLoading) {
      const checkInterval = setInterval(() => {
        if (isLoaded && window.kakao && window.kakao.maps) {
          clearInterval(checkInterval)
          resolve(window.kakao)
        }
      }, 100)
      return
    }

    isLoading = true

    // API 키 확인
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
    if (!apiKey) {
      reject(new Error('Kakao Map API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요.'))
      return
    }

    // 스크립트 태그 생성
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`

    script.onload = () => {
      // SDK 로드 완료 후 maps 라이브러리 로드
      window.kakao.maps.load(() => {
        isLoaded = true
        isLoading = false
        resolve(window.kakao)
      })
    }

    script.onerror = () => {
      isLoading = false
      reject(new Error('Kakao Map API 스크립트를 로드하는데 실패했습니다.'))
    }

    document.head.appendChild(script)
  })
}

export default loadKakaoMap
