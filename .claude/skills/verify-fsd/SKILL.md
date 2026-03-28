---
name: verify-fsd
description: FSD 아키텍처 레이어 의존성 규칙 준수 여부를 검증합니다
user_invocable: true
---

# verify-fsd

FSD 아키텍처 규칙 준수 여부를 검증합니다.

## 사용법

`/verify-fsd`

## 검증 항목

### 1. 레이어 의존성 방향 검증

- shared는 다른 레이어를 import하지 않음
- entities는 shared만 import 가능
- features는 shared, entities만 import 가능
- widgets는 shared, entities, features만 import 가능
- app은 모든 레이어 import 가능

### 2. Cross-import 검증

- 같은 레이어 내 슬라이스 간 직접 import 없음
- 예: entities/post가 entities/user를 직접 import하면 위반

### 3. Barrel Export 검증

- 각 슬라이스에 index.ts 존재 여부
- 외부에서 슬라이스 내부 파일 직접 import 여부 검사

## 수행 방법

- Grep 도구를 사용하여 src/ 내 모든 import 구문 분석
- 레이어별 허용/금지 import 대상 매핑
- 위반 사항 목록 출력 및 수정 제안 제공
