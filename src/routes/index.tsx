import { createFileRoute, notFound } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { CmsSections } from "@/components/site/CmsSections";
import { loadPage } from "@/lib/cms";
import { cmsLinks, cmsSeo, notFoundMeta } from "@/lib/seo";

// Homepage content is edited in the CMS: Pages → Home. Each line of the headline is animated separately.
export const Route = createFileRoute("/")({
  loader: async () => {
    const data = await loadPage("home");
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: cmsSeo(loaderData.page.seo, "LogicsGrid", loaderData.page.hero.text ?? ""),
          links: cmsLinks(loaderData.page.seo),
        }
      : { meta: notFoundMeta },
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  const { hero } = data.page;
  return (
    <>
      <Hero eyebrow={hero.eyebrow} title={hero.title} text={hero.text} labels={hero.labels} />
      <CmsSections data={data} />
    </>
  );
}
