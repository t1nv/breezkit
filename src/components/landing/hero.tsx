import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";
import dashboardImg from "@/assets/dashboard-preview.jpg";
import { SPRING } from "./constants";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section id="top" className="relative pt-32 md:pt-40 pb-20 md:pb-28">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="relative z-10">
          <Reveal>
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {t("hero.badge")}
            </motion.span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.04] tracking-tight text-foreground">
              {t("hero.headline")}
              <br />
              <span className="text-primary">
                {t("hero.headlineAccent")}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-5 max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </Reveal>

          <Reveal delay={300}>
            <Link
              to="/auth"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3.5 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              {t("hero.cta")}
              <span className="h-5 w-5 rounded-full bg-white/20 grid place-items-center">
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/5 blur-3xl"
            />
            <motion.div
              whileHover={{ rotate: -1, scale: 1.01 }}
              transition={SPRING}
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-black/20">
                <span className="h-2 w-2 rounded-full bg-red-400/60" />
                <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
                <span className="h-2 w-2 rounded-full bg-green-400/60" />
                <span className="ml-3 text-[11px] text-muted-foreground font-mono">
                  breezkit.app
                </span>
              </div>
              <img
                src={dashboardImg}
                alt="Vista del dashboard de Breezkit"
                width={1920}
                height={1080}
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
