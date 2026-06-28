# Triptory — AI 도슨트 챗봇 개발 프롬프트

## 역할
너는 풀스택 시니어 개발자이자 UX/UI 전문가다. 아래 요구사항으로 Triptory 서비스의 도슨트 챗봇을 구현해라.

## 브랜드 / 서비스 개요
- **서비스명**: Triptory (트립토리)
- **한줄 소개**: AI가 동행하는 국내 지역 문화·역사 여행 가이드
- **핵심 가치**: 여행이 단순 소비로 끝나지 않고, 지역을 이해하고 기억하는 경험으로 전환
- **타겟 사용자**: 20-30대, 혼자 여행하거나 여행 경험이 부족한 사용자

## 챗봇 콘셉트
- **이름**: "도슨트" (Docent)
- **성격**: 친절하지만 전문적인 박물관 도슨트. 사용자가 장소에 도착했을 때 반갑게 맞이하고, 그 장소의 이야기를 들려주는 역할.
- **말투**: ~합니다체 (존댓말), 감정적이지 않고 정확한 사실 중심, 너무 딱딱하지 않은 친근함

## 핵심 조건
- **LLM/AI 사용 금지**. 모든 답변은 사전에 준비된 Q&A 데이터를 기반으로 함
- 사용자 질문은 키워드 매칭으로 가장 적합한 답변을 찾아 응답
- 매칭 실패 시 "아직 이 질문에 배우지 못했어요" + 대체 추천 질문 제시

---

## 구현 요구사항

### 1. 데이터 구조

```typescript
// types.ts
interface Location {
  id: string
  name: string
  lat: number
  lng: number
  address: string
}

interface QASet {
  id: string
  locationId: string
  category: 'history' | 'culture' | 'people' | 'architecture' | 'food' | 'tip'
  question: string
  answer: string
  keywords: string[]          // 매칭용 키워드
  imageUrl?: string           // 답변에 포함될 이미지
  weight?: number             // 매칭 가중치 (기본 1.0)
}

interface DocentIntro {
  locationId: string
  greeting: string            // "안녕하세요, {장소명}에 오신 것을 환영합니다!"
  intro: string               // 2~3문장 핵심 소개
  quickReplies: string[]      // 처음에 보여줄 추천 질문 3개
}

interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  text: string
  imageUrl?: string
  timestamp: number
  type: 'text' | 'quickReply' | 'error' | 'locationChange'
}
```

### 2. 매칭 알고리즘 (우선순위 순)

```typescript
function findBestAnswer(userInput: string, currentLocationId: string): QASet | null
```

1. **정규화**: 사용자 입력에서 조사/어미 제거, 공백 정리
2. **직접 매칭**: 현재 장소의 Q&A `question` 필드와 `includes()` 매칭 (대소문자 무시)
3. **키워드 매칭**: 사용자 입력을 명사 단위로 분리 후 Q&A `keywords` 배열과 교집합 개수로 점수 계산 → 최고 점수 반환 (weight 반영)
4. **전체 장소 검색**: 현재 장소에서 못 찾으면 같은 코스 내 다른 장소 Q&A 검색
5. **실패**: null 반환

### 3. UX 흐름

```
[사용자 장소 도착]
    ↓
도슨트 인사말 표시 (DocentIntro.greeting + intro)
    ↓
"이런 것도 궁금하세요?" + quickReplies 3개 (버튼 형태)
    ↓
사용자: 버튼 탭 or 직접 입력
    ↓
매칭 → 답변 표시 + 하단에 새로운 추천 질문 2개 자동 제안
    ↓
사용자: 다음 질문 or "다음 장소로 이동" 버튼
```

**UI 포인트:**
- 메시지 풍선: bot은 왼쪽, user는 오른쪽 (카카오톡 스타일)
- 추천 질문은 **칩 버튼** (채팅 입력창 위에 가로 스크롤)
- 장소 변경 시: "📍 {새 장소명}에 도착하셨습니다" 시스템 메시지 + 기존 대화 히스토리 유지
- 답변 이미지가 있으면 텍스트 아래에 썸네일 표시
- 답변 하단에 작은 회색 폰트로 `[출처: 한국관광공사 TourAPI]` 같은 출처 표시

### 4. 화면 구성

