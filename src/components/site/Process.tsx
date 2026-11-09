import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "./Reveal";

export function Process({
  eyebrow,
  title,
  items,
}: {
  eyebrow?: string;
  title?: string;
  items: { title: string; text?: string }[];
}) {
  const STEPS = items.map((s, i) => ({
    n: String(i + 1).padStart(2, "0"),
    title: s.title,
    body: s.text ?? "",
  }));
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative py-32">
      <div className="content-shell">
        <Reveal>
          <p className="eyebrow mb-6">{eyebrow}</p>
          <h2 className="font-display max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
            {title}
          </h2>
        </Reveal>

        <div className="relative mt-24 [perspective:1400px]">
          <div className="absolute top-0 bottom-0 left-4 w-px bg-border md:left-1/2">
            <motion.div
              style={{ height: lineHeight }}
              className="w-px bg-gradient-to-b from-electric via-cyan-glow to-violet-glow"
            />
          </div>

          <div className="space-y-16">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, z: -160, y: 50 }}
                whileInView={{ opacity: 1, z: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`relative pl-12 md:w-1/2 md:pl-0 ${
                  i % 2 === 0 ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"
                }`}
              >
                <span
                  className={`absolute top-3 left-4 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-electric shadow-[0_0_18px_color-mix(in_oklab,var(--electric)_80%,transparent)] md:left-auto ${
                    i % 2 === 0 ? "md:right-0 md:translate-x-1/2" : "md:left-0 md:-translate-x-1/2"
                  }`}
                />
                <div className="glass-panel rounded-2xl p-7">
                  <span className="font-display text-xs font-bold tracking-[0.3em] text-electric">
                    {s.n}
                  </span>
                  <h3 className="font-display mt-3 text-2xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
