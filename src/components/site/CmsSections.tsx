import { useState, type ReactNode } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone, ArrowUpRight } from "lucide-react";
import type { Block, PageData } from "@/lib/cms";
import { phoneHref, whatsappHref } from "@/lib/cms";
import { CmsLink, useSite } from "@/lib/site-context";
import { ContactForm } from "./ContactForm";
import { ServiceCards, WorkCards, WorkTile } from "./ContentCards";
import {
  CompareTable,
  DepthSteps,
  LayerStack,
  Marquee,
  ProblemFix,
  StatsStrip,
  TiltCard,
} from "./Depth";
import { Checklist, CtaBanner, Faq, SectionHeading } from "./PageKit";
import { Metrics } from "./Metrics";
import { Problem } from "./Problem";
import { Process } from "./Process";
import { Reveal } from "./Reveal";
import { AudienceList, FeatureTabs, NumberedRows, ServiceList, StatementPair } from "./Sections";
import { WhyUs } from "./WhyUs";

// Block data is free-form JSON from the page builder; fields are checked where used.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D = any;
const list = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);
const pad = (i: number) => String(i + 1).padStart(2, "0");

function Shell({ d, children, className = "" }: { d: D; children: ReactNode; className?: string }) {
  return (
    <section className={`section-shell ${d.alt ? "section-alt" : ""} ${className}`}>
      <div className="content-shell">{children}</div>
    </section>
  );
}

function Heading({ d }: { d: D }) {
  return <SectionHeading eyebrow={d.eyebrow} title={d.title} text={d.text} />;
}