```
┌─────────────────────────────┐
│  ← 장소명           ⋮       │  ← 헤더 (현재 장소명, 뒤로가기)
├─────────────────────────────┤
│                             │
│  [봇] 안녕하세요!            │
│  북촌 한옥마을에 오신 것을   │
│  환영합니다.                 │
│                             │
│  [봇] 조선시대 양반층이      │
│  살았던 전통 주거지역으로... │
│                             │
│  ┌───────────┐ ┌──────────┐│
│  │ 언제부터   │ │ 유명한   ││  ← 추천 질문 칩
│  │ 한옥마을? │ │ 한옥은?  ││
│  └───────────┘ └──────────┘│
│                             │
│  ┌──────────────────────┐   │
│  │ 질문을 입력하세요...  │🔍 │  ← 입력창
│  └──────────────────────┘   │
└─────────────────────────────┘
```

### 5. 기술 구현

**프론트엔드 (React/Next.js):**
- `useChat` 훅: 메시지 상태 관리, 매칭 로직 호출, 히스토리 관리
- 컴포넌트: `ChatContainer`, `MessageBubble`, `QuickReplyChips`, `ChatInput`, `SystemMessage`
- 스크롤: 새 메시지가 추가되면 자동 스크롤 다운 (단, 사용자가 위로 스크롤 중이면 유지)
- 타이핑 인디케이터: 봇 응답이 매칭되는 동안 0.5~1초 간격으로 "..." 표시

**데이터 (초기 MVP):**
- `/data/locations.json` — 장소 목록
- `/data/{locationId}/qa.json` — 장소별 Q&A 세트
- `/data/{locationId}/intro.json` — 도슨트 인사말

### 6. 샘플 데이터 (MVP 테스트용)

```json
// locations.json
[
  { "id": "bukchon", "name": "북촌 한옥마을", "lat": 37.5826, "lng": 126.9860, "address": "서울 종로구 계동길 37" }
]

// data/bukchon/intro.json
{
  "locationId": "bukchon",
  "greeting": "안녕하세요, 북촌 한옥마을에 오신 것을 환영합니다!",
  "intro": "북촌은 조선시대 양반과 중인층이 모여 살던 대표적인 주거지역으로, 현재도 실제 주민들이 살아가는 살아있는 역사 공간입니다. 한옥 900여 채가 밀집된 국내 최대 한옥 밀집지역이에요.",
  "quickReplies": [
    "북촌은 언제부터 한옥마을이 되었나요?",
    "여기서 꼭 가봐야 할 곳은?",
    "북촌을 방문할 때 예절이 있나요?"
  ]
}

// data/bukchon/qa.json
[
  {
    "id": "qa_001",
    "locationId": "bukchon",
    "category": "history",
    "question": "북촌은 언제부터 한옥마을이 되었나요?",
    "answer": "북촌은 조선시대(1392년) 한양 도성 내부에 위치한 상류층 주거지역으로 시작되었습니다. 일제강점기인 1930년대에 지금과 같은 한옥 형태가 대거 들어섰고, 1970~80년대 도시 개발 속에서도 원형이 잘 보존되어 현재에 이르고 있습니다.",
    "keywords": ["역사", "유래", "시작", "언제", "조선", "한옥마을"],
    "imageUrl": "/images/bukchon_history.jpg",
    "weight": 1.2
  }
]
```

### 7. 매칭 실패 시 UX (중요)

```typescript
if (!matchedAnswer) {
  return {
    text: "아직 그 질문에 대해 잘 배우지 못했어요. 🤔\n\n이런 질문은 어떠세요?",
    quickReplies: currentLocationIntro.quickReplies
  }
}
```

사용자가 "모른다"는 답변을 받았을 때 좌절하지 않도록, **항상 대체 경로(추천 질문)** 를 제시해야 함. 답을 못 찾아도 대화가 끊기면 안 됨.

---

## 산출물

1. `components/chat/ChatContainer.tsx` — 메인 챗봇 컨테이너
2. `components/chat/MessageBubble.tsx` — 메시지 풍선 UI
3. `components/chat/QuickReplyChips.tsx` — 추천 질문 칩 버튼
4. `components/chat/ChatInput.tsx` — 입력창
5. `hooks/useChat.ts` — 채팅 상태 및 매칭 로직
6. `lib/matcher.ts` — Q&A 매칭 알고리즘
7. `lib/types.ts` — 타입 정의
8. `data/locations.json` — 장소 데이터
9. `data/{location}/intro.json` — 장소별 인트로
10. `data/{location}/qa.json` — 장소별 Q&A

---

## 제약 조건
- 외부 AI API 호출 금지
- 모든 로직은 클라이언트 사이드에서 동작
- 반응형 디자인 (모바일: 100% 너비, 데스크탑: max-w-md 중앙 정렬)
- 상태 관리는 React useState + useContext (추가 라이브러리 없음)
- 스타일은 Tailwind CSS 사용
- 한국어 검색을 위한 외부 형태소 분석기 사용 금지 (기본 문자열 매칭으로만 동작)
