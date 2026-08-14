"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";
import LanguageSwitcher from "./LanguageSwitcher";

const navKeys = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/ministries", key: "ministries" },
  { href: "/events", key: "events" },
  { href: "/resources", key: "resources" },
  { href: "/news", key: "news" },
  { href: "/gallery", key: "gallery" },
  { href: "/contact", key: "contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-navy-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1">
            <img
              src="/church-logo.png"
              alt="SDA Youth Ministry"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-sm font-extrabold tracking-widest">
              {t("site.brandShort")}
            </span>
            <span className="block truncate text-xs text-gold-400">{t("site.brandSub")}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navKeys.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-gold-500 text-navy-900"
                  : "text-navy-100 hover:bg-navy-800 hover:text-white"
              }`}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
          <div className="ml-2">
            <LanguageSwitcher />
          </div>
          <Link
            href="/contact"
            className="ml-2 rounded-full bg-gold-500 px-5 py-2 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-400"
          >
            {t("nav.getInvolved")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-navy-100 hover:bg-navy-800"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-navy-800 bg-navy-900 px-4 pb-4 lg:hidden">
          {navKeys.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                isActive(link.href)
                  ? "bg-navy-800 text-gold-400"
                  : "text-navy-100 hover:bg-navy-800"
              }`}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-lg bg-gold-500 px-4 py-3 text-center text-sm font-bold text-navy-900"
          >
            {t("nav.getInvolved")}
          </Link>
        </nav>
      )}
    </header>
  );
}