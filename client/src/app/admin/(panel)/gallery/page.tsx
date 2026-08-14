"use client";

import Manager, { type Field, type Column } from "@/components/admin/Manager";

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  image: string;
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
  { name: "image", label: "Image", type: "image", required: true },
  { name: "caption", label: "Caption", type: "text" },
];

const columns: Column<GalleryItem>[] = [
  {
    key: "image",
    label: "Image",
    render: (item) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
    ),
  },
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
];

export default function GalleryAdminPage() {
  return (
    <Manager<GalleryItem>
      title="Gallery"
      description="Manage photos in the media gallery."
      resource="/api/admin/gallery"
      columns={columns}
      fields={fields}
    />
  );
}