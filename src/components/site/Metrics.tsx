import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Reveal } from "./Reveal";
import { useSite } from "@/lib/site-context";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1400, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-6xl font-bold tracking-tight sm:text-7xl">
      {n}
      <span className="text-electric">{suffix}</span>
    </span>
  );
}

export function Metrics() {
  const { site } = useSite();
  const METRICS = site.stats.map((m) => ({
    value: Number(m.value) || 0,
    suffix: m.suffix ?? "",
    label: m.label,
  }));
  const TRUST = site.trustPoints;
  return (
    <section className="relative border-y border-border">
      <div className="content-shell py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.1}>
              <div className="relative pl-6">
                <span className="absolute top-2 bottom-2 left-0 w-px bg-gradient-to-b from-electric via-border to-transparent" />
                <Counter value={m.value} suffix={m.suffix} />
                <p className="mt-3 text-sm tracking-wide text-muted-foreground">{m.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-8">
            {TRUST.map((t) => (
              <span
                key={t}
                className="flex items-center gap-2 text-xs tracking-[0.18em] text-muted-foreground uppercase"
              >
                <span className="h-1 w-1 rounded-full bg-cyan-glow" />
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
