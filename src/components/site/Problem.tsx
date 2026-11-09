import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Reveal } from "./Reveal";
import { BrandLogo } from "./BrandLogo";

const FRAGMENT_SPOTS = [
  { x: -260, y: -110, color: "var(--electric)" },
  { x: 250, y: -140, color: "var(--cyan-glow)" },
  { x: -230, y: 130, color: "var(--violet-glow)" },
  { x: 240, y: 120, color: "var(--emerald-glow)" },
];
type FragmentSpec = { label: string; x: number; y: number; color: string };

const EASE = [0.22, 1, 0.36, 1] as const;
const MERGE_MS = 700;

/** Keeps the fragments inside the screen on narrow viewports. */
function useSpread() {
  const [spread, setSpread] = useState(1);
  useEffect(() => {
    const read = () => {
      const w = window.innerWidth;
      setSpread(w < 640 ? 0.4 : w < 1024 ? 0.7 : 1);
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return spread;
}

function Fragment({
  frag,
  active,
  merged,
  index,
  spread,
}: {
  frag: FragmentSpec;
  active: boolean;
  merged: boolean;
  index: number;
  spread: number;
}) {
  const start = frag.x > 0 ? 14 : -14;
  return (
    <motion.div
      initial={false}
      animate={{
        x: active ? 0 : frag.x * spread,
        y: active ? 0 : frag.y * spread,
        rotate: active ? 0 : start,
        opacity: merged ? 0 : 1,
      }}
      transition={{
        default: {
          duration: active ? 0.65 : 0,
          delay: active ? index * 0.07 : 0,
          ease: EASE,
        },
        opacity: { duration: 0.5, ease: "easeInOut" },
      }}
      className="glass-panel absolute rounded-xl px-4 py-3 text-sm font-medium"
    >
      <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: frag.color }} />
      {frag.label}
    </motion.div>
  );
}

export function Problem({
  eyebrow,
  title,
  subtitle,
  fragments,
  logoCaption,
  text,
  rows,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  fragments: string[];
  logoCaption?: string;
  text?: string;
  rows: { label: string; pain?: string; ours?: string }[];
}) {
  const FRAGMENTS = fragments.slice(0, 4).map((label, i) => ({ label, ...FRAGMENT_SPOTS[i]! }));
  const COMPARISONS = rows.map((r) => ({ old: r.label, pain: r.pain ?? "", ours: r.ours ?? "" }));
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const spread = useSpread();
  const inView = useInView(stageRef, { once: true, margin: "-40% 0px -40% 0px" });
  const [merged, setMerged] = useState(false);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const t = setTimeout(() => setMerged(true), MERGE_MS);
    return () => clearTimeout(t);
  }, [inView, reducedMotion]);

  const active = inView && !reducedMotion;

  return (
    <section className="relative overflow-x-clip">
      <div className="content-shell">
        <Reveal>
          <p className="eyebrow mb-6">{eyebrow}</p>
          <h2 className="font-display max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
            {title}
            <span className="block text-muted-foreground">{subtitle}</span>
          </h2>
        </Reveal>
      </div>

      {/* Scroll runway: the stage stays pinned in the middle of the viewport
          while the four fragments fly in, merge, and hand over to the logo. */}
      <div className="relative h-[170vh] md:h-[200vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center">
          <div
            ref={stageRef}
            className="relative flex h-[420px] w-full max-sm:scale-75 items-center justify-center"
          >
            {!reducedMotion &&
              FRAGMENTS.map((f, i) => (
                <Fragment
                  key={f.label}
                  frag={f}
                  active={active}
                  merged={merged}
                  index={i}
                  spread={spread}
                />
              ))}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, scale: 0.72 }}
              animate={reducedMotion || inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.65, delay: reducedMotion ? 0 : 0.75, ease: EASE }}
              className="absolute flex flex-col items-center"
            >
              <div className="relative">
                <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--electric)_28%,transparent),transparent_70%)] blur-xl" />
                <BrandLogo
                  variant="icon"
                  className="relative h-32 w-36 object-contain drop-shadow-2xl sm:h-40 sm:w-44"
                />
              </div>
              <p className="font-display mt-6 text-2xl font-bold">LOGICSGRID</p>
              <p className="mt-2 text-sm text-muted-foreground">{logoCaption}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="content-shell">
        <Reveal>
          <p className="mx-auto max-w-2xl text-center text-muted-foreground">{text}</p>
        </Reveal>

        <div className="mt-20 divide-y divide-border border-y border-border">
          {COMPARISONS.map((c, i) => (
            <Reveal key={c.old} delay={i * 0.06}>
              <div className="grid items-baseline gap-4 py-7 md:grid-cols-[220px_1fr_1fr]">
                <p className="font-display text-lg font-semibold">{c.old}</p>
                <p className="text-sm text-muted-foreground">{c.pain}</p>
                <p className="text-sm font-medium text-foreground">
                  <span className="text-electric">LogicsGrid — </span>
                  {c.ours}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
