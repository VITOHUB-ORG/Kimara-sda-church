import PageHeader from "@/components/site/PageHeader";
import PrayerForm from "@/components/site/PrayerForm";
import { getI18n } from "@/lib/i18n/server";

export const metadata = {
  title: "Prayer",
  description:
    "Submit a prayer request to the SDA Youth Ministry. You are not alone.",
};

export default async function PrayerPage() {
  const { t } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow={t("prayerPage.eyebrow")}
        title={t("prayerPage.title")}
        description={t("prayerPage.desc")}
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-100 p-8 shadow-sm sm:p-10">
            <PrayerForm />
          </div>
        </div>
      </section>
    </>
  );
}