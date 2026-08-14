"use client";

import Manager, { type Field, type Column } from "@/components/admin/Manager";

interface Testimony {
  _id: string;
  name: string;
  title: string;
  testimony: string;
  approved: boolean;
  createdAt: string;
}

const fields: Field[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "title", label: "Title", type: "text" },
  { name: "testimony", label: "Testimony", type: "textarea", required: true },
  { name: "image", label: "Image", type: "image" },
  { name: "approved", label: "Approved for publication", type: "checkbox" },
];

const columns: Column<Testimony>[] = [
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  {
    key: "testimony",
    label: "Testimony",
    render: (item) => (
      <span className="line-clamp-2 max-w-md block text-gray-600">{item.testimony}</span>
    ),
  },
  {
    key: "approved",
    label: "Approved",
    render: (item) => (item.approved ? "✓" : "✗"),
  },
  {
    key: "createdAt",
    label: "Date",
    render: (item) => new Date(item.createdAt).toLocaleDateString("en-GB"),
  },
];

export default function TestimonialsAdminPage() {
  return (
    <Manager<Testimony>
      title="Testimonies"
      description="Review and approve testimonies submitted on the website."
      resource="/api/admin/testimonials"
      columns={columns}
      fields={fields}
    />
  );
}