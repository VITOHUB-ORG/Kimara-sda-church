export type MinistrySlug =
  | "adventurers"
  | "pathfinders"
  | "ambassadors"
  | "young-adults"
  | "senior-youth"
  | "mission";

export interface Ministry {
  _id: string;
  name: string;
  slug: MinistrySlug;
  tagline: string;
  description: string;
  color: "green" | "blue" | "orange" | "purple" | "gold" | "burgundy";
  image: string;
  leaderName: string;
  leaderTitle: string;
  contact: string;
  published: boolean;
}

export interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string | null;
  time: string;
  ministry: MinistrySlug | "general";
  image: string;
  youtubeUrl: string;
  registrationLink: string;
  featured: boolean;
  published: boolean;
  createdAt?: string;
}

export interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  type: "lesoni" | "bobea" | "kesha";
  category: string;
  bibleText: string;
  image: string;
  author: string;
  published: boolean;
  createdAt: string;
}

export type ResourceType =
  | "bible-study"
  | "devotional"
  | "sermon"
  | "prayer"
  | "testimony"
  | "download";

export interface Resource {
  _id: string;
  title: string;
  type: ResourceType;
  description: string;
  fileUrl: string;
  link: string;
  author: string;
  published: boolean;
}

export interface GalleryItem {
  _id: string;
  title: string;
  category: "worship" | "fellowship" | "service" | "mission" | "leadership";
  image: string;
  images?: string[];
  caption: string;
  featured?: boolean;
}

export interface Testimony {
  _id: string;
  name: string;
  title: string;
  testimony: string;
  image: string;
  approved: boolean;
}
