import { apiGet, type Paginated } from "@/lib/api";
import type { Testimony } from "@/lib/types";
import { getI18n } from "@/lib/i18n/server";
import PageHeader from "@/components/site/PageHeader";
import TestimonyForm from "@/components/site/TestimonyForm";

export const metadata = {
  title: "Testimonies",
  description:
    "Stories of transformed lives by the power of God from the SDA Youth Ministry.",
};

async function getTestimonies() {
  return apiGet<Paginated<Testimony>>(
    "/api/public/testimonials?limit=50&approved=true"
  ).catch(() => ({ items: [] as Testimony[], total: 0, page: 1, pages: 1 }));
}

export default async function TestimoniesPage() {
  const data = await getTestimonies();
  const { t } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow={t("testimoniesPage.eyebrow")}
        title={t("testimoniesPage.title")}
        description={t("testimoniesPage.desc")}
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {data.items.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((testimony) => (
                <blockquote
                  key={testimony._id}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-navy-100/40 p-6 shadow-sm"
                >
                  <p className="font-display text-4xl leading-none text-gold-500">
                    “
                  </p>
                  <p className="mt-2 flex-1 text-gray-700">
                    {testimony.testimony}
                  </p>
                  <footer className="mt-5">
                    <p className="font-display font-bold text-navy-900">
                      {testimony.name}
                    </p>
                    {testimony.title && (
                      <p className="text-sm text-gray-500">{testimony.title}</p>
                    )}
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {t("testimoniesPage.empty")}
            </p>
          )}

          <div className="mx-auto mt-20 max-w-2xl">
            <div className="text-center">
              <h2 className="font-display text-2xl font-extrabold text-navy-900">
                {t("testimoniesPage.shareTitle")}
              </h2>
              <p className="mt-2 text-gray-600">{t("testimoniesPage.shareDesc")}</p>
            </div>
            <div className="mt-8 rounded-2xl border border-gray-100 p-8 shadow-sm">
              <TestimonyForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
