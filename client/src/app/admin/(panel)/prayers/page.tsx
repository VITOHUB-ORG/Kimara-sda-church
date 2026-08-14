"use client";

import Manager, { type Field, type Column } from "@/components/admin/Manager";

interface Prayer {
  _id: string;
  name: string;
  prayer: string;
  isPublic: boolean;
  status: string;
  createdAt: string;
}

const fields: Field[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "prayer", label: "Prayer Request", type: "textarea", required: true },
  { name: "isPublic", label: "Public on prayer wall", type: "checkbox" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "pending", label: "Pending" },
      { value: "prayed", label: "Prayed For" },
      { value: "answered", label: "Answered" },
    ],
  },
];

const columns: Column<Prayer>[] = [
  { key: "name", label: "Name" },
  {
    key: "prayer",
    label: "Prayer",
    render: (item) => (
      <span className="line-clamp-2 max-w-md block text-gray-600">{item.prayer}</span>
    ),
  },
  {
    key: "isPublic",
    label: "Public",
    render: (item) => (item.isPublic ? "✓" : "—"),
  },
  { key: "status", label: "Status" },
  {
    key: "createdAt",
    label: "Date",
    render: (item) => new Date(item.createdAt).toLocaleDateString("en-GB"),
  },
];

export default function PrayersAdminPage() {
  return (
    <Manager<Prayer>
      title="Prayer Requests"
      description="Review prayer requests from the website."
      resource="/api/admin/prayers"
      columns={columns}
      fields={fields}
    />
  );
}