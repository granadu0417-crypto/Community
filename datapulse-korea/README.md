# DataPulse Korea 🇰🇷

> 대한민국의 모든 공공데이터, 한눈에

복잡한 공공데이터를 누구나 쉽게 이해하고 활용할 수 있는 인터랙티브 시각화 플랫폼

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-orange)

## 📋 목차

- [소개](#소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [배포](#배포)
- [문서](#문서)
- [로드맵](#로드맵)
- [기여](#기여)

## 🎯 소개

DataPulse Korea는 대한민국의 다양한 공공데이터를 통합하여 시각화하는 플랫폼입니다.

### 핵심 가치
- **투명성**: 권력과 예산의 흐름을 투명하게 공개
- **접근성**: 복잡한 데이터를 누구나 이해할 수 있게
- **신뢰성**: 공식 공공데이터만 사용하여 정확성 보장

## ✨ 주요 기능

### 🏠 생활 인텔리전스
- **부동산**: 실거래가, 공시지가, 가격 추이 분석
- **안전**: 범죄율, 사고다발지역 히트맵
- **환경**: 실시간 미세먼지, 대기질 모니터링
- **인구**: 이동 트렌드, 인구 구성 분석

### 💼 권력 투명성
- **공직자 추적**: 재산 공개, 부동산 보유 현황
- **국회 모니터링**: 의원 출석률, 법안 발의, 표결 기록
- **주식 거래**: 국회의원 주식 매매 내역

### 💰 세금 & 예산
- **세금 추적기**: 내가 낸 세금의 흐름 시각화
- **예산 집행**: 중앙/지방정부 예산 집행률
- **지자체 비교**: 동네별 예산 효율성 랭킹

### 📊 전문 분석
- **교육**: 학교별 교육비, 학군 비교
- **의료**: 병원 평가, 수술 건수, 응급실 대기
- **교통**: 사고 다발 구간, 혼잡도 예측
- **문화**: 문화시설 접근성, 행사 정보

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion
- **Maps**: Kakao Map API, Leaflet.js
- **Charts**: Chart.js, D3.js, Recharts

### Backend/Serverless
- **Platform**: Cloudflare Pages + Workers
- **Database**: Cloudflare D1 (SQLite)
- **Cache**: Cloudflare KV Storage
- **Cron Jobs**: Cloudflare Workers Cron

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions → Cloudflare Pages
- **Monitoring**: Cloudflare Analytics

## 🚀 시작하기

### 요구사항
- Node.js 18+
- npm 또는 yarn
- Git

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/datapulse-korea.git
cd datapulse-korea

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 열고 API 키들을 입력하세요

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 환경변수 설정

`.env.local` 파일을 생성하고 다음 키들을 설정하세요:

```env
# 지도
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_map_key

# 공공데이터 API
REALESTATE_API_KEY=your_realestate_api_key
CRIME_API_KEY=your_crime_api_key
AIRKOREA_API_KEY=your_airkorea_api_key
POPULATION_API_KEY=your_population_api_key
ASSEMBLY_API_KEY=your_assembly_api_key

# 더 많은 키들은 docs/API_CATALOG.md 참고
```

API 키 발급 방법은 [API_CATALOG.md](./docs/API_CATALOG.md)를 참고하세요.

## 📦 배포

### Cloudflare Pages 배포

1. **Cloudflare Pages 프로젝트 생성**
   - Cloudflare Dashboard에서 Pages 탭으로 이동
   - GitHub 저장소 연결

2. **빌드 설정**
   ```
   Build command: npm run pages:build
   Build output directory: .vercel/output/static
   ```

3. **환경변수 설정**
   - Pages 프로젝트 설정에서 환경변수 추가

4. **배포**
   ```bash
   # 로컬에서 배포
   npm run pages:deploy

   # 또는 GitHub에 push하면 자동 배포
   git push origin main
   ```

### 도메인 연결

Cloudflare Pages에서 커스텀 도메인 설정:
1. Pages 프로젝트 → Custom domains
2. `datapulse.dev` 추가
3. DNS 설정 (Cloudflare가 자동 처리)

## 📚 문서

- [마스터플랜](./docs/MASTERPLAN.md) - 전체 프로젝트 계획
- [API 카탈로그](./docs/API_CATALOG.md) - 사용하는 모든 공공 API 정보
- [개발 로드맵](./docs/ROADMAP.md) - 8주 개발 계획
- [데이터 스키마](./docs/DATA_SCHEMA.md) - 데이터베이스 구조

## 🗓️ 로드맵

### ✅ Week 1: 기반 구축 (현재)
- [x] 프로젝트 초기 설정
- [x] 기본 레이아웃 구현
- [ ] 지도 API 연동
- [ ] Cloudflare Pages 배포

### 🔄 Week 2: 데이터 레이어
- [ ] 첫 번째 공공 API 연동
- [ ] D1 Database 설정
- [ ] 캐싱 구현

### 📅 Week 3-4: 핵심 기능
- [ ] 부동산 데이터
- [ ] 안전 지도
- [ ] 환경 모니터링
- [ ] 종합 점수 시스템

### 📅 Week 5: 권력 투명성
- [ ] 공직자 자산 추적
- [ ] 국회의원 모니터링

### 📅 Week 6: UX/UI 고도화
- [ ] 지역 비교 도구
- [ ] 공유 기능
- [ ] 성능 최적화

### 📅 Week 7: 전문 분야
- [ ] 교육, 의료, 교통, 문화 테마

### 📅 Week 8: 런칭
- [ ] 베타 테스트
- [ ] 법률 검토
- [ ] 공식 런칭

전체 로드맵은 [ROADMAP.md](./docs/ROADMAP.md)를 참고하세요.

## 🤝 기여

기여는 언제나 환영합니다!

1. 이 저장소를 Fork 하세요
2. Feature 브랜치를 만드세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push 하세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 열어주세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참고하세요.

## 🙏 감사의 글

- 공공데이터를 제공하는 모든 정부 기관
- 오픈소스 커뮤니티
- 이 프로젝트에 영감을 준 [Real Signal](https://real-signal.org/)

## 📞 문의

- 이슈: [GitHub Issues](https://github.com/your-username/datapulse-korea/issues)
- 이메일: contact@datapulse.dev

---

**Made with ❤️ in South Korea**
