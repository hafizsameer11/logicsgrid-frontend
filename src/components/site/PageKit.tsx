import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { whatsappHref } from "@/lib/cms";
import { useSite } from "@/lib/site-context";
import { HeroCube } from "./Depth";

export function PageHero({
  eyebrow,
  title,
  text,
  children,
  visual,
  labels,
}: {
  eyebrow?: string | null | undefined;
  title: string;
  text?: string | null | undefined;
  children?: ReactNode;
  visual?: ReactNode;
  labels?: readonly string[] | undefined;
}) {
  return (
    <header className="relative overflow-hidden border-b border-border pt-32 pb-16 sm:pt-36 md:pb-24">
      <div className="bg-grid-lines absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="page-hero-glow absolute inset-0" aria-hidden="true" />
      <div className="depth-floor" aria-hidden="true" />
      <div className="content-shell relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="min-w-0">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="page-title mt-5 max-w-4xl">{title}</h1>
          {text ? <p className="body-lead mt-6 max-w-2xl">{text}</p> : null}
          {children ? (
            <div className="mt-9 flex flex-wrap items-center gap-4">{children}</div>
          ) : null}
        </div>
        {visual === null ? null : (
          <div className="hidden min-w-0 lg:block">{visual ?? <HeroCube labels={labels} />}</div>
        )}
      </div>
    </header>
  );
}

export function HeroActions({ primary, secondary }: { primary?: string; secondary?: ReactNode }) {
  const { site } = useSite();
  return (
    <>
      <Button asChild size="lg">
        <Link to="/contact">
          {primary ?? site.cta.button ?? "Book a consultation"}
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
      {secondary ?? (
        <Button asChild size="lg" variant="outline">
          <a href={whatsappHref(site)} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden="true" />
            WhatsApp us
          </a>
        </Button>
      )}
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow?: string | null | undefined;
  title?: string | null | undefined;
  text?: string | null | undefined;
  center?: boolean;
}) {
  if (!eyebrow && !title && !text) return null;
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {title ? <h2 className="section-title mt-4">{title}</h2> : null}
      {text ? <p className="body-lead mt-5">{text}</p> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`surface-card ${className}`}>{children}</article>;
}

/** Browser-frame placeholder until real project screenshots are supplied. */
export function ProductVisual({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div
      className={`product-visual ${compact ? "aspect-[16/10]" : "aspect-[16/9]"}`}
      role="img"
      aria-label={`${label} product interface placeholder`}
    >
      <div className="flex h-9 items-center gap-2 border-b border-border px-4" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-muted-foreground" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground" />
      </div>
      <div className="grid h-[calc(100%-2.25rem)] grid-cols-[28%_1fr] gap-3 p-4" aria-hidden="true">
        <div className="rounded-lg border border-border bg-secondary" />
        <div className="grid grid-rows-[42%_1fr] gap-3">
          <div className="rounded-lg bg-primary/15 ring-1 ring-primary/30" />
          <div className="grid grid-cols-2 gap-3">
            <span className="rounded-lg bg-secondary" />
            <span className="rounded-lg bg-secondary" />
          </div>
        </div>
      </div>
      <span className="sr-only">Replace with a real screenshot of {label}.</span>
    </div>
  );
}

/** ProductVisual tilted in 3D space, for hero and feature areas. */
export function TiltedVisual({ label }: { label: string }) {
  return (
    <div className="[perspective:1600px]">
      <div className="transition-transform duration-700 [transform:rotateY(-14deg)_rotateX(8deg)] hover:[transform:rotateY(-4deg)_rotateX(2deg)] motion-reduce:[transform:none]">
        <div className="rounded-2xl shadow-[0_40px_80px_-30px_color-mix(in_oklab,var(--electric)_55%,transparent)]">
          <ProductVisual label={label} />
        </div>
      </div>
    </div>
  );
}

export function Checklist({ items, columns = 2 }: { items: readonly string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-muted-foreground">
          <Check className="mt-1 h-4 w-4 shrink-0 text-secondary-accent" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Chips({ items }: { items: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function Faq({
  items,
  title,
  alt = true,
}: {
  items?: { q: string; a: string }[] | undefined;
  title?: string | null | undefined;
  alt?: boolean;
}) {
  const { site } = useSite();
  const list = items?.length ? items : site.commonFaqs;
  if (!list.length) return null;
  return (
    <section className={`section-shell ${alt ? "section-alt" : ""}`}>
      <div className="content-shell grid gap-12 lg:grid-cols-[0.65fr_1fr]">
        <div>
          <SectionHeading eyebrow="Questions" title={title || "Common questions"} />
          <p className="mt-6 text-muted-foreground">
            Still unsure?{" "}
            <a className="text-electric" href={whatsappHref(site)} target="_blank" rel="noreferrer">
              Ask us on WhatsApp
            </a>{" "}
            or email{" "}
            <a className="text-electric" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        </div>
        <Accordion type="single" collapsible className="border-t border-border">
          {list.map((item, index) => (
            <AccordionItem key={item.q} value={`faq-${index}`}>
              <AccordionTrigger className="min-h-14 text-left text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="pb-6 text-base leading-7 text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/** Closing call to action. Empty props fall back to the defaults in CMS Site settings. */
export function CtaBanner({
  title,
  text,
  label,
}: {
  title?: string | null | undefined;
  text?: string | null | undefined;
  label?: string | null | undefined;
}) {
  const { site } = useSite();
  return (
    <section className="section-shell border-t border-border">
      <div className="content-shell">
        <div className="cta-banner relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="page-hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow">Start a conversation</p>
            <h2 className="section-title mt-4">{title || site.cta.title}</h2>
            <p className="body-lead mt-4 max-w-2xl">{text || site.cta.text}</p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/contact">
                {label || site.cta.button || "Book a consultation"}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={whatsappHref(site)} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MobileStickyCta() {
  const { site } = useSite();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-lg md:hidden">
      <Button asChild size="lg" className="w-full">
        <Link to="/contact">{site.cta.button || "Book a consultation"}</Link>
      </Button>
    </div>
  );
}
