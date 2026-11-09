import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CtaBanner } from "@/components/site/PageKit";
import { cms } from "@/lib/cms";
import { cmsLinks, cmsSeo, notFoundMeta } from "@/lib/seo";

// Blog posts are written in the CMS: Blog → Posts.
export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ params }) => {
    const post = await cms.post(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            ...cmsSeo(loaderData.seo, loaderData.title, loaderData.excerpt ?? "", "article"),
            ...(loaderData.coverImage && !loaderData.seo.og_image
              ? [{ property: "og:image", content: loaderData.coverImage }]
              : []),
          ],
          links: cmsLinks(loaderData.seo),
        }
      : { meta: notFoundMeta },
  component: Page,
});

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

function Page() {
  const post = Route.useLoaderData();
  const meta = [formatDate(post.publishedAt), post.readTime, post.author].filter(Boolean);
  return (
    <>
      <article className="section-shell pt-36 sm:pt-40">
        <header className="mx-auto max-w-[800px] px-6">
          <Link to="/insights" className="text-sm text-electric">
            ← All insights
          </Link>
          {post.category ? <p className="eyebrow mt-8">{post.category}</p> : null}
          <h1 className="page-title mt-5">{post.title}</h1>
          {post.excerpt ? <p className="body-lead mt-7 max-w-3xl">{post.excerpt}</p> : null}
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-border py-4 text-sm text-muted-foreground">
            {meta.map((m, i) => (
              <span key={m} className="flex items-center gap-4">
                {i ? <span aria-hidden="true">·</span> : null}
                {m}
              </span>
            ))}
          </div>
        </header>
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt=""
            className="mx-auto mt-12 w-full max-w-[960px] rounded-2xl px-6 object-cover"
          />
        ) : null}
        <div
          className="cms-prose mx-auto mt-14 max-w-[800px] px-6"
          dangerouslySetInnerHTML={{ __html: post.body ?? "" }}
        />
      </article>
      <CtaBanner />
    </>
  );
}
