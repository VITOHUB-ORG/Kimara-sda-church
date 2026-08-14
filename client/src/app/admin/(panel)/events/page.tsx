"use client";

import Manager, { type Field, type Column } from "@/components/admin/Manager";

interface Event {
  _id: string;
  title: string;
  location: string;
  startDate: string;
  ministry: string;
  featured: boolean;
  published: boolean;
}

const fields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "location", label: "Location", type: "text" },
  { name: "time", label: "Time", type: "text", placeholder: "e.g. 9:00 AM" },
  { name: "startDate", label: "Start Date", type: "date", required: true },
  { name: "endDate", label: "End Date", type: "date" },
  {
    name: "ministry",
    label: "Ministry",
    type: "select",
    options: [
      { value: "general", label: "General" },
      { value: "adventurers", label: "Adventurers" },
      { value: "pathfinders", label: "Pathfinders" },
      { value: "ambassadors", label: "Ambassadors" },
      { value: "young-adults", label: "Young Adults" },
      { value: "senior-youth", label: "Senior Youth" },
      { value: "mission", label: "Mission & Evangelism" },
    ],
  },
  { name: "image", label: "Image", type: "image" },
  { name: "youtubeUrl", label: "YouTube Live Link", type: "url", placeholder: "https://youtube.com/live/... or channel URL" },
  { name: "registrationLink", label: "Registration Link", type: "url" },
  { name: "featured", label: "Featured on homepage", type: "checkbox" },
  { name: "published", label: "Published", type: "checkbox" },
];

const columns: Column<Event>[] = [
  { key: "title", label: "Title" },
  { key: "location", label: "Location" },
  {
    key: "startDate",
    label: "Start",
    render: (item) => new Date(item.startDate).toLocaleDateString("en-GB"),
  },
  { key: "ministry", label: "Ministry" },
  {
    key: "featured",
    label: "Featured",
    render: (item) => (item.featured ? "★" : "—"),
  },
  {
    key: "published",
    label: "Published",
    render: (item) => (item.published ? "✓" : "✗"),
  },
];

export default function EventsAdminPage() {
  return (
    <Manager<Event>
      title="Events"
      description="Manage upcoming events and programs."
      resource="/api/admin/events"
      columns={columns}
      fields={fields}
    />
  );
}
