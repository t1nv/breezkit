import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "./section-header";
import { ParallaxBlob } from "./scroll-fx";

const STEP_KEYS = ["s1", "s2", "s3"] as const;

export function HowItWorks() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "start 0.25"],
  });
  const lineScaleX = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0, 1]);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <ParallaxBlob
          distance={55}
          className="absolute top-1/2 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[140px]"
        />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeader
          align="left"
          kicker={t("howItWorks.eyebrow")}
          title={t("howItWorks.title")}
          subtitle={t("howItWorks.subtitle")}
        />

        <ol className="mt-16 grid md:grid-cols-3 gap-10 md:gap-8 relative">
          <motion.div
            aria-hidden
            style={{ scaleX: lineScaleX, transformOrigin: "0% 50%" }}
            className="pointer-events-none absolute top-7 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-px hidden md:block bg-gradient-to-r from-transparent via-primary/25 to-transparent"
          />

          {STEP_KEYS.map((key, idx) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 * idx, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <span
                aria-hidden
                className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-background font-display text-2xl font-bold italic text-primary"
              >
                {idx + 1}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-foreground tracking-tight">
                {t(`howItWorks.${key}`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm">
                {t(`howItWorks.${key}d`)}
              </p>
            </motion.li>
          ))}
        </ol>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
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
