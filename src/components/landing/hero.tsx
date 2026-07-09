import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Reveal } from "./reveal";
import { useSectionExit, useTilt } from "./scroll-fx";

const CHART_BARS = [38, 52, 44, 66, 58, 82, 74];

/** Product-shaped hero art: composed from the app's own visual system. */
function HeroPreview({
  driftGoal,
  driftInsight,
}: {
  driftGoal: ReturnType<typeof useTransform<number, number>>;
  driftInsight: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <div
      aria-hidden
      className="relative select-none [transform-style:preserve-3d]"
      role="presentation"
    >
      {/* Main balance card */}
      <motion.div
        initial={{ opacity: 0, y: 24, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 1.5 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-[19rem] sm:w-[21rem] rounded-2xl border border-border bg-card p-5 shadow-[0_25px_60px_-20px_rgba(62,42,32,0.25)]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Balance del mes</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
            <TrendingUp className="h-3 w-3" />
            +12%
          </span>
        </div>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
          Gs 4.850.000
        </p>
        <div className="mt-4 flex items-end gap-1.5 h-16">
          {CHART_BARS.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`flex-1 rounded-t-sm ${
                i === CHART_BARS.length - 2 ? "bg-primary" : "bg-primary/25"
              }`}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>Ene</span>
          <span>Jul</span>
        </div>
      </motion.div>

      {/* Goal card — drifts down as the hero scrolls out */}
      <motion.div
        style={{ y: driftGoal }}
        className="absolute -left-10 sm:-left-16 top-40 z-20 w-52"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="bk-float-slow rounded-xl border border-border bg-card p-4 shadow-[0_15px_40px_-15px_rgba(62,42,32,0.22)] -rotate-2"
        >
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-foreground">Meta: Aguinaldo</span>
            <span className="text-muted-foreground">68%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ background: "var(--gradient-accent)" }}
            />
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Gs 3.400.000 de Gs 5.000.000</p>
        </motion.div>
      </motion.div>

      {/* AI insight chip — drifts up as the hero scrolls out */}
      <motion.div
        style={{ y: driftInsight }}
        className="absolute -right-4 sm:-right-12 -bottom-8 z-20 max-w-[15rem]"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="bk-float rounded-xl border border-primary/15 bg-card p-3.5 shadow-[0_15px_40px_-15px_rgba(193,95,60,0.3)] rotate-1"
        >
          <div className="flex gap-2.5">
            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white [background:var(--gradient-accent)]">
              <Sparkles className="h-3 w-3" />
            </span>
            <p className="text-[11px] leading-snug text-foreground/90">
              Podés ahorrar <span className="font-semibold text-primary">Gs 320.000</span> este mes
              reduciendo delivery.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const exit = useSectionExit(sectionRef);
  const driftGoal = useTransform(exit, [0, 1], reduced ? [0, 0] : [0, 26]);
  const driftInsight = useTransform(exit, [0, 1], reduced ? [0, 0] : [0, -20]);
  const { rotateX, rotateY, onPointerMove, onPointerLeave } = useTilt(sectionRef);

  return (
    <section
      id="top"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative pt-32 md:pt-44 pb-24 md:pb-32 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-8 items-center">
          <div className="max-w-2xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {t("hero.badge")}
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="mt-8 font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.06] tracking-tight text-foreground">
                {t("hero.headline")}
                <br />
                <span className="text-primary italic">{t("hero.headlineAccent")}</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
                {t("hero.subtitle")}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200"
                >
                  {t("hero.cta")}
                  <span className="h-5 w-5 rounded-full bg-white/20 grid place-items-center">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{t("hero.trustPrefix")}</span>{" "}
                  {t("hero.trustText")}
                </span>
              </div>
            </Reveal>
          </div>

          <div className="hidden lg:flex justify-center pl-6 [perspective:1100px]">
            <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
              <HeroPreview driftGoal={driftGoal} driftInsight={driftInsight} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
