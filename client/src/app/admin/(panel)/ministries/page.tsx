"use client";

import Manager, { type Field, type Column } from "@/components/admin/Manager";

interface Ministry {
  _id: string;
  name: string;
  slug: string;
  color: string;
  published: boolean;
}

const fields: Field[] = [
  { name: "name", label: "Name", type: "text", required: true },
  {
    name: "slug",
    label: "Slug / Ministry Key",
    type: "select",
    required: true,
    options: [
      { value: "adventurers", label: "Adventurers" },
      { value: "pathfinders", label: "Pathfinders" },
      { value: "ambassadors", label: "Ambassadors" },
      { value: "young-adults", label: "Young Adults" },
      { value: "senior-youth", label: "Senior Youth" },
      { value: "mission", label: "Mission & Evangelism" },
    ],
  },
  { name: "tagline", label: "Tagline", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  {
    name: "color",
    label: "Accent Color",
    type: "select",
    options: [
      { value: "green", label: "Green (Adventurers)" },
      { value: "blue", label: "Blue (Pathfinders)" },
      { value: "orange", label: "Orange (Ambassadors)" },
      { value: "purple", label: "Purple (Young Adults)" },
      { value: "gold", label: "Gold (Senior Youth)" },
      { value: "burgundy", label: "Burgundy (Mission)" },
    ],
  },
  { name: "image", label: "Image", type: "image" },
  { name: "leaderName", label: "Leader Name", type: "text" },
  { name: "leaderTitle", label: "Leader Title", type: "text" },
  { name: "contact", label: "Contact", type: "text" },
  { name: "published", label: "Published", type: "checkbox" },
];

const columns: Column<Ministry>[] = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "color", label: "Color" },
  {
    key: "published",
    label: "Published",
    render: (item) => (item.published ? "✓" : "✗"),
  },
];

export default function MinistriesAdminPage() {
  return (
    <Manager<Ministry>
      title="Ministries"
      description="Manage ministry information."
      resource="/api/admin/ministries"
      columns={columns}
      fields={fields}
    />
  );
}