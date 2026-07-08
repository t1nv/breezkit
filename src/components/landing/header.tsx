import { BreezkitMark } from "@/components/brand/logo";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight, Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { GITHUB_URL } from "./constants";
import { LangSwitcher } from "./lang-switcher";

export function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#features", label: t("nav.features") },
    { href: "#how-it-works", label: "Cómo funciona" },
    { href: "#pricing", label: t("nav.pricing") },
    { href: "#faq", label: t("nav.faq") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 inset-x-0 z-50 px-4"
    >
      <motion.div
        layout
        className={`mx-auto max-w-5xl flex items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-2xl shadow-[0_15px_40px_-15px_rgba(62,42,32,0.18)] border border-border"
            : "bg-background/60 backdrop-blur-lg border border-border"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5 group">
          <motion.span whileHover={{ rotate: 10, scale: 1.05 }} className="inline-flex">
            <BreezkitMark className="h-7 w-7" />
          </motion.span>
          <span className="font-display font-bold text-base tracking-tight text-foreground">
            Breezkit
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-muted transition-all duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1">
          <LangSwitcher />
          <motion.a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            whileHover={{ scale: 1.1 }}
            className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
          </motion.a>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/auth"
              className="group inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              {t("nav.getStarted")}
              <span className="h-5 w-5 rounded-full bg-white/20 grid place-items-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </motion.div>
        </div>

        <button
          className="md:hidden h-9 w-9 grid place-items-center rounded-full border border-border hover:bg-muted transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.3 }}>
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </motion.div>
        </button>
      </motion.div>

      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden mt-2 rounded-2xl bg-popover/95 backdrop-blur-2xl border border-border p-4 shadow-xl"
        >
          <nav className="flex flex-col gap-1">
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg px-3 py-2.5 text-sm hover:bg-muted text-foreground transition-colors"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 pt-2 border-t border-border"
            >
              <Link
                to="/auth"
                className="block rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium text-center"
              >
                {t("nav.getStarted")}
              </Link>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
