import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslation } from "react-i18next";
import type { SupportedLanguage } from "@/lib/i18n";
import { switchLanguage } from "@/lib/i18n";
import {
  Sparkles,
  ShieldCheck,
  Bot,
  Wallet,
  Zap,
  Menu,
  X,
  Github,
  ArrowRight,
  Check,
  BarChart3,
  Target,
  TrendingUp,
  Plus,
  Globe,
  Smartphone,
} from "lucide-react";
import dashboardImg from "@/assets/dashboard-preview.jpg";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Security } from "@/components/landing/security";
import { UseCases } from "@/components/landing/use-cases";
import { Comparison } from "@/components/landing/comparison";
import { Integrations } from "@/components/landing/integrations";
import { DashboardPreview } from "@/components/landing/dashboard-preview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Breezkit — Asesor Financiero con IA" },
      {
        name: "description",
        content:
          "Plataforma financiera con IA: controla tu dinero, ahorra inteligente e invierte segun tu perfil.",
      },
      { property: "og:title", content: "Breezkit — Asesor Financiero con IA" },
      {
        property: "og:description",
        content: "Decisiones financieras claras impulsadas por IA.",
      },
    ],
  }),
  component: Landing,
});

const GITHUB_URL = "https://github.com/t1nv/breezkit";
const SPRING = { type: "spring" as const, stiffness: 300, damping: 20 };
const EASE_OUT = { ease: [0.22, 1, 0.36, 1], duration: 0.7 };

function LangSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language as SupportedLanguage;

  return (
    <button
      onClick={() => {
        const next: SupportedLanguage = current === "es" ? "en" : "es";
        switchLanguage(next);
      }}
      className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      <span className="text-[8px] font-bold absolute mt-3">
        {current === "es" ? "EN" : "ES"}
      </span>
    </button>
  );
}

function Landing() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.98]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      <BackgroundDecor />
      <Header />
      <main>
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
          <Hero />
        </motion.div>
        <Features />
        <HowItWorks />
        <StatsBar />
        <UseCases />
        <Integrations />
        <Security />
        <Comparison />
        <Pricing />
        <DashboardPreview />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

/* ── Utilities ── */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
}: {
  as?: any;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as any}
      style={{ transitionDelay: `${delay}ms` }}
      className={`opacity-0 translate-y-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [&.is-revealed]:opacity-100 [&.is-revealed]:translate-y-0 ${className}`}
    >
      {children}
    </Tag>
  );
}

function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-soft)" }} />
      <div className="absolute -top-48 left-1/4 h-[500px] w-[500px] rounded-full bg-[#FF5A00]/8 blur-[150px]" />
      <div className="absolute -bottom-48 right-1/4 h-[400px] w-[400px] rounded-full bg-[#FF8C00]/5 blur-[120px]" />
    </div>
  );
}

/* ── Header (Fluid Island Nav) ── */

