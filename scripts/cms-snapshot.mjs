// Saves the CMS content to src/data/cms-snapshot.json, the offline fallback the site uses
// when the CMS API is unreachable. Usage: npm run cms:snapshot  (CMS_URL defaults to http://127.0.0.1:8000)
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const base = (process.env.CMS_URL ?? process.env.VITE_CMS_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
const get = async (path) => {
  const res = await fetch(`${base}/api/${path}`, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
};

const [site, services, caseStudies, posts, techGroups, carePlans, sitemap] = await Promise.all([
  get("site"), get("services"), get("case-studies"), get("posts"), get("tech-groups"), get("care-plans"), get("sitemap"),
]);

const pageSlugs = sitemap.urls.map((u) => u.path).filter((p) => !p.includes("/", 1)).map((p) => (p === "/" ? "home" : p.slice(1)));
const pages = Object.fromEntries(await Promise.all(pageSlugs.map(async (slug) => [slug, await get(`pages/${slug}`)])));
const postBodies = Object.fromEntries(await Promise.all(posts.posts.map(async (p) => [p.slug, await get(`posts/${p.slug}`)])));

const out = resolve(process.cwd(), "src/data/cms-snapshot.json");
writeFileSync(out, JSON.stringify({ site, pages, services, caseStudies, posts, postBodies, techGroups, carePlans }, null, 2));
console.log(`Saved ${Object.keys(pages).length} pages, ${services.length} services, ${caseStudies.length} projects, ${posts.posts.length} posts to ${out}`);
