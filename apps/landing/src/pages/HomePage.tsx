import { useEffect, useState } from "react";
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
import { Button } from "@qlp/ui";

const pageTitle = "Quran, Tajwīd & Arabic Learning | Nūr Path";

function usePageMeta() {
  useEffect(() => {
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

    upsertMeta(
      "name",
      "description",
      "Guided Quran learning in recitation, tajwīd, memorisation, and Quranic Arabic, with practical study methods for learners and families.",
    );
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta(
      "property",
      "og:description",
      "Build confident recitation, sustainable memorisation, and deeper understanding through Quranic Arabic.",
    );
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", "Nūr Path");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta(
      "name",
      "twitter:description",
      "Practical guidance for Quran recitation, tajwīd, memorisation, and Quranic Arabic.",
    );

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
          name: "Nūr Path",
          url: window.location.origin,
          description:
            "Guided Quran education in recitation, tajwīd, memorisation, and Quranic Arabic for learners and families.",
          areaServed: "Worldwide",
          knowsAbout: [
            "Quran recitation",
            "Tajwīd",
            "Quran memorisation",
            "Quranic Arabic",
            "Quranic Ijazah",
            "Quranic studies",
          ],
        },
        {
          "@type": "WebSite",
          "@id": `${window.location.origin}/#website`,
          url: window.location.origin,
          name: "Nūr Path",
          description: "Thoughtful, personal online Quran learning.",
          publisher: { "@id": `${window.location.origin}/#organization` },
          inLanguage: "en",
        },
      ],
    });
  }, []);
}

const programs = [
  {
    number: "01",
    title: "Memorise consistently",
    arabic: "حِفْظ",
    description:
      "Set a realistic daily target, balance new passages with revision, and build a steady routine that protects long-term recall.",
    meta: "Sustainable pace · Structured revision",
  },
  {
    number: "02",
    title: "Refine your tajwīd",
    arabic: "تَجْوِيد",
    description:
      "Begin with articulation points, practise one rule in short passages, and use regular correction before habits become fixed.",
    meta: "Beginner friendly · Guided correction",
  },
  {
    number: "03",
    title: "Understand Quranic Arabic",
    arabic: "عَرَبِيَّة",
    description:
      "Grow recurring Quranic vocabulary, recognise Arabic roots and patterns, and connect language study directly to the verses you recite.",
    meta: "Vocabulary · Roots · Reflection",
  },
  {
    number: "04",
    title: "Pursue Quranic ijāzah",
    arabic: "إِجَازَة",
    description:
      "Follow an advanced pathway in precise recitation, intensive personal review, and study toward a formal chain of transmission.",
    meta: "Advanced · One year or more",
  },
  {
    number: "05",
    title: "Explore Quranic studies",
    arabic: "عُلُومُ الْقُرْآن",
    description:
      "Study foundations of tafsīr, reasons for revelation, Makki and Madani passages, and an introduction to the Quranic sciences.",
    meta: "Intermediate–advanced · 4–8 months",
  },
];

const learningGuides = [
  {
    category: "Quran memorisation",
    title: "Build a consistent memorisation routine",
    summary:
      "Choose a daily target you can sustain, give revision equal weight, and use a simple weekly review cycle.",
    detail: "6 min read · June 12, 2026",
  },
  {
    category: "Tajwīd",
    title: "Begin tajwīd in the right sequence",
    summary:
      "Start with where letters are formed, work through one rule at a time, and seek regular feedback on short passages.",
    detail: "5 min read · June 5, 2026",
  },
  {
    category: "Quranic Arabic",
    title: "Understand more of what you recite",
    summary:
      "Learn recurring vocabulary in context, notice root patterns, and let reading, listening, and meaning reinforce one another.",
    detail: "7 min read · May 28, 2026",
  },
];

function BrandMark() {
  return (
    <span className="flex items-center gap-3" aria-label="Nūr Path home">
      <span className="relative grid size-9 place-items-center rounded-full border border-brand-gold/50">
        <span className="size-3 rotate-45 border border-brand-gold" />
      </span>
      <span className="font-display text-[1.45rem] font-semibold leading-none">
        Nūr Path
      </span>
    </span>
  );
}

