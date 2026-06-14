import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";

const ROW_KEYS = ["r1", "r2", "r3", "r4", "r5", "r6"];

export function Comparison() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/[0.02] blur-[120px]" />
      </div>
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-semibold tracking-[0.2em] uppercase text-primary"
          >
            {t("comparison.eyebrow")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            {t("comparison.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-muted-foreground text-lg"
          >
            {t("comparison.subtitle")}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 rounded-2xl border border-white/[0.06] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]"
        >
          <div className="grid grid-cols-3 gap-px bg-white/[0.06]">
            <div className="bg-gradient-to-br from-white/[0.03] to-transparent p-4 md:p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                &nbsp;
              </span>
            </div>
            <div className="bg-gradient-to-br from-white/[0.03] to-transparent p-4 md:p-5 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                {t("comparison.h1")}
              </span>
            </div>
            <div className="bg-gradient-to-br from-primary/[0.04] to-transparent p-4 md:p-5 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {t("comparison.h2")}
              </span>
            </div>

            {ROW_KEYS.map((rk, i) => (
              <motion.div
                key={rk}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className={`contents ${
                  i < ROW_KEYS.length - 1 ? "[&>*]:border-b [&>*]:border-white/[0.04]" : ""
                }`}
              >
                <div className="bg-gradient-to-br from-white/[0.02] to-transparent p-4 md:p-5">
                  <span className="text-sm text-foreground/80">{t(`comparison.${rk}`)}</span>
                </div>
                <div className="bg-gradient-to-br from-white/[0.02] to-transparent p-4 md:p-5 text-center">
                  <span className="inline-flex h-6 w-6 rounded-full bg-red-500/10 items-center justify-center">
                    <X className="h-3 w-3 text-red-400" />
                  </span>
                </div>
                <div className="bg-gradient-to-br from-primary/[0.02] to-transparent p-4 md:p-5 text-center">
                  <span className="inline-flex h-6 w-6 rounded-full bg-green-500/10 items-center justify-center">
                    <Check className="h-3 w-3 text-green-400" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