function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#features", label: t("nav.features") },
    { href: "#how-it-works", label: "Cómo funciona" },
    { href: "#pricing", label: t("nav.pricing") },
    { href: "#faq", label: t("nav.faq") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 inset-x-0 z-50 px-4"
    >
      <motion.div
        layout
        className={`mx-auto max-w-5xl flex items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ${
          scrolled
            ? "bg-[#141414]/90 backdrop-blur-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.06)]"
            : "bg-[#141414]/60 backdrop-blur-lg border border-[rgba(255,255,255,0.06)]"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5 group">
          <motion.span
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="h-7 w-7 rounded-lg grid place-items-center text-white"
            style={{ background: "var(--gradient-accent)" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
          </motion.span>
          <span className="font-display font-bold text-base tracking-tight text-foreground">
            Breezkit
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-white/5 transition-all duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1">
          <LangSwitcher />
            <motion.a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              whileHover={{ scale: 1.1 }}
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </motion.a>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/auth"
              className="group inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              {t("nav.getStarted")}
              <span className="h-5 w-5 rounded-full bg-white/20 grid place-items-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </motion.div>
        </div>

        <button
          className="md:hidden h-9 w-9 grid place-items-center rounded-full border border-white/10 hover:bg-white/5 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </motion.div>
        </button>
      </motion.div>

      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden mt-2 rounded-2xl bg-[#141414]/95 backdrop-blur-2xl border border-white/10 p-4 shadow-xl"
        >
          <nav className="flex flex-col gap-1">
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg px-3 py-2.5 text-sm hover:bg-white/5 text-foreground transition-colors"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 pt-2 border-t border-white/10"
            >
              <Link
                to="/auth"
                className="block rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium text-center"
              >
                {t("nav.getStarted")}
              </Link>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}

/* ── Hero (Split Layout) ── */

function Hero() {
  const { t } = useTranslation();

  return (
    <section id="top" className="relative pt-32 md:pt-40 pb-20 md:pb-28">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Left */}
        <div className="relative z-10">
          <Reveal>
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {t("hero.badge")}
            </motion.span>
          </Reveal>

          <Reveal delay={100}>
              <h1 className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.04] tracking-tight text-foreground">
                {t("hero.headline")}
                <br />
                <span className="text-primary">
                  {t("hero.headlineAccent")}
                </span>
              </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-5 max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </Reveal>

          <Reveal delay={300}>
            <Link
              to="/auth"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3.5 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              {t("hero.cta")}
              <span className="h-5 w-5 rounded-full bg-white/20 grid place-items-center">
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </Reveal>

        </div>

        {/* Right */}
        <Reveal delay={300}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/5 blur-3xl"
            />
            <motion.div
              whileHover={{ rotate: -1, scale: 1.01 }}
              transition={SPRING}
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-black/20">
                <span className="h-2 w-2 rounded-full bg-red-400/60" />
                <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
                <span className="h-2 w-2 rounded-full bg-green-400/60" />
                <span className="ml-3 text-[11px] text-muted-foreground font-mono">
                  breezkit.app
                </span>
              </div>
              <img
                src={dashboardImg}
                alt="Vista del dashboard de Breezkit"
                width={1920}
                height={1080}
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Features (Editorial Zigzag) ── */

const FEATURE_KEYS = [
  "aiAnalysis",
  "smartSaving",
  "investments",
  "privacy",
  "alerts",
  "dashboard",
  "goals",
  "support",
  "sync",
] as const;

function FeatureIcon({ idx, size = "sm" }: { idx: number; size?: "sm" | "md" }) {
  const icons = [
    Bot, Wallet, TrendingUp, ShieldCheck,
    Zap, BarChart3, Target, Smartphone, Sparkles,
  ];
  const Icon = icons[idx] ?? ShieldCheck;
  return <Icon className={size === "md" ? "h-6 w-6" : "h-5 w-5"} />;
}

const FEATURE_VISUALS: Record<string, "analysis" | "chart" | "alerts" | "goals" | undefined> = {
  aiAnalysis: "analysis",
  dashboard: "chart",
  alerts: "alerts",
  goals: "goals",
};

function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full bg-primary/[0.04] blur-[160px]" />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <Reveal>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
              {t("features.eyebrow")}
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {t("features.title")}
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 text-muted-foreground text-lg">
              {t("features.subtitle")}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {FEATURE_KEYS.map((key, i) => {
            const visual = FEATURE_VISUALS[key];
            const isAnalysis = visual === "analysis";

            return (
              <Reveal key={key} delay={i * 50}>
                <motion.article
                  whileHover={{ y: -3 }}
                  transition={SPRING}
                  className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent hover:bg-white/[0.06] transition-all duration-500 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] h-full p-6 md:p-7 overflow-hidden"
                >
                  {isAnalysis && (
                    <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-[80px]" />
                  )}

                  <div className="relative z-10 flex flex-col">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-secondary grid place-items-center text-white shadow-lg shadow-primary/10">
                      <FeatureIcon idx={i} />
                    </div>

                    <div className="mt-5 flex-1">
                      <h3 className="font-display text-xl font-bold text-foreground tracking-tight">
                        {t(`features.items.${key}.title`)}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {t(`features.items.${key}.desc`)}
                      </p>
                    </div>

                    {visual === "analysis" && (
                      <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Resumen IA
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            En vivo
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {[
                            { label: "Gastos hormiga", value: 73 },
                            { label: "Ahorro potencial", value: 48 },
                            { label: "Riesgo cartera", value: 24 },
                          ].map((bar) => (
                            <div key={bar.label}>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-muted-foreground">{bar.label}</span>
                                <span className="font-medium text-foreground">{bar.value}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${bar.value}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {visual === "chart" && (
                      <div className="mt-5 flex items-end gap-1.5 h-16">
                        {[32, 48, 28, 62, 45, 78, 55].map((h, bi) => (
                          <motion.div
                            key={bi}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 + bi * 0.06, ease: [0.22, 1, 0.36, 1] }}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/60 to-primary/20"
                          />
                        ))}
                      </div>
                    )}

                    {visual === "alerts" && (
                      <div className="mt-5 space-y-2">
                        {[
                          { text: "Gasto duplicado detectado", color: "bg-amber-500" },
                          { text: "Presupuesto monthly al 85%", color: "bg-blue-500" },
                        ].map((alert) => (
                          <div key={alert.text} className="flex items-center gap-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3.5 py-2.5">
                            <span className={`h-2 w-2 rounded-full ${alert.color} shrink-0`} />
                            <span className="text-[12px] text-muted-foreground">{alert.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {visual === "goals" && (
                      <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold text-foreground">Fondo de emergencia</span>
                          <span className="text-[11px] text-muted-foreground">$4,200 / $10,000</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "42%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                          />
                        </div>
                        <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
                          <span>Meta: Dic 2026</span>
                          <span className="text-green-400">42% completado</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Stats Bar ── */

const STAT_KEYS = ["free", "setup", "recommendations", "available"] as const;

function StatsBar() {
  const { t } = useTranslation();
  const STAT_VALUES = [t("stats.v0"), t("stats.v1"), t("stats.v2"), t("stats.v3")];

  return (
    <section className="py-16 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]">
          {STAT_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 80}>
              <div className="bg-gradient-to-br from-white/[0.02] to-transparent px-6 py-8 text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary">
                  {STAT_VALUES[i]}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {t(`stats.${key}`)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ── */

const PRICING_FEATURE_KEYS = [
  "unlimited",
  "ai",
  "goals",
  "alerts",
  "multi",
  "reports",
  "support",
  "noCard",
] as const;

function Pricing() {
  const { t } = useTranslation();

  return (
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center">
          <Reveal delay={100}>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {t("pricing.title")}
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 text-muted-foreground">
              {t("pricing.subtitle")}
            </p>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-8 md:p-10 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.5)]"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 shadow-lg"
            >
              {t("pricing.badge")}
            </motion.span>

            <div className="text-center">
              <h3 className="font-display text-base font-semibold text-muted-foreground">
                Breezkit
              </h3>
              <div className="mt-3 flex items-end justify-center gap-1">
                <span className="font-display text-6xl md:text-7xl font-bold text-foreground">
                  $0
                </span>
                <span className="pb-2 text-sm text-muted-foreground">
                  {t("pricing.perMonth")}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("pricing.fullAccess")}
              </p>
            </div>

            <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-sm">
              {PRICING_FEATURE_KEYS.map((key, i) => (
                <motion.li
                  key={key}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="h-5 w-5 rounded-full bg-primary/10 grid place-items-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  <span className="text-foreground/80">
                    {t(`pricing.features.${key}`)}
                  </span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8"
            >
              <Link
                to="/auth"
                className="group inline-flex w-full justify-center items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3.5 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                {t("pricing.cta")}
                <span className="h-5 w-5 rounded-full bg-white/20 grid place-items-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── FAQ ── */

function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = t("faq.items", { returnObjects: true }) as { q: string; a: string }[];

  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center">
          <Reveal delay={100}>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {t("faq.title")}
            </h2>
          </Reveal>
        </div>

        <div className="mt-12 space-y-3">
          {items.map((it, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={it.q} delay={i * 60}>
                <motion.div
                  layout
                  className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    id={`faq-btn-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-foreground"
                  >
                    <span className="font-medium text-sm md:text-base">{it.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="h-6 w-6 rounded-full border border-white/10 grid place-items-center shrink-0"
                    >
                      <Plus className="h-3 w-3 text-muted-foreground" />
                    </motion.span>
                  </button>
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {it.a}
                    </p>
                  </motion.div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */

function CTA() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl p-10 md:p-16 border border-white/[0.06]"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div className="absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 right-1/3 h-64 w-64 rounded-full bg-secondary/8 blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight text-white">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-white/60 text-lg max-w-lg">
                {t("cta.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/auth"
                    className="group inline-flex items-center gap-2 rounded-full bg-white text-primary px-7 py-3.5 font-medium hover:bg-white/90 transition-all shadow-xl"
                  >
                    {t("cta.cta")}
                    <span className="h-5 w-5 rounded-full bg-primary/10 grid place-items-center group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="h-3 w-3 text-primary" />
                    </span>
                  </Link>
                </motion.div>
                <motion.a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-7 py-3.5 font-medium hover:bg-white/10 transition-all"
                >
                  <Github className="h-4 w-4" /> {t("cta.github")}
                </motion.a>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Footer ── */

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/[0.04] bg-gradient-to-b from-transparent to-white/[0.02]">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5 group">
            <motion.span
              whileHover={{ rotate: 10 }}
              className="h-8 w-8 rounded-lg grid place-items-center text-white"
              style={{ background: "var(--gradient-accent)" }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.span>
            <span className="font-display font-bold text-lg text-foreground">
              Breezkit
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm leading-relaxed">
            {t("footer.description")}
          </p>
          <div className="mt-5 flex gap-2">
            <LangSwitcher />
            <motion.a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              whileHover={{ scale: 1.15 }}
              className="h-9 w-9 grid place-items-center rounded-full border border-white/10 hover:bg-white/5 transition-all text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </motion.a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground/60">
            {t("footer.product")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground transition-colors">{t("footer.features")}</a></li>
            <li><a href="#pricing" className="hover:text-foreground transition-colors">{t("footer.pricing")}</a></li>
            <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
            <li><Link to="/auth" className="hover:text-foreground transition-colors">{t("footer.signUp")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground/60">
            {t("footer.legal")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">{t("footer.privacy")}</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">{t("footer.terms")}</a></li>
            <li><a href="#contact" className="hover:text-foreground transition-colors">{t("footer.contact")}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground/60">
            {t("footer.resources")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">{t("footer.blog")}</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">{t("footer.api")}</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">{t("footer.status")}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 py-5 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
          <span>&copy; 2026 Breezkit. {t("footer.copyright")}</span>
          <span>{t("footer.tagline")}</span>
        </div>
      </div>
    </footer>
  );
}
