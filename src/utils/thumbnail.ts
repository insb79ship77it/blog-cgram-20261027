// 게시글 목록 썸네일 선택 로직 (Astro 의존성이 없는 순수 함수)
//
// 우선순위
// 1. 본문 이미지 중 YouTube 썸네일이 아닌 일반 이미지
// 2. 본문에 있는 YouTube 영상 링크의 썸네일
// 3. 본문에 이미지 문법으로 직접 넣은 YouTube 썸네일 URL
// 4. 프론트매터 image
// 5. 없으면 빈 문자열 (기본 이미지를 쓰지 않음)

const MARKDOWN_IMAGE =
  /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;
const HTML_IMAGE = /<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi;
const YOUTUBE_THUMB_URL = /(?:i\.ytimg\.com|img\.youtube\.com)\//i;
const YOUTUBE_VIDEO =
  /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#\s)]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

// 코드 블록 안의 예시 이미지가 썸네일로 잡히지 않게 제거
const stripCode = (text: string): string =>
  text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/`[^`\n]*`/g, '');

const isUsableUrl = (url: string): boolean =>
  /^https?:\/\//i.test(url) || url.startsWith('/');

// 본문에 나온 순서대로 이미지 URL 목록 반환
const collectImages = (body: string): string[] => {
  const found: { index: number; url: string }[] = [];

  for (const m of body.matchAll(MARKDOWN_IMAGE)) {
    found.push({ index: m.index ?? 0, url: m[1] });
  }
  for (const m of body.matchAll(HTML_IMAGE)) {
    found.push({ index: m.index ?? 0, url: m[1] });
  }

  return found
    .sort((a, b) => a.index - b.index)
    .map((item) => item.url)
    .filter(isUsableUrl);
};

export interface ThumbnailSource {
  body?: string;
  data: { image?: string };
}

export const getThumbnail = (post: ThumbnailSource): string => {
  const body = stripCode(post.body ?? '');
  const images = collectImages(body);

  // 1. 일반 이미지
  const normalImage = images.find((url) => !YOUTUBE_THUMB_URL.test(url));
  if (normalImage) return normalImage;

  // 2. 본문 속 YouTube 영상 링크
  const video = body.match(YOUTUBE_VIDEO);
  if (video) return `https://img.youtube.com/vi/${video[1]}/hqdefault.jpg`;

  // 3. 이미지 문법으로 직접 넣은 YouTube 썸네일
  const youtubeImage = images.find((url) => YOUTUBE_THUMB_URL.test(url));
  if (youtubeImage) return youtubeImage;

  // 4. 프론트매터 image
  if (post.data.image) return post.data.image;

  // 5. 없음
  return '';
};
