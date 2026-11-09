import snapshot from "@/data/cms-snapshot.json";

/**
 * Content comes from the LogicsGrid CMS (Laravel + Filament, see /cms). If the CMS cannot be
 * reached, the site falls back to src/data/cms-snapshot.json so it never renders empty.
 * Refresh the snapshot with `npm run cms:snapshot` after publishing content.
 */
export const CMS_URL =
  (import.meta.env["VITE_CMS_URL"] as string | undefined)?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

export type TitleText = { title: string; text?: string; icon?: string };
export type Faq = { q: string; a: string };
export type Seo = {
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
  noindex?: boolean;
};
export type Link = { label: string; url: string };

export type Site = {
  name: string;
  tagline: string | null;
  logo: string | null;
  logoIcon: string | null;
  favicon: string | null;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  hours: string;
  hoursNote: string;
  stats: { value: number | string; suffix?: string | null; label: string }[];
  trustPoints: string[];
  socialLinks: { platform: string; url: string }[];
  headerLinks: Link[];
  footerColumns: { title: string; links: Link[] }[];
  budgetRanges: string[];
  commonFaqs: Faq[];
  deploymentIncluded: TitleText[];
  cta: { title: string | null; text: string | null; button: string | null };
  seo: {
    title: string | null;
    description: string | null;
    ogImage: string | null;
    googleAnalyticsId: string | null;
    googleSiteVerification: string | null;
  };
  services: { slug: string; title: string; short: string; icon: string | null }[];
};

export type Block = { type: string; data: Record<string, unknown> };
export type CmsPage = {
  slug: string;
  hero: {
    eyebrow: string | null;
    title: string;
    text: string | null;
    labels: string[];
    image: string | null;
  };
  sections: Block[];
  seo: Seo;
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  intro: string;
  icon: string | null;
  image: string | null;
  tags: string[];
  audience: TitleText[];
  problems: { problem: string; fix: string }[];
  features: TitleText[];
  deliverables: string[];
  steps: { title: string; text: string; output?: string }[];
  stack: string[];
  faqs: Faq[];
  related: string[];
  seo: Seo;
};

export type CaseStudy = {
  slug: string;
  name: string;
  clientType: string | null;
  category: string;
  platform: string | null;
  summary: string;
  challenge: string | null;
  solution: string | null;
  features: TitleText[];
  scope: string[];
  stack: string[];
  results: { value: string; label: string }[] | null;
  quote: string | null;
  quoteAuthor: string | null;
  projectUrl: string | null;
  services: string[];
  coverImage: string | null;
  gallery: string[];
  seo: Seo;
};

export type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  coverImage?: string;
  category?: string;
  categorySlug?: string;
  author?: string;
  readTime?: string;
  publishedAt?: string;
  seo: Seo;
};
export type PostList = { posts: Post[]; categories: { slug: string; name: string }[] };
export type TechGroup = { title: string; text: string | null; core: string[]; also: string[] };
export type CarePlan = {
  name: string;
  label: string | null;
  for: string | null;
  points: string[];
  is_highlighted: boolean;
};

type Snapshot = {
  site: Site;
  pages: Record<string, CmsPage>;
  services: Service[];
  caseStudies: CaseStudy[];
  posts: PostList;
  postBodies: Record<string, Post>;
  techGroups: TechGroup[];
  carePlans: CarePlan[];
};
const snap = snapshot as unknown as Snapshot;

class NotFoundError extends Error {}

/**
 * Short-lived cache of CMS responses, on the server and in the browser. Rendering one page needs
 * several API calls, so each response is reused for a few seconds; admin edits still show up
 * almost immediately.
 */
const CACHE_MS = 15_000;
const responseCache = new Map<string, { at: number; value: Promise<unknown> }>();

function get<T>(path: string, fallback: () => T | undefined): Promise<T> {
  const hit = responseCache.get(path);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.value as Promise<T>;
  const value = fetchFromCms(path, fallback);
  responseCache.set(path, { at: Date.now(), value });
  // Never keep a failed lookup, so a 404 or an outage is retried on the next request.
  value.catch(() => responseCache.delete(path));
  return value;
}

async function fetchFromCms<T>(path: string, fallback: () => T | undefined): Promise<T> {
  try {
    const res = await fetch(`${CMS_URL}/api/${path}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (res.status === 404) throw new NotFoundError(path);
    if (!res.ok) throw new Error(`CMS ${res.status} for ${path}`);
    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    const value = fallback();
    if (value === undefined) throw new NotFoundError(path);
    return value;
  }
}

/** Returns null when the CMS reports the item does not exist, so routes can 404. */
async function maybe<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
}

let siteCache: Promise<Site> | undefined;
export const cms = {
  site: () => {
    // Cache in the browser only; on the server every request reads fresh settings.
    if (typeof window === "undefined") return get<Site>("site", () => snap.site);
    siteCache ??= get<Site>("site", () => snap.site);
    return siteCache;
  },
  page: (slug: string) => maybe(get<CmsPage>(`pages/${slug}`, () => snap.pages[slug])),
  services: () => get<Service[]>("services", () => snap.services),
  service: (slug: string) =>
    maybe(get<Service>(`services/${slug}`, () => snap.services.find((s) => s.slug === slug))),
  caseStudies: () => get<CaseStudy[]>("case-studies", () => snap.caseStudies),
  caseStudy: (slug: string) =>
    maybe(
      get<CaseStudy>(`case-studies/${slug}`, () => snap.caseStudies.find((c) => c.slug === slug)),
    ),
  posts: () => get<PostList>("posts", () => snap.posts),
  post: (slug: string) => maybe(get<Post>(`posts/${slug}`, () => snap.postBodies[slug])),
  techGroups: () => get<TechGroup[]>("tech-groups", () => snap.techGroups),
  carePlans: () => get<CarePlan[]>("care-plans", () => snap.carePlans),
  async submitEnquiry(data: Record<string, string>) {
    const res = await fetch(`${CMS_URL}/api/enquiries`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  },
};

/** Collections a page's blocks depend on, fetched together with the page. */
export type PageData = {
  page: CmsPage;
  services: Service[];
  caseStudies: CaseStudy[];
  techGroups: TechGroup[];
  carePlans: CarePlan[];
  posts: PostList | null;
};

export async function loadPage(
  slug: string,
  opts: { posts?: boolean } = {},
): Promise<PageData | null> {
  const page = await cms.page(slug);
  if (!page) return null;
  const types = new Set(page.sections.map((b) => b.type));
  const [services, caseStudies, techGroups, carePlans, posts] = await Promise.all([
    cms.services(),
    types.has("work") ? cms.caseStudies() : Promise.resolve([] as CaseStudy[]),
    types.has("tech_groups") || types.has("marquee")
      ? cms.techGroups()
      : Promise.resolve([] as TechGroup[]),
    types.has("care_plans") ? cms.carePlans() : Promise.resolve([] as CarePlan[]),
    opts.posts ? cms.posts() : Promise.resolve(null),
  ]);
  return { page, services, caseStudies, techGroups, carePlans, posts };
}

export const whatsappHref = (site: Pick<Site, "whatsapp">) =>
  `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`;
export const phoneHref = (site: Pick<Site, "phone">) => `tel:${site.phone.replace(/[^\d+]/g, "")}`;
