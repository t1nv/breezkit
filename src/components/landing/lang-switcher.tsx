import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import type { SupportedLanguage } from "@/lib/i18n";
import { switchLanguage } from "@/lib/i18n";

export function LangSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language as SupportedLanguage;

  return (
    <button
      onClick={() => {
        const next: SupportedLanguage = current === "es" ? "en" : "es";
        switchLanguage(next);
      }}
      className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      <span className="text-[8px] font-bold absolute mt-3">
        {current === "es" ? "EN" : "ES"}
      </span>
    </button>
  );
}
