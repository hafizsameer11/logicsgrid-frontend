import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CmsPageHero } from "@/components/site/CmsPage";
import { CmsSections } from "@/components/site/CmsSections";
import { TiltCard } from "@/components/site/Depth";
import { loadPage } from "@/lib/cms";
import { cmsLinks, cmsSeo, notFoundMeta } from "@/lib/seo";

// Hero and extra sections come from CMS Pages → Insights; the list comes from Blog → Posts.
export const Route = createFileRoute("/insights/")({
  loader: async () => {
    const data = await loadPage("insights", { posts: true });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: cmsSeo(loaderData.page.seo, "Insights", loaderData.page.hero.text ?? ""),
          links: cmsLinks(loaderData.page.seo),
        }
      : { meta: notFoundMeta },
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  const posts = data.posts?.posts ?? [];
  const categories = data.posts?.categories ?? [];
  const [category, setCategory] = useState<string | null>(null);
  const shown = category ? posts.filter((p) => p.categorySlug === category) : posts;
  return (
    <>
      <CmsPageHero data={data} />
      <section className="section-shell">
        <div className="content-shell">
          {categories.length > 1 ? (
            <div
              className="mb-10 flex flex-wrap gap-3"
              role="tablist"
              aria-label="Filter by category"
            >
              {[{ slug: null, name: "All" }, ...categories].map((c) => (
                <button
                  key={c.name}
                  role="tab"
                  aria-selected={category === c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={`min-h-11 rounded-full border px-5 text-sm ${category === c.slug ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          ) : null}
          {shown.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((post) => (
                <TiltCard key={post.slug} className="flex flex-col p-0">
                  <Link
                    to="/insights/$slug"
                    params={{ slug: post.slug }}
                    className="flex h-full flex-col"
                  >
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt=""
                        className="aspect-[16/9] w-full rounded-t-2xl object-cover"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="flex flex-1 flex-col p-6">
                      {post.category ? <p className="eyebrow">{post.category}</p> : null}
                      <h2 className="mt-5 text-2xl font-semibold">{post.title}</h2>
                      {post.excerpt ? (
                        <p className="mt-4 leading-7 text-muted-foreground">{post.excerpt}</p>
                      ) : null}
                      <p className="mt-auto pt-8 text-sm text-muted-foreground">
                        {[
                          post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : null,
                          post.readTime,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  </Link>
                </TiltCard>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">New articles are on the way.</p>
          )}
        </div>
      </section>
      <CmsSections data={data} />
    </>
  );
}
