---
description: Mock API Route Handler를 작성하거나 수정할 때 적용
globs: src/app/api/**/*.ts
---

# Mock API 규칙

## 파일 위치

- Route Handler: `src/app/api/{resource}/route.ts`
- Mock 데이터: `src/app/api/_data/` (언더스코어로 비라우팅 표시)

## 응답 형식 통일

```tsx
// 페이지네이션
interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

// 단일 응답
interface ApiResponse<T> {
  data: T;
}
```

- 모든 API 응답은 위 형식을 따름
- `@/shared/types/api`에 정의된 타입 사용

## 페이지네이션

- 커서 기반 (offset 아님)
- limit 기본값: 5

## 에러 응답

```tsx
NextResponse.json({ error: '메시지' }, { status: 코드 });
```
