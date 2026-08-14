import PageHeader from "@/components/site/PageHeader";
import { getI18n } from "@/lib/i18n/server";

const valueColors = [
  "#D9A441",
  "#1D4E89",
  "#3A7D44",
  "#8E3B46",
  "#E67E22",
  "#26828E",
];

const structureColors = [
  "#3A7D44",
  "#1D4E89",
  "#E67E22",
  "#6B3FA0",
  "#D9A441",
  "#8E3B46",
];

export const metadata = {
  title: "About",
  description:
    "Learn about the mission, vision, core values and structure of the SDA Youth Ministry.",
};

export default async function AboutPage() {
  const { t, dict } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow={t("about.eyebrow")}
        title={t("about.title")}
        description={t("about.desc")}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
                {t("about.missionEyebrow")}
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-navy-900">
                {t("about.missionTitle")}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                {t("about.missionP1")}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                {t("about.missionP2")}
              </p>
            </div>
            <div className="rounded-2xl bg-navy-900 p-8 text-white">
              <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-gold-400">
                {t("about.coreStatementLabel")}
              </p>
              <blockquote className="mt-4 font-display text-2xl font-bold leading-snug">
                {t("about.coreStatement")}
              </blockquote>
              <p className="mt-4 text-navy-100">{t("about.coreStatementNote")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-100/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
              {t("about.valuesEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-navy-900">
              {t("about.valuesTitle")}
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dict.about.values.map((value, i) => (
              <div
                key={value.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <span
                  className="block h-1.5 w-12 rounded-full"
                  style={{ backgroundColor: valueColors[i] }}
                />
                <h3 className="mt-4 font-display text-lg font-bold text-navy-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
              {t("about.structureEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-navy-900">
              {t("about.structureTitle")}
            </h2>
            <p className="mt-4 text-lg text-gray-600">{t("about.structureDesc")}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dict.about.structure.map(([name, ages], i) => (
              <div
                key={name}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-black text-white"
                  style={{ backgroundColor: structureColors[i] }}
                >
                  {name.charAt(0)}
                </span>
                <div>
                  <h3 className="font-display font-bold text-navy-900">{name}</h3>
                  <p className="text-sm text-gray-500">{ages}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}