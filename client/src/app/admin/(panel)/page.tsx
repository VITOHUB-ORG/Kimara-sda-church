"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin";
import type { Paginated } from "@/lib/api";

const resources = [
  { path: "/api/admin/events", label: "Events", href: "/admin/events" },
  { path: "/api/admin/news", label: "News Articles", href: "/admin/news" },
  { path: "/api/admin/resources", label: "Resources", href: "/admin/resources" },
  { path: "/api/admin/ministries", label: "Ministries", href: "/admin/ministries" },
  { path: "/api/admin/gallery", label: "Gallery Items", href: "/admin/gallery" },
  { path: "/api/admin/prayers", label: "Prayer Requests", href: "/admin/prayers" },
  { path: "/api/admin/testimonials", label: "Testimonies", href: "/admin/testimonials" },
  { path: "/api/admin/contact", label: "Messages", href: "/admin/contact" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      resources.map(async (r) => {
        try {
          const data = await adminFetch<Paginated<unknown>>(`${r.path}?limit=1`);
          return [r.path, data.total] as const;
        } catch {
          return [r.path, 0] as const;
        }
      })
    )
      .then((results) => setCounts(Object.fromEntries(results)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-navy-900">
        Dashboard Overview
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        A quick view of content across the platform.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((r) => (
          <Link
            key={r.path}
            href={r.href}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <p className="font-display text-3xl font-black text-navy-900">
              {loading ? "…" : counts[r.path] ?? 0}
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-600">{r.label}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-gold-600">
              Manage →
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gold-100 bg-gold-100/40 p-6">
        <p className="font-display text-sm font-bold text-navy-900">
          How content management works
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Use the menu on the left to add or edit content. New events, news,
          resources, ministries and gallery items appear on the public website
          as soon as they are published. Prayer requests, testimonies and
          contact messages arrive here from the public website.
        </p>
      </div>
    </div>
  );
}
