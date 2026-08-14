"use client";

import Manager, { type Field, type Column } from "@/components/admin/Manager";

interface Resource {
  _id: string;
  title: string;
  type: string;
  author: string;
  published: boolean;
}

const fields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: [
      { value: "bible-study", label: "Bible Study" },
      { value: "devotional", label: "Devotional" },
      { value: "sermon", label: "Sermon" },
      { value: "prayer", label: "Prayer" },
      { value: "testimony", label: "Testimony" },
      { value: "download", label: "Download" },
    ],
  },
  { name: "description", label: "Description", type: "textarea" },
  { name: "author", label: "Author", type: "text" },
  { name: "fileUrl", label: "PDF / File (download)", type: "pdf" },
  { name: "link", label: "External Link", type: "url", placeholder: "https://..." },
  { name: "published", label: "Published", type: "checkbox" },
];

const columns: Column<Resource>[] = [
  { key: "title", label: "Title" },
  { key: "type", label: "Type" },
  { key: "author", label: "Author" },
  {
    key: "published",
    label: "Published",
    render: (item) => (item.published ? "✓" : "✗"),
  },
];

export default function ResourcesAdminPage() {
  return (
    <Manager<Resource>
      title="Resources"
      description="Manage spiritual resources."
      resource="/api/admin/resources"
      columns={columns}
      fields={fields}
    />
  );
}