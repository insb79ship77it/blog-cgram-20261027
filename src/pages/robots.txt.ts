import type { APIRoute } from 'astro';

// 사이트 주소는 astro.config.mjs의 site 값을 그대로 사용합니다.
// 주소가 바뀌어도 이 파일은 수정할 필요가 없습니다.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap.xml', site).href;

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
