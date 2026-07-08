import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/**
 * Shared section lead: serif-italic kicker + display title + subtitle.
 * `align` varies per section to break the uniform centered cadence.
 */
export function SectionHeader({
  kicker,
  title,
  subtitle,
  align = "center",
}: {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {kicker && (
        <Reveal>
          <p className={`bk-kicker ${centered ? "bk-kicker--center" : ""}`}>{kicker}</p>
        </Reveal>
      )}
      <Reveal delay={80}>
        <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={160}>
          <p
            className={`mt-4 text-muted-foreground text-lg leading-relaxed ${centered ? "" : "max-w-xl"}`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
