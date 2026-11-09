import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { cms } from "@/lib/cms";
import { useSite } from "@/lib/site-context";
import { WorkCards } from "@/components/site/ContentCards";
import { AudienceList, FeatureTabs, ServiceList, StatementPair } from "@/components/site/Sections";
import { DepthSteps, HeroCube, LayerStack, ProblemFix } from "@/components/site/Depth";
import {
  Checklist,
  Chips,
  CtaBanner,
  Faq,
  HeroActions,
  MobileStickyCta,
  PageHero,
  SectionHeading,
  TiltedVisual,
} from "@/components/site/PageKit";
import { Reveal } from "@/components/site/Reveal";
import { cmsLinks, cmsSeo, notFoundMeta } from "@/lib/seo";

// Services are edited in the CMS: Content → Services.
export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const service = await cms.service(params.slug);
    if (!service) throw notFound();
    const caseStudies = await cms.caseStudies();
    return { service, caseStudies };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: cmsSeo(loaderData.service.seo, loaderData.service.title, loaderData.service.short),
          links: cmsLinks(loaderData.service.seo),
        }
      : { meta: notFoundMeta },
  component: Page,
});

function Page() {
  const { service, caseStudies } = Route.useLoaderData();
  const { site } = useSite();
  const deploymentIncluded = site.deploymentIncluded;
  const relatedWork = caseStudies.filter((c) => c.services.includes(service.slug));
  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.title}
        text={service.intro}
        visual={<HeroCube labels={service.tags} />}
      >
        <HeroActions primary="Discuss your project" />
      </PageHero>

      <section className="section-shell">
        <div className="content-shell grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Overview"
              title="What this service covers"
              text={service.short}
            />
            <p className="mt-5 text-muted-foreground">
              Every project is handled by one team, from the first workshop to deployment and
              support. You get a fixed-scope proposal, weekly progress updates, and full ownership
              of what we build.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {service.tags.map((t) => (
                <span key={t} className="glass-panel rounded-full px-4 py-2 text-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <Reveal>
            {service.image ? (
              <img
                src={service.image}
                alt={service.title}
                className="w-full rounded-2xl object-cover"
                loading="lazy"
              />
            ) : (
              <TiltedVisual label={service.title} />
            )}
          </Reveal>
        </div>
      </section>

      <section className="section-shell section-alt">
        <div className="content-shell">
          <SectionHeading eyebrow="Who it's for" title="Built for teams ready to move" />
          <AudienceList items={service.audience} />
        </div>
      </section>

      <section className="section-shell">
        <div className="content-shell">
          <SectionHeading
            eyebrow="Problems we solve"
            title="Remove the friction holding you back"
          />
          <ProblemFix rows={service.problems} />
        </div>
      </section>

      <section className="section-shell section-alt">
        <div className="content-shell">
          <SectionHeading eyebrow="What we build" title="Capabilities inside this service" />
          <FeatureTabs items={service.features} labels={service.tags} />
        </div>
      </section>

      <section className="section-shell">
        <div className="content-shell grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Deliverables"
              title="Design to deployment, covered"
              text="What you receive by the end of the project."
            />
            <div className="mt-8">
              <Checklist items={service.deliverables} columns={1} />
            </div>
          </div>
          <Reveal>
            <LayerStack layers={["Design", "Build", "Deploy", "Support"]} />
          </Reveal>
        </div>
      </section>

      <section className="section-shell section-alt">
        <div className="content-shell">
          <SectionHeading
            eyebrow="How the project runs"
            title="Step by step, with something to show at each stage"
          />
          <DepthSteps steps={service.steps} />
        </div>
      </section>

      <section className="section-shell">
        <div className="content-shell grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Technology"
              title="A practical, modern stack"
              text="We work on any stack. These are the tools we usually recommend for this kind of project."
            />
            <div className="mt-8">
              <Chips items={service.stack} />
            </div>
            <p className="mt-6">
              <Link to="/technologies" className="text-electric">
                See our full stack →
              </Link>
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="Included" title="Deployment comes with it" />
            <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {deploymentIncluded.map((d) => (
                <li key={d.title} className="border-l-2 border-electric/60 pl-4">
                  <p className="font-semibold">{d.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {relatedWork.length ? (
        <section className="section-shell section-alt">
          <div className="content-shell">
            <SectionHeading eyebrow="Related work" title="Where we have done this before" />
            <div className="mt-12">
              <WorkCards items={relatedWork} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-shell">
        <div className="content-shell">
          <StatementPair
            items={[
              {
                eyebrow: "After launch",
                title: "Keep it secure, current and improving.",
                text: (
                  <>
                    Every project can move onto a care plan: monitoring, security updates, backups,
                    fixes and time for new features.{" "}
                    <Link to="/care-plans" className="text-electric">
                      Explore care plans →
                    </Link>
                  </>
                ),
              },
              {
                eyebrow: "Not sure yet?",
                title: "Start with a free audit.",
                text: (
                  <>
                    We review your current website or systems and send practical recommendations.{" "}
                    <Link to="/free-audit" className="text-electric">
                      Request an audit →
                    </Link>
                  </>
                ),
              },
            ]}
          />
        </div>
      </section>

      <Faq items={service.faqs} title="Common questions" />

      <section className="section-shell">
        <div className="content-shell">
          <SectionHeading eyebrow="Related services" title="Often combined with" />
          <ServiceList slugs={service.related} />
        </div>
      </section>

      <CtaBanner title="Ready to start your project?" />
      <MobileStickyCta />
    </>
  );
}
