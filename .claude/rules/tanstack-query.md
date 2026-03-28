---
description: TanStack Query 훅을 작성하거나 수정할 때 적용
globs: src/**/api/*.ts
---

# TanStack Query 규칙

## Query Key Factory 패턴 필수

```tsx
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  detail: (id: string) => [...postKeys.all, id] as const,
};
```

- 모든 Query Key는 Factory를 통해 생성
- 하드코딩된 문자열 배열 사용 금지

## 훅 분리

- 컴포넌트에 직접 `useQuery`/`useMutation` 작성 금지
- 반드시 커스텀 훅으로 분리하여 FSD 슬라이스의 `api/` 디렉토리에 배치

## Optimistic Update

- `useMutation`의 `onMutate`에서 캐시 직접 업데이트
- `onError`에서 반드시 이전 상태로 rollback
- `onSettled`에서 `invalidateQueries`로 서버 동기화

## API 호출

- `@/shared/api/client`의 fetch wrapper를 통해 호출
