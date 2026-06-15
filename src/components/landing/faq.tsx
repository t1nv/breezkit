import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Reveal } from "./reveal";

export function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = t("faq.items", { returnObjects: true }) as { q: string; a: string }[];

  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center">
          <Reveal delay={100}>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {t("faq.title")}
            </h2>
          </Reveal>
        </div>

        <div className="mt-12 space-y-3">
          {items.map((it, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={it.q} delay={i * 60}>
                <motion.div
                  layout
                  className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    id={`faq-btn-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-foreground"
                  >
                    <span className="font-medium text-sm md:text-base">{it.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="h-6 w-6 rounded-full border border-white/10 grid place-items-center shrink-0"
                    >
                      <Plus className="h-3 w-3 text-muted-foreground" />
                    </motion.span>
                  </button>
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {it.a}
                    </p>
                  </motion.div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
