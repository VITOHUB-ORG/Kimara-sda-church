import type { MinistrySlug, ResourceType } from "./types";

export const ministryColors: Record<
  MinistrySlug,
  {
    solid: string;
    soft: string;
    text: string;
    border: string;
    dot: string;
  }
> = {
  adventurers: {
    solid: "bg-adventurers",
    soft: "bg-[#EAF3EC]",
    text: "text-adventurers",
    border: "border-adventurers",
    dot: "bg-adventurers",
  },
  pathfinders: {
    solid: "bg-pathfinders",
    soft: "bg-[#EAF0F8]",
    text: "text-pathfinders",
    border: "border-pathfinders",
    dot: "bg-pathfinders",
  },
  ambassadors: {
    solid: "bg-ambassadors",
    soft: "bg-[#FDF0E4]",
    text: "text-ambassadors",
    border: "border-ambassadors",
    dot: "bg-ambassadors",
  },
  "young-adults": {
    solid: "bg-youngadults",
    soft: "bg-[#F1EBFA]",
    text: "text-youngadults",
    border: "border-youngadults",
    dot: "bg-youngadults",
  },
  "senior-youth": {
    solid: "bg-senioryouth",
    soft: "bg-[#FBF3E0]",
    text: "text-senioryouth",
    border: "border-senioryouth",
    dot: "bg-senioryouth",
  },
  mission: {
    solid: "bg-mission",
    soft: "bg-[#F7EBED]",
    text: "text-mission",
    border: "border-mission",
    dot: "bg-mission",
  },
};

export const ministryMeta: Record<
  MinistrySlug,
  { label: string; hex: string }
> = {
  adventurers: { label: "Adventurers", hex: "#3A7D44" },
  pathfinders: { label: "Pathfinders", hex: "#1D4E89" },
  ambassadors: { label: "Ambassadors", hex: "#E67E22" },
  "young-adults": { label: "Young Adults", hex: "#6B3FA0" },
  "senior-youth": { label: "Senior Youth", hex: "#D9A441" },
  mission: { label: "Mission & Evangelism", hex: "#8E3B46" },
};

export const resourceMeta: Record<
  ResourceType,
  { label: string; description: string }
> = {
  "bible-study": {
    label: "Bible Study",
    description: "Explore God's Word.",
  },
  devotional: {
    label: "Devotionals",
    description: "Daily spiritual encouragement.",
  },
  sermon: {
    label: "Sermons",
    description: "Messages for today's generation.",
  },
  prayer: {
    label: "Prayer",
    description: "Submit or share prayer requests.",
  },
  testimony: {
    label: "Testimonies",
    description: "Stories of transformed lives.",
  },
  download: {
    label: "Downloads",
    description: "Downloadable resources.",
  },
};
