import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  Bot,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Target,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";
import { SPRING } from "./constants";

/** Featured cells carry a product visual; quiet items sit in a compact strip. */
const FEATURED: { key: string; icon: LucideIcon; span: string }[] = [
  { key: "aiAnalysis", icon: Bot, span: "md:col-span-2" },
  { key: "alerts", icon: Zap, span: "" },
  { key: "goals", icon: Target, span: "" },
  { key: "dashboard", icon: BarChart3, span: "md:col-span-2" },
];

const QUIET: { key: string; icon: LucideIcon }[] = [
  { key: "smartSaving", icon: Wallet },
  { key: "investments", icon: TrendingUp },
  { key: "privacy", icon: ShieldCheck },
  { key: "support", icon: Smartphone },
  { key: "sync", icon: Sparkles },
];

function AnalysisVisual() {
  return (
    <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-muted-foreground">Resumen IA</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 font-medium">
          En vivo
        </span>
      </div>
      <div className="space-y-2.5">
        {[
          { label: "Gastos hormiga", value: 73 },
          { label: "Ahorro potencial", value: 48 },
          { label: "Riesgo cartera", value: 24 },
        ].map((bar, bi) => (
          <div key={bar.label}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-muted-foreground">{bar.label}</span>
              <span className="font-medium text-foreground">{bar.value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${bar.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + bi * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{ background: "var(--gradient-accent)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartVisual() {
  return (
    <div className="mt-6 flex items-end gap-1.5 h-20 max-w-md">
      {[32, 48, 28, 62, 45, 78, 55, 68, 40, 72].map((h, bi) => (
        <motion.div
          key={bi}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 + bi * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/70 to-primary/25"
        />
      ))}
    </div>
  );
}

function AlertsVisual() {
  return (
    <div className="mt-6 space-y-2">
      {[
        { text: "Gasto duplicado detectado", tone: "bg-warning" },
        { text: "Presupuesto mensual al 85%", tone: "bg-primary" },
      ].map((alert) => (
        <div
          key={alert.text}
          className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-3.5 py-2.5"
        >
          <span className={`h-2 w-2 rounded-full ${alert.tone} shrink-0`} />
          <span className="text-[12px] text-muted-foreground">{alert.text}</span>
        </div>
      ))}
    </div>
  );
}

function GoalsVisual() {
  return (
    <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-foreground">Fondo de emergencia</span>
        <span className="text-[11px] text-muted-foreground">42%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "42%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: "var(--gradient-accent)" }}
        />
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
        <span>Gs 8,4M de Gs 20M</span>
        <span className="text-success font-medium">Meta: Dic 2026</span>
      </div>
    </div>
  );
}

const VISUALS: Record<string, () => React.JSX.Element> = {
  aiAnalysis: AnalysisVisual,
  dashboard: ChartVisual,
  alerts: AlertsVisual,
  goals: GoalsVisual,
};

export function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full bg-primary/[0.04] blur-[160px]" />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeader
          kicker={t("features.eyebrow")}
          title={t("features.title")}
          subtitle={t("features.subtitle")}
        />

        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {FEATURED.map(({ key, icon: Icon, span }, i) => {
            const Visual = VISUALS[key];
            return (
              <Reveal key={key} delay={i * 60} className={span}>
                <motion.article
                  whileHover={{ y: -3 }}
                  transition={SPRING}
                  className="group relative h-full rounded-2xl border border-border bg-card hover:bg-muted/40 transition-colors duration-300 shadow-[0_10px_30px_-10px_rgba(62,42,32,0.12)] p-6 md:p-7 overflow-hidden"
                >
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 shrink-0 rounded-xl grid place-items-center text-white shadow-lg shadow-primary/10 [background:var(--gradient-accent)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground tracking-tight">
                        {t(`features.items.${key}.title`)}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-lg">
                      {t(`features.items.${key}.desc`)}
                    </p>
                    <div className="mt-auto">{Visual && <Visual />}</div>
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={200}>
          <div className="mt-5 rounded-2xl border border-border bg-card/60 px-6 py-5 md:px-8">
            <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-5">
              {QUIET.map(({ key, icon: Icon }) => (
                <li key={key} className="flex items-start gap-3">
                  <Icon aria-hidden className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                      {t(`features.items.${key}.title`)}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {t(`features.items.${key}.desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
