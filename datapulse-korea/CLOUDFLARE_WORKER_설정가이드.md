# ☁️ Cloudflare Worker API 프록시 설정 가이드 (한국어 UI)

공공데이터 API의 HTTP/HTTPS Mixed Content 문제를 해결하기 위한 Cloudflare Worker 설정 가이드입니다.

---

## 📋 문제 상황

현재 에러 메시지:
```
Error forwarding request to backend server
500 Internal Server Error
```

**원인:**
- 공공데이터 API는 HTTP만 지원
- 우리는 HTTPS로 요청
- API Gateway가 HTTP 백엔드로 전달하는 과정에서 실패

**해결:**
- Cloudflare Worker가 HTTP로 직접 API 호출
- 클라이언트에는 HTTPS 엔드포인트 제공

---

## 🚀 1단계: Cloudflare Worker 생성 (5분)

### 1-1. Cloudflare 대시보드 접속

1. https://dash.cloudflare.com/ 접속
2. 로그인 (datapulse-korea Pages 사용 중인 계정)

### 1-2. Workers 메뉴 이동

1. 좌측 사이드바에서 **"Workers 및 Pages"** 클릭
2. 상단의 **"생성"** 버튼 클릭 (파란색 버튼)

### 1-3. Worker 생성

1. **"Worker 생성"** 탭 선택
2. Worker 이름 입력:
   ```
   datapulse-korea-api-proxy
   ```
   (또는 원하는 이름)
3. 하단의 **"배포"** 버튼 클릭 (파란색 버튼)

### 1-4. Worker 코드 수정

1. 배포 완료 후 **"편집"** 버튼 클릭
2. 좌측 편집기에 있는 **기존 코드 전체 삭제**
3. `/worker.js` 파일 내용 전체 복사
4. 편집기에 붙여넣기
5. 우측 상단 **"저장 및 배포"** 버튼 클릭

---

## 🔧 2단계: 환경 변수 설정 (5분)

### 2-1. 설정 페이지 이동

1. Worker 페이지에서 상단 탭 중 **"설정"** 클릭
2. 좌측 메뉴에서 **"변수"** 클릭

### 2-2. 환경 변수 추가

**"변수 추가"** 버튼을 3번 클릭하여 다음 변수들을 추가:

#### 변수 1:
- **변수 이름**: `AIR_KOREA_API_KEY`
- **값**: `bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ==`
- **유형**: ✅ **암호화** 체크박스 선택
- **추가** 버튼 클릭

#### 변수 2:
- **변수 이름**: `KMA_API_KEY`
- **값**: `bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ==`
- **유형**: ✅ **암호화** 체크박스 선택
- **추가** 버튼 클릭

#### 변수 3:
- **변수 이름**: `DISASTER_API_KEY`
- **값**: `bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ==`
- **유형**: ✅ **암호화** 체크박스 선택
- **추가** 버튼 클릭

### 2-3. 배포

- 하단의 **"배포"** 버튼 클릭 (파란색 버튼)

---

## 📝 3단계: Worker URL 확인 (1분)

### 3-1. URL 복사

1. Worker 페이지 상단에서 **"설정"** 탭 클릭
2. 좌측 메뉴에서 **"트리거"** 클릭
3. **"경로"** 섹션에서 Worker URL 확인:
   ```
   https://datapulse-korea-api-proxy.[사용자명].workers.dev
   ```
4. URL 복사 (클립보드에 저장)

예시:
```
https://datapulse-korea-api-proxy.granadu0417-crypto.workers.dev
```

---

## 🧪 4단계: Worker 테스트 (2분)

### 4-1. 브라우저에서 테스트

복사한 Worker URL 뒤에 `/api/air-quality/seoul` 붙여서 접속:

```
https://datapulse-korea-api-proxy.[사용자명].workers.dev/api/air-quality/seoul
```

### 4-2. 정상 응답 확인

다음과 같은 JSON 응답이 보이면 **성공**:

