# 🔑 API 연동 가이드

실시간 환경 안전 지도 기능의 API 연동 가이드입니다.

---

## 📋 필요한 API 목록

### 1. 에어코리아 대기질 API (한국환경공단)

**용도**: 실시간 미세먼지, 초미세먼지, 오존 등 대기질 데이터

**신청**:
1. 공공데이터포털 방문: https://www.data.go.kr/data/15073861/openapi.do
2. 회원가입 후 로그인
3. "활용신청" 버튼 클릭
4. 신청 승인 (즉시 또는 1~2일 소요)

**엔드포인트**:
- 측정소별 실시간 측정정보: `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty`
- 측정소 정보: `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnList`

**필수 파라미터**:
- `serviceKey`: 발급받은 API 키
- `returnType`: json
- `numOfRows`: 100 (한 번에 가져올 개수)
- `pageNo`: 1
- `stationName`: 측정소명 (예: 강남구)
- `dataTerm`: DAILY (일평균)

**응답 예시**:
```json
{
  "response": {
    "body": {
      "items": [{
        "stationName": "강남구",
        "pm10Value": "45",
        "pm10Grade": "2",
        "pm25Value": "25",
        "pm25Grade": "2",
        "khaiValue": "75",
        "khaiGrade": "2",
        "dataTime": "2025-10-31 14:00"
      }]
    }
  }
}
```

---

### 2. 기상청 기상특보 API

**용도**: 실시간 호우, 대설, 태풍 등 기상특보

**신청**:
1. 기상자료개방포털: https://data.kma.go.kr/
2. 회원가입 후 로그인
3. 데이터 > 기상예보 > 기상특보
4. 인증키 발급

**엔드포인트**:
- 특보 조회: `http://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList`

**필수 파라미터**:
- `serviceKey`: 발급받은 API 키
- `numOfRows`: 10
- `pageNo`: 1
- `dataType`: JSON
- `stnId`: 지역코드 (예: 108 = 서울)

---

### 3. 행정안전부 긴급재난문자 API

**용도**: 실시간 긴급재난문자 정보

**신청**:
1. 공공데이터포털: https://www.data.go.kr/data/15134001/openapi.do
2. 또는 재난안전데이터공유플랫폼: https://www.safetydata.go.kr/
3. 활용신청 후 승인 대기

**엔드포인트**:
- 재난문자 조회: 승인 후 제공되는 엔드포인트 사용

**필수 파라미터**:
- `serviceKey`: 발급받은 API 키
- `pageNo`: 1
- `numOfRows`: 100
- `type`: json

---

### 4. 전국 CCTV 표준데이터 (파일 다운로드)

**용도**: CCTV 위치 정보

**다운로드**:
1. 공공데이터포털: https://www.data.go.kr/data/15013094/standard.do
2. 파일데이터 다운로드 (CSV/JSON)
3. 주기적으로 업데이트 확인

**데이터 구조**:
```csv
관리기관명,설치장소명,도로명주소,설치목적구분,카메라대수,경도,위도
강남구청,강남역 사거리,서울 강남구 강남대로 지하396,방범,4,127.027610,37.498095
```

---

## 🔧 환경변수 설정

`/.env.local` 파일 생성:

```bash
# 에어코리아 API
NEXT_PUBLIC_AIR_KOREA_API_KEY=your_air_korea_api_key_here

# 기상청 API
NEXT_PUBLIC_KMA_API_KEY=your_kma_api_key_here

# 긴급재난문자 API
NEXT_PUBLIC_DISASTER_API_KEY=your_disaster_api_key_here
```

---

## 📝 API 연동 구현 위치

### 1. API 클라이언트 생성

`/src/lib/api/environmentApi.ts` 파일 생성 권장:

```typescript
// 에어코리아 API 호출
export async function fetchAirQuality(stationName: string) {
  const API_KEY = process.env.NEXT_PUBLIC_AIR_KOREA_API_KEY
  const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty`

  const params = new URLSearchParams({
    serviceKey: API_KEY!,
    returnType: 'json',
    numOfRows: '100',
    pageNo: '1',
    stationName: stationName,
    dataTerm: 'DAILY',
    ver: '1.0',
  })

  const response = await fetch(`${url}?${params}`)
  const data = await response.json()

  return data.response.body.items[0]
}
```

### 2. 목업 데이터 대체

현재 `/src/lib/data/mockEnvironmentData.ts`를 사용 중:

```typescript
// 목업 데이터 (현재)
import { mockAirQualityData } from '@/lib/data/mockEnvironmentData'

// API 연동 후 (교체)
import { fetchAirQuality } from '@/lib/api/environmentApi'
const airQualityData = await fetchAirQuality('강남구')
```

---

## ✅ 연동 체크리스트

- [ ] 에어코리아 API 키 발급
- [ ] 기상청 API 키 발급
- [ ] 긴급재난문자 API 키 발급
- [ ] CCTV 데이터 다운로드
- [ ] 환경변수 설정 (`.env.local`)
- [ ] `environmentApi.ts` 파일 생성
- [ ] API 호출 함수 구현
- [ ] 목업 데이터 → 실제 API 교체
- [ ] 에러 핸들링 추가
- [ ] 로딩 상태 UI 추가

---

## 🚨 주의사항

1. **API 사용량 제한**
   - 개발계정: 일 500건
   - 운영계정: 일 10,000건
   - 활용사례 등록 시 트래픽 증가 가능

2. **CORS 이슈**
   - Next.js API Routes 사용 권장
   - `/src/app/api/air-quality/route.ts` 형태로 프록시 구현

3. **캐싱**
   - 대기질: 1시간 캐시
   - 기상특보: 10분 캐시
   - CCTV 위치: 1일 캐시 (정적 데이터)

4. **에러 처리**
   ```typescript
   try {
     const data = await fetchAirQuality('강남구')
   } catch (error) {
     // 목업 데이터 사용 또는 에러 메시지 표시
     console.error('API 호출 실패:', error)
   }
   ```

---

## 📞 문의

- 공공데이터포털: 1577-0095
- 에어코리아: 02-2284-1199
- 기상청: 02-2181-0800

---

**작성일**: 2025-10-31
**업데이트 예정**: API 키 발급 후
