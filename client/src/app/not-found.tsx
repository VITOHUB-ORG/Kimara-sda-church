import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getI18n();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-4 text-center">
      <p className="font-display text-8xl font-black text-gold-500">404</p>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-white">
        {t("notFound.title")}
      </h1>
      <p className="mt-2 max-w-md text-navy-100">{t("notFound.desc")}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gold-500 px-7 py-3 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400"
      >
        {t("notFound.back")}
      </Link>
    </div>
  );
}