```json
{
  "response": {
    "body": {
      "items": [
        {
          "stationName": "강남구",
          "pm10Value": "45",
          "pm25Value": "25",
          ...
        }
      ]
    }
  }
}
```

### 4-3. 에러 발생 시

```json
{
  "error": "API 키가 설정되지 않았습니다"
}
```

→ **2단계 (환경 변수 설정)**로 돌아가서 다시 확인

---

## 💻 5단계: 로컬 환경 변수 설정 (3분)

### 5-1. .env.local 파일 수정

프로젝트 루트의 `.env.local` 파일 열기:

```bash
# 기존 내용
NEXT_PUBLIC_AIR_KOREA_API_KEY=bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ==
NEXT_PUBLIC_KMA_API_KEY=bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ==
NEXT_PUBLIC_DISASTER_API_KEY=bRfZ97B4aD4dhEcDAZTTYL4i0QvA5lrXzStBTwhEZgv2zJLjnLO5BGjR5UIjsSLodBMC2IzGZd6SBz1qwS6KKQ==

# 아래 추가 (3단계에서 복사한 Worker URL)
NEXT_PUBLIC_API_PROXY_URL=https://datapulse-korea-api-proxy.[사용자명].workers.dev
```

**중요:** `[사용자명]` 부분을 실제 Worker URL로 변경!

### 5-2. 파일 저장

Ctrl+S 또는 Cmd+S로 저장

---

## 🔄 6단계: 클라이언트 코드 수정 (5분)

이 단계는 제가 코드로 수정해드릴게요!

Worker URL을 알려주시면 `environmentApi.ts` 파일을 수정하겠습니다.

예시:
```
Worker URL: https://datapulse-korea-api-proxy.xxx.workers.dev
```

---

## 🌐 7단계: Cloudflare Pages 환경 변수 설정 (3분)

### 7-1. Pages 설정 이동

1. Cloudflare 대시보드에서 **"Workers 및 Pages"** 클릭
2. **"datapulse-korea"** 프로젝트 클릭
3. 상단 탭에서 **"설정"** 클릭
4. 좌측 메뉴에서 **"환경 변수"** 클릭

### 7-2. 환경 변수 추가

1. **"프로덕션"** 탭 선택
2. **"변수 추가"** 버튼 클릭
3. 변수 추가:
   - **변수 이름**: `NEXT_PUBLIC_API_PROXY_URL`
   - **값**: `https://datapulse-korea-api-proxy.[사용자명].workers.dev`
4. **"저장"** 버튼 클릭

### 7-3. 재배포

- 환경 변수 저장 후 자동으로 재배포되거나
- **"배포"** 탭 → 최신 배포 → **"재배포"** 클릭

---

## ✅ 완료 체크리스트

- [ ] 1단계: Worker 생성 및 코드 배포
- [ ] 2단계: 환경 변수 3개 추가 (AIR_KOREA_API_KEY, KMA_API_KEY, DISASTER_API_KEY)
- [ ] 3단계: Worker URL 복사
- [ ] 4단계: Worker 테스트 (JSON 응답 확인)
- [ ] 5단계: `.env.local`에 `NEXT_PUBLIC_API_PROXY_URL` 추가
- [ ] 6단계: `environmentApi.ts` 코드 수정 (제가 도와드릴게요)
- [ ] 7단계: Cloudflare Pages 환경 변수 추가
- [ ] 최종: 프로덕션 사이트 테스트

---

## 🆘 도움이 필요한 경우

각 단계에서 막히는 부분이 있으면 스크린샷과 함께 알려주세요!

**현재 진행 상황:**
- ⬜ 1단계: Worker 생성
- ⬜ 2단계: 환경 변수 설정
- ⬜ 3단계: Worker URL 확인
- ⬜ 4단계: 테스트

어느 단계부터 진행하시겠어요?

---

**작성일**: 2025-11-02
**예상 소요 시간**: 30분
