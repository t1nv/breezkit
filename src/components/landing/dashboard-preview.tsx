import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const METRIC_KEYS = ["m1", "m2", "m3", "m4"];

const CATEGORIES = [
  { label: "Vivienda", value: 35, color: "bg-blue-500/60" },
  { label: "Alimentación", value: 22, color: "bg-green-500/60" },
  { label: "Transporte", value: 15, color: "bg-amber-500/60" },
  { label: "Ocio", value: 10, color: "bg-purple-500/60" },
  { label: "Otros", value: 18, color: "bg-muted-foreground/30" },
];

export function DashboardPreview() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute top-1/3 left-1/2 w-[700px] h-[700px] rounded-full bg-primary/[0.03] blur-[160px]" />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-semibold tracking-[0.2em] uppercase text-primary"
          >
            {t("dashboardPreview.eyebrow")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            {t("dashboardPreview.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-muted-foreground text-lg"
          >
            {t("dashboardPreview.subtitle")}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-6 md:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center gap-1.5 mb-6 pb-4 border-b border-white/[0.06]">
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
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-2 w-2 rounded-full ${
                    idx === 0 ? "bg-green-400" :
                    idx === 1 ? "bg-red-400" :
                    idx === 2 ? "bg-blue-400" :
                    "bg-amber-400"
                  }`} />
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

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
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
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${cat.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 + ci * 0.08, ease: [0.22, 1, 0.36, 1] }}
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
