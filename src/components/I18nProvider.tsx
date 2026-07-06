"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Languages } from "lucide-react";
import { isLanguage, type Language, translations } from "@/lib/i18n";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (typeof translations)[Language];
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("mara-language");
    if (savedLanguage && isLanguage(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("mara-language", language);
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    const setLanguage = (nextLanguage: Language) => setLanguageState(nextLanguage);

    return {
      language,
      setLanguage,
      toggleLanguage: () => setLanguage(language === "es" ? "en" : "es"),
      t: translations[language]
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}

export function LanguageToggle() {
  const { language, toggleLanguage, t } = useI18n();

  return (
    <button className="languageToggle" type="button" onClick={toggleLanguage} aria-label={t.language.toggleLabel}>
      <Languages size={17} />
      <span>{language.toUpperCase()}</span>
      <b>{t.language.switchTo}</b>
    </button>
  );
}
