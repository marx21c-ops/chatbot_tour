# Triptory — 작업 내역

## 프로젝트 개요

- **프로젝트명:** Triptory (AI 도슨트)
- **설명:** AI가 동행하는 국내 지역 문화·역사 여행 가이드
- **스택:** Next.js 16 + React 19 + Tailwind CSS v4 + TypeScript

---

## Commit 1 — `b8ad04f` — 카메라 배경 + 캐릭터 오버레이 UI 및 타자기 효과 적용

### 추가된 기능
- **CameraBackground** — 후면 카메라를 실시간 배경으로 사용
- **Trory 캐릭터** — `public/trory.png` AI 도슨트 캐릭터 오버레이
- **챗봇 UI**
  - `ChatContainer` — 메시지 상태 관리, 타자기 효과, TTS(음성 출력)
  - `ChatInput` — 텍스트 입력 및 사진 촬영 버튼
  - `MessageBubble` — 봇/유저 메시지 버블 UI
  - `QuickReplyChips` — 퀵 답변 칩
- **여행 데이터**
  - `locations.json` — 북촌/경복궁/인사동 장소 정보
  - `bukchon/intro.json`, `bukchon/qa.json` — 북촌 도슨트 인사말 & Q&A
  - `matcher.ts` — 질문 의도 매칭 로직
- **useChat 훅** — 메시지 히스토리 관리

### 파일
```
CHATBOT_PROMPT.md
public/trory.png
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/components/CameraBackground.tsx
src/components/chat/ChatContainer.tsx
src/components/chat/ChatInput.tsx
src/components/chat/MessageBubble.tsx
src/components/chat/QuickReplyChips.tsx
src/data/bukchon/intro.json
src/data/bukchon/qa.json
src/data/locations.json
src/hooks/useChat.ts
src/lib/matcher.ts
src/lib/types.ts
```

---

## Commit 2 — `c0bea0c` — GPS 위치 기반 코스 내비게이션 & LocationSheet

### 추가된 기능
- **useGeolocation** — 사용자 GPS 위치 추적, 가장 가까운 장소 감지
- **useNavigation** — 웨이포인트 기반 코스 안내 (거리 측정, 완료 감지)
- **CourseSelector** — 코스 선택 전체화면 UI
- **LocationSheet** — 하단 시트 오버레이 (장소 선택 / 코스 선택)
- **CameraCapture** — 사진 촬영 후 Vision API 분석
- **코스 데이터**
  - `courses.ts` — 북촌/경복궁/인사동 코스 + 웨이포인트
  - `gyeongbokgung/intro.json`, `insadong/intro.json`
- **vision.ts** — OpenAI Vision API 연동 (사진 분석)
- **ChatContainer 리팩토링** — LocationSheet 통합, 수동 장소 전환, 코스 내비게이션 연동

### 파일
```
src/app/page.tsx
src/components/CameraCapture.tsx
src/components/CourseSelector.tsx
src/components/LocationSheet.tsx
src/components/chat/ChatContainer.tsx
src/components/chat/ChatInput.tsx
src/data/courses.ts
src/data/gyeongbokgung/intro.json
src/data/insadong/intro.json
src/hooks/useGeolocation.ts
src/hooks/useNavigation.ts
src/lib/types.ts
src/lib/vision.ts
```

---

## Commit 3 — `4985599` — 모바일 최적화

### 변경 내용

| 파일 | 변경 | 설명 |
|---|---|---|
| `layout.tsx` | `viewport` export 추가 | `width=device-width`, `maximum-scale=1`, `userScalable=false`, `viewportFit=cover`, `themeColor=#000000` |
| `globals.css` | `-webkit-tap-highlight-color: transparent` | 탭 하이라이트 제거 |
| | `overscroll-behavior: none` | 모바일 오버스크롤 방지 |
| | `touch-action: manipulation` | 더블탭 줌 방지 |
| | `input/textarea/button/select { font-size: 16px }` | iOS 자동 줌 방지 |
| | `::selection` 스타일 | 선택 색상 통일 |
| `CameraBackground.tsx` | `bg-black` fallback | 카메라 로딩 전 검은 배경 |
| | `disablePictureInPicture` | PIP 방지 |
| `ChatContainer.tsx` | `justify-center` → `justify-end` | 콘텐츠 입력창 위로 정렬 |
| | `pt-48` → 제거, `pb-2` 추가 | 상단 여백 최소화 |
| | `gap-3` → `gap-2` | 아이템 간격 축소 |
| | 입력창 래퍼 padding 제거 | 입력창 최하단 정렬 |

---

## 프로젝트 구조

```
src/
├── app/
│   ├── globals.css          # 전역 스타일
│   ├── layout.tsx           # 루트 레이아웃 (viewport meta)
│   └── page.tsx             # 메인 페이지 (locationDataMap)
├── components/
│   ├── CameraBackground.tsx # 카메라 실시간 배경
│   ├── CameraCapture.tsx    # 사진 촬영 모듈
│   ├── CourseSelector.tsx   # 코스 선택 화면
│   ├── LocationSheet.tsx    # 하단 시트 (장소/코스 선택)
│   └── chat/
│       ├── ChatContainer.tsx    # 메인 채팅 로직
│       ├── ChatInput.tsx        # 입력창
│       ├── MessageBubble.tsx    # 메시지 버블
│       └── QuickReplyChips.tsx  # 퀵 답변 칩
├── data/
│   ├── courses.ts           # 코스 정의
│   ├── locations.json       # 장소 정보
│   ├── bukchon/             # 북촌 한옥마을 데이터
│   ├── gyeongbokgung/       # 경복궁 데이터
│   └── insadong/            # 인사동 데이터
├── hooks/
│   ├── useChat.ts           # 채팅 히스토리
│   ├── useGeolocation.ts    # GPS 위치 추적
│   └── useNavigation.ts     # 코스 내비게이션
└── lib/
    ├── matcher.ts           # 질문 의도 매칭
    ├── types.ts             # 타입 정의
    └── vision.ts            # Vision API 연동
```
