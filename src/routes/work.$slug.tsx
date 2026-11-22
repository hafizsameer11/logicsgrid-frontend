import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { cms } from "@/lib/cms";
import { useSite } from "@/lib/site-context";
import { cmsLinks, cmsSeo, notFoundMeta } from "@/lib/seo";
import {
  FactStrip,
  FeatureGrid,
  Gallery,
  HeroShowcase,
  NextProject,
  ReadingProgress,
  ScopeAndStack,
  ScrollShowcase,
  Story,
} from "@/components/site/CaseStudy";
import {
  CtaBanner,
  HeroActions,
  MobileStickyCta,
  PageHero,
  SectionHeading,
  TiltedVisual,
} from "@/components/site/PageKit";
import { ServiceList } from "@/components/site/Sections";

// Case studies are edited in the CMS: Content → Projects.
export const Route = createFileRoute("/work/$slug")({
  loader: async ({ params }) => {
    const [item, all] = await Promise.all([cms.caseStudy(params.slug), cms.caseStudies()]);
    if (!item) throw notFound();
    return { item, all };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            ...cmsSeo(
              loaderData.item.seo,
              loaderData.item.name,
              loaderData.item.summary,
              "article",
            ),
            ...(loaderData.item.coverImage && !loaderData.item.seo.og_image
              ? [{ property: "og:image", content: loaderData.item.coverImage }]
              : []),
          ],
          links: cmsLinks(loaderData.item.seo),
        }
      : { meta: notFoundMeta },
  component: Page,
});

function Page() {
  const { item, all } = Route.useLoaderData();
  const { services } = useSite();
  const next =
    all.length > 1 ? all[(all.findIndex((c) => c.slug === item.slug) + 1) % all.length] : undefined;
  const usedServices = services.filter((s) => item.services.includes(s.slug));
  const facts = [
    ["Client", item.clientType],
    ["Category", item.category],
    ["Platform", item.platform],
    ["Services", usedServices.map((s) => s.title).join(", ")],
  ].filter(([, v]) => v) as [string, string][];
  const visual = item.coverImage ? (
    <HeroShowcase item={item} />
  ) : (
    <TiltedVisual label={item.name} />
  );
  return (
    <>
      <ReadingProgress />
      <PageHero
        eyebrow={`Case study · ${item.category}`}
        title={item.name}
        text={item.summary}
        visual={visual}
      >
        <HeroActions primary="Build something similar" />
        {item.projectUrl ? (
          <a
            href={item.projectUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-electric"
          >
            Visit the live project
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        ) : null}
      </PageHero>

      <FactStrip facts={facts} />
      <ScrollShowcase item={item} />
      <Story challenge={item.challenge} solution={item.solution} />

      {item.results?.length ? (
        <section className="section-shell">
          <div className="content-shell">
            <SectionHeading eyebrow="Results" title="What changed" />
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {item.results.map((r) => (
                <div key={r.label} className="bg-card p-6 sm:p-8">
                  <strong className="font-display text-4xl font-bold text-electric">
                    {r.value}
                  </strong>
                  <p className="mt-2 text-sm text-muted-foreground">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FeatureGrid features={item.features} />
      <Gallery item={item} />
      {/* Technology is only shown when the stack is known; an empty heading looks broken. */}
      <ScopeAndStack scope={item.scope} stack={item.stack} />

      {item.quote ? (
        <section className="section-shell section-alt">
          <div className="content-shell max-w-4xl">
            <blockquote className="font-display text-3xl leading-tight font-bold sm:text-4xl">
              “{item.quote}”
            </blockquote>
            {item.quoteAuthor ? (
              <p className="mt-6 text-muted-foreground">{item.quoteAuthor}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {usedServices.length ? (
        <section className="section-shell section-alt">
          <div className="content-shell">
            <SectionHeading eyebrow="Services used" title="Need something similar?" />
            <ServiceList slugs={item.services} />
          </div>
        </section>
      ) : null}

      {next ? <NextProject next={next} /> : null}

      <CtaBanner />
      <MobileStickyCta />
    </>
  );
}
