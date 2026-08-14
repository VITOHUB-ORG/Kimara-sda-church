import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";

const columns = [
  {
    key: "explore",
    links: [
      { key: "about", href: "/about" },
      { key: "ministries", href: "/ministries" },
      { key: "events", href: "/events" },
      { key: "news", href: "/news" },
    ],
  },
  {
    key: "grow",
    links: [
      { key: "resources", href: "/resources" },
      { key: "gallery", href: "/gallery" },
      { key: "testimonies", href: "/testimonies" },
      { key: "prayer", href: "/prayer" },
    ],
  },
  {
    key: "connect",
    links: [
      { key: "contact", href: "/contact" },
      { key: "church", href: "/contact" },
      { key: "privacy", href: "/privacy" },
    ],
  },
];

export default async function Footer() {
  const { t } = await getI18n();

  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5">
              <img
                src="/church-logo.png"
                alt="SDA Youth Ministry"
                className="h-full w-full object-contain"
              />
            </span>
            <p className="mt-3 font-display text-lg font-extrabold tracking-widest">
              {t("footer.brand")}
            </p>
            <p className="mt-2 text-sm text-gold-400">{t("site.tagline")}</p>
          </div>

          {columns.map((col) => (
            <div key={col.key}>
              <p className="font-display text-sm font-bold uppercase tracking-widest text-gold-500">
                {t(`footer.${col.key}`)}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-sm text-navy-100 transition-colors hover:text-gold-400"
                    >
                      {t(`footer.links.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-6 sm:flex-row">
          <p className="text-xs text-navy-100">{t("footer.bottomChurch")}</p>
          <p className="text-xs text-navy-100">
            © {new Date().getFullYear()} Kimara Youth Ministry.{" "}
            {t("footer.bottomRights")}
          </p>
        </div>
      </div>
    </footer>
  );
}