import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { CaseStudy } from "@/lib/cms";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into view once, with an optional stagger index. */
function Rise({
  children,
  i = 0,
  className,
}: {
  children: ReactNode;
  i?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: i * 0.08, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Browser-window frame around a screenshot, so every project image looks consistent. */
function Frame({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f1a] shadow-[0_50px_100px_-40px_color-mix(in_oklab,var(--electric)_60%,transparent)]">
      <div
        className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3"
        aria-hidden="true"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 h-5 flex-1 rounded-md bg-white/5" />
      </div>
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        className="block w-full object-cover"
      />
    </div>
  );
}

/** Hero visual: the cover image floats gently and tilts with the pointer. */
export function HeroShowcase({ item }: { item: CaseStudy }) {
  const reduce = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  if (!item.coverImage) return null;
  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({
          x: ((e.clientY - r.top) / r.height - 0.5) * -6,
          y: ((e.clientX - r.left) / r.width - 0.5) * 8,
        });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ perspective: 1400 }}
    >
      <div
        className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--electric)_35%,transparent),transparent)] blur-2xl"
        aria-hidden="true"
      />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ duration: 0.9, ease }}
        className="relative"
      >
        <motion.div
          animate={reduce ? { y: 0 } : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Frame src={item.coverImage} alt={`${item.name} cover`} eager />
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Project facts as glass tiles that stagger in. */
export function FactStrip({ facts }: { facts: [string, string][] }) {
  return (
    <section className="relative -mt-px pt-12">
      <div className="content-shell">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(([label, value], i) => (
            <Rise key={label} i={i}>
              <div className="h-full rounded-2xl border border-border bg-card/70 p-6 backdrop-blur transition-colors duration-500 hover:border-electric/50">
                <dt className="eyebrow">{label}</dt>
                <dd className="mt-3 font-medium leading-snug">{value}</dd>
              </div>
            </Rise>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Large cover that flattens from a 3D tilt to flat as it scrolls into view. */
export function ScrollShowcase({ item }: { item: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });
  const rotateX = useTransform(p, [0, 1], [24, 0]);
  const scale = useTransform(p, [0, 1], [0.86, 1]);
  const opacity = useTransform(p, [0, 0.4], [0.3, 1]);
  const src = item.gallery[1] ?? item.coverImage;
  if (!src) return null;
  return (
    <section className="overflow-hidden py-16 md:py-24">
      <div className="content-shell" ref={ref} style={{ perspective: 1600 }}>
        <motion.div style={reduce ? {} : { rotateX, scale, opacity, transformOrigin: "50% 100%" }}>
          <Frame src={src} alt={`${item.name} product screen`} />
        </motion.div>
      </div>
    </section>
  );
}

/** Challenge and solution as two chapters joined by a line that draws itself on scroll. */
export function Story({
  challenge,
  solution,
}: {
  challenge: string | null;
  solution: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const parts = [
    ["01", "The challenge", challenge],
    ["02", "Our solution", solution],
  ].filter(([, , t]) => t) as [string, string, string][];
  if (!parts.length) return null;
  return (
    <section className="section-shell">
      <div className="content-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Rise>
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow">The story</p>
            <h2 className="section-title mt-4">From problem to product</h2>
            <p className="body-lead mt-5 max-w-md">
              What the client was dealing with, and how we approached it.
            </p>
          </div>
        </Rise>
        <div ref={ref} className="relative pl-10">
          <span className="absolute top-2 bottom-2 left-[11px] w-px bg-border" aria-hidden="true" />
          <motion.span
            style={{ height }}
            className="absolute top-2 left-[11px] w-px bg-gradient-to-b from-electric to-cyan-glow"
            aria-hidden="true"
          />
          {parts.map(([n, title, text], i) => (
            <Rise key={n} i={i} className={i ? "mt-14" : ""}>
              <span
                className="absolute -left-0 mt-1 grid h-6 w-6 place-items-center rounded-full border border-electric/60 bg-background text-[10px] font-bold text-electric shadow-[0_0_20px_color-mix(in_oklab,var(--electric)_50%,transparent)]"
                aria-hidden="true"
              />
              <p className="font-display text-sm font-semibold text-electric">{n}</p>
              <h3 className="mt-2 text-2xl">{title}</h3>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{text}</p>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Feature cards with a glow that follows the pointer. */
export function FeatureGrid({ features }: { features: CaseStudy["features"] }) {
  if (!features.length) return null;
  return (
    <section className="section-shell section-alt">
      <div className="content-shell">
        <Rise>
          <p className="eyebrow">Key features</p>
          <h2 className="section-title mt-4 max-w-2xl">What we built into it</h2>
        </Rise>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {features.map((f, i) => (
            <Rise key={f.title} i={i}>
              <div
                className="group relative h-full overflow-hidden rounded-3xl border border-border bg-background p-8 transition-all duration-500 hover:-translate-y-1 hover:border-electric/50"
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(360px circle at var(--mx) var(--my), color-mix(in oklab, var(--electric) 16%, transparent), transparent 70%)",
                  }}
                  aria-hidden="true"
                />
                <span className="relative font-display text-5xl font-bold text-transparent [-webkit-text-stroke:1px_color-mix(in_oklab,var(--electric)_70%,transparent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="relative mt-6 text-xl">{f.title}</h3>
                {f.text ? (
                  <p className="relative mt-3 leading-7 text-muted-foreground">{f.text}</p>
                ) : null}
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Bento gallery with hover zoom and a keyboard-friendly lightbox. */
export function Gallery({ item }: { item: CaseStudy }) {
  const [open, setOpen] = useState<number | null>(null);
  const images = item.gallery;
  const go = useCallback(
    (d: number) => setOpen((o) => (o === null ? o : (o + d + images.length) % images.length)),
    [images.length],
  );
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);
  if (!images.length) return null;
  return (
    <section className="section-shell">
      <div className="content-shell">
        <Rise>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Screens</p>
              <h2 className="section-title mt-4">Inside the product</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {images.length} screens · click any image to enlarge
            </p>
          </div>
        </Rise>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {images.map((src, i) => {
            // The first screen gets a full-width tile; the rest sit two per row.
            // Tiles are 16:10 and images are contained, so no screen is cropped.
            const span = i === 0 || (i === images.length - 1 && i % 2 === 1) ? "md:col-span-2" : "";
            return (
              <Rise key={src} i={i % 4} className={span}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-[#0b0f1a] text-left"
                  aria-label={`Enlarge screen ${i + 1} of ${images.length}`}
                >
                  <img
                    src={src}
                    alt={`${item.name} screen ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute right-4 bottom-4 grid h-10 w-10 translate-y-3 place-items-center rounded-full bg-white/90 text-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <Expand className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
              </Rise>
            );
          })}
        </div>
      </div>
      <AnimatePresence>
        {open !== null ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${item.name} screens`}
          >
            <motion.img
              key={images[open]}
              src={images[open]}
              alt={`${item.name} screen ${open + 1}`}
              className="max-h-full max-w-full rounded-xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => setOpen(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  aria-label="Previous screen"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  aria-label="Next screen"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
                <span className="absolute bottom-5 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
                  {open + 1} / {images.length}
                </span>
              </>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

/** Scope checklist beside the technology stack. */
export function ScopeAndStack({ scope, stack }: { scope: string[]; stack: string[] }) {
  return (
    <section className="section-shell">
      <div className={`content-shell grid gap-6 ${stack.length ? "lg:grid-cols-2" : ""}`}>
        <Rise>
          <div className="h-full rounded-3xl border border-border bg-card p-8 sm:p-10">
            <p className="eyebrow">Our scope</p>
            <h2 className="mt-4 text-3xl">What we delivered</h2>
            <ul className="mt-8 grid gap-3">
              {scope.map((s, i) => (
                <Rise key={s} i={i}>
                  <li className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-electric/15 text-electric">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {s}
                  </li>
                </Rise>
              ))}
            </ul>
          </div>
        </Rise>
        {stack.length ? (
          <Rise i={1}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-10">
              <div
                className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-electric/20 blur-3xl"
                aria-hidden="true"
              />
              <p className="eyebrow relative">Technology</p>
              <h2 className="relative mt-4 text-3xl">Tools chosen for the job</h2>
              <div className="relative mt-8 flex flex-wrap gap-3">
                {stack.map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease }}
                    whileHover={{ y: -3 }}
                    className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>
          </Rise>
        ) : null}
      </div>
    </section>
  );
}

/** Full-width "next project" card with its cover sliding on hover. */
export function NextProject({ next }: { next: CaseStudy }) {
  return (
    <section className="section-shell">
      <div className="content-shell">
        <Rise>
          <Link
            to="/work/$slug"
            params={{ slug: next.slug }}
            className="group relative grid overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-2"
          >
            <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12">
              <p className="eyebrow">Next project</p>
              <h2 className="mt-4 font-display text-3xl font-bold transition-colors duration-500 group-hover:text-electric sm:text-5xl">
                {next.name}
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">{next.summary}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                View case study
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              </span>
            </div>
            {next.coverImage ? (
              <div className="relative min-h-64 overflow-hidden">
                <img
                  src={next.coverImage}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-left-top transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-card via-card/20 to-transparent" />
              </div>
            ) : null}
          </Link>
        </Rise>
      </div>
    </section>
  );
}

/** Thin progress bar at the top of the page showing how far the reader has scrolled. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-electric to-cyan-glow"
      aria-hidden="true"
    />
  );
}
