"use client";

import Manager, { type Field, type Column } from "@/components/admin/Manager";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const fields: Field[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "subject", label: "Subject", type: "text" },
  { name: "message", label: "Message", type: "textarea" },
  { name: "read", label: "Mark as read", type: "checkbox" },
];

const columns: Column<Message>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "subject", label: "Subject" },
  {
    key: "message",
    label: "Message",
    render: (item) => (
      <span className="line-clamp-2 max-w-md block text-gray-600">{item.message}</span>
    ),
  },
  {
    key: "read",
    label: "Read",
    render: (item) => (item.read ? "✓" : "—"),
  },
  {
    key: "createdAt",
    label: "Date",
    render: (item) => new Date(item.createdAt).toLocaleDateString("en-GB"),
  },
];

export default function ContactAdminPage() {
  return (
    <Manager<Message>
      title="Messages"
      description="Messages received through the website contact form."
      resource="/api/admin/contact"
      columns={columns}
      fields={fields}
    />
  );
}