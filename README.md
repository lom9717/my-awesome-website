# 주식.io - 실시간 주식 게임 플랫폼

**주식.io**는 실시간으로 사용자들이 가상 주식을 거래하고 경쟁하는 멀티플레이어 게임입니다.

## 🎮 주요 기능

### 사용자 기능
- **계정 관리**: 회원가입 및 로그인 (JWT 기반)
- **주식 생성**: 새로운 주식 상장 (50% 성공/실패 확률)
  - 성공 시: 투자금의 1.5배 수익
  - 실패 시: 투자금 손실
- **주식 거래**: 다른 사용자들의 주식 매수/매도
- **상장 폐지**: 원가의 2배 수수료로 상장 폐지
- **실시간 랭킹**: 자산 기준 실시간 순위 (온라인)
- **실시간 가격 업데이트**: WebSocket 기반 실시간 주식 가격 변동

### 개발자(관리자) 기능
- **주식 가격 조작**: 관리자 권한으로 주식 가격 실시간 변경
- **사용자 자산 조작**: 관리자 권한으로 사용자 자산(랭킹) 조정
- **실시간 모니터링**: 모든 게임 내 활동 실시간 추적

## 🛠️ 기술 스택

### 백엔드
- **Node.js + Express**: REST API 서버
- **MongoDB**: 데이터베이스
- **Socket.io**: 실시간 양방향 통신 (WebSocket)
- **JWT**: 사용자 인증
- **Bcrypt**: 비밀번호 암호화

### 프론트엔드
- **React**: UI 프레임워크
- **Socket.io-client**: 실시간 통신
- **Axios**: HTTP 클라이언트
- **React Router**: 라우팅

## 📁 프로젝트 구조

```
my-awesome-website/
├── backend/
│   ├── models/
│   │   ├── User.js          # 사용자 스키마
│   │   ├── Stock.js         # 주식 스키마
│   │   └── Transaction.js   # 거래 기록 스키마
│   ├── routes/
│   │   ├── auth.js          # 인증 라우트
│   │   ├── stocks.js        # 주식 거래 라우트
│   │   └── admin.js         # 관리자 조작 라우트
│   ├── server.js            # 메인 서버
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.js      # 로그인/회원가입
│   │   │   └── Dashboard.js # 메인 대시보드
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
├── README.md
└── .gitignore
```

## 🚀 설치 및 실행

### 백엔드

```bash
cd backend
npm install

# .env 파일 설정
cp .env.example .env
# PORT, MONGO_URI, JWT_SECRET, ADMIN_KEY 설정

# 실행
npm start  # 또는 npm run dev (개발 모드)
```

### 프론트엔드

```bash
cd frontend
npm install
npm start
```

서버는 `http://localhost:5000`에서, 클라이언트는 `http://localhost:3000`에서 실행됩니다.

## 📊 게임 메커니즘

### 초기 자본
- 모든 사용자는 **1,000,000 원**으로 시작

### 주식 생성 (주식 상장)
- 사용자가 새로운 주식을 상장
- **50% 확률로 성공/실패**
- 성공: 투자금의 1.5배 수익
- 실패: 투자금 전액 손실

### 주식 거래
- 다른 사용자의 주식 매수/매도 가능
- 매도 시: **원가의 2배 수수료** 차감

### 실시간 랭킹
- 현재 보유 자산 기준 순위
- WebSocket으로 실시간 업데이트
- 모든 온라인 사용자와 경쟁

### 관리자 기능
- **X-Admin-Key** 헤더로 관리자 권한 확인
- 주식 가격 실시간 조작 가능
- 사용자 자산 임의 변경 가능
- 모든 조작은 실시간으로 모든 클라이언트에 전파

## 🔐 API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인

### 주식
- `GET /api/stocks/all` - 모든 주식 조회
- `POST /api/stocks/create` - 주식 생성
- `POST /api/stocks/buy` - 주식 매수
- `POST /api/stocks/sell` - 주식 매도

### 관리자 (X-Admin-Key 필수)
- `POST /api/admin/manipulate-stock` - 주식 가격 조작
- `POST /api/admin/manipulate-user` - 사용자 자산 조작
- `GET /api/admin/ranking` - 랭킹 조회

## 📡 WebSocket 이벤트

### 클라이언트 → 서버
- `get-ranking` - 랭킹 조회 요청
- `get-stocks` - 주식 정보 조회 요청

### 서버 → 클라이언트
- `ranking-update` - 랭킹 업데이트
- `stocks-update` - 주식 정보 업데이트
- `admin-stock-manipulated` - 주식 가격 조작 알림
- `admin-user-manipulated` - 사용자 자산 조작 알림

## 💡 확장 가능성

- 다양한 투자 상품 추가 (채권, 옵션 등)
- 실제 시장 데이터 연동
- 토너먼트 모드
- 친구 초대 및 비공개 게임
- 소셜 기능 (채팅, 팔로우 등)
- 모바일 앱 개발
- 결제 시스템 (게임 내 아이템 구매)

## 📄 라이센스

MIT
