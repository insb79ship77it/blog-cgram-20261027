# 정보꾸러미 인사이트

Astro 기반 정보 블로그입니다.

- 글 작성: `src/content/posts/` 폴더에 `.md` 파일 추가
- 카테고리 추가: `src/utils/posts.ts`의 `CATEGORIES`에 항목 추가
- 로컬 실행: `npm install` → `npm run dev`
- 배포(Cloudflare Pages): 빌드 명령어 `npm run build`, 출력 디렉터리 `dist`

## 글 머리말(frontmatter)

```md
---
title: "제목"
description: "목록에 표시할 요약"
pubDate: 2026-10-25
category: "건강"        # 건강 / 생활 정보 / 뉴스
tags: ["태그1", "태그2"]
image: "https://..."    # 선택, 본문에 이미지·영상이 없을 때만 썸네일로 사용
draft: false            # true면 사이트에 표시하지 않음
---
```

## 썸네일 우선순위

1. 본문의 일반 이미지
2. 본문의 YouTube 영상 링크 썸네일
3. 본문에 이미지 문법으로 넣은 YouTube 썸네일
4. 프론트매터 `image`
5. 없으면 빈 영역
