# CLAUDE.md

## 프로젝트 개요

Instagram 스타일 포스트 피드 애플리케이션 (연봉인상 개발자 사전 과제).
무한 스크롤 포스트 목록과 좋아요 인터랙션을 구현하는 프론트엔드 프로젝트.

- **저장소:** https://github.com/ordin20118/kwangho-yvis-fe-assignment
- **메인 브랜치:** main
- **작업 브랜치 전략:** GitHub Flow (feature 브랜치 → main PR)

## 기술 스택

| 카테고리             | 기술                         | 버전              |
| -------------------- | ---------------------------- | ----------------- |
| 프레임워크           | Next.js (App Router)         | 15.x              |
| 언어                 | TypeScript                   | 5.x               |
| 서버 상태 관리       | TanStack Query (React Query) | 5.x               |
| 클라이언트 상태 관리 | Zustand                      | 5.x               |
| 스타일링             | Tailwind CSS                 | 4.x               |
| 아이콘               | Lucide React                 | latest            |
| 린팅                 | ESLint                       | 9.x (flat config) |
| 포맷팅               | Prettier                     | 3.x               |
| 패키지 매니저        | pnpm                         | latest            |

## 아키텍처: Feature-Sliced Design (FSD)

```
src/
├── app/                    # Next.js App Router 레이어
│   ├── layout.tsx          # 루트 레이아웃 (providers 래핑)
│   ├── page.tsx            # 메인 피드 페이지
│   ├── providers.tsx       # QueryClientProvider + 기타 providers
│   └── api/                # Route Handlers (Mock API)
├── entities/               # 비즈니스 엔티티 (도메인 모델)
├── features/               # 사용자 인터랙션 (유스케이스)
├── widgets/                # 조합형 UI 블록
└── shared/                 # 공유 유틸리티 및 UI
    ├── api/                # fetch wrapper 등
    ├── lib/                # 공용 유틸리티 함수
    ├── ui/                 # 공통 UI 컴포넌트
    └── types/              # 공통 타입 정의
```

각 레이어의 슬라이스는 해당 기능 개발 시 생성합니다.
슬라이스 내부 segments: `model/` (타입/스토어), `ui/` (컴포넌트), `api/` (hooks/fetchers), `lib/` (유틸리티)

### FSD 레이어 규칙

1. **의존성 방향:** shared → entities → features → widgets → app (단방향만 허용)
2. **각 슬라이스의 `index.ts`:** Public API 역할. 외부에서는 반드시 barrel export를 통해 접근
3. **cross-import 금지:** 같은 레이어 내 슬라이스 간 직접 import 불가
4. **segments:** model/ (타입/스토어), ui/ (컴포넌트), api/ (hooks/fetchers), lib/ (유틸리티)

## 코딩 컨벤션

### 네이밍

- **컴포넌트 파일:** PascalCase (`PostCard.tsx`)
- **Hook 파일:** camelCase (`usePostsInfinite.ts`)
- **유틸리티/설정 파일:** camelCase (`client.ts`, `utils.ts`)
- **타입 파일:** camelCase (`types.ts`)
- **디렉토리:** kebab-case (`post-card/`, `like-post/`)
- **컴포넌트 이름:** PascalCase, 파일명과 동일
- **Hook 이름:** `use` 접두사 + PascalCase (`useLikePost`)
- **타입/인터페이스:** PascalCase, `I` 접두사 사용하지 않음 (`Post`, `User`)
- **상수:** UPPER_SNAKE_CASE (`POSTS_PER_PAGE`)

### 파일 구조 (컴포넌트)

```tsx
// 1. 외부 라이브러리 import
import { useState } from 'react';

// 2. 내부 모듈 import (FSD 레이어 순서)
import { Post } from '@/entities/post';

// 3. 타입 정의
interface PostCardProps {
  post: Post;
}

// 4. 컴포넌트 (named export 사용, default export 사용하지 않음)
//    단, Next.js page/layout 파일은 default export 필수
export function PostCard({ post }: PostCardProps) {
  return <div>...</div>;
}
```

