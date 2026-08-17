"use client";

import Manager, { type Field, type Column } from "@/components/admin/Manager";
import { normalizeImageSrc } from "@/lib/api";

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  image: string;
  images?: string[];
  featured?: boolean;
}

const fields: Field[] = [
  { name: "title", label: "Title", type: "text" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { value: "worship", label: "Worship" },
      { value: "fellowship", label: "Fellowship" },
      { value: "service", label: "Service" },
      { value: "mission", label: "Mission" },
      { value: "leadership", label: "Leadership" },
    ],
  },
  {
    name: "images",
    label: "Images",
    type: "images",
  },
  { name: "caption", label: "Caption", type: "text" },
  {
    name: "featured",
    label: "Show on homepage carousel",
    type: "checkbox",
  },
];

const columns: Column<GalleryItem>[] = [
  {
    key: "image",
    label: "Image",
    render: (item) => {
      const src = item.images?.[0] || item.image || "";
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={normalizeImageSrc(src)}
          alt=""
          className="h-12 w-16 rounded-lg object-cover"
        />
      );
    },
  },
  {
    key: "title",
    label: "Title",
    render: (item) => (
      <span className="flex items-center gap-2">
        {item.title || "—"}
        {item.featured && (
          <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-bold text-gold-600">
            ★ Featured
          </span>
        )}
        {item.images && item.images.length > 1 && (
          <span className="rounded-full bg-navy-100 px-2 py-0.5 text-[11px] font-bold text-navy-800">
            {item.images.length} photos
          </span>
        )}
      </span>
    ),
  },
  { key: "category", label: "Category" },
];

export default function GalleryAdminPage() {
  return (
    <Manager<GalleryItem>
      title="Gallery"
      description="Manage photos in the media gallery. Multiple images per item are supported — the first is the cover."
      resource="/api/admin/gallery"
      columns={columns}
      fields={fields}
    />
  );
}
