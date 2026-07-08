import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "./section-header";

const METRIC_KEYS = ["m1", "m2", "m3", "m4"];

// Brand ramp: terracotta shades by weight, neutral tail.
const CATEGORIES = [
  { label: "Vivienda", value: 35, color: "bg-primary" },
  { label: "Alimentación", value: 22, color: "bg-primary/70" },
  { label: "Transporte", value: 15, color: "bg-primary/50" },
  { label: "Ocio", value: 10, color: "bg-primary/30" },
  { label: "Otros", value: 18, color: "bg-muted-foreground/40" },
];

export function DashboardPreview() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute top-1/3 left-1/2 w-[700px] h-[700px] rounded-full bg-primary/[0.03] blur-[160px]" />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeader
          kicker={t("dashboardPreview.eyebrow")}
          title={t("dashboardPreview.title")}
          subtitle={t("dashboardPreview.subtitle")}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-[0_10px_30px_-10px_rgba(62,42,32,0.12)]"
        >
          <div className="flex items-center gap-1.5 mb-6 pb-4 border-b border-border">
            <span className="h-2 w-2 rounded-full bg-red-400/60" />
            <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
            <span className="h-2 w-2 rounded-full bg-green-400/60" />
            <span className="ml-3 text-[11px] text-muted-foreground font-mono">
              breezkit.app/dashboard
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {METRIC_KEYS.map((mk, idx) => (
              <motion.div
                key={mk}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      idx === 0
                        ? "bg-success"
                        : idx === 1
                          ? "bg-destructive"
                          : idx === 2
                            ? "bg-primary"
                            : "bg-warning"
                    }`}
                  />
                  <span className="text-[12px] text-muted-foreground">
                    {t(`dashboardPreview.${mk}l`)}
                  </span>
                </div>
                <span className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  {t(`dashboardPreview.${mk}v`)}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-muted-foreground">Gastos por categoría</span>
              <span className="text-[11px] text-muted-foreground">Este mes</span>
            </div>
            <div className="space-y-2.5">
              {CATEGORIES.map((cat, ci) => (
                <div key={cat.label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">{cat.label}</span>
                    <span className="text-foreground/80">{cat.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${cat.value}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: 0.5 + ci * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`h-full rounded-full ${cat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
