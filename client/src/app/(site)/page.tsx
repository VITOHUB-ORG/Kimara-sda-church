import { apiGet, type Paginated } from "@/lib/api";
import type { Ministry, Event, Resource, NewsItem, GalleryItem } from "@/lib/types";
import { isYouTubeUrl } from "@/lib/youtube";
import { getI18n } from "@/lib/i18n/server";
import Hero from "@/components/site/Hero";
import Journey from "@/components/site/Journey";
import WatchLive from "@/components/site/WatchLive";
import SectionHeading from "@/components/site/SectionHeading";
import MinistryCard from "@/components/site/MinistryCard";
import EventCard from "@/components/site/EventCard";
import ResourceCard from "@/components/site/ResourceCard";
import NewsCard from "@/components/site/NewsCard";
import ImageCarousel, { type CarouselSlide } from "@/components/site/ImageCarousel";
import CTA from "@/components/site/CTA";
import IWillGo from "@/components/site/IWillGo";
import Link from "next/link";

function gallerySlides(items: GalleryItem[]): CarouselSlide[] {
  return items.map((item) => {
    const images = (item.images ?? []).filter(Boolean);
    return {
      src: images[0] || item.image,
      alt: item.title || item.caption || "Gallery photo",
      title: item.title || item.caption || undefined,
      caption: item.caption || undefined,
    };
  });
}

async function getData() {
  const [ministries, events, resources, news, featured, gallery] = await Promise.all([
    apiGet<Paginated<Ministry>>("/api/public/ministries?limit=6").catch(() => null),
    apiGet<Paginated<Event>>("/api/public/events?limit=6&sort=startDate").catch(() => null),
    apiGet<Paginated<Resource>>("/api/public/resources?limit=6").catch(() => null),
    apiGet<Paginated<NewsItem>>("/api/public/news?limit=3").catch(() => null),
    apiGet<Paginated<GalleryItem>>("/api/public/gallery?featured=true&limit=6").catch(() => null),
    apiGet<Paginated<GalleryItem>>("/api/public/gallery?limit=6").catch(() => null),
  ]);

  const galleryItems =
    featured?.items && featured.items.length > 0 ? featured.items : (gallery?.items ?? []);

  return {
    ministries: ministries?.items ?? [],
    events: events?.items ?? [],
    resources: resources?.items ?? [],
    news: news?.items ?? [],
    gallery: galleryItems,
  };
}

export default async function HomePage() {
  const { ministries, events, resources, news, gallery } = await getData();
  const { t } = await getI18n();
  const liveEvent = events.find((e) => isYouTubeUrl(e.youtubeUrl)) ?? null;
  const slides = gallerySlides(gallery);

  return (
    <>
      <Hero />

      {slides.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow={t("home.galleryEyebrow")}
                title={t("home.galleryTitle")}
              />
              <Link
                href="/gallery"
                className="rounded-full border border-navy-900 px-6 py-2.5 text-center text-sm font-bold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white sm:inline-block"
              >
                {t("home.viewAllGallery")}
              </Link>
            </div>
            <div className="mt-12">
              <ImageCarousel slides={slides} />
            </div>
          </div>
        </section>
      )}

      <IWillGo />

      {/* Ministries */}
      <section className="bg-navy-100/40 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("home.ministriesEyebrow")}
            title={t("home.ministriesTitle")}
            description={t("home.ministriesDesc")}
            center
          />
          {ministries.length > 0 && (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ministries.map((ministry) => (
                <MinistryCard key={ministry._id} ministry={ministry} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Journey */}
      <Journey />

      {/* Watch Live */}
      <WatchLive event={liveEvent} />

      {/* Featured events */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow={t("home.eventsEyebrow")}
              title={t("home.eventsTitle")}
            />
            <Link
              href="/events"
              className="rounded-full border border-navy-900 px-6 py-2.5 text-center text-sm font-bold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white sm:inline-block"
            >
              {t("home.viewAllEvents")}
            </Link>
          </div>
          {events.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-gray-500">
              {t("home.noEvents")}
            </p>
          )}
        </div>
      </section>

      {/* Resources — salvation first */}
      <section className="bg-navy-100/40 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t("home.resourcesEyebrow")}
            title={t("home.resourcesTitle")}
            description={t("home.resourcesDesc")}
            center
          />
          {resources.length > 0 ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-gray-500">
              {t("home.noResources")}
            </p>
          )}
        </div>
      </section>

      {/* Latest news */}
      {news.length > 0 && (
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow={t("home.newsEyebrow")} title={t("home.newsTitle")} />
              <Link
                href="/news"
                className="rounded-full border border-navy-900 px-6 py-2.5 text-center text-sm font-bold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white sm:inline-block"
              >
                {t("home.viewAllNews")}
              </Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {news.map((item) => (
                <NewsCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
