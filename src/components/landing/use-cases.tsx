import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { User, Heart, Briefcase, Building2 } from "lucide-react";
import { SectionHeader } from "./section-header";

const cards = [
  { key: "s1", icon: User, idx: 0, tinted: false },
  { key: "s2", icon: Heart, idx: 1, tinted: true },
  { key: "s3", icon: Briefcase, idx: 2, tinted: true },
  { key: "s4", icon: Building2, idx: 3, tinted: false },
] as const;

export function UseCases() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-secondary/[0.03] blur-[140px]" />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeader
          kicker={t("useCases.eyebrow")}
          title={t("useCases.title")}
          subtitle={t("useCases.subtitle")}
        />

        <div className="mt-16 grid md:grid-cols-2 gap-5">
          {cards.map(({ key, icon: Icon, idx, tinted }, i) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className={`group relative rounded-2xl border p-6 md:p-7 transition-colors duration-300 shadow-[0_10px_30px_-10px_rgba(62,42,32,0.12)] ${
                tinted
                  ? "border-primary/10 bg-gradient-to-br from-primary/[0.05] to-transparent hover:from-primary/[0.08]"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  aria-hidden
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-primary"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-primary">
                    {t(`useCases.v${idx + 1}`)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {t(`useCases.v${idx + 1}l`)}
                  </div>
                </div>
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
