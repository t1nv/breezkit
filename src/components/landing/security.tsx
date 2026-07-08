import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Eye, Lock, Trash2 } from "lucide-react";
import { SectionHeader } from "./section-header";

const items = [
  { key: "s1", icon: Lock },
  { key: "s2", icon: Eye },
  { key: "s3", icon: ShieldCheck },
  { key: "s4", icon: Trash2 },
] as const;

export function Security() {
  const { t } = useTranslation();

  return (
    <section className="bk-band py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              align="left"
              kicker={t("security.eyebrow")}
              title={t("security.title")}
              subtitle={t("security.subtitle")}
            />
          </div>

          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-9">
            {items.map(({ key, icon: Icon }, idx) => (
              <motion.li
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 * idx, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4"
              >
                <span
                  aria-hidden
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-background text-primary"
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground tracking-tight">
                    {t(`security.${key}`)}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {t(`security.${key}d`)}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
