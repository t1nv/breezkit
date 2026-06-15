import { useTranslation } from "react-i18next";
import { Reveal } from "./reveal";

const STAT_KEYS = ["free", "setup", "recommendations", "available"] as const;

export function StatsBar() {
  const { t } = useTranslation();
  const STAT_VALUES = [t("stats.v0"), t("stats.v1"), t("stats.v2"), t("stats.v3")];

  return (
    <section className="py-16 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]">
          {STAT_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 80}>
              <div className="bg-gradient-to-br from-white/[0.02] to-transparent px-6 py-8 text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary">
                  {STAT_VALUES[i]}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {t(`stats.${key}`)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
