import PageHeader from "@/components/site/PageHeader";
import { getI18n } from "@/lib/i18n/server";

export const metadata = {
  title: "Privacy",
  description: "Privacy policy for the SDA Youth Ministry digital platform.",
};

export default async function PrivacyPage() {
  const { t, dict } = await getI18n();

  return (
    <>
      <PageHeader eyebrow={t("privacyPage.eyebrow")} title={t("privacyPage.title")} />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6 text-gray-700">
          <p>{t("privacyPage.intro")}</p>
          <h2 className="font-display text-xl font-bold text-navy-900">
            {t("privacyPage.hCollect")}
          </h2>
          <p>{t("privacyPage.pCollect")}</p>
          <h2 className="font-display text-xl font-bold text-navy-900">
            {t("privacyPage.hUse")}
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            {dict.privacyPage.useList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2 className="font-display text-xl font-bold text-navy-900">
            {t("privacyPage.hConfidential")}
          </h2>
          <p>{t("privacyPage.pConfidential")}</p>
          <h2 className="font-display text-xl font-bold text-navy-900">
            {t("privacyPage.hContact")}
          </h2>
          <p>
            {t("privacyPage.pContact")}{" "}
            <a href="/contact" className="font-semibold text-gold-600 underline">
              {t("footer.links.contact")}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}