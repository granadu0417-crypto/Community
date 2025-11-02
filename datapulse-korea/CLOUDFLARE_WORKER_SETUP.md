# ☁️ Cloudflare Worker API 프록시 설정 가이드

공공데이터 API의 HTTP/HTTPS Mixed Content 문제를 해결하기 위한 Cloudflare Worker 프록시 설정 가이드입니다.

---

## 📋 문제 상황

1. **공공데이터 API는 HTTP만 지원** (`http://apis.data.go.kr/...`)
2. **Cloudflare Pages는 HTTPS 사용** (`https://datapulse-korea.pages.dev/`)
3. **브라우저가 Mixed Content 차단** (HTTPS 페이지에서 HTTP 요청 불가)
4. **Next.js 정적 export는 API Routes 미지원** (`output: 'export'`)

## ✅ 해결 방법

**Cloudflare Worker를 API 프록시로 사용**
- Worker는 서버사이드에서 HTTP API를 호출 (Mixed Content 없음)
- HTTPS 엔드포인트를 제공하여 클라이언트와 안전하게 통신
- 무료 플랜으로 하루 100,000 요청 가능

---

## 🚀 설정 단계

### 1. Cloudflare Worker 생성

1. **Cloudflare Dashboard 접속**
   - https://dash.cloudflare.com/
   - 로그인 (Pages에 사용 중인 계정)

2. **Workers & Pages 메뉴 선택**
   - 좌측 메뉴에서 "Workers & Pages" 클릭
   - "Create" 버튼 클릭

3. **Create Worker 선택**
   - "Create Worker" 탭 선택
   - Worker 이름 입력: `datapulse-korea-api-proxy` (원하는 이름)
   - "Deploy" 버튼 클릭

4. **Worker 코드 수정**
   - "Quick edit" 버튼 클릭
   - 기존 코드 전체 삭제
   - `/worker.js` 파일 내용 복사하여 붙여넣기
   - "Save and Deploy" 클릭

### 2. 환경변수 설정

1. **Worker 설정 페이지로 이동**
   - "Settings" 탭 클릭
   - "Variables" 섹션 선택

2. **환경변수 추가**
   - "Add variable" 버튼 클릭
   - 다음 3개 변수 추가:

   | Variable name | Value | Type |
   |--------------|-------|------|
   | `AIR_KOREA_API_KEY` | `bRfZ97B4...KKQ==` | Secret |
   | `KMA_API_KEY` | `bRfZ97B4...KKQ==` | Secret |
   | `DISASTER_API_KEY` | `bRfZ97B4...KKQ==` | Secret |

   - **Secret** 타입으로 설정 (Encrypt 체크박스 선택)
   - "Save and Deploy" 클릭

### 3. Worker URL 확인

배포 완료 후 Worker URL 확인:
```
https://datapulse-korea-api-proxy.your-account.workers.dev
```

예시:
```
https://datapulse-korea-api-proxy.granadu0417-crypto.workers.dev
```

---

## 📡 API 엔드포인트

Worker가 제공하는 엔드포인트:

| 엔드포인트 | 설명 | 파라미터 |
|-----------|------|---------|
| `GET /api/air-quality/seoul` | 서울 전체 측정소 대기질 | 없음 |
| `GET /api/air-quality/station?name=강남구` | 특정 측정소 대기질 | `name` (측정소명) |
| `GET /api/weather-warnings?areaCode=11` | 기상특보 | `areaCode` (선택) |
| `GET /api/stations?addr=서울` | 측정소 목록 | `addr` (시도명) |

---

## 🔧 클라이언트 코드 수정

### 환경변수 추가 (.env.local)

```bash
# Cloudflare Worker API 프록시 URL
NEXT_PUBLIC_API_PROXY_URL=https://datapulse-korea-api-proxy.your-account.workers.dev
```

### environmentApi.ts 수정

기존 공공데이터 API 직접 호출을 Worker를 통한 호출로 변경:

```typescript
const PROXY_URL = process.env.NEXT_PUBLIC_API_PROXY_URL

// Before (직접 호출 - 500 에러)
const response = await fetch(`https://apis.data.go.kr/...`)

// After (Worker를 통한 호출)
const response = await fetch(`${PROXY_URL}/api/air-quality/seoul`)
```

---

## 🧪 테스트

### 1. Worker 직접 테스트

브라우저 또는 curl로 Worker URL 직접 호출:

```bash
# 서울 대기질 조회
curl https://datapulse-korea-api-proxy.your-account.workers.dev/api/air-quality/seoul

# 특정 측정소 조회
curl https://datapulse-korea-api-proxy.your-account.workers.dev/api/air-quality/station?name=강남구

# 기상특보 조회
curl https://datapulse-korea-api-proxy.your-account.workers.dev/api/weather-warnings
```

### 2. 성공 응답 예시

```json
{
  "response": {
    "body": {
      "items": [
        {
          "stationName": "강남구",
          "pm10Value": "45",
          "pm25Value": "25",
          "khaiValue": "75",
          "dataTime": "2025-11-02 14:00"
        }
      ]
    }
  }
}
```

### 3. 에러 응답 예시

```json
{
  "error": "API 키가 설정되지 않았습니다"
}
```

---

## 💰 비용 및 제한

### Cloudflare Workers 무료 플랜

- **일일 요청 수**: 100,000 요청/일
- **CPU 시간**: 요청당 10ms
- **메모리**: 128MB
- **Workers 수**: 무제한

### 예상 사용량

- 사용자 1명당 페이지 로드: 1-2 요청
- 일 1,000명 방문 시: ~2,000 요청
- ✅ **무료 플랜으로 충분**

---

## 🔍 디버깅

### Worker 로그 확인

1. Cloudflare Dashboard → Workers & Pages
2. Worker 선택 → "Logs" 탭
3. "Begin log stream" 클릭
4. 실시간 로그 확인

### 일반적인 에러

| 에러 메시지 | 원인 | 해결방법 |
|-----------|------|---------|
| `API 키가 설정되지 않았습니다` | 환경변수 미설정 | Worker 환경변수 확인 |
| `API 호출 실패: 500` | 공공데이터 API 에러 | Worker 로그에서 상세 에러 확인 |
| `CORS error` | CORS 헤더 누락 | worker.js의 corsHeaders 확인 |
| `404 Not Found` | 잘못된 엔드포인트 | URL 경로 확인 |

---

## 📌 다음 단계

1. ✅ Cloudflare Worker 생성 및 배포
2. ✅ 환경변수 설정
3. ✅ Worker URL 복사
4. ⬜ `.env.local`에 `NEXT_PUBLIC_API_PROXY_URL` 추가
5. ⬜ `environmentApi.ts` 수정 (Worker URL 사용)
6. ⬜ 로컬 테스트
7. ⬜ Cloudflare Pages 환경변수에 `NEXT_PUBLIC_API_PROXY_URL` 추가
8. ⬜ 배포 및 프로덕션 테스트

---

## 🆘 문의

- Cloudflare Workers 문서: https://developers.cloudflare.com/workers/
- Workers 예제: https://workers.cloudflare.com/
- 커뮤니티: https://community.cloudflare.com/

---

**작성일**: 2025-11-02
**목적**: HTTP/HTTPS Mixed Content 문제 해결
