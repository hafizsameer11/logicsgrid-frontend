import { createFileRoute, notFound } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { loadPage } from "@/lib/cms";
import { cmsLinks, cmsSeo, notFoundMeta } from "@/lib/seo";

// Content for this page is edited in the CMS: Pages → Contact.
export const Route = createFileRoute("/contact")({
  loader: async () => {
    const data = await loadPage("contact");
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: cmsSeo(loaderData.page.seo, "Contact", loaderData.page.hero.text ?? ""),
          links: cmsLinks(loaderData.page.seo),
        }
      : { meta: notFoundMeta },
  component: Page,
});

function Page() {
  return <CmsPage data={Route.useLoaderData()} />;
}
