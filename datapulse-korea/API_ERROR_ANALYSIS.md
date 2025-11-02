# 🔍 API 500 에러 원인 분석 및 해결방안

## 📊 문제 분석

### 발생한 에러

```
GET https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?
serviceKey=...KKQ%3D%3D&returnType=json&numOfRows=100&pageNo=1&sidoName=%EC%84%9C%EC%9A%B8&ver=1.0
500 (Internal Server Error)
```

### 시도한 해결책

1. ✅ **프로덕션 디버그 로그 제거** (logger 유틸리티)
2. ✅ **성능 최적화** (useMemo, useCallback, debouncing)
3. ✅ **Mixed Content 수정** (HTTP → HTTPS)
4. ❌ **API 키 디코딩** (2중 인코딩 방지) - 여전히 500 에러
5. ❌ **상세 에러 로깅 추가** - 500 에러 지속

---

## 🎯 근본 원인 발견

### 문제 1: 프로토콜 불일치

**현재 상황:**
- ✅ **공식 문서**: `http://apis.data.go.kr/...` (HTTP)
- ✅ **API_SETUP_GUIDE.md**: `http://apis.data.go.kr/...` (HTTP)
- ✅ **test-air/route.ts**: `http://apis.data.go.kr/...` (HTTP)
- ❌ **environmentApi.ts**: `https://apis.data.go.kr/...` (**HTTPS**)

**왜 HTTPS를 사용했나?**
- Cloudflare Pages는 HTTPS 사용
- 브라우저가 Mixed Content 차단 (HTTPS 페이지에서 HTTP 요청 불가)
- HTTPS로 변경했지만 API 서버가 제대로 지원하지 않음

**HTTPS API 엔드포인트 문제:**
- 공공데이터포털 API는 주로 HTTP를 사용
- HTTPS를 지원하더라도 인증/파라미터 처리가 다를 수 있음
- 일부 API는 HTTPS에서 500 에러 반환

### 문제 2: 정적 Export로 API Routes 사용 불가

**next.config.js:**
```javascript
output: 'export'  // 정적 빌드
```

**영향:**
- Next.js API Routes (`/src/app/api/**/route.ts`) 동작 안 함
- 서버사이드 프록시 사용 불가
- 클라이언트에서 직접 API 호출 필요

### 문제 3: URL 인코딩 방식

**테스트 코드 (test-air/route.ts):**
```typescript
const url = new URL('http://...')
url.searchParams.append('serviceKey', apiKey)  // 자동 URL 인코딩
```
→ `serviceKey=...KKQ%3D%3D` (인코딩됨)

**현재 코드 (environmentApi.ts):**
```typescript
const requestUrl = `${url}?serviceKey=${AIR_KOREA_KEY}&${params}`
```
→ `serviceKey=...KKQ==` (인코딩 안 됨)

**어느 방식이 맞나?**
- 공공데이터포털 API는 **일반적으로 인코딩된 serviceKey를 기대**
- 하지만 API마다 다를 수 있음
- HTTP vs HTTPS에 따라 달라질 수 있음

---

## ✅ 해결 방안

### 🥇 방안 1: Cloudflare Worker 프록시 (권장)

**장점:**
- ✅ HTTP API를 서버사이드에서 호출 (Mixed Content 없음)
- ✅ HTTPS 엔드포인트 제공 (보안)
- ✅ 정적 export 유지 가능
- ✅ 무료 플랜 100,000 요청/일
- ✅ API 키 숨김 (클라이언트 노출 방지)

**단점:**
- ⚠️ 추가 설정 필요
- ⚠️ Worker 배포 및 관리

**구현:**
1. `worker.js` 파일을 Cloudflare Worker로 배포
2. `CLOUDFLARE_WORKER_SETUP.md` 가이드 참조
3. `environmentApi.ts`를 Worker URL로 수정

**예상 작업 시간:** 30분

---

### 🥈 방안 2: Vercel/Node.js 배포로 전환

**장점:**
- ✅ Next.js API Routes 사용 가능
- ✅ 서버사이드 프록시 구현 간단
- ✅ 이미 `test-air/route.ts` 코드 존재

**단점:**
- ❌ `output: 'export'` 제거 필요
- ❌ Cloudflare Pages 대신 Vercel 사용
- ❌ 서버 비용 발생 가능 (Vercel 무료 플랜 한계)

