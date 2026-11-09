import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CmsLink, useSite } from "@/lib/site-context";
import { BrandLogo } from "./BrandLogo";

export function Nav() {
  const { site, services } = useSite();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const links = site.headerLinks;
  const dropdownItem =
    "block rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:bg-accent";
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="content-shell grid min-h-18 grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
      >
        <Link to="/" className="focus-ring w-fit" aria-label={`${site.name} home`}>
          <BrandLogo eager />
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          <div className="group relative">
            <Link to="/services" className="nav-link">
              Services <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </Link>
            <div className="invisible absolute left-0 top-full w-80 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="rounded-xl border border-border bg-popover p-2 shadow-2xl">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    to="/services/$slug"
                    params={{ slug: service.slug }}
                    className={dropdownItem}
                  >
                    {service.title}
                  </Link>
                ))}
                <div className="my-1 border-t border-border" />
                <Link to="/care-plans" className={dropdownItem}>
                  Care plans
                </Link>
                <Link to="/free-audit" className={dropdownItem}>
                  Free website and systems audit
                </Link>
              </div>
            </div>
          </div>
          {links.map((item) => (
            <CmsLink key={item.url} href={item.url} className="nav-link">
              {item.label}
            </CmsLink>
          ))}
          <Button asChild className="ml-2">
            <Link to="/contact">{site.cta.button ?? "Book a consultation"}</Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </nav>
      {open ? (
        <div className="fixed inset-0 top-[72px] h-[calc(100dvh-72px)] overflow-y-auto border-t border-border bg-background lg:hidden">
          <nav aria-label="Mobile" className="content-shell flex flex-col py-8">
            <Link to="/services" className="mobile-nav-link">
              Services
            </Link>
            {services.map((service) => (
              <Link
                key={service.slug}
                to="/services/$slug"
                params={{ slug: service.slug }}
                className="min-h-11 border-l border-border py-3 pl-5 text-sm text-muted-foreground"
              >
                {service.title}
              </Link>
            ))}
            <Link
              to="/care-plans"
              className="min-h-11 border-l border-border py-3 pl-5 text-sm text-muted-foreground"
            >
              Care plans
            </Link>
            {links.map((item) => (
              <CmsLink key={item.url} href={item.url} className="mobile-nav-link">
                {item.label}
              </CmsLink>
            ))}
            <Link to="/contact" className="mobile-nav-link">
              Contact
            </Link>
            <Button asChild size="lg" className="mt-8">
              <Link to="/contact">{site.cta.button ?? "Book a consultation"}</Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
