---
description: FSD 아키텍처 관련 코드를 작성하거나 수정할 때 적용
globs: src/**/*.{ts,tsx}
---

# FSD 아키텍처 규칙

## 레이어 의존성 방향 (단방향만 허용)

shared → entities → features → widgets → app

- shared: 다른 레이어를 import하지 않음
- entities: shared만 import 가능
- features: shared, entities만 import 가능
- widgets: shared, entities, features만 import 가능
- app: 모든 레이어 import 가능

## Cross-import 금지

같은 레이어 내 슬라이스 간 직접 import 불가.

- ❌ `entities/post`에서 `entities/user` 직접 import
- ✅ 공통 타입이 필요하면 `shared/types`에 정의

## Barrel Export 필수

- 모든 슬라이스는 `index.ts`를 통해 public API만 노출
- 외부에서 슬라이스 내부 파일 직접 import 금지

```tsx
// ✅
import { Post, postKeys } from '@/entities/post';

// ❌
import { Post } from '@/entities/post/model/types';
```

## Segments 구조

- `model/` — 타입, 스토어
- `ui/` — 컴포넌트
- `api/` — hooks, fetchers
- `lib/` — 유틸리티