**구현:**
1. `next.config.js`에서 `output: 'export'` 제거
2. Vercel에 배포
3. `environmentApi.ts`를 `/api/air-quality/*` 호출로 수정

**예상 작업 시간:** 15분

---

### 🥉 방안 3: HTTP API 직접 호출 (비권장)

**장점:**
- ✅ 가장 간단함
- ✅ 추가 설정 없음

**단점:**
- ❌ Mixed Content 경고/차단
- ❌ 최신 브라우저에서 동작 안 함
- ❌ 보안 문제

**구현:**
```typescript
const url = 'http://apis.data.go.kr/...'  // HTTPS → HTTP
```

**사용 불가:** Cloudflare Pages (HTTPS 강제)

---

## 🎯 권장 해결책

### 단계별 가이드

#### 1단계: Cloudflare Worker 배포 (30분)

`CLOUDFLARE_WORKER_SETUP.md` 파일 참조:

1. Cloudflare Dashboard → Workers & Pages → Create Worker
2. `worker.js` 코드 복사/붙여넣기
3. 환경변수 설정:
   - `AIR_KOREA_API_KEY`
   - `KMA_API_KEY`
   - `DISASTER_API_KEY`
4. Worker URL 복사 (예: `https://datapulse-korea-api-proxy.xxx.workers.dev`)

#### 2단계: 클라이언트 코드 수정

**`.env.local` 추가:**
```bash
NEXT_PUBLIC_API_PROXY_URL=https://datapulse-korea-api-proxy.xxx.workers.dev
```

**`environmentApi.ts` 수정:**
```typescript
const PROXY_URL = process.env.NEXT_PUBLIC_API_PROXY_URL

// fetchSeoulAllStations() 함수 수정
export async function fetchSeoulAllStations(): Promise<AirQualityData[]> {
  try {
    // Worker API 호출
    const response = await fetch(`${PROXY_URL}/api/air-quality/seoul`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      const error = await response.json()
      logger.error('대기질 조회 실패:', error)
      return []
    }

    const data = await response.json()

    // 응답 데이터 매핑 (기존 로직 유지)
    if (data.response?.body?.items && Array.isArray(data.response.body.items)) {
      const items = data.response.body.items
      return items.map(/* ... */)
    }

    return []
  } catch (error) {
    logger.error('서울 전체 대기질 조회 실패:', error)
    return []
  }
}
```

#### 3단계: Cloudflare Pages 환경변수 추가

1. Cloudflare Dashboard → Pages → datapulse-korea → Settings → Environment variables
2. `NEXT_PUBLIC_API_PROXY_URL` 추가
3. 재배포

#### 4단계: 테스트

```bash
# Worker 직접 테스트
curl https://datapulse-korea-api-proxy.xxx.workers.dev/api/air-quality/seoul

# 프로덕션 테스트
https://datapulse-korea.pages.dev/environment
```

---

## 📈 예상 결과

### Before (현재)

```
❌ 500 Internal Server Error
❌ API 호출 실패
❌ 데이터 로드 불가
```

### After (Worker 적용 후)

```
✅ 200 OK
✅ JSON 응답 정상
✅ 실시간 대기질 데이터 표시
```

---

## 🔧 추가 개선사항

Worker 배포 후 다음 개선 작업 진행:

1. **에러 핸들링 강화**
   - API 실패 시 fallback 데이터 표시
   - 사용자 친화적 에러 메시지

2. **캐싱 전략**
   - Worker에서 Cloudflare KV 스토리지 사용
   - 대기질: 1시간 캐시
   - 기상특보: 10분 캐시

3. **모니터링**
   - Worker 로그 분석
   - API 호출 실패율 추적
   - 성능 메트릭 수집

4. **보안 강화**
   - API 키를 클라이언트에서 완전히 제거
   - Rate limiting 추가
   - IP 기반 접근 제어

---

## 📚 참고 자료

- [Cloudflare Workers 문서](https://developers.cloudflare.com/workers/)
- [공공데이터포털](https://www.data.go.kr/)
- [에어코리아 OpenAPI](http://openapi.airkorea.or.kr/)

---

**작성일**: 2025-11-02
**최종 업데이트**: 2025-11-02
**상태**: Worker 프록시 구현 완료, 배포 대기 중
