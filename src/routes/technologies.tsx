import { createFileRoute, notFound } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { loadPage } from "@/lib/cms";
import { cmsLinks, cmsSeo, notFoundMeta } from "@/lib/seo";

// Content for this page is edited in the CMS: Pages → Technologies.
export const Route = createFileRoute("/technologies")({
  loader: async () => {
    const data = await loadPage("technologies");
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: cmsSeo(loaderData.page.seo, "Technologies", loaderData.page.hero.text ?? ""),
          links: cmsLinks(loaderData.page.seo),
        }
      : { meta: notFoundMeta },
  component: Page,
});

function Page() {
  return <CmsPage data={Route.useLoaderData()} />;
}
