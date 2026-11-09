import type { PageData } from "@/lib/cms";
import { CmsSections } from "./CmsSections";
import { HeroActions, MobileStickyCta, PageHero } from "./PageKit";
import { HeroCube } from "./Depth";

/** Pages whose hero has no call-to-action buttons, because the page itself is the action. */
const NO_HERO_ACTIONS = new Set(["contact", "free-audit", "privacy", "terms", "insights"]);

export function CmsPageHero({ data }: { data: PageData }) {
  const { hero, slug } = data.page;
  const visual = hero.image ? (
    <img
      src={hero.image}
      alt=""
      className="mx-auto max-h-[360px] w-auto rounded-2xl object-contain"
    />
  ) : hero.labels.length ? (
    <HeroCube labels={hero.labels} />
  ) : null;
  return (
    <PageHero eyebrow={hero.eyebrow} title={hero.title} text={hero.text} visual={visual}>
      {NO_HERO_ACTIONS.has(slug) ? null : <HeroActions />}
    </PageHero>
  );
}

/** A full CMS-driven page: hero plus every section from the page builder. */
export function CmsPage({ data, stickyCta = false }: { data: PageData; stickyCta?: boolean }) {
  return (
    <>
      <CmsPageHero data={data} />
      <CmsSections data={data} />
      {stickyCta ? <MobileStickyCta /> : null}
    </>
  );
}