### 컴포넌트 패턴

- **Composition Pattern:** PostCard는 PostHeader, PostImage, PostActions를 조합
- **Custom Hook 분리:** 데이터 로직은 반드시 커스텀 훅으로 분리
- **Props 인터페이스:** 컴포넌트와 같은 파일에 정의, `{ComponentName}Props` 네이밍
- **Named Export:** 모든 컴포넌트는 named export 사용 (page.tsx, layout.tsx 제외)
- **'use client' 지시어:** 클라이언트 컴포넌트에만 명시. 가능하면 서버 컴포넌트 유지

### TypeScript

- `any` 사용 금지. 필요시 `unknown` 사용
- 유틸리티 타입 적극 활용 (`Pick`, `Omit`, `Partial`)
- API 응답 타입을 별도로 정의하고 엔티티 타입과 분리
- strict 모드 활성화

## 상태 관리 패턴

### TanStack Query (서버 상태)

- **사용 시점:** API에서 가져오는 모든 데이터 (포스트 목록, 포스트 상세)
- **Query Key 컨벤션:** 배열 형태, 계층적 구조 (`['posts', 'list']`, `['posts', id]`)
- **무한 스크롤:** `useInfiniteQuery` + `getNextPageParam`
- **Optimistic Update:** `useMutation`의 `onMutate`에서 캐시 직접 업데이트, `onError`에서 롤백

```tsx
// Query Key Factory 패턴
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  detail: (id: string) => [...postKeys.all, id] as const,
};
```

### Zustand (클라이언트 상태)

- **사용 시점:** 서버와 무관한 순수 UI 상태 (모달 열림/닫힘, 토스트 등)
- 이 프로젝트에서는 최소한으로 사용. 서버 상태는 반드시 TanStack Query 사용

## API 패턴 (Mock Route Handlers)

- Route Handler 위치: `src/app/api/`
- Mock 데이터 위치: `src/app/api/_data/` (언더스코어로 비라우팅 표시)
- 페이지네이션: 커서 기반 (`cursor` + `limit` 파라미터)
- 응답 형식: `PaginatedResponse<T>`, `ApiResponse<T>` 타입을 `shared/types/`에 정의하여 통일
- 에러 응답: `NextResponse.json({ error: message }, { status: code })`

## Git 워크플로우

### 브랜치 전략

- `main`: 안정 브랜치
- `유형/이슈번호-설명`: 작업 브랜치 (예: `feature/123-infinite-scroll`)

### 커밋 메시지 (Conventional Commits + GitHub Issues)

```
feat: 포스트 목록 무한 스크롤 구현 (#123)
fix: 좋아요 카운트 동기화 오류 수정 (#456)
chore: ESLint 설정 추가 (#789)
style: PostCard 레이아웃 조정 (#123)
refactor: usePostsInfinite 훅 에러 핸들링 개선 (#101)
docs: README.md 작성 (#202)
```

### PR 단위

이슈 단위로 1개 PR. PR 제목에 이슈 번호 포함, PR 본문에 `Closes #번호`로 자동 클로즈.

## 빌드 및 실행 명령

```bash
pnpm install          # 의존성 설치
pnpm dev              # 개발 서버 (http://localhost:3000)
pnpm build            # 프로덕션 빌드
pnpm lint             # ESLint 검사
pnpm format           # Prettier 포맷팅
pnpm format:check     # Prettier 포맷 검사
```

## Path Alias

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 주요 제약 및 규칙

1. **댓글/저장 기능 불필요:** 과제 요구사항에 없음
2. **인증 불필요:** 로그인/회원가입 없음. 모든 API는 public
3. **Mock 데이터:** 외부 DB 없이 인메모리 mock 데이터 사용
4. **이미지 최소 1장:** 각 포스트에 반드시 1개 이상의 이미지
5. **반응형:** 모바일 우선 디자인. max-width로 데스크톱 제한
6. **성능:** next/image 사용, 불필요한 리렌더링 방지
7. **에러 처리:** 빈 상태, 로딩 상태, 에러 상태 모두 UI로 표현
