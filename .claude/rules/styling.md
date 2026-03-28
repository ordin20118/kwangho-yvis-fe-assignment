---
description: UI 스타일링 관련 코드를 작성할 때 적용
globs: src/**/*.tsx
---

# 스타일링 규칙

## Tailwind CSS만 사용

- 인라인 `style` 속성 사용 금지
- CSS Module 사용 금지
- 별도 CSS 파일 생성 금지 (globals.css 제외)

## 모바일 우선 반응형

- 기본 스타일은 모바일 기준
- `sm:`, `md:`, `lg:` 등 브레이크포인트로 확장
- 피드 컨테이너: `max-w-screen-sm mx-auto`

## 범위 외

- 다크모드 미지원 (과제 요구사항 아님)

## 이미지

- `next/image` 컴포넌트 사용
- 외부 이미지 도메인은 `next.config.ts`에 등록
