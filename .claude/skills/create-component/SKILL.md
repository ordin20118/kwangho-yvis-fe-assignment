---
name: create-component
description: 프로젝트 컨벤션에 맞는 React 컴포넌트 스켈레톤을 생성합니다
user_invocable: true
---

# create-component

프로젝트 컨벤션에 맞는 React 컴포넌트를 생성합니다.

## 사용법

`/create-component {component-path}`

- component-path: src/ 이하 전체 경로 (예: entities/post/ui/PostHeader)

## 수행 작업

1. `src/{component-path}.tsx` 파일 생성
2. Props 인터페이스 포함한 컴포넌트 스켈레톤 작성
3. 해당 슬라이스의 `index.ts`에 export 추가

## 컴포넌트 템플릿

```tsx
interface {ComponentName}Props {
  // props
}

export function {ComponentName}({ }: {ComponentName}Props) {
  return (
    <div>
      {/* TODO */}
    </div>
  );
}
```

> 규칙은 `component-patterns` Rule 참조
