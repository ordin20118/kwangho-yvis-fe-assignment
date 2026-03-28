---
description: React 컴포넌트를 작성하거나 수정할 때 적용
globs: src/**/*.tsx
---

# 컴포넌트 패턴 규칙

## Export 방식

- Named export 사용 (default export 금지)
- 예외: Next.js `page.tsx`, `layout.tsx`는 default export 필수

## Props 인터페이스

- 컴포넌트와 같은 파일에 정의
- 네이밍: `{ComponentName}Props`

```tsx
interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) { ... }
```

## Composition Pattern

- 복합 컴포넌트는 작은 단위로 쪼개고 조합
- PostCard = PostHeader + PostImage + PostActions

## 'use client' 지시어

- 클라이언트 컴포넌트에만 명시
- 가능하면 서버 컴포넌트 유지
- 상태/이벤트가 필요한 컴포넌트만 클라이언트로

## Custom Hook 분리

- 데이터 페칭, 비즈니스 로직은 반드시 커스텀 훅으로 분리
- 컴포넌트에는 렌더링 로직만 유지

## Import 순서

1. 외부 라이브러리
2. 내부 모듈 (FSD 레이어 순서: shared → entities → features → widgets)
3. 타입 정의
