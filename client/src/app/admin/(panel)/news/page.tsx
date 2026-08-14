"use client";

import Manager, { type Field, type Column } from "@/components/admin/Manager";

interface News {
  _id: string;
  title: string;
  category: string;
  author: string;
  published: boolean;
  createdAt: string;
}

const fields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "category", label: "Category", type: "text", placeholder: "Announcement / Report" },
  { name: "author", label: "Author", type: "text" },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  { name: "content", label: "Content", type: "textarea" },
  { name: "image", label: "Image", type: "image" },
  { name: "published", label: "Published", type: "checkbox" },
];

const columns: Column<News>[] = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "author", label: "Author" },
  {
    key: "createdAt",
    label: "Date",
    render: (item) => new Date(item.createdAt).toLocaleDateString("en-GB"),
  },
  {
    key: "published",
    label: "Published",
    render: (item) => (item.published ? "✓" : "✗"),
  },
];

export default function NewsAdminPage() {
  return (
    <Manager<News>
      title="News"
      description="Manage news articles and announcements."
      resource="/api/admin/news"
      columns={columns}
      fields={fields}
    />
  );
}