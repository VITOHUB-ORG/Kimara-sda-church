import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    type: {
      type: String,
      enum: ["lesoni", "bobea", "kesha", "announcement"],
      default: "announcement",
    },
    category: { type: String, default: "Announcement" },
    bibleText: { type: String, default: "" },
    image: { type: String, default: "" },
    author: { type: String, default: "SDA Youth Ministry" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("News", newsSchema);