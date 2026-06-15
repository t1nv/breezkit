import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight, Github } from "lucide-react";
import { Reveal } from "./reveal";
import { GITHUB_URL } from "./constants";

export function CTA() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl p-10 md:p-16 border border-white/[0.06]"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div className="absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 right-1/3 h-64 w-64 rounded-full bg-secondary/8 blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight text-white">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-white/60 text-lg max-w-lg">
                {t("cta.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/auth"
                    className="group inline-flex items-center gap-2 rounded-full bg-white text-primary px-7 py-3.5 font-medium hover:bg-white/90 transition-all shadow-xl"
                  >
                    {t("cta.cta")}
                    <span className="h-5 w-5 rounded-full bg-primary/10 grid place-items-center group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="h-3 w-3 text-primary" />
                    </span>
                  </Link>
                </motion.div>
                <motion.a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-7 py-3.5 font-medium hover:bg-white/10 transition-all"
                >
                  <Github className="h-4 w-4" /> {t("cta.github")}
                </motion.a>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
