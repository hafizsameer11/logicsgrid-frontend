import { useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "./Reveal";

export function WhyUs({
  eyebrow,
  title,
  items,
}: {
  eyebrow?: string;
  title?: string;
  items: { title: string; text?: string }[];
}) {
  const REASONS = items.map((r) => ({ title: r.title, body: r.text ?? "" }));
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative border-y border-border py-32">
      <div className="content-shell">
        <Reveal>
          <p className="eyebrow mb-6">{eyebrow}</p>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">{title}</h2>
        </Reveal>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr]">
          <div className="space-y-2">
            {REASONS.slice(0, 3).map((r, i) => (
              <Row key={r.title} r={r} i={i} active={active} setActive={setActive} align="left" />
            ))}
          </div>

          <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--electric)_16%,transparent),transparent_68%)] blur-2xl" />
            <div className="grid grid-cols-3 gap-2">
              {REASONS.map((_, i) => (
                <motion.span
                  key={i}
                  className="h-16 w-16 rounded border"
                  animate={{
                    borderColor:
                      active === i
                        ? "color-mix(in oklab, var(--electric) 90%, transparent)"
                        : "var(--border)",
                    background:
                      active === i
                        ? "color-mix(in oklab, var(--electric) 26%, transparent)"
                        : "color-mix(in oklab, var(--foreground) 3%, transparent)",
                    scale: active === i ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.35 }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {REASONS.slice(3).map((r, i) => (
              <Row
                key={r.title}
                r={r}
                i={i + 3}
                active={active}
                setActive={setActive}
                align="right"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  r,
  i,
  active,
  setActive,
  align,
}: {
  r: { title: string; body: string };
  i: number;
  active: number | null;
  setActive: (n: number | null) => void;
  align: "left" | "right";
}) {
  return (
    <div
      onMouseEnter={() => setActive(i)}
      onMouseLeave={() => setActive(null)}
      className={`cursor-default border-l-2 py-4 pl-5 transition-all ${
        active === i ? "border-electric bg-accent/40" : "border-border"
      } ${align === "right" ? "lg:text-right" : ""}`}
    >
      <p className="font-display text-lg font-semibold">{r.title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">{r.body}</p>
    </div>
  );
}
