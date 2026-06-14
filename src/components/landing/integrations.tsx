import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Building2, Wallet, Cpu, Calculator } from "lucide-react";

const items = [
  { key: "i1", icon: Building2, idx: 0 },
  { key: "i2", icon: Wallet, idx: 1 },
  { key: "i3", icon: Cpu, idx: 2 },
  { key: "i4", icon: Calculator, idx: 3 },
] as const;

export function Integrations() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-secondary/[0.02] blur-[140px]" />
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
            {t("integrations.eyebrow")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            {t("integrations.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-muted-foreground text-lg"
          >
            {t("integrations.subtitle")}
          </motion.p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ key, icon: Icon }, idx) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * idx, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-6 hover:bg-white/[0.06] transition-all duration-500 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] text-center"
            >
              <div className="h-16 w-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] grid place-items-center mx-auto group-hover:border-primary/20 transition-colors">
                <Icon className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-foreground tracking-tight">
                {t(`integrations.${key}`)}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(`integrations.${key}d`)}
              </p>
              <span className="mt-4 inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">
                Próximamente
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
