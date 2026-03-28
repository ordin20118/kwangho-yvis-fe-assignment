---
name: create-fsd-slice
description: FSD 아키텍처에 맞는 새로운 슬라이스(디렉토리 + barrel export)를 생성합니다
user_invocable: true
---

# create-fsd-slice

FSD(Feature-Sliced Design) 아키텍처에 맞는 새로운 슬라이스를 생성합니다.

## 사용법

`/create-fsd-slice {layer} {slice-name}`

- layer: entities | features | widgets
- slice-name: kebab-case 슬라이스 이름 (예: post, like-post, post-card)

## 수행 작업

1. `src/{layer}/{slice-name}/` 디렉토리 생성
2. 해당 레이어에 맞는 하위 segments 디렉토리 생성:
   - entities: model/, ui/
   - features: api/, ui/, lib/
   - widgets: api/, ui/
3. `index.ts` barrel export 파일 생성
4. entities 레이어의 경우 `model/types.ts` 기본 타입 파일 생성

## 생성 구조 예시

### entities
```
src/entities/{slice-name}/
├── index.ts
├── model/
│   └── types.ts
└── ui/
```

### features
```
src/features/{slice-name}/
├── index.ts
├── api/
├── ui/
└── lib/
```

### widgets
```
src/widgets/{slice-name}/
├── index.ts
├── api/
└── ui/
```

> 규칙은 `fsd-architecture` Rule 참조
