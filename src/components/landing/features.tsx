import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  Bot, Wallet, TrendingUp, ShieldCheck, Zap,
  BarChart3, Target, Smartphone, Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";
import { SPRING } from "./constants";

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

const FEATURE_ICONS: LucideIcon[] = [
  Bot, Wallet, TrendingUp, ShieldCheck,
  Zap, BarChart3, Target, Smartphone, Sparkles,
];

const FEATURE_VISUALS: Record<string, "analysis" | "chart" | "alerts" | "goals" | undefined> = {
  aiAnalysis: "analysis",
  dashboard: "chart",
  alerts: "alerts",
  goals: "goals",
};

export function Features() {
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
            const Icon = FEATURE_ICONS[i] ?? ShieldCheck;

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
                      <Icon className="h-5 w-5" />
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
                          { text: "Presupuesto mensual al 85%", color: "bg-blue-500" },
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