export default function HomePage() {
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
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main
      id="main-content"
      className="overflow-hidden bg-background text-foreground"
    >
      <header className="absolute inset-x-0 top-0 z-50 border-b border-hero-foreground/15 text-hero-foreground">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" onClick={closeMenu} className="focus-ring rounded-sm">
            <BrandMark />
          </a>
          <nav
            className="hidden items-center gap-8 text-sm font-medium lg:flex"
            aria-label="Primary navigation"
          >
            <a className="nav-link" href="#programs">
              Programs
            </a>
            <a className="nav-link" href="#approach">
              Our approach
            </a>
            <a className="nav-link" href="#stories">
              Learning guides
            </a>
            <a className="nav-link" href="#about">
              About
            </a>
          </nav>
          <Button
            asChild
            className="hidden h-11 rounded-full bg-brand-gold px-6 text-brand-ink shadow-none hover:bg-brand-gold-soft lg:inline-flex"
          >
            <a href="#begin">
              Book a free consultation <ArrowRight />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-hero-foreground hover:bg-hero-foreground/10 hover:text-hero-foreground lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <nav
            className="border-t border-hero-foreground/15 bg-brand-deep/95 px-5 py-6 backdrop-blur-lg lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-5 text-lg">
              <a onClick={closeMenu} href="#programs">
                Programs
              </a>
              <a onClick={closeMenu} href="#approach">
                Our approach
              </a>
              <a onClick={closeMenu} href="#stories">
                Learning guides
              </a>
              <a onClick={closeMenu} href="#about">
                About
              </a>
              <Button
                asChild
                className="mt-2 rounded-full bg-brand-gold text-brand-ink hover:bg-brand-gold-soft"
              >
                <a onClick={closeMenu} href="#begin">
                  Book a free consultation
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
          alt="A learner reflecting on Quran study at a sunlit desk"
          width={1600}
          height={1200}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="hero-shade absolute inset-0" />
        <div
          className="absolute right-[7%] top-28 hidden size-40 rounded-full border border-hero-foreground/15 xl:block"
          aria-hidden="true"
        >
          <div className="absolute inset-5 rotate-45 border border-hero-foreground/10" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-40 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
          <div className="hero-enter max-w-3xl">
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold-soft">
              <span className="h-px w-10 bg-brand-gold" /> Personal Quran
              learning
            </p>
            <h1 className="max-w-3xl font-display text-5xl leading-[0.98] font-medium sm:text-6xl lg:text-[5.6rem]">
              Learn with clarity.
              <br />
              <em className="font-normal text-brand-gold-soft">
                Grow with purpose.
              </em>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-hero-muted sm:text-lg">
              Live Quran, tajwīd, and Arabic learning for non-native speakers,
              combining authentic instruction with flexible online study.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-13 rounded-full bg-brand-gold px-7 text-brand-ink shadow-none hover:bg-brand-gold-soft"
              >
                <a href="#begin">
                  Start your journey <ArrowRight />
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
                  See how it works
                </a>
              </Button>
            </div>
          </div>
          <div className="mt-14 flex flex-wrap gap-x-9 gap-y-3 border-t border-hero-foreground/20 pt-6 text-sm text-hero-muted lg:absolute lg:bottom-24 lg:right-12 lg:mt-0 lg:border-0 lg:pt-0">
            <span className="flex items-center gap-2">
              <Check className="text-brand-gold" /> 1-to-1 & small groups
            </span>
            <span className="flex items-center gap-2">
              <Check className="text-brand-gold" /> Flexible schedules
            </span>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-warm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
          {[
            ["5,000+", "Learners supported"],
            ["30+", "Countries worldwide"],
            ["50+", "Qualified teachers"],
            ["15+", "Learning programmes"],
          ].map(([value, label]) => (
            <div className="px-4 py-7 text-center sm:py-8" key={label}>
              <p className="font-display text-3xl font-semibold text-primary">
                {value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="section-space bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12">
          <div data-reveal>
            <p className="eyebrow">More than lessons</p>
            <h2 className="section-title mt-5">
              A lifelong connection, <em>beautifully nurtured.</em>
            </h2>
          </div>
          <div data-reveal className="lg:pt-12">
            <p className="max-w-2xl text-xl leading-9 text-foreground/80 sm:text-2xl">
              Strong Quran learning grows through a steady rhythm: clear
              foundations, focused practice, regular review, and understanding
              that deepens reflection.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {[
                [
                  Heart,
                  "Sustainable rhythm",
                  "Small, repeatable goals that fit real schedules.",
                ],
                [
                  BookOpen,
                  "Focused progression",
                  "One rule, passage, or pattern at a time.",
                ],
                [
                  Sparkles,
                  "Deeper reflection",
                  "Vocabulary and meaning connected to recitation.",
                ],
              ].map(([Icon, title, text]) => {
                const FeatureIcon = Icon as typeof Heart;
                return (
                  <div key={String(title)}>
                    <FeatureIcon
                      className="size-6 text-brand-gold-dark"
                      strokeWidth={1.5}
                    />
                    <h3 className="mt-4 font-display text-xl font-semibold">
                      {String(title)}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {String(text)}
                    </p>
                  </div>
                );
              })}
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
              <p className="eyebrow text-brand-gold">Learning pathways</p>
              <h2 className="section-title mt-5 max-w-2xl">
                A path shaped around <em>your goals.</em>
              </h2>
            </div>
            <p className="max-w-md leading-7 text-hero-muted">
              Build a memorisation rhythm, refine your pronunciation, or
              understand more of the Arabic you recite.
            </p>
          </div>
          <div className="mt-14 border-t border-hero-foreground/15">
            {programs.map((program) => (
              <a
                key={program.number}
                href="#begin"
                data-reveal
                className="program-row group grid gap-5 border-b border-hero-foreground/15 py-8 sm:grid-cols-[4rem_1fr_auto] sm:items-center lg:grid-cols-[6rem_1fr_1.15fr_auto] lg:py-10"
              >
                <span className="font-mono text-xs text-brand-gold">
                  {program.number}
                </span>
                <div>
                  <p
                    className="mb-1 text-sm text-brand-gold/75"
                    lang="ar"
                    dir="rtl"
                  >
                    {program.arabic}
                  </p>
                  <h3 className="font-display text-3xl font-medium sm:text-4xl">
                    {program.title}
                  </h3>
                </div>
                <div className="sm:col-start-2 lg:col-start-auto">
                  <p className="max-w-lg text-sm leading-6 text-hero-muted">
                    {program.description}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.1em] text-brand-gold-soft">
                    {program.meta}
                  </p>
                </div>
                <span className="hidden size-12 place-items-center rounded-full border border-hero-foreground/25 transition-all duration-300 group-hover:border-brand-gold group-hover:bg-brand-gold group-hover:text-brand-ink sm:grid">
                  <ChevronRight />
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
              alt="A mother and daughter studying Quran together"
              width={1200}
              height={900}
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute -bottom-6 right-4 max-w-[13rem] bg-brand-gold p-5 text-brand-ink sm:-right-5 sm:p-6">
              <p className="font-display text-4xl font-semibold">1:1+</p>
              <p className="mt-1 text-sm leading-5">
                Personal or small-group study.
              </p>
            </div>
          </div>
          <div data-reveal>
            <p className="eyebrow">How learning feels</p>
            <h2 className="section-title mt-5">
              Authentic teaching.
              <br />
              <em>Modern access.</em>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">
              Effective study follows a clear sequence: listen carefully,
              understand the lesson, practise it in short passages, and use
              correction to refine what you hear and recite.
            </p>
            <ol className="mt-9 space-y-6">
              {[
                [
                  "01",
                  "Learn with qualified teachers",
                  "Study with experienced teachers shaped by Al-Madinah programmes and Quranic qualifications.",
                ],
                [
                  "02",
                  "Choose a fitting format",
                  "Use focused one-to-one teaching or a small-group setting, with morning and evening options.",
                ],
                [
                  "03",
                  "Progress with structure",
                  "Follow a programme designed for your level, with practical correction and regular follow-up.",
                ],
              ].map(([number, title, text]) => (
                <li
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-border pt-5"
                  key={number}
                >
                  <span className="font-mono text-xs text-brand-gold-dark">
                    {number}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {text}
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
            <p className="eyebrow">Learning for every season</p>
            <h2 className="section-title mt-5">
              A welcoming space for <em>every learner.</em>
            </h2>
            <p className="mt-7 max-w-xl leading-7 text-muted-foreground">
              Progress does not require mastering everything at once. Begin with
              recurring words, familiar passages, or a modest memorisation
              target, then build steadily from there.
            </p>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {[
                "Daily memorisation targets",
                "Weekly revision cycles",
                "Letter articulation practice",
                "Arabic roots and vocabulary",
              ].map((item) => (
                <p
                  key={item}
                  className="flex items-center gap-3 border border-border bg-card px-4 py-4 text-sm"
                >
                  <Check className="text-brand-gold-dark" /> {item}
                </p>
              ))}
            </div>
            <Button
              asChild
              variant="link"
              className="mt-7 h-auto p-0 text-primary underline-offset-8"
            >
              <a href="#begin">
                Find your learning path <ArrowRight />
              </a>
            </Button>
          </div>
          <div data-reveal className="order-1 lg:order-2">
            <img
              loading="lazy"
              src={childImage}
              alt="A young learner enjoying an online Quran lesson"
              width={1200}
              height={900}
              className="aspect-[4/5] w-full object-cover"
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
            <p className="eyebrow justify-center">Learning journal</p>
            <h2 className="section-title mx-auto mt-5 max-w-2xl">
              Practical insight.
              <br />
              <em>Deeper reflection.</em>
            </h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-3">
            {learningGuides.map((guide, index) => (
              <article
                data-reveal
                key={guide.title}
                className="bg-background p-7 sm:p-10 lg:p-12"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold-dark">
                    {guide.category}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-7 font-display text-2xl leading-9 sm:text-3xl sm:leading-10">
                  {guide.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {guide.summary}
                </p>
                <p className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
                  {guide.detail}
                </p>
              </article>
            ))}
          </div>
          <div
            data-reveal
            className="mt-10 grid gap-5 text-sm text-muted-foreground sm:grid-cols-3"
          >
            <p className="flex items-center justify-center gap-2">
              <ShieldCheck className="text-primary" /> Clear, sequenced practice
            </p>
            <p className="flex items-center justify-center gap-2">
              <Users className="text-primary" /> Guidance for learners and
              families
            </p>
            <p className="flex items-center justify-center gap-2">
              <MessageCircle className="text-primary" /> Regular correction and
              review
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
          <p className="text-xs font-semibold uppercase tracking-[0.22em]">
            Explore the right programme
          </p>
          <h2 className="mt-5 font-display text-5xl leading-none font-medium sm:text-6xl lg:text-7xl">
            Begin gently.
            <br />
            <em>Build beautifully.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-7 text-brand-ink/75">
            Share your level and goals to find a suitable pathway in
            memorisation, tajwīd, Arabic, ijāzah, or Quranic studies.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-9 h-13 rounded-full bg-brand-deep px-8 text-hero-foreground shadow-none hover:bg-brand-ink"
          >
            <a href="https://quranacad-7awqvkx8.manus.space/#contact">
              Explore enrolment options <ArrowRight />
            </a>
          </Button>
          <p className="mt-4 text-xs text-brand-ink/65">
            Flexible schedules · Online worldwide
          </p>
        </div>
      </section>

      <footer className="bg-brand-ink text-hero-muted">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
          <div className="grid gap-10 border-b border-hero-foreground/15 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="text-hero-foreground">
                <BrandMark />
              </div>
              <p className="mt-5 max-w-sm text-sm leading-6">
                Personal Quran teaching, rooted in care, clarity, and a sincere
                love of learning.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
                Explore
              </p>
              <div className="mt-4 grid gap-3 text-sm">
                <a href="#programs">Programs</a>
                <a href="#approach">Our approach</a>
                <a href="#stories">Learning guides</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
                Learning formats
              </p>
              <div className="mt-4 grid gap-3 text-sm">
                <span>One-to-one lessons</span>
                <span>Small-group classes</span>
                <span>Online · Worldwide</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Nūr Path. All rights reserved.</p>
            <p>Learning with intention, wherever you are.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
