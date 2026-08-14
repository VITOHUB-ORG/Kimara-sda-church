import PageHeader from "@/components/site/PageHeader";
import ContactForm from "@/components/site/ContactForm";
import { getI18n } from "@/lib/i18n/server";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with the SDA Youth Ministry — send a message or find our official communication channels.",
};

const channelColors = ["#12355B", "#1D4E89", "#26828E", "#3A7D44"];

export default async function ContactPage() {
  const { t, dict } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow={t("contactPage.eyebrow")}
        title={t("contactPage.title")}
        description={t("contactPage.desc")}
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-navy-900">
                {t("contactPage.sendTitle")}
              </h2>
              <p className="mt-2 text-gray-600">{t("contactPage.sendDesc")}</p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-extrabold text-navy-900">
                {t("contactPage.channelsTitle")}
              </h2>
              <div className="space-y-4">
                {dict.contactPage.channels.map((channel, i) => (
                  <div
                    key={channel.title}
                    className="flex items-start gap-4 rounded-2xl border border-gray-100 p-5 shadow-sm"
                  >
                    <span
                      className="mt-1 h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: channelColors[i] }}
                    />
                    <div>
                      <h3 className="font-display font-bold text-navy-900">
                        {channel.title}
                      </h3>
                      <p className="text-sm text-gray-600">{channel.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-navy-900 p-8 text-white">
                <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-gold-400">
                  {t("contactPage.noteLabel")}
                </p>
                <p className="mt-3 text-navy-100">
                  {t("contactPage.noteText")}{" "}
                  <a href="/prayer" className="font-semibold text-gold-400 underline">
                    {t("footer.links.prayer")}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
