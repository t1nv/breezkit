import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Check, ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

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

export function Pricing() {
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
            <p className="mt-4 text-muted-foreground">{t("pricing.subtitle")}</p>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 relative rounded-2xl border border-border bg-card p-8 md:p-10 shadow-[0_25px_60px_-20px_rgba(62,42,32,0.18)]"
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
                <span className="pb-2 text-sm text-muted-foreground">{t("pricing.perMonth")}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t("pricing.fullAccess")}</p>
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
                  <span className="text-foreground/80">{t(`pricing.features.${key}`)}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-8">
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
