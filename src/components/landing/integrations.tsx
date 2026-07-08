import { useTranslation } from "react-i18next";
import { Building2, Wallet, Cpu, Calculator } from "lucide-react";
import { Reveal } from "./reveal";

const items = [
  { key: "i1", icon: Building2 },
  { key: "i2", icon: Wallet },
  { key: "i3", icon: Cpu },
  { key: "i4", icon: Calculator },
] as const;

/**
 * Roadmap section — deliberately quiet (nothing here has shipped yet), a
 * compact strip instead of a full card grid.
 */
export function Integrations() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between rounded-2xl border border-border bg-card/60 px-6 py-8 md:px-10">
          <div className="max-w-xs">
            <p className="bk-kicker">{t("integrations.eyebrow")}</p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">
              {t("integrations.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("integrations.subtitle")}
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-x-10 gap-y-5">
            {items.map(({ key, icon: Icon }, i) => (
              <Reveal key={key} delay={i * 60} as="li">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="block text-sm font-semibold text-foreground leading-tight">
                      {t(`integrations.${key}`)}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {t(`integrations.${key}d`)} · Próximamente
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
