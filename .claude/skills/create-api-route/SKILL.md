---
name: create-api-route
description: Next.js Route Handler 기반 Mock API 엔드포인트를 생성합니다
user_invocable: true
---

# create-api-route

Next.js Route Handler 기반 Mock API 엔드포인트를 생성합니다.

## 사용법

`/create-api-route {path} {methods}`

- path: API 경로 (예: posts, posts/[id]/like)
- methods: HTTP 메서드 (예: GET, PATCH)

## 수행 작업

1. `src/app/api/{path}/route.ts` 파일 생성
2. 지정된 HTTP 메서드 핸들러 함수 작성
3. NextRequest/NextResponse 타입 사용
4. Mock 데이터 import 연결

## 템플릿 (GET with 커서 페이지네이션)

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { posts } from '@/app/api/_data/posts';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const limit = Number(searchParams.get('limit')) || 5;

  // 커서 기반 페이지네이션 로직

  return NextResponse.json({
    data: slicedPosts,
    nextCursor,
    hasNextPage,
  });
}
```

> 규칙은 `api-mock` Rule 참조
