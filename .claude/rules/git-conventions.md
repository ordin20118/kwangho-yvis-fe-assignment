---
description: Git 커밋, 브랜치 생성 시 적용
globs:
---

# Git 컨벤션

## 브랜치 네이밍

구조: `유형/이슈번호-간단한-설명`

```
feature/123-login-page        # 기능 구현
fix/456-fix-header             # 버그 수정
chore/789-set-dev-env          # 기타 작업
refactor/101-auth-module       # 리팩토링
docs/202-update-readme         # 문서 작업
```

- GitHub Issues 번호는 반드시 포함
- 설명은 kebab-case로 간결하게

## Conventional Commits

구조: `타입: 설명 (#이슈번호)`

```
feat: 포스트 목록 무한 스크롤 구현 (#123)
fix: 좋아요 카운트 동기화 오류 수정 (#456)
chore: ESLint 설정 추가 (#789)
style: PostCard 레이아웃 조정 (#123)
refactor: usePostsInfinite 훅 에러 핸들링 개선 (#101)
docs: README.md 작성 (#202)
```

- 커밋 메시지에 `(#이슈번호)` 필수 포함 (GitHub 자동 링크)
- 스코프는 선택 사항

## PR

- 이슈 단위로 1개 PR
- PR 제목에 이슈 번호 포함: `feat: 무한 스크롤 구현 (#123)`
- PR 본문에 `Closes #123`으로 이슈 자동 클로즈
- PR 설명에 구현 내용 포함
