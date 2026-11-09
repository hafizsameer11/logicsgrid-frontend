import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useSite } from "@/lib/site-context";
import { CmsIcon } from "./CmsIcon";
import { HeroCube } from "./Depth";
import { Reveal } from "./Reveal";

type Item = { title: string; text?: string | undefined; icon?: string | null | undefined };

const pad = (n: number) => String(n + 1).padStart(2, "0");

/** Editorial numbered rows on hairlines: no boxes. */
export function NumberedRows({
  items,
  columns = 2,
}: {
  items: readonly Item[];
  columns?: 1 | 2 | 3;
}) {
  const cols =
    columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : columns === 2 ? "md:grid-cols-2" : "";
  return (
    <div className={`mt-12 grid gap-x-12 ${cols}`}>
      {items.map(({ title, text, icon }, i) => (
        <Reveal key={title} delay={(i % 3) * 0.06}>
          <div className="group relative flex gap-5 border-t border-border py-7">
            <span
              className="absolute -top-px left-0 h-px w-0 bg-gradient-to-r from-electric to-cyan-glow transition-all duration-500 group-hover:w-full"
              aria-hidden="true"
            />
            <span className="font-display text-sm font-semibold text-electric">{pad(i)}</span>
            <div className="min-w-0">
              <h3 className="flex items-center gap-3 text-xl font-semibold">
                {icon ? <CmsIcon name={icon} className="h-5 w-5 text-secondary-accent" /> : null}
                {title}
              </h3>
              <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Interactive list with a 3D spotlight panel on desktop; plain numbered rows on smaller screens. */
export function FeatureTabs({
  items,
  labels,
}: {
  items: readonly Item[];
  labels?: readonly string[] | undefined;
}) {
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];
  if (!current) return null;
  return (
    <>
      <div className="lg:hidden">
        <NumberedRows items={items} columns={2} />
      </div>
      <div className="mt-14 hidden gap-10 lg:grid lg:grid-cols-[0.85fr_1.15fr]">
        <div role="tablist" aria-orientation="vertical" className="border-l border-border">
          {items.map((item, i) => (
            <button
              key={item.title}
              role="tab"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`relative flex w-full items-center gap-5 py-4 pr-4 pl-7 text-left transition-colors ${i === active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <span
                className={`absolute top-0 -left-px h-full w-0.5 transition-all ${i === active ? "bg-electric shadow-[0_0_14px_var(--electric)]" : "bg-transparent"}`}
                aria-hidden="true"
              />
              <span className="font-display text-xs text-electric">{pad(i)}</span>
              <span className="font-display text-lg font-semibold">{item.title}</span>
            </button>
          ))}
        </div>
        <div
          className="relative min-h-[420px] overflow-hidden rounded-3xl border border-border bg-[radial-gradient(80%_80%_at_80%_20%,color-mix(in_oklab,var(--electric)_18%,transparent),transparent_70%)]"
          role="tabpanel"
        >
          <div className="depth-floor" aria-hidden="true" />
          <div className="absolute -top-6 -right-10 opacity-90">
            <HeroCube labels={labels} size={150} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 bottom-0 p-10"
            >
              {current.icon ? (
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-background/70 text-electric">
                  <CmsIcon name={current.icon} className="h-5 w-5" />
                </span>
              ) : null}
              <p className="mt-6 font-display text-sm text-electric">
                {pad(active)} / {pad(items.length - 1)}
              </p>
              <h3 className="mt-2 max-w-md font-display text-4xl font-bold">{current.title}</h3>
              <p className="mt-4 max-w-lg text-lg leading-8 text-muted-foreground">
                {current.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

/** Big typographic rows for "who it's for". */
export function AudienceList({
  items,
}: {
  items: readonly { title: string; text?: string | undefined }[];
}) {
  return (
    <div className="mt-12 border-b border-border">
      {items.map((a, i) => (
        <Reveal key={a.title} delay={i * 0.05}>
          <div className="group grid gap-3 border-t border-border py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-10">
            <h3 className="font-display text-2xl font-bold transition-all duration-300 group-hover:translate-x-2 group-hover:text-electric sm:text-4xl">
              {a.title}
            </h3>
            <p className="text-lg leading-8 text-muted-foreground">{a.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Large hover rows linking to services, used wherever services are cross-linked. */
export function ServiceList({ slugs }: { slugs?: readonly string[] | undefined }) {
  const { services } = useSite();
  const data = slugs?.length ? services.filter((s) => slugs.includes(s.slug)) : services;
  return (
    <div className="mt-12 border-b border-border">
      {data.map((s) => {
        const index = services.indexOf(s);
        return (
          <Link
            key={s.slug}
            to="/services/$slug"
            params={{ slug: s.slug }}
            className="group relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 overflow-hidden border-t border-border py-7 sm:gap-8"
          >
            <span
              className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-electric/15 via-electric/5 to-transparent transition-transform duration-500 group-hover:scale-x-100"
              aria-hidden="true"
            />
            <span className="relative font-display text-sm text-electric">{pad(index)}</span>
            <span className="relative min-w-0">
              <span className="block font-display text-2xl font-bold sm:text-3xl">{s.title}</span>
              <span className="mt-1 block text-muted-foreground">{s.short}</span>
            </span>
            <span className="relative grid h-12 w-12 place-items-center rounded-full border border-border transition-all duration-300 group-hover:rotate-45 group-hover:border-electric group-hover:bg-electric group-hover:text-primary-foreground">
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

/** Two big statements side by side with a glowing divider, instead of two cards. */
export function StatementPair({
  items,
}: {
  items: readonly { eyebrow?: string | undefined; title: string; text?: ReactNode }[];
}) {
  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-0">
      {items.map((it, i) => (
        <Reveal key={it.title} delay={i * 0.1}>
          <div className={`relative ${i === 1 ? "md:pl-14" : "md:pr-14"}`}>
            {i === 1 ? (
              <span
                className="absolute top-0 bottom-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-electric to-transparent md:block"
                aria-hidden="true"
              />
            ) : null}
            {it.eyebrow ? <p className="eyebrow">{it.eyebrow}</p> : null}
            <h2 className="mt-5 bg-gradient-to-br from-foreground via-foreground to-electric bg-clip-text font-display text-4xl leading-tight font-bold text-transparent sm:text-5xl">
              {it.title}
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{it.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
