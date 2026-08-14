"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getToken, clearToken, adminFetch } from "@/lib/admin";
import {
  IconGrid,
  IconCalendar,
  IconNewspaper,
  IconBook,
  IconChurch,
  IconImage,
  IconHeart,
  IconSparkles,
  IconMail,
} from "@/lib/icons";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

const nav = [
  { href: "/admin", label: "Dashboard", Icon: IconGrid },
  { href: "/admin/events", label: "Events", Icon: IconCalendar },
  { href: "/admin/news", label: "News", Icon: IconNewspaper },
  { href: "/admin/resources", label: "Resources", Icon: IconBook },
  { href: "/admin/ministries", label: "Ministries", Icon: IconChurch },
  { href: "/admin/gallery", label: "Gallery", Icon: IconImage },
  { href: "/admin/prayers", label: "Prayer Requests", Icon: IconHeart },
  { href: "/admin/testimonials", label: "Testimonies", Icon: IconSparkles },
  { href: "/admin/contact", label: "Messages", Icon: IconMail },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    adminFetch<Admin>("/api/auth/me")
      .then(setAdmin)
      .catch(() => {
        clearToken();
        router.replace("/admin/login");
      })
      .finally(() => setChecking(false));
  }, [router]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-gold-400">
          Loading...
        </p>
      </div>
    );
  }

  if (!admin) return null;

  const handleLogout = () => {
    clearToken();
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-navy-950 text-white shadow-2xl transition-transform duration-200 lg:static lg:w-64 lg:translate-x-0 lg:shadow-none ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-navy-800 px-5 py-5 lg:px-6">
              <Link href="/admin" className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1">
                  <img
                    src="/church-logo.png"
                    alt="SDA Youth Ministry"
                    className="h-full w-full object-contain"
                  />
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block truncate font-display text-sm font-extrabold tracking-widest">
                    KIMARA YOUTH
                  </span>
                  <span className="block truncate text-xs text-gold-400">
                    Content Management
                  </span>
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-navy-100 hover:bg-navy-800 lg:hidden"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {nav.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-gold-500 text-navy-900"
                        : "text-navy-100 hover:bg-navy-800"
                    }`}
                  >
                    <span className="shrink-0">
                      <item.Icon className="h-5 w-5" />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-navy-800 px-5 py-4 lg:px-6">
              <p className="truncate text-sm font-semibold">{admin.name}</p>
              <p className="truncate text-xs text-navy-100">{admin.email}</p>
              <button
                onClick={handleLogout}
                className="mt-3 w-full rounded-lg border border-navy-700 px-4 py-2 text-xs font-bold uppercase tracking-wide text-navy-100 transition-colors hover:bg-navy-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg border border-gray-200 p-2 text-navy-900 lg:hidden"
                aria-label="Open menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              </button>
              <p className="truncate font-display text-base font-bold text-navy-900 sm:text-lg">
                Admin Dashboard
              </p>
            </div>
            <Link
              href="/"
              target="_blank"
              className="shrink-0 text-sm font-semibold text-gold-600 hover:text-gold-500"
            >
              View website ↗
            </Link>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}