function WorkSection({ d, data }: { d: D; data: PageData }) {
  const items = list<string>(d.case_studies).length
    ? data.caseStudies.filter((c) => d.case_studies.includes(c.slug))
    : data.caseStudies;
  const categories = ["All", ...Array.from(new Set(data.caseStudies.map((c) => c.category)))];
  const [filter, setFilter] = useState("All");
  if (!d.filters)
    return (
      <Shell d={d}>
        <Heading d={d} />
        <div className="mt-12">
          <WorkCards items={items} />
        </div>
      </Shell>
    );
  const shown = filter === "All" ? items : items.filter((x) => x.category === filter);
  return (
    <Shell d={d}>
      <Heading d={d} />
      <div
        className="flex gap-2 overflow-x-auto pb-4"
        role="tablist"
        aria-label="Filter case studies"
      >
        {categories.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={filter === item}
            onClick={() => setFilter(item)}
            className={`min-h-11 shrink-0 rounded-xl border px-5 text-sm font-semibold ${filter === item ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}
          >
            {item}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {shown.map((item) => (
            <WorkTile key={item.slug} item={item} large />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
          <h2 className="text-2xl font-semibold">{filter} case studies are on the way</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            We are preparing these with client permission. Ask us for relevant examples on a call.
          </p>
          <CmsLink href="/contact" className="mt-6 inline-block font-semibold text-electric">
            Ask for examples →
          </CmsLink>
        </div>
      )}
    </Shell>
  );
}

function ContactChannels({ d }: { d: D }) {
  const { site } = useSite();
  const channels = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: site.phone,
      href: whatsappHref(site),
      note: "Fastest reply",
    },
    {
      icon: Mail,
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
      note: "Send briefs and documents",
    },
    { icon: Phone, label: "Phone", value: site.phone, href: phoneHref(site), note: site.hours },
  ];
  if (d.title) {
    return (
      <Shell d={d}>
        <div className="grid gap-12 lg:grid-cols-2">
          <Heading d={d} />
          <div className="grid gap-4 self-end">
            <div className="border-b border-border pb-4">
              <p className="flex items-start gap-3">
                <MapPin
                  className="mt-1 h-5 w-5 shrink-0 text-secondary-accent"
                  aria-hidden="true"
                />
                <span>{site.location}</span>
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <p className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-secondary-accent" aria-hidden="true" />
                <span>
                  {site.hours}, {site.hoursNote}
                </span>
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <a className="flex items-start gap-3 text-electric" href={`mailto:${site.email}`}>
                <Mail className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
                {site.email}
              </a>
            </div>
            <div className="border-b border-border pb-4">
              <a
                className="flex items-start gap-3 text-electric"
                href={whatsappHref(site)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
                WhatsApp {site.phone}
              </a>
            </div>
          </div>
        </div>
      </Shell>
    );
  }
  return (
    <Shell d={d}>
      <div className="border-b border-border">
        {channels.map(({ icon: Icon, label, value, href, note }) => (
          <a
            key={label}
            className="group relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 overflow-hidden border-t border-border py-7 sm:gap-8"
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
          >
            <span
              className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-electric/15 via-electric/5 to-transparent transition-transform duration-500 group-hover:scale-x-100"
              aria-hidden="true"
            />
            <span className="relative grid h-12 w-12 place-items-center rounded-xl border border-border bg-background text-electric">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="relative min-w-0">
              <span className="eyebrow block">
                {label} · {note}
              </span>
              <span className="mt-1 block font-display text-xl font-bold break-words sm:text-3xl">
                {value}
              </span>
            </span>
            <ArrowUpRight
              className="relative h-6 w-6 text-muted-foreground transition-all duration-300 group-hover:rotate-45 group-hover:text-electric"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>
    </Shell>
  );
}

function CarePlansSection({ d, data }: { d: D; data: PageData }) {
  const plans = data.carePlans;
  return (
    <Shell d={d}>
      <Heading d={d} />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <TiltCard
            key={plan.name}
            className={`flex flex-col ${plan.is_highlighted ? "glow-border" : ""}`}
          >
            <span className="eyebrow">{plan.label ?? `Plan ${i + 1}`}</span>
            <h3 className="mt-6 text-3xl font-semibold">{plan.name}</h3>
            <p className="mt-3 text-muted-foreground">{plan.for}</p>
            <div className="mt-6 border-t border-border pt-6">
              <Checklist items={plan.points} columns={1} />
            </div>
          </TiltCard>
        ))}
      </div>
    </Shell>
  );
}

function TechGroupsSection({ d, data }: { d: D; data: PageData }) {
  return (
    <Shell d={d}>
      <Heading d={d} />
      <div className="mt-12 border-b border-border">
        {data.techGroups.map((g, i) => (
          <Reveal key={g.title} delay={(i % 4) * 0.05}>
            <div className="grid gap-5 border-t border-border py-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-12">
              <div>
                <p className="font-display text-sm text-electric">{pad(i)}</p>
                <h3 className="mt-2 font-display text-2xl font-bold">{g.title}</h3>
                <p className="mt-2 text-muted-foreground">{g.text}</p>
              </div>
              <div className="flex flex-wrap content-start gap-2">
                {g.core.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-primary/60 bg-primary/15 px-4 py-2 text-sm shadow-[0_0_18px_-6px_var(--electric)]"
                  >
                    {t}
                  </span>
                ))}
                {g.also.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          Core
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border border-border" />
          Also used
        </span>
      </p>
    </Shell>
  );
}

/** Renders one page-builder block from the CMS. Unknown block types render nothing. */
export function CmsBlock({ block, data }: { block: Block; data: PageData }) {
  const d: D = block.data ?? {};
  switch (block.type) {
    case "numbered_rows":
      return (
        <Shell d={d}>
          <Heading d={d} />
          <NumberedRows items={list(d.items)} columns={(Number(d.columns) || 2) as 1 | 2 | 3} />
        </Shell>
      );
    case "feature_tabs":
      return (
        <Shell d={d}>
          <Heading d={d} />
          <FeatureTabs items={list(d.items)} labels={list<string>(d.labels)} />
        </Shell>
      );
    case "audience_list":
      return (
        <Shell d={d}>
          <Heading d={d} />
          <AudienceList items={list(d.items)} />
        </Shell>
      );
    case "steps":
      return (
        <Shell d={d}>
          <Heading d={d} />
          <DepthSteps steps={list(d.items)} />
        </Shell>
      );
    case "stages":
      return (
        <Shell d={d}>
          <Heading d={d} />
          <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-8">
            {list<D>(d.items).map((s, i, all) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="group">
                  <div className="flex gap-1.5" aria-hidden="true">
                    {all.map((_, j) => (
                      <span
                        key={j}
                        className={`h-1.5 flex-1 rounded-full ${j <= i ? "bg-gradient-to-r from-electric to-cyan-glow" : "bg-border"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-6 eyebrow">Stage {i + 1}</p>
                  <h3 className="mt-3 font-display text-5xl font-bold transition-colors group-hover:text-electric">
                    {s.title}
                  </h3>
                  <p className="mt-4 text-lg leading-8 text-muted-foreground">{s.text}</p>
                  {s.help ? <p className="mt-5 text-secondary-accent">→ {s.help}</p> : null}
                </div>
              </Reveal>
            ))}
          </div>
        </Shell>
      );
    case "problem_fix":
      return (
        <Shell d={d}>
          <Heading d={d} />
          <ProblemFix rows={list(d.rows)} />
        </Shell>
      );
    case "cards":
      return (
        <Shell d={d}>
          <Heading d={d} />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {list<D>(d.items).map((m) => {
              const body = (
                <>
                  <span className="eyebrow">{m.label}</span>
                  <h3 className="mt-6 text-2xl font-semibold">{m.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{m.text}</p>
                </>
              );
              const isLink = typeof m.footnote === "string" && m.footnote.startsWith("/");
              return (
                <TiltCard
                  key={m.title}
                  className={`flex flex-col ${m.highlight ? "glow-border" : ""}`}
                >
                  {isLink ? (
                    <CmsLink href={m.footnote} className="flex h-full flex-col">
                      {body}
                      <span className="mt-auto pt-6 text-sm font-semibold text-electric">
                        Learn more →
                      </span>
                    </CmsLink>
                  ) : (
                    <>
                      {body}
                      {m.footnote ? (
                        <p className="mt-auto pt-6 text-sm text-secondary-accent">{m.footnote}</p>
                      ) : null}
                    </>
                  )}
                </TiltCard>
              );
            })}
          </div>
          {d.note ? <p className="mt-8 text-muted-foreground">{d.note}</p> : null}
        </Shell>
      );
    case "compare_table":
      return (
        <Shell d={d}>
          <Heading d={d} />
          <CompareTable
            caption={d.title ?? "Comparison"}
            columns={list(d.columns)}
            rows={list<D>(d.rows).map((r) => ({ label: r.label, values: list<string>(r.values) }))}
          />
        </Shell>
      );
    case "statement_pair":
      return (
        <Shell d={d}>
          <StatementPair
            items={list<D>(d.items).map((it) => ({
              eyebrow: it.eyebrow,
              title: it.title,
              text: (
                <>
                  {it.text}
                  {it.link_url ? (
                    <>
                      {" "}
                      <CmsLink href={it.link_url} className="text-electric">
                        {it.link_label || "Learn more →"}
                      </CmsLink>
                    </>
                  ) : null}
                </>
              ),
            }))}
          />
        </Shell>
      );
    case "checklist": {
      const principles = list<D>(d.principles);
      const layers = list<string>(d.layers);
      return (
        <Shell d={d} className="overflow-hidden">
          <div className={`grid items-center gap-12 ${layers.length ? "lg:grid-cols-2" : ""}`}>
            <div>
              <Heading d={d} />
              {list<string>(d.items).length ? (
                <div className="mt-8">
                  <Checklist items={list<string>(d.items)} columns={d.two_columns ? 2 : 1} />
                </div>
              ) : null}
              {principles.length ? (
                <div
                  className={`mt-10 grid gap-x-6 gap-y-5 ${principles.length > 3 ? "sm:grid-cols-2" : ""}`}
                >
                  {principles.map((p) => (
                    <div key={p.title} className="border-l-2 border-electric/60 pl-4">
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {layers.length ? (
              <Reveal>
                <LayerStack layers={layers} />
              </Reveal>
            ) : null}
          </div>
        </Shell>
      );
    }
    case "area_checklists":
      return (
        <Shell d={d}>
          <Heading d={d} />
          <div className="mt-12 grid gap-x-16 md:grid-cols-2">
            {list<D>(d.items).map((a, i) => (
              <div key={a.title} className="group border-t border-border pt-8 pb-4">
                <span className="depth-step-index transition-all duration-500 group-hover:[-webkit-text-stroke-color:var(--cyan-glow)]">
                  {pad(i)}
                </span>
                <h3 className="mt-4 font-display text-3xl font-bold">{a.title}</h3>
                <div className="mt-5">
                  <Checklist items={list<string>(a.points)} />
                </div>
              </div>
            ))}
          </div>
        </Shell>
      );
    case "timeline":
      return (
        <Shell d={d}>
          <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Heading d={d} />
            </div>
            <ol className="relative space-y-12 border-l border-border pl-8">
              {list<D>(d.items).map((s, i) => (
                <li key={s.title} className="relative list-none">
                  <Reveal delay={i * 0.06}>
                    <span
                      className="absolute top-1 -left-[39px] h-3.5 w-3.5 rounded-full bg-electric shadow-[0_0_18px_color-mix(in_oklab,var(--electric)_80%,transparent)]"
                      aria-hidden="true"
                    />
                    <div className="pb-4">
                      {s.label ? <p className="eyebrow">{s.label}</p> : null}
                      <h3 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                        {s.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-lg leading-8 text-muted-foreground">
                        {s.text}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </Shell>
      );
    case "value_grid":
      return (
        <Shell d={d}>
          <Heading d={d} />
          <div className="mt-12 grid gap-x-16 md:grid-cols-2">
            {list<D>(d.items).map((v, i) => (
              <div key={v.title} className="group border-t border-border py-10">
                <span className="depth-step-index transition-all duration-500 group-hover:[-webkit-text-stroke-color:var(--cyan-glow)]">
                  {pad(i)}
                </span>
                <h3 className="mt-4 font-display text-4xl font-bold">{v.title}</h3>
                <p className="mt-4 max-w-md text-lg leading-8 text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </Shell>
      );
    case "fact_grid":
      return (
        <Shell d={d}>
          <Heading d={d} />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {list<D>(d.items).map((p) => (
              <div key={p.title} className="bg-card p-7">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </Shell>
      );
    case "stats":
      if (d.animated) return <Metrics />;
      return (
        <Shell d={d}>
          <Heading d={d} />
          <StatsStrip className={d.title || d.eyebrow ? "mt-12" : ""} />
        </Shell>
      );
    case "problem_merge":
      return (
        <Problem
          eyebrow={d.eyebrow}
          title={d.title}
          subtitle={d.subtitle}
          fragments={list(d.fragments)}
          logoCaption={d.logo_caption}
          text={d.text}
          rows={list(d.rows)}
        />
      );
    case "why_grid":
      return <WhyUs eyebrow={d.eyebrow} title={d.title} items={list(d.items)} />;
    case "scroll_process":
      return <Process eyebrow={d.eyebrow} title={d.title} items={list(d.items)} />;
    case "marquee": {
      const items = list<string>(d.items).length
        ? list<string>(d.items)
        : Array.from(
            new Set([
              ...data.techGroups.flatMap((g) => [...g.core, ...g.also]),
              ...data.services.flatMap((s) => s.stack),
            ]),
          );
      return (
        <Shell d={d}>
          <Heading d={d} />
          <div className={d.title ? "mt-10" : ""}>
            <Marquee items={items} />
          </div>
          {d.link_url ? (
            <p className="mt-8">
              <CmsLink href={d.link_url} className="text-electric">
                {d.link_label || "Learn more →"}
              </CmsLink>
            </p>
          ) : null}
        </Shell>
      );
    }
    case "services":
      return (
        <Shell d={d}>
          <Heading d={d} />
          {d.style === "cards" ? (
            <div className="mt-12">
              <ServiceCards
                slugs={list(d.services)}
                detailed={!d.eyebrow || d.eyebrow === "What we do"}
              />
            </div>
          ) : (
            <ServiceList slugs={list(d.services)} />
          )}
        </Shell>
      );
    case "work":
      return <WorkSection d={d} data={data} />;
    case "care_plans":
      return <CarePlansSection d={d} data={data} />;
    case "tech_groups":
      return <TechGroupsSection d={d} data={data} />;
    case "contact_form":
      return (
        <Shell d={d}>
          <div className="grid gap-10 lg:grid-cols-[1fr_.72fr]">
            <div>
              <Heading d={d} />
              <div className="mt-8">
                <ContactForm variant={d.variant === "audit" ? "audit" : "contact"} />
              </div>
            </div>
            {list<string>(d.aside_items).length ? (
              <aside className="space-y-5 lg:pt-24">
                <div className="surface-card">
                  <h2 className="text-xl font-semibold">{d.aside_title}</h2>
                  <div className="mt-5">
                    <Checklist items={list<string>(d.aside_items)} columns={1} />
                  </div>
                </div>
              </aside>
            ) : null}
          </div>
        </Shell>
      );
    case "contact_channels":
      return <ContactChannels d={d} />;
    case "rich_text":
      return (
        <Shell d={d}>
          <div className="max-w-[768px]">
            <Heading d={d} />
            <div className="cms-prose mt-6" dangerouslySetInnerHTML={{ __html: d.content ?? "" }} />
          </div>
        </Shell>
      );
    case "faq":
      return <Faq items={d.use_common ? undefined : list(d.items)} title={d.title} />;
    case "cta":
      return <CtaBanner title={d.title} text={d.text} label={d.button_label} />;
    default:
      return null;
  }
}

export function CmsSections({ data }: { data: PageData }) {
  return (
    <>
      {data.page.sections.map((block, i) => (
        <CmsBlock key={`${block.type}-${i}`} block={block} data={data} />
      ))}
    </>
  );
}
