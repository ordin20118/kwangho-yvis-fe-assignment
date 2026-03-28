---
name: create-query-hook
description: TanStack Query 기반 커스텀 훅(query/infinite/mutation)을 생성합니다
user_invocable: true
---

# create-query-hook

TanStack Query 기반 커스텀 훅을 생성합니다.

## 사용법

`/create-query-hook {type} {hook-name} {slice-path}`

- type: query | infinite | mutation
- hook-name: 훅 이름 (예: usePostsInfinite, useLikePost)
- slice-path: FSD 슬라이스 경로 (예: widgets/post-list, features/like-post)

## 수행 작업

1. `src/{slice-path}/api/{hook-name}.ts` 파일 생성
2. 훅 타입에 맞는 TanStack Query 훅 스켈레톤 작성
3. Query Key Factory 패턴 적용
4. 해당 슬라이스의 `index.ts`에 export 추가

## 타입별 템플릿

### useInfiniteQuery

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';
import { postKeys } from '@/entities/post';

export function usePostsInfinite() {
  return useInfiniteQuery({
    queryKey: postKeys.lists(),
    queryFn: ({ pageParam }) =>
      fetch(`/api/posts?cursor=${pageParam}&limit=5`).then(res => res.json()),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
```

### useMutation (Optimistic Update)

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from '@/entities/post';

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      fetch(`/api/posts/${postId}/like`, { method: 'PATCH' }).then(res => res.json()),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      const previous = queryClient.getQueryData(postKeys.lists());
      // optimistic update logic
      return { previous };
    },
    onError: (_err, _postId, context) => {
      queryClient.setQueryData(postKeys.lists(), context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}
```

> 규칙은 `tanstack-query` Rule 참조
