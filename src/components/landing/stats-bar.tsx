import { useTranslation } from "react-i18next";
import { Reveal } from "./reveal";

const STAT_KEYS = ["free", "setup", "recommendations", "available"] as const;

/** Quiet inline proof strip on a tinted band — value and label read as one phrase. */
export function StatsBar() {
  const { t } = useTranslation();
  const values = [t("stats.v0"), t("stats.v1"), t("stats.v2"), t("stats.v3")];

  return (
    <section className="bk-band py-10 md:py-12">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <dl className="flex flex-wrap items-baseline justify-center gap-x-10 gap-y-4 text-center">
            {STAT_KEYS.map((key, i) => (
              <div key={key} className="flex items-baseline gap-2.5">
                <dd className="font-display text-2xl md:text-3xl font-bold text-primary order-1">
                  {values[i]}
                </dd>
                <dt className="text-sm text-muted-foreground order-2">{t(`stats.${key}`)}</dt>
                {i < STAT_KEYS.length - 1 && (
                  <span aria-hidden className="order-3 hidden sm:inline text-border select-none">
                    ·
                  </span>
                )}
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
