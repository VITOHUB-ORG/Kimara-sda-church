import SectionHeading from "./SectionHeading";
import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";

const stepMeta = [
  { href: "/resources", color: "#1D4E89" },
  { href: "/ministries", color: "#3A7D44" },
  { href: "/contact", color: "#8E3B46" },
  { href: "/events", color: "#E67E22" },
  { href: "/testimonies", color: "#D9A441" },
];

export default async function Journey() {
  const { t, dict } = await getI18n();
  const steps = dict.journey.steps;

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("journey.eyebrow")}
          title={t("journey.title")}
          description={t("journey.desc")}
          center
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <Link
              key={step.key}
              href={stepMeta[i].href}
              className="group flex flex-col rounded-2xl border border-gray-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-display text-xs font-black tracking-widest"
                  style={{ color: stepMeta[i].color }}
                >
                  {step.key}
                </span>
                <span className="font-display text-3xl font-black text-gray-200">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-navy-900">
                {step.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-gray-600">{step.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}