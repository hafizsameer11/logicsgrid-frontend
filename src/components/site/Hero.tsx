import { motion, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LazyGrid as GridSystem } from "../three/LazyGrid";

// Floating labels sit over the 3D scene on the right, clear of the headline and buttons.
const LABEL_SPOTS = [
  "left-[60%] top-[14%]",
  "right-[6%] top-[20%]",
  "left-[62%] bottom-[16%]",
  "right-[4%] bottom-[34%]",
  "left-[78%] top-[8%]",
  "right-[18%] bottom-[8%]",
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({
  eyebrow,
  title,
  text,
  labels,
}: {
  eyebrow?: string | null;
  title: string;
  text?: string | null;
  labels: string[];
}) {
  const reducedMotion = useReducedMotion();
  const lines = title.split(/\r?\n/).filter(Boolean);
  const LABELS = labels
    .slice(0, LABEL_SPOTS.length)
    .map((label, i) => ({ text: label, className: LABEL_SPOTS[i] }));
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <div className="bg-grid-lines absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_78%)]" />

      <GridSystem className="absolute inset-y-0 right-0 w-full lg:w-[58%]" />

      {LABELS.map((l, i) => (
        <motion.span
          key={l.text}
          className={`glass-panel absolute z-10 hidden rounded-full px-3 py-1 text-[11px] tracking-[0.2em] text-muted-foreground uppercase xl:block ${l.className}`}
          initial={{ opacity: 0 }}
          animate={reducedMotion ? { opacity: 0.8 } : { opacity: [0, 1, 0.6, 1], y: [0, -8, 0] }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { delay: 1.2 + i * 0.2, duration: 6, repeat: Infinity, repeatType: "mirror" }
          }
        >
          {l.text}
        </motion.span>
      ))}

      <div className="content-shell relative z-20 pt-28 pb-16">
        <div className="max-w-2xl 2xl:max-w-3xl">
          <motion.p
            className="eyebrow mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {eyebrow}
          </motion.p>
          <h1 className="font-display text-4xl leading-[0.98] font-bold tracking-tight sm:text-7xl 2xl:text-8xl">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className={`block ${i === 1 ? "text-electric text-glow-electric" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.14, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          >
            {text}
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          >
            <Button asChild size="lg">
              <Link to="/contact">Book a consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/work">See our work</Link>
            </Button>
          </motion.div>
          {/* On phones the 3D scene sits under the buttons instead of behind the text. */}
          <div className="relative -mx-6 mt-6 h-[320px] md:hidden" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--electric)_18%,transparent),transparent_65%)]" />
            <GridSystem viewport="mobile" className="absolute inset-0" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 md:block">
        <motion.div
          className="h-10 w-px bg-gradient-to-b from-transparent via-electric to-transparent"
          animate={reducedMotion ? { opacity: 0.7 } : { opacity: [0.2, 1, 0.2] }}
          transition={reducedMotion ? { duration: 0 } : { duration: 2.4, repeat: Infinity }}
        />
      </div>
    </section>
  );
}
