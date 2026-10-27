import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export const SITE_NAME = 'C-gram';
export const SITE_DESCRIPTION =
  '건강, 생활 정보, 뉴스를 한눈에 이해하기 쉽게 정리하는 정보 블로그입니다.';

export type Tone = 'health' | 'life' | 'news' | 'etc';

export const CONTACT_EMAIL = 'your-email@example.com';

export const CATEGORIES: { name: string; slug: string; tone: Tone }[] = [
  { name: '건강', slug: 'health', tone: 'health' },
  { name: '생활 정보', slug: 'life', tone: 'life' },
  { name: '뉴스', slug: 'news', tone: 'news' },
];

export const categorySlug = (name: string): string =>
  CATEGORIES.find((c) => c.name === name)?.slug ??
  name.trim().replace(/\s+/g, '-');

export const categoryTone = (name: string): Tone =>
  CATEGORIES.find((c) => c.name === name)?.tone ?? 'etc';

export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  }).format(date);

export const postUrl = (post: Post): string => `/posts/${post.id}/`;

// 초안(draft)을 제외하고 최신순으로 정렬
export const getSortedPosts = async (): Promise<Post[]> => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
};

export const tagSlug = (tag: string): string =>
  tag
    .trim()
    .toLowerCase()
    .replace(/[\/?#%\\]/g, '')
    .replace(/\s+/g, '-');

export const tagUrl = (tag: string): string => `/tags/${tagSlug(tag)}/`;

export interface TagInfo {
  name: string;
  slug: string;
  posts: Post[];
}

// 모든 글의 태그를 모아 글 수가 많은 순으로 정렬
export const getTags = async (): Promise<TagInfo[]> => {
  const posts = await getSortedPosts();
  const map = new Map<string, TagInfo>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      if (!slug) continue;
      const info = map.get(slug) ?? { name: tag.trim(), slug, posts: [] };
      if (!info.posts.includes(post)) info.posts.push(post);
      map.set(slug, info);
    }
  }

  return [...map.values()].sort(
    (a, b) =>
      b.posts.length - a.posts.length || a.name.localeCompare(b.name, 'ko'),
  );
};
