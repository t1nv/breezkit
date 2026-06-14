import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Wallet, Target } from "lucide-react";

const steps = [
  { key: "s1", icon: Wallet, idx: 0 },
  { key: "s2", icon: Bot, idx: 1 },
  { key: "s3", icon: Target, idx: 2 },
] as const;

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[140px]" />
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
            {t("howItWorks.eyebrow")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            {t("howItWorks.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-muted-foreground text-lg"
          >
            {t("howItWorks.subtitle")}
          </motion.p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 md:gap-8 relative">
          <div aria-hidden className="pointer-events-none absolute top-12 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px hidden md:block bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {steps.map(({ key, icon: Icon, idx }) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 * idx, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-center md:text-left"
            >
              <div className="flex flex-col items-center md:items-start">
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary grid place-items-center text-white shadow-lg shadow-primary/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border border-white/[0.06] grid place-items-center text-[11px] font-bold text-muted-foreground">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-foreground tracking-tight">
                  {t(`howItWorks.${key}`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm">
                  {t(`howItWorks.${key}d`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-center"
        >
          <Link
            to="/auth"
            className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            {t("hero.cta")}
            <span className="h-5 w-5 rounded-full bg-white/20 grid place-items-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
