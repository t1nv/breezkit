import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { User, Heart, Briefcase, Building2 } from "lucide-react";

const cards = [
  { key: "s1", icon: User, idx: 0, border: true },
  { key: "s2", icon: Heart, idx: 1, border: false },
  { key: "s3", icon: Briefcase, idx: 2, border: true },
  { key: "s4", icon: Building2, idx: 3, border: false },
] as const;

export function UseCases() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-secondary/[0.03] blur-[140px]" />
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
            {t("useCases.eyebrow")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            {t("useCases.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-muted-foreground text-lg"
          >
            {t("useCases.subtitle")}
          </motion.p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-5">
          {cards.map(({ key, icon: Icon, idx, border }, i) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className={`group relative rounded-2xl ${
                border
                  ? "border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent"
                  : "border border-primary/10 bg-gradient-to-br from-primary/[0.04] to-transparent"
              } p-6 md:p-7 hover:bg-white/[0.06] transition-all duration-500 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]`}
            >
              <div className="flex items-start justify-between">
                <div className={`h-12 w-12 rounded-xl grid place-items-center text-white shadow-lg ${
                  border
                    ? "bg-gradient-to-br from-primary to-secondary shadow-primary/10"
                    : "bg-gradient-to-br from-secondary to-primary shadow-secondary/10"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="text-right"
                >
                  <div className="font-display text-2xl font-bold text-primary">
                    {t(`useCases.v${idx + 1}`)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {t(`useCases.v${idx + 1}l`)}
                  </div>
                </motion.div>
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-foreground tracking-tight">
                {t(`useCases.${key}`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t(`useCases.${key}d`)}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
