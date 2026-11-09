import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/lib/cms";
import { useSite } from "@/lib/site-context";
import { ProductVisual } from "./PageKit";
import { TiltCard } from "./Depth";
import { CmsIcon } from "./CmsIcon";

export function ServiceCards({
  slugs,
  detailed = false,
}: {
  slugs?: readonly string[] | undefined;
  detailed?: boolean;
}) {
  const { services } = useSite();
  const data = slugs?.length ? services.filter((s) => slugs.includes(s.slug)) : services;
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <TiltCard key={item.slug} className="group flex min-h-64 flex-col p-0">
          <Link
            to="/services/$slug"
            params={{ slug: item.slug }}
            className="flex h-full flex-col p-6"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-background text-electric tilt-lift">
                <CmsIcon name={item.icon} className="h-5 w-5" />
              </span>
              <span className="eyebrow">{String(services.indexOf(item) + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-8 text-2xl font-semibold">{item.title}</h3>
            <p className="mt-3 text-muted-foreground">{item.short}</p>
            {detailed ? (
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {item.deliverables.slice(0, 4).map((d) => (
                  <li key={d} className="flex gap-2">
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary-accent"
                      aria-hidden="true"
                    />
                    {d}
                  </li>
                ))}
              </ul>
            ) : null}
            <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-electric">
              Explore service{" "}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        </TiltCard>
      ))}
    </div>
  );
}

/** Case study tile; uses the uploaded cover image when there is one. */
export function WorkTile({ item, large = false }: { item: CaseStudy; large?: boolean }) {
  return (
    <TiltCard className="group p-0">
      <Link to="/work/$slug" params={{ slug: item.slug }} className="block">
        {item.coverImage ? (
          <img
            src={item.coverImage}
            alt={`${item.name} screenshot`}
            className={`w-full rounded-t-2xl object-cover ${large ? "aspect-[16/9]" : "aspect-[16/10]"}`}
            loading="lazy"
          />
        ) : (
          <ProductVisual label={item.name} compact={!large} />
        )}
        <div className={large ? "p-7" : "p-6"}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="eyebrow">{item.category}</p>
            {large ? (
              <span className="text-sm text-muted-foreground">
                {[item.clientType, item.platform].filter(Boolean).join(" · ")}
              </span>
            ) : null}
          </div>
          <h3 className={`mt-3 font-semibold ${large ? "text-3xl" : "text-2xl"}`}>{item.name}</h3>
          <p className="mt-3 text-muted-foreground">{item.summary}</p>
          {large ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {item.scope.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : null}
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-electric">
            View case study <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}

export function WorkCards({
  items,
  slugs,
}: {
  items: CaseStudy[];
  slugs?: readonly string[] | undefined;
}) {
  const data = slugs?.length ? items.filter((c) => slugs.includes(c.slug)) : items;
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {data.map((item) => (
        <WorkTile key={item.slug} item={item} />
      ))}
    </div>
  );
}
