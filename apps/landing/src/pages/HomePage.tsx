import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Heart,
  Menu,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import heroImage from "@/assets/quran-study-hero.jpg";
import childImage from "@/assets/quran-child-learning.jpg";
import familyImage from "@/assets/quran-family-learning.jpg";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { resolveSupportedLng } from "@/i18n/config";
import { Button } from "@qlp/ui";

const PROGRAM_IDS = ["01", "02", "03", "04", "05"] as const;
const GUIDE_IDS = ["memorisation", "tajwid", "arabic"] as const;
const STAT_IDS = ["learners", "countries", "teachers", "programmes"] as const;
const ABOUT_FEATURES = [
  { icon: Heart, id: "rhythm" },
  { icon: BookOpen, id: "progression" },
  { icon: Sparkles, id: "reflection" },
] as const;
const APPROACH_STEPS = ["01", "02", "03"] as const;
const LEARNER_ITEMS = [
  "memorisation",
  "revision",
  "articulation",
  "vocabulary",
] as const;

function usePageMeta() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const pageTitle = t("meta.title");
    document.title = pageTitle;

    const upsertMeta = (
      attr: "name" | "property",
      key: string,
      content: string,
    ) => {
      let element = document.head.querySelector<HTMLMetaElement>(
        `meta[${attr}="${key}"]`,
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    upsertMeta("name", "description", t("meta.description"));
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", t("meta.ogDescription"));
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", t("appName"));
    upsertMeta("property", "og:locale", resolveSupportedLng(i18n.language) === "ar" ? "ar_SA" : "en_US");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", t("meta.twitterDescription"));

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}/`;

    const jsonLdId = "nur-path-structured-data";
    let script = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = jsonLdId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "EducationalOrganization",
          "@id": `${window.location.origin}/#organization`,
          name: t("appName"),
          url: window.location.origin,
          description: t("meta.jsonLdDescription"),
          areaServed: t("meta.areaServed"),
          knowsAbout: [
            t("meta.knowsAbout.recitation"),
            t("meta.knowsAbout.tajwid"),
            t("meta.knowsAbout.memorisation"),
            t("meta.knowsAbout.arabic"),
            t("meta.knowsAbout.ijazah"),
            t("meta.knowsAbout.studies"),
          ],
        },
        {
          "@type": "WebSite",
          "@id": `${window.location.origin}/#website`,
          url: window.location.origin,
          name: t("appName"),
          description: t("meta.jsonLdWebsiteDescription"),
          publisher: { "@id": `${window.location.origin}/#organization` },
          inLanguage: resolveSupportedLng(i18n.language),
        },
      ],
    });
  }, [t, i18n.language]);
}

