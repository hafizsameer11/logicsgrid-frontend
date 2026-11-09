import type { Seo } from "./cms";

/** Builds per-route head meta: "Page | LogicsGrid" title plus description, Open Graph and Twitter tags. */
export function seo(title: string, description: string, type: "website" | "article" = "website") {
  const full = `${title} | LogicsGrid`;
  return [
    { title: full },
    { name: "description", content: description },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: full },
    { name: "twitter:description", content: description },
  ];
}

/**
 * Head meta from the SEO fields edited in the CMS. A meta title that already contains
 * "LogicsGrid" is used as is; otherwise " | LogicsGrid" is appended.
 */
export function cmsSeo(
  fields: Seo | undefined,
  fallbackTitle: string,
  fallbackDescription = "",
  type: "website" | "article" = "website",
) {
  const title = fields?.seo_title || fallbackTitle;
  const full = title.includes("LogicsGrid") ? title : `${title} | LogicsGrid`;
  const description = fields?.seo_description || fallbackDescription;
  const meta: Record<string, string>[] = [
    { title: full },
    { name: "description", content: description },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: full },
    { name: "twitter:description", content: description },
  ];
  if (fields?.seo_keywords) meta.push({ name: "keywords", content: fields.seo_keywords });
  if (fields?.og_image)
    meta.push(
      { property: "og:image", content: fields.og_image },
      { name: "twitter:image", content: fields.og_image },
    );
  if (fields?.noindex) meta.push({ name: "robots", content: "noindex, nofollow" });
  return meta;
}

export function cmsLinks(fields: Seo | undefined) {
  return fields?.canonical_url ? [{ rel: "canonical", href: fields.canonical_url }] : [];
}

export const notFoundMeta = [
  { title: "Not found | LogicsGrid" },
  { name: "robots", content: "noindex" },
];
