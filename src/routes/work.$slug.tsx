import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { cms } from "@/lib/cms";
import { useSite } from "@/lib/site-context";
import { cmsLinks, cmsSeo, notFoundMeta } from "@/lib/seo";
import { ProblemFix, TiltCard } from "@/components/site/Depth";
import {
  Checklist,
  Chips,
  CtaBanner,
  HeroActions,
  MobileStickyCta,
  PageHero,
  SectionHeading,
  TiltedVisual,
} from "@/components/site/PageKit";
import { NumberedRows, ServiceList } from "@/components/site/Sections";

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
    <img
      src={item.coverImage}
      alt={`${item.name} screenshot`}
      className="w-full rounded-2xl object-cover shadow-[0_40px_80px_-30px_color-mix(in_oklab,var(--electric)_55%,transparent)]"
    />
  ) : (
    <TiltedVisual label={item.name} />
  );
  return (
    <>
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
            className="text-sm font-semibold text-electric"
          >
            Visit the live project →
          </a>
        ) : null}
      </PageHero>

      <section className="pt-12">
        <div className="content-shell">
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(([label, value]) => (
              <div key={label} className="bg-card p-6">
                <dt className="eyebrow">{label}</dt>
                <dd className="mt-2 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {item.challenge || item.solution ? (
        <section className="section-shell">
          <div className="content-shell">
            <SectionHeading eyebrow="Challenge and solution" title="What needed solving" />
            <ProblemFix rows={[{ problem: item.challenge ?? "", fix: item.solution ?? "" }]} />
          </div>
        </section>
      ) : null}

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

      {item.features.length ? (
        <section className="section-shell section-alt">
          <div className="content-shell">
            <SectionHeading eyebrow="Key features" title="Focused on the work that matters" />
            <NumberedRows items={item.features} />
          </div>
        </section>
      ) : null}

      {item.gallery.length ? (
        <section className="section-shell">
          <div className="content-shell">
            <SectionHeading eyebrow="Screens" title="Inside the product" />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {item.gallery.map((src) => (
                <TiltCard key={src} className="p-0">
                  <img
                    src={src}
                    alt={`${item.name} screen`}
                    className="w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-shell">
        <div className="content-shell grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our scope" title="What we delivered" />
            <div className="mt-8">
              <Checklist items={item.scope} columns={1} />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Technology" title="Tools chosen for the job" />
            <div className="mt-8">
              <Chips items={item.stack} />
            </div>
          </div>
        </div>
      </section>

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

      {next ? (
        <section className="section-shell">
          <div className="content-shell">
            <p className="eyebrow">Next case study</p>
            <Link
              to="/work/$slug"
              params={{ slug: next.slug }}
              className="mt-4 inline-block font-display text-3xl font-semibold hover:text-electric sm:text-5xl"
            >
              {next.name} →
            </Link>
            <p className="mt-3 text-muted-foreground">{next.summary}</p>
          </div>
        </section>
      ) : null}

      <CtaBanner />
      <MobileStickyCta />
    </>
  );
}
