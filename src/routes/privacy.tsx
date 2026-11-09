import { createFileRoute, notFound } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { loadPage } from "@/lib/cms";
import { cmsLinks, cmsSeo, notFoundMeta } from "@/lib/seo";

// Content for this page is edited in the CMS: Pages → Privacy policy.
export const Route = createFileRoute("/privacy")({
  loader: async () => {
    const data = await loadPage("privacy");
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: cmsSeo(loaderData.page.seo, "Privacy policy", loaderData.page.hero.text ?? ""),
          links: cmsLinks(loaderData.page.seo),
        }
      : { meta: notFoundMeta },
  component: Page,
});

function Page() {
  return <CmsPage data={Route.useLoaderData()} />;
}
