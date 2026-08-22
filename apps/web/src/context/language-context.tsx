"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

const translations = {
  en: {
    dashboard: "Dashboard",
    disposals: "Disposals",
    ecoCredits: "EcoCredits",
    verification: "Verification",
    edgeQueue: "Edge Queue",
    mlEvidence: "ML Evidence",
    previews: "Previews",
    citizen: "Citizen",
    municipal: "Municipal",
    developer: "Developer",
    citizenSignIn: "Citizen sign in",
    municipalSignIn: "Municipal sign in",
    developerSignIn: "Developer sign in",
    productView: "Product view",
    chooseAccess: "Choose your SGV access",
    fictionalAccounts: "Fictional accounts",
    localDemoFallback: "Local demo fallback",
    openCitizenDashboard: "Open citizen dashboard",
    openMunicipalConsole: "Open municipal console",
    openDeveloperConsole: "Open developer console",
    continueWithGoogle: "Continue with Google",
    truthReal: "REAL - live hardware or local ML",
    truthSimulated: "SIMULATED - rules replayed offline",
    truthPreview: "PREVIEW/SEEDED - fixture data"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    disposals: "निपटान",
    ecoCredits: "इको-क्रेडिट्स",
    verification: "सत्यापन",
    edgeQueue: "एज क्यू",
    mlEvidence: "एमएल साक्ष्य",
    previews: "पूर्वावलोकन",
    citizen: "नागरिक",
    municipal: "नगरपालिका",
    developer: "डेवलपर",
    citizenSignIn: "नागरिक साइन इन",
    municipalSignIn: "नगरपालिका साइन इन",
    developerSignIn: "डेवलपर साइन इन",
    productView: "प्रोडक्ट व्यू",
    chooseAccess: "अपना SGV एक्सेस चुनें",
    fictionalAccounts: "काल्पनिक खाते",
    localDemoFallback: "लोकल डेमो फॉलबैक",
    openCitizenDashboard: "नागरिक डैशबोर्ड खोलें",
    openMunicipalConsole: "नगरपालिका कंसोल खोलें",
    openDeveloperConsole: "डेवलपर कंसोल खोलें",
    continueWithGoogle: "Google के साथ जारी रखें",
    truthReal: "REAL - लाइव हार्डवेयर या लोकल ML",
    truthSimulated: "SIMULATED - ऑफलाइन नियम रीप्ले",
    truthPreview: "PREVIEW/SEEDED - फिक्स्चर डेटा"
  }
} as const;

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations.en;

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const value = useMemo<LanguageContextValue>(() => ({
    lang,
    setLang,
    t: (key) => translations[lang][key] ?? translations.en[key] ?? key
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
