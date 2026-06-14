import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "./locales/es.json";
import en from "./locales/en.json";

const SUPPORTED_LANGUAGES = ["es", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

const savedLang =
  typeof window !== "undefined" ? localStorage.getItem("breezkit-lang") : null;
const detectedLang =
  typeof navigator !== "undefined"
    ? navigator.language?.split("-")[0]
    : "es";
const initialLang = isSupportedLanguage(savedLang ?? "")
  ? savedLang!
  : isSupportedLanguage(detectedLang)
    ? detectedLang
    : "es";

i18next.use(initReactI18next).use(LanguageDetector).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: initialLang,
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["localStorage", "navigator"],
    lookupLocalStorage: "breezkit-lang",
    caches: ["localStorage"],
  },
});

export function switchLanguage(lang: SupportedLanguage) {
  i18next.changeLanguage(lang);
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
  }
}

export default i18next;
