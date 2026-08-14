"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { createT, dictionaries, type Dictionary, type Lang, type TFunction } from "./shared";

interface I18nContextValue {
  lang: Lang;
  t: TFunction;
  dict: Dictionary;
  setLang: (next: Lang) => void;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "en",
  t: (key: string) => key,
  dict: dictionaries.en,
  setLang: () => {},
});

export function setLangCookie(next: Lang) {
  document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
}

export function I18nProvider({
  lang: initialLang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const dict = dictionaries[lang];

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      t: createT(dict),
      dict,
      setLang: (next: Lang) => {
        if (next === lang) return;
        setLangCookie(next);
        setLangState(next);
      },
    }),
    [lang, dict]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
