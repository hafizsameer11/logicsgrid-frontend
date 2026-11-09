import { lazy, Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from "motion/react";
import { ClientOnly } from "@tanstack/react-router";

const GridSystem = lazy(() => import("./GridSystem").then((m) => ({ default: m.GridSystem })));

/**
 * Lazy-loaded 3D scene. `viewport` picks which screen size this instance renders on, so the
 * homepage can place the scene differently on phones without running two WebGL canvases.
 */
export function LazyGrid(props: {
  className?: string;
  assembled?: boolean;
  viewport?: "mobile" | "desktop";
}) {
  const { viewport = "desktop", ...rest } = props;
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const fallback = <div className={`${props.className ?? ""} static-grid`} aria-hidden />;
  if ((viewport === "mobile") !== isMobile) return null;
  if (reducedMotion) return fallback;
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <GridSystem {...rest} lite={viewport === "mobile"} />
      </Suspense>
    </ClientOnly>
  );
}
