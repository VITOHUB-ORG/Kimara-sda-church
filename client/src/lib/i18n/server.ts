import { cookies } from "next/headers";
import { dictionaries, createT, type Dictionary, type Lang, type TFunction } from "./shared";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const lang = store.get("lang")?.value;
  return lang === "sw" ? "sw" : "en";
}

export async function getI18n(): Promise<{
  lang: Lang;
  t: TFunction;
  dict: Dictionary;
}> {
  const lang = await getLang();
  return { lang, t: createT(dictionaries[lang]), dict: dictionaries[lang] };
}

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" },
];
