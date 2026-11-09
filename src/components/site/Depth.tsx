import { useRef, type CSSProperties, type ReactNode } from "react";
import { useSite } from "@/lib/site-context";
import { Reveal } from "./Reveal";

/** CSS-only glass cube that echoes the homepage 3D hero without loading WebGL on inner pages. */
export function HeroCube({
  labels = [],
  size = 220,
}: {
  labels?: readonly string[] | undefined;
  size?: number;
}) {
  const spots = ["-left-6 top-2", "-right-4 top-10", "-left-10 bottom-10", "-right-8 bottom-2"];
  return (
    <div
      className="relative mx-auto grid h-[300px] w-[300px] place-items-center sm:h-[360px] sm:w-[360px]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--electric)_24%,transparent),transparent_65%)] blur-2xl" />
      <div className="cube-scene relative" style={{ "--cube": `${size}px` } as CSSProperties}>
        <div className="cube">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="cube-face" />
          ))}
          <div className="cube-core">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="cube-face" />
            ))}
          </div>
        </div>
        <span className="cube-shadow" />
      </div>
      {labels.slice(0, 4).map((label, i) => (
        <span
          key={label}
          className={`glass-panel float-chip absolute rounded-full px-3 py-1 text-[11px] tracking-[0.2em] text-muted-foreground uppercase ${spots[i]}`}
          style={{ animationDelay: `${i * 0.8}s` }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

/** Card that tilts toward the pointer with a soft glare. Static on touch devices and reduced motion. */
export function TiltCard({
  children,
  className = "",
  as: Tag = "article",
}: {
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  function move(event: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width;
    const y = (event.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  }
  function leave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }
  const Comp = Tag as "article";
  return (
    <Comp
      ref={ref as React.Ref<HTMLElement>}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`tilt-card surface-card ${className}`}
    >
      {children}
    </Comp>
  );
}

/** Isometric stack of glass planes; layers spread apart on hover. */
export function LayerStack({
  layers,
  className = "",
}: {
  layers: readonly string[];
  className?: string;
}) {
  return (
    <div
      className={`layer-stack mx-auto h-[300px] w-full max-w-[340px] sm:h-[340px] ${className}`}
      role="img"
      aria-label={`Layers: ${layers.join(", ")}`}
    >
      <div className="layer-stack-inner mx-auto mt-16 h-44 w-44 sm:h-52 sm:w-52">
        {layers.map((layer, i) => (
          <div key={layer} className="layer-plane" style={{ "--i": i } as CSSProperties}>
            <span>{layer}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Company facts strip; values come only from site.ts. */
export function StatsStrip({ className = "" }: { className?: string }) {
  const { site } = useSite();
  return (
    <div
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4 ${className}`}
    >
      {site.stats.map((s) => (
        <div key={s.label} className="bg-card p-6 sm:p-8">
          <strong className="font-display text-4xl font-bold sm:text-5xl">
            {s.value}
            <span className="text-electric">{s.suffix}</span>
          </strong>
          <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export function Marquee({ items }: { items: readonly string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee" aria-label={items.join(", ")}>
      <div className="marquee-track" aria-hidden="true">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 rounded-full border border-border bg-card px-5 py-2.5 text-sm text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const railCols: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

/** Process timeline: a glowing rail with numbered nodes. Horizontal on desktop, vertical on mobile. */
export function DepthSteps({
  steps,
}: {
  steps: readonly { title: string; text: string; output?: string }[];
  columns?: 2 | 3;
}) {
  return (
    <ol
      className={`relative mt-14 grid gap-10 lg:gap-6 ${railCols[steps.length] ?? "lg:grid-cols-3"}`}
    >
      <span
        className="absolute top-2 bottom-2 left-6 w-px bg-gradient-to-b from-electric via-cyan-glow/60 to-transparent lg:top-6 lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:bg-gradient-to-r"
        aria-hidden="true"
      />
      {steps.map((step, i) => (
        <li key={step.title} className="group relative list-none pl-20 lg:pl-0">
          <span className="absolute top-0 left-0 grid h-12 w-12 place-items-center rounded-full border border-electric/70 bg-background font-display text-sm font-bold text-electric shadow-[0_0_24px_color-mix(in_oklab,var(--electric)_45%,transparent)] transition-transform duration-500 group-hover:scale-110 lg:relative">
            {String(i + 1).padStart(2, "0")}
          </span>
          <Reveal delay={i * 0.08}>
            <h3 className="text-xl font-semibold lg:mt-7">{step.title}</h3>
            <p className="mt-3 leading-7 text-muted-foreground">{step.text}</p>
            {step.output ? (
              <p className="mt-4 text-sm text-secondary-accent">→ {step.output}</p>
            ) : null}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

/** Problem on the left, how we fix it on the right. */
export function ProblemFix({ rows }: { rows: readonly { problem: string; fix: string }[] }) {
  return (
    <div className="mt-12 divide-y divide-border overflow-hidden rounded-2xl border border-border">
      <div className="hidden grid-cols-2 bg-card md:grid">
        <p className="eyebrow p-5">The problem</p>
        <p className="eyebrow border-l border-border p-5">How we solve it</p>
      </div>
      {rows.map((row) => (
        <div key={row.problem} className="grid md:grid-cols-2">
          <p className="p-5 text-muted-foreground sm:p-6">
            <span
              className="mr-2 inline-block h-2 w-2 rounded-full bg-destructive/80"
              aria-hidden="true"
            />
            {row.problem}
          </p>
          <p className="border-t border-border bg-card/60 p-5 sm:p-6 md:border-t-0 md:border-l">
            <span
              className="mr-2 inline-block h-2 w-2 rounded-full bg-secondary-accent"
              aria-hidden="true"
            />
            {row.fix}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Simple feature comparison table; scrolls horizontally inside its own box on small screens. */
export function CompareTable({
  columns,
  rows,
  caption,
}: {
  columns: readonly string[];
  rows: readonly { label: string; values: readonly (boolean | string | null)[] }[];
  caption: string;
}) {
  return (
    <div className="mt-12 overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-card">
          <tr>
            <th scope="col" className="p-4 font-semibold text-muted-foreground">
              Included
            </th>
            {columns.map((c) => (
              <th key={c} scope="col" className="p-4 font-display text-base font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="p-4 font-medium text-foreground">
                {row.label}
              </th>
              {row.values.map((v, i) => (
                <td key={i} className="p-4 text-muted-foreground">
                  {v === true || v === "yes" ? (
                    <span className="text-secondary-accent" aria-label="Included">
                      ●
                    </span>
                  ) : v === false || v === "no" ? (
                    <span aria-label="Not included">–</span>
                  ) : (
                    v
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
