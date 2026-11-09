import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  MessageCircle,
  Twitter,
  Youtube,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { phoneHref, whatsappHref } from "@/lib/cms";
import { CmsLink, useSite } from "@/lib/site-context";
import { BrandLogo } from "./BrandLogo";

export { CtaBanner as FinalCta } from "./PageKit";

const socialIcons: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  x: Twitter,
  youtube: Youtube,
  github: Github,
};

export function Footer() {
  const { site, services } = useSite();
  return (
    <footer className="border-t border-border bg-card">
      <div className="content-shell py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="focus-ring inline-flex" aria-label={`${site.name} home`}>
              <BrandLogo />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">{site.tagline}</p>
            <div className="mt-5 flex gap-2">
              {site.socialLinks.map((s) => {
                const Icon = socialIcons[s.platform] ?? Globe;
                return (
                  <a
                    key={s.url}
                    className="icon-link"
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${site.name} on ${s.platform}`}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <h2 className="footer-title">Services</h2>
            <ul className="mt-4 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    className="footer-link"
                    to="/services/$slug"
                    params={{ slug: service.slug }}
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {site.footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="footer-title">{col.title}</h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.url}>
                    <CmsLink className="footer-link" href={l.url}>
                      {l.label}
                    </CmsLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="footer-title">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a className="footer-link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li>
                <a className="footer-link" href={phoneHref(site)}>
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  className="footer-link"
                  href={whatsappHref(site)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp us
                </a>
              </li>
              <li>{site.location}</li>
              <li>{site.hours}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link className="footer-link" to="/privacy">
              Privacy policy
            </Link>
            <Link className="footer-link" to="/terms">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppButton() {
  const { site } = useSite();
  return (
    <a
      href={whatsappHref(site)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-secondary-accent text-background shadow-xl focus-ring md:hidden"
      aria-label={`Chat with ${site.name} on WhatsApp`}
    >
      <MessageCircle aria-hidden="true" />
    </a>
  );
}
