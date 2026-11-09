import { createContext, useContext, type ReactNode } from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import type { Service, Site } from "./cms";

type SiteContextValue = { site: Site; services: Service[] };

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({
  value,
  children,
}: {
  value: SiteContextValue;
  children: ReactNode;
}) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

/** Global settings and the published services, loaded once by the root route from the CMS. */
export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("useSite must be used inside SiteProvider");
  return value;
}

/** Link for URLs typed in the CMS: internal paths use the router, everything else a plain anchor. */
export function CmsLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={className}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  // CMS paths are not known to the typed route tree, so the router link is given a plain string.
  return (
    <RouterLink to={href as "/"} className={className}>
      {children}
    </RouterLink>
  );
}