function BrandMark({ homeAria, name }: { homeAria: string; name: string }) {
  return (
    <span className="flex items-center gap-3" aria-label={homeAria}>
      <span className="relative grid size-9 place-items-center rounded-full border border-brand-gold/50">
        <span className="size-3 rotate-45 border border-brand-gold" />
      </span>
      <span className="font-display text-[1.45rem] font-semibold leading-none">
        {name}
      </span>
    </span>
  );
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  usePageMeta();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [i18n.language]);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: "#programs", label: t("nav.programs") },
    { href: "#approach", label: t("nav.approach") },
    { href: "#stories", label: t("nav.guides") },
    { href: "#about", label: t("nav.about") },
  ];

  return (
    <main
      id="main-content"
      className="overflow-hidden bg-background text-foreground"
    >
      <header className="absolute inset-x-0 top-0 z-50 border-b border-hero-foreground/15 text-hero-foreground">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" onClick={closeMenu} className="focus-ring rounded-sm">
            <BrandMark homeAria={t("brand.homeAria")} name={t("appName")} />
          </a>
          <nav
            className="hidden items-center gap-8 text-sm font-medium lg:flex"
            aria-label={t("nav.primaryAria")}
          >
            {navLinks.map((link) => (
              <a className="nav-link" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher />
            <Button
              asChild
              className="hidden h-11 rounded-full bg-brand-gold px-6 text-brand-ink shadow-none hover:bg-brand-gold-soft lg:inline-flex"
            >
              <a href="#begin">
                {t("nav.bookConsultation")}{" "}
                <ArrowRight className="rtl:rotate-180" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-hero-foreground hover:bg-hero-foreground/10 hover:text-hero-foreground lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <nav
            className="border-t border-hero-foreground/15 bg-brand-deep/95 px-5 py-6 backdrop-blur-lg lg:hidden"
            aria-label={t("nav.mobileAria")}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-5 text-lg">
              {navLinks.map((link) => (
                <a onClick={closeMenu} href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
              <Button
                asChild
                className="mt-2 rounded-full bg-brand-gold text-brand-ink hover:bg-brand-gold-soft"
              >
                <a onClick={closeMenu} href="#begin">
                  {t("nav.bookConsultation")}
                </a>
              </Button>
            </div>
          </nav>
        )}
      </header>

      <section
        id="top"
        className="relative flex min-h-[92svh] items-end bg-brand-deep text-hero-foreground"
      >
        <img
          src={heroImage}
          alt={t("hero.imageAlt")}
          width={1600}
          height={1200}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center rtl:-scale-x-100"
        />
        <div className="hero-shade absolute inset-0" />
        <div
          className="absolute end-[7%] top-28 hidden size-40 rounded-full border border-hero-foreground/15 xl:block"
          aria-hidden="true"
        >
          <div className="absolute inset-5 rotate-45 border border-hero-foreground/10" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-40 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
          <div className="hero-enter max-w-3xl">
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold-soft rtl:tracking-wide">
              <span className="h-px w-10 bg-brand-gold" /> {t("hero.eyebrow")}
            </p>
            <h1 className="max-w-3xl font-display text-5xl leading-[0.98] font-medium sm:text-6xl lg:text-[5.6rem] rtl:leading-[1.25]">
              {t("hero.title")}
              <br />
              <em className="font-normal text-brand-gold-soft">
                {t("hero.titleEmphasis")}
              </em>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-hero-muted sm:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-13 rounded-full bg-brand-gold px-7 text-brand-ink shadow-none hover:bg-brand-gold-soft"
              >
                <a href="#begin">
                  {t("hero.startJourney")}{" "}
                  <ArrowRight className="rtl:rotate-180" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-13 justify-start rounded-full px-2 text-hero-foreground hover:bg-transparent hover:text-brand-gold-soft sm:px-5"
              >
                <a href="#approach">
                  <span className="grid size-10 place-items-center rounded-full border border-hero-foreground/35">
                    <Play className="fill-current" />
                  </span>{" "}
                  {t("hero.seeHow")}
                </a>
              </Button>
            </div>
          </div>
          <div className="mt-14 flex flex-wrap gap-x-9 gap-y-3 border-t border-hero-foreground/20 pt-6 text-sm text-hero-muted lg:absolute lg:bottom-24 lg:end-12 lg:mt-0 lg:border-0 lg:pt-0">
            <span className="flex items-center gap-2">
              <Check className="text-brand-gold" /> {t("hero.oneToOne")}
            </span>
            <span className="flex items-center gap-2">
              <Check className="text-brand-gold" /> {t("hero.flexible")}
            </span>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-warm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border px-5 sm:px-8 lg:grid-cols-4 lg:px-12 rtl:divide-x-reverse">
          {STAT_IDS.map((id) => (
            <div
              className="px-4 py-7 text-center sm:py-8"
              key={id}
            >
              <p className="font-display text-3xl font-semibold text-primary">
                {t(`stats.${id}.value`)}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground rtl:tracking-wide">
                {t(`stats.${id}.label`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="section-space bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12">
          <div data-reveal>
            <p className="eyebrow">{t("about.eyebrow")}</p>
            <h2 className="section-title mt-5 rtl:leading-[1.3]">
              {t("about.title")} <em>{t("about.titleEmphasis")}</em>
            </h2>
          </div>
          <div data-reveal className="lg:pt-12">
            <p className="max-w-2xl text-xl leading-9 text-foreground/80 sm:text-2xl">
              {t("about.body")}
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {ABOUT_FEATURES.map(({ icon: FeatureIcon, id }) => (
                <div key={id}>
                  <FeatureIcon
                    className="size-6 text-brand-gold-dark"
                    strokeWidth={1.5}
                  />
                  <h3 className="mt-4 font-display text-xl font-semibold">
                    {t(`about.features.${id}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {t(`about.features.${id}.text`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="programs"
        className="section-space bg-brand-deep text-hero-foreground"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div
            data-reveal
            className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
          >
            <div>
              <p className="eyebrow text-brand-gold">{t("programs.eyebrow")}</p>
              <h2 className="section-title mt-5 max-w-2xl rtl:leading-[1.3]">
                {t("programs.title")} <em>{t("programs.titleEmphasis")}</em>
              </h2>
            </div>
            <p className="max-w-md leading-7 text-hero-muted">
              {t("programs.intro")}
            </p>
          </div>
          <div className="mt-14 border-t border-hero-foreground/15">
            {PROGRAM_IDS.map((id) => (
              <a
                key={id}
                href="#begin"
                data-reveal
                className="program-row group grid gap-5 border-b border-hero-foreground/15 py-8 sm:grid-cols-[4rem_1fr_auto] sm:items-center lg:grid-cols-[6rem_1fr_1.15fr_auto] lg:py-10"
              >
                <span className="font-mono text-xs text-brand-gold">{id}</span>
                <div>
                  <p
                    className="mb-1 text-sm text-brand-gold/75"
                    lang="ar"
                    dir="rtl"
                  >
                    {t(`programs.items.${id}.arabic`)}
                  </p>
                  <h3 className="font-display text-3xl font-medium sm:text-4xl">
                    {t(`programs.items.${id}.title`)}
                  </h3>
                </div>
                <div className="sm:col-start-2 lg:col-start-auto">
                  <p className="max-w-lg text-sm leading-6 text-hero-muted">
                    {t(`programs.items.${id}.description`)}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.1em] text-brand-gold-soft rtl:tracking-wide">
                    {t(`programs.items.${id}.meta`)}
                  </p>
                </div>
                <span className="hidden size-12 place-items-center rounded-full border border-hero-foreground/25 transition-all duration-300 group-hover:border-brand-gold group-hover:bg-brand-gold group-hover:text-brand-ink sm:grid">
                  <ChevronRight className="rtl:rotate-180" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="approach" className="section-space bg-surface-warm">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:px-12">
          <div data-reveal className="relative">
            <img
              loading="lazy"
              src={familyImage}
              alt={t("approach.imageAlt")}
              width={1200}
              height={900}
              className="aspect-[4/5] w-full object-cover rtl:-scale-x-100"
            />
            <div className="absolute -bottom-6 end-4 max-w-[13rem] bg-brand-gold p-5 text-brand-ink sm:-end-5 sm:p-6">
              <p className="font-display text-4xl font-semibold">
                {t("approach.badgeValue")}
              </p>
              <p className="mt-1 text-sm leading-5">{t("approach.badgeText")}</p>
            </div>
          </div>
          <div data-reveal>
            <p className="eyebrow">{t("approach.eyebrow")}</p>
            <h2 className="section-title mt-5 rtl:leading-[1.3]">
              {t("approach.title")}
              <br />
              <em>{t("approach.titleEmphasis")}</em>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">
              {t("approach.body")}
            </p>
            <ol className="mt-9 space-y-6">
              {APPROACH_STEPS.map((id) => (
                <li
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-border pt-5"
                  key={id}
                >
                  <span className="font-mono text-xs text-brand-gold-dark">
                    {id}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">
                      {t(`approach.steps.${id}.title`)}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {t(`approach.steps.${id}.text`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section-space bg-background">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24 lg:px-12">
          <div data-reveal className="order-2 lg:order-1">
            <p className="eyebrow">{t("learners.eyebrow")}</p>
            <h2 className="section-title mt-5 rtl:leading-[1.3]">
              {t("learners.title")} <em>{t("learners.titleEmphasis")}</em>
            </h2>
            <p className="mt-7 max-w-xl leading-7 text-muted-foreground">
              {t("learners.body")}
            </p>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {LEARNER_ITEMS.map((id) => (
                <p
                  key={id}
                  className="flex items-center gap-3 border border-border bg-card px-4 py-4 text-sm"
                >
                  <Check className="text-brand-gold-dark" />{" "}
                  {t(`learners.items.${id}`)}
                </p>
              ))}
            </div>
            <Button
              asChild
              variant="link"
              className="mt-7 h-auto p-0 text-primary underline-offset-8"
            >
              <a href="#begin">
                {t("learners.cta")} <ArrowRight className="rtl:rotate-180" />
              </a>
            </Button>
          </div>
          <div data-reveal className="order-1 lg:order-2">
            <img
              loading="lazy"
              src={childImage}
              alt={t("learners.imageAlt")}
              width={1200}
              height={900}
              className="aspect-[4/5] w-full object-cover rtl:-scale-x-100"
            />
          </div>
        </div>
      </section>

      <section
        id="stories"
        className="section-space border-y border-border bg-surface-warm"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div data-reveal className="text-center">
            <p className="eyebrow justify-center">{t("journal.eyebrow")}</p>
            <h2 className="section-title mx-auto mt-5 max-w-2xl rtl:leading-[1.3]">
              {t("journal.title")}
              <br />
              <em>{t("journal.titleEmphasis")}</em>
            </h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-3">
            {GUIDE_IDS.map((id, index) => (
              <article
                data-reveal
                key={id}
                className="bg-background p-7 sm:p-10 lg:p-12"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold-dark rtl:tracking-wide">
                    {t(`journal.items.${id}.category`)}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-7 font-display text-2xl leading-9 sm:text-3xl sm:leading-10">
                  {t(`journal.items.${id}.title`)}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {t(`journal.items.${id}.summary`)}
                </p>
                <p className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
                  {t(`journal.items.${id}.detail`)}
                </p>
              </article>
            ))}
          </div>
          <div
            data-reveal
            className="mt-10 grid gap-5 text-sm text-muted-foreground sm:grid-cols-3"
          >
            <p className="flex items-center justify-center gap-2">
              <ShieldCheck className="text-primary" /> {t("journal.badges.practice")}
            </p>
            <p className="flex items-center justify-center gap-2">
              <Users className="text-primary" /> {t("journal.badges.guidance")}
            </p>
            <p className="flex items-center justify-center gap-2">
              <MessageCircle className="text-primary" /> {t("journal.badges.review")}
            </p>
          </div>
        </div>
      </section>

      <section
        id="begin"
        className="relative bg-brand-gold py-20 text-brand-ink sm:py-24"
      >
        <div
          className="pattern-overlay absolute inset-0 opacity-15"
          aria-hidden="true"
        />
        <div
          data-reveal
          className="relative mx-auto max-w-4xl px-5 text-center sm:px-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] rtl:tracking-wide">
            {t("cta.eyebrow")}
          </p>
          <h2 className="mt-5 font-display text-5xl leading-none font-medium sm:text-6xl lg:text-7xl rtl:leading-[1.25]">
            {t("cta.title")}
            <br />
            <em>{t("cta.titleEmphasis")}</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-7 text-brand-ink/75">
            {t("cta.body")}
          </p>
          <Button
            asChild
            size="lg"
            className="mt-9 h-13 rounded-full bg-brand-deep px-8 text-hero-foreground shadow-none hover:bg-brand-ink"
          >
            <a href="https://quranacad-7awqvkx8.manus.space/#contact">
              {t("cta.button")} <ArrowRight className="rtl:rotate-180" />
            </a>
          </Button>
          <p className="mt-4 text-xs text-brand-ink/65">{t("cta.note")}</p>
        </div>
      </section>

      <footer className="bg-brand-ink text-hero-muted">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
          <div className="grid gap-10 border-b border-hero-foreground/15 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="text-hero-foreground">
                <BrandMark homeAria={t("brand.homeAria")} name={t("appName")} />
              </div>
              <p className="mt-5 max-w-sm text-sm leading-6">
                {t("footer.tagline")}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold rtl:tracking-wide">
                {t("footer.explore")}
              </p>
              <div className="mt-4 grid gap-3 text-sm">
                {navLinks.slice(0, 3).map((link) => (
                  <a href={link.href} key={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold rtl:tracking-wide">
                {t("footer.formats")}
              </p>
              <div className="mt-4 grid gap-3 text-sm">
                <span>{t("footer.oneToOne")}</span>
                <span>{t("footer.smallGroup")}</span>
                <span>{t("footer.online")}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p>{t("footer.copyright", { year: 2026 })}</p>
            <p>{t("footer.intention")}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
