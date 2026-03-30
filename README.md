# 연봉인상 개발자 사전 과제

Instagram 스타일의 포스트 피드 애플리케이션입니다. 무한 스크롤 포스트 목록과 좋아요 인터랙션을 구현했습니다.

## 기술 스택

| 카테고리 | 기술 | 버전 |
| --- | --- | --- |
| 프레임워크 | Next.js (App Router) | 16.x |
| 언어 | TypeScript | 5.x |
| 서버 상태 관리 | TanStack Query | 5.x |
| 클라이언트 상태 관리 | Zustand | 5.x |
| 스타일링 | Tailwind CSS | 4.x |
| 아이콘 | Lucide React | latest |
| 패키지 매니저 | pnpm | latest |

---

## 프로젝트 실행 방법

### 요구 사항

- Node.js 18 이상
- pnpm

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (http://localhost:3000)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

### 기타 명령어

```bash
# ESLint 검사
pnpm lint

# Prettier 포맷팅
pnpm format

# 포맷 검사
pnpm format:check
```

> 별도의 DB나 외부 API 설정이 필요 없습니다. Next.js Route Handler 기반 Mock API를 사용하므로 `pnpm dev`만으로 모든 기능을 확인할 수 있습니다.



## 아키텍처

### Feature-Sliced Design (FSD)

프로젝트 전체를 5개 레이어로 나누어 관심사를 분리했습니다.

```
src/
├── app/           # Next.js App Router, 페이지, 레이아웃, Mock API
├── widgets/       # 조합형 UI 블록 (PostFeed)
├── features/      # 사용자 인터랙션 (좋아요 토글)
├── entities/      # 비즈니스 엔티티 (Post)
└── shared/        # 공용 유틸리티, UI 컴포넌트, 타입
```

**의존성 규칙:** 상위 레이어만 하위 레이어를 import할 수 있습니다.

```
shared → entities → features → widgets → app
```

각 슬라이스는 `index.ts` barrel export를 통해 public API만 노출합니다.

### 주요 슬라이스

| 슬라이스 | 레이어 | 역할 |
| --- | --- | --- |
| `entities/post` | Entities | Post 타입, Query Key Factory, PostCard UI, 무한 스크롤 훅 |
| `features/like-post` | Features | 좋아요 토글 mutation (디바운스 + Optimistic Update) |
| `widgets/feed` | Widgets | PostFeed 조합 컴포넌트 (무한 스크롤 + 좋아요 통합) |

### 컴포넌트 구조

```
PostFeed (widget)
└── PostCard (entity) x N
    ├── PostHeader     # 프로필 이미지 + 유저명
    ├── PostImage      # next/image 기반 이미지
    └── PostActions    # 좋아요 버튼 + 카운트
```

### 상태 관리

- **서버 상태 (TanStack Query):** 포스트 목록 조회(`useInfiniteQuery`), 좋아요 토글(`useMutation` + Optimistic Update)
- **클라이언트 상태 (Zustand):** UI 전용 상태가 필요할 때 사용 (현재 최소 활용)

### Mock API

| 엔드포인트 | 메서드 | 설명 |
| --- | --- | --- |
| `/api/posts` | GET | 커서 기반 페이지네이션 포스트 목록 |
| `/api/posts/:id/like` | PATCH | 좋아요 토글 (isLiked + likeCount 변경) |

인메모리 Mock 데이터(30개 포스트, 10명 유저)를 사용하며, 네트워크 지연을 시뮬레이션하기 위해 700ms 딜레이를 추가했습니다.



## Git 워크플로우

GitHub Flow를 기반으로, 이슈 단위로 feature 브랜치를 만들고 PR을 통해 main에 병합하는 방식으로 진행했습니다.

```
main ─────●────────●────────●────────●────────●
          ↑        ↑        ↑        ↑        ↑
          │        │        │        │        │
feature/  │ feature/ feature/ feature/ docs/
project-  │ 3-ui-   4-infinite 5-like  10-readme
setup     │ components scroll interaction
          │
   feature/
   2-data-modeling-mock-api
```

| 순서 | 브랜치 | PR | 작업 내용 |
| --- | --- | --- | --- |
| 1 | `feature/project-setup` | #5 | 프로젝트 초기 세팅 및 FSD 아키텍처 구성 |
| 2 | `feature/2-data-modeling-mock-api` | #6 | 데이터 모델링 및 Mock API 구현 |
| 3 | `feature/3-ui-components` | #8 | UI 컴포넌트 구현 및 정적 피드 페이지 구성 |
| 4 | `feature/4-infinite-scroll` | #9 | 무한 스크롤 구현 및 피드 페이지 연동 |
| 5 | `feature/5-like-interaction` | #11 | 좋아요 인터랙션 구현 및 피드 연동 |
| 6 | `docs/10-readme` | - | README 작성 |

각 PR은 이슈 단위로 생성하고, 커밋 메시지에 이슈 번호를 포함하여 추적이 가능하도록 했습니다.

dev 브랜치는 별도로 두지 않았습니다. 



## 직면한 문제와 해결 과정

### 상태 관리

프론트엔드 개발 경험이 적은 상태에서 가장 먼저 부딪힌 문제는 "상태 관리를 어떻게 할 것인가"였습니다. Redux, Zustand, Jotai, TanStack Query 등 다양한 선택지가 있었고, 각각의 차이를 이해하는 것부터 시작해야 했습니다.

AI와 대화하며 조사한 결과, 상태를 **서버 상태**와 **클라이언트 상태**로 나누는 개념을 알게 되었습니다.

- **서버 상태:** 포스트 목록, 좋아요 수처럼 서버에서 오는 데이터. 캐싱, 동기화, 로딩/에러 처리가 핵심.
- **클라이언트 상태:** 모달 열림/닫힘 같은 화면 전용 상태. 서버와 무관하게 브라우저에서만 관리.

이 둘을 하나의 라이브러리로 관리하면 서버 데이터의 캐싱이나 동기화 로직을 직접 구현해야 해서 복잡해진다는 점을 이해했습니다. 이를 바탕으로 각 역할에 맞는 라이브러리를 선택했습니다.

| 역할 | 라이브러리 | 선택 이유 |
| --- | --- | --- |
| 서버 상태 | TanStack Query | 캐싱, 무한 스크롤(`useInfiniteQuery`), Optimistic Update를 내장으로 지원 |
| 클라이언트 상태 | Zustand | 보일러플레이트가 적고 단순한 API로 학습 비용이 낮음 |

실제로 이 프로젝트에서는 서버 상태가 대부분이어서 TanStack Query가 핵심이 되었고, Zustand는 필요할 때를 대비해 최소한으로 두었습니다. 상태의 성격에 따라 도구를 나눠 쓴다는 접근 방식 자체가 이번 프로젝트에서 가장 큰 어려룸이자 배움이었습니다.




## AI 활용 방식

이 프로젝트에서는 **Claude Code**를 개발 전반에 걸쳐 활용했습니다.

### 프로젝트 설정 및 컨벤션 수립

`CLAUDE.md` 파일을 통해 프로젝트의 기술 스택, FSD 아키텍처 규칙, 코딩 컨벤션, Git 워크플로우를 정의했습니다. 또한 Claude Code의 두 가지 커스터마이징 기능을 역할에 맞게 분리하여 활용했습니다.

- **`.claude/rules/`** — AI가 코드를 생성할 때 **자동으로 참조하는 규칙**입니다. 별도 호출 없이 항상 컨텍스트에 포함되어, 컨벤션을 일관되게 준수하도록 합니다.
- **`.claude/skills/`** — 슬래시 커맨드로 **직접 호출하는 코드 생성 도구**입니다. 내부에 코드 스니펫 템플릿을 포함하고 있어, 호출 시 프로젝트 구조에 맞는 파일을 자동 생성합니다.

| 구분 | Rules (규칙) | Skills (스킬) |
| --- | --- | --- |
| 동작 방식 | 자동 적용 | 슬래시 커맨드로 수동 호출하거나, AI가 상황에 맞게 자동 선택하여 실행 |
| 역할 | "이렇게 작성해라" (가이드라인) | "이 코드를 만들어라" (코드 템플릿 실행) |
| 내용 | 컨벤션, 패턴 규칙 텍스트 | 코드 스니펫 + 생성 로직 |

#### Rules 목록

| Rule | 내용 |
| --- | --- |
| `fsd-architecture` | 레이어 의존성 방향, cross-import 금지, barrel export 규칙 |
| `component-patterns` | named export, Props 네이밍, import 순서, 'use client' 기준 |
| `tanstack-query` | Query Key Factory 패턴, 훅 분리, Optimistic Update 패턴 |
| `api-mock` | Route Handler 위치, 응답 형식, 커서 페이지네이션 |
| `styling` | Tailwind만 사용, 모바일 우선 |

#### Skills 목록

| Skill | 역할 |
| --- | --- |
| `/create-fsd-slice` | FSD 슬라이스 디렉토리 + barrel export 생성 |
| `/create-component` | 프로젝트 컨벤션에 맞는 컴포넌트 스켈레톤 생성 |
| `/create-query-hook` | TanStack Query 커스텀 훅(query/infinite/mutation) 생성 |
| `/create-api-route` | Next.js Route Handler 기반 Mock API 엔드포인트 생성 |
| `/verify-fsd` | FSD 레이어 의존성 규칙 준수 여부 검증 |

예를 들어 새로운 엔티티를 추가할 때, `/create-fsd-slice`로 디렉토리 구조를 잡고 → `/create-component`로 UI를 생성하고 → `/create-query-hook`으로 데이터 훅을 만드는 식으로 일관된 구조의 코드를 빠르게 생성했습니다.

### 설계 협업 및 코드 리뷰

- 복잡한 로직(디바운스 + Optimistic Update 조합)은 AI와 단계적으로 설계한 뒤 구현했습니다.
- 디바운스 로직의 엣지 케이스(연타, 언마운트 시 타이머 정리)를 식별하고 보완했습니다.
- 구현 후 `/verify-fsd`로 FSD 레이어 의존성 규칙 위반 여부를 검증했습니다.

### 활용 원칙

- AI가 생성한 코드는 반드시 직접 검토한 후 반영했습니다.
- 프로젝트 컨벤션을 `CLAUDE.md`와 rules 파일로 명시하여, AI가 일관된 패턴의 코드를 생성하도록 유도했습니다.



## 실행 화면


| 화면 | 스크린샷 |
| --- | --- |
| 피드 목록 | <img src="./docs/screenshots/screenshot_1.png" alt="피드 목록" width="300" /> |

---