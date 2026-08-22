"use client";

import { useLanguage } from "@/context/language-context";
import styles from "./language-toggle.module.css";

type LanguageToggleProps = {
  variant?: "dark" | "paper";
};

export function LanguageToggle({ variant = "dark" }: LanguageToggleProps) {
  const { lang, setLang } = useLanguage();
  const nextLang = lang === "en" ? "hi" : "en";

  return (
    <button
      aria-label={lang === "en" ? "Switch language to Hindi" : "Switch language to English"}
      className={styles.toggle}
      data-variant={variant}
      onClick={() => setLang(nextLang)}
      type="button"
    >
      <span aria-hidden="true">{lang === "en" ? "अ" : "A"}</span>
      {lang === "en" ? "हिंदी" : "English"}
    </button>
  );
}
