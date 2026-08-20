"use client";

import Manager, { type Field, type Column } from "@/components/admin/Manager";

interface News {
  _id: string;
  title: string;
  type: string;
  category: string;
  author: string;
  published: boolean;
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  lesoni: "Bible Study Guide",
  bobea: "Youth Lesson",
  kesha: "Morning Devotional",
};

const fields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "type",
    label: "Reading Type",
    type: "select",
    options: [
      { value: "lesoni", label: "Bible Study Guide (Lesoni)" },
      { value: "bobea", label: "Youth Lesson (Bobea)" },
      { value: "kesha", label: "Morning Devotional (Kesha la Asubuhi)" },
    ],
  },
  { name: "bibleText", label: "Bible Text (reference)", type: "text", placeholder: "e.g. Isaiah 41:10" },
  { name: "author", label: "Author", type: "text" },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  { name: "content", label: "Content", type: "textarea" },
  { name: "image", label: "Image", type: "image" },
  { name: "published", label: "Published", type: "checkbox" },
];

const columns: Column<News>[] = [
  { key: "title", label: "Title" },
  {
    key: "type",
    label: "Type",
    render: (item) => typeLabels[item.type] || item.type || item.category || "—",
  },
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
      title="Daily Lessons"
      description="Post daily Bible study guides (Lesoni), youth lessons (Bobea) and morning devotionals (Kesha la Asubuhi)."
      resource="/api/admin/news"
      columns={columns}
      fields={fields}
    />
  );
}