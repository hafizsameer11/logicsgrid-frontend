import { useSite } from "@/lib/site-context";

/** Default brand icon, served from public/brand. A logo uploaded in CMS Site settings overrides it. */
const DEFAULT_ICON = "/brand/logicsgrid-icon.png";

type BrandLogoProps = {
  variant?: "signature" | "icon" | "full";
  className?: string;
  eager?: boolean;
};

/** Brand logo. Uses the logo uploaded in CMS Site settings when there is one. */
export function BrandLogo({
  variant = "signature",
  className = "",
  eager = false,
}: BrandLogoProps) {
  const { site } = useSite();
  const loading = eager ? "eager" : "lazy";
  const iconSrc = site.logoIcon ?? DEFAULT_ICON;

  if (variant === "full" || (variant === "signature" && site.logo)) {
    return (
      <img
        src={site.logo ?? DEFAULT_ICON}
        alt={site.name}
        className={variant === "signature" ? `h-9 w-auto ${className}` : className}
        loading={loading}
        decoding="async"
      />
    );
  }

  if (variant === "icon") {
    return (
      <img src={iconSrc} alt={site.name} className={className} loading={loading} decoding="async" />
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        className="h-9 w-auto shrink-0 object-contain"
        loading={loading}
        decoding="async"
      />
      <span className="font-display text-lg font-bold">
        Logics<span className="text-electric">Grid</span>
      </span>
    </span>
  );
}
