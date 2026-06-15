import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Sparkles, Github } from "lucide-react";
import { GITHUB_URL } from "./constants";
import { LangSwitcher } from "./lang-switcher";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/[0.04] bg-gradient-to-b from-transparent to-white/[0.02]">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5 group">
            <motion.span
              whileHover={{ rotate: 10 }}
              className="h-8 w-8 rounded-lg grid place-items-center text-white"
              style={{ background: "var(--gradient-accent)" }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.span>
            <span className="font-display font-bold text-lg text-foreground">
              Breezkit
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm leading-relaxed">
            {t("footer.description")}
          </p>
          <div className="mt-5 flex gap-2">
            <LangSwitcher />
            <motion.a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              whileHover={{ scale: 1.15 }}
              className="h-9 w-9 grid place-items-center rounded-full border border-white/10 hover:bg-white/5 transition-all text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </motion.a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground/60">
            {t("footer.product")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground transition-colors">{t("footer.features")}</a></li>
            <li><a href="#pricing" className="hover:text-foreground transition-colors">{t("footer.pricing")}</a></li>
            <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
            <li><Link to="/auth" className="hover:text-foreground transition-colors">{t("footer.signUp")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground/60">
            {t("footer.legal")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">{t("footer.privacy")}</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">{t("footer.terms")}</a></li>
            <li><a href="#contact" className="hover:text-foreground transition-colors">{t("footer.contact")}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-[0.1em] uppercase text-foreground/60">
            {t("footer.resources")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">{t("footer.blog")}</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">{t("footer.api")}</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">{t("footer.status")}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 py-5 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
          <span>&copy; 2026 Breezkit. {t("footer.copyright")}</span>
          <span>{t("footer.tagline")}</span>
        </div>
      </div>
    </footer>
  );
}
