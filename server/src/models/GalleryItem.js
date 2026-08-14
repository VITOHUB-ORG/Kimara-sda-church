import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    category: {
      type: String,
      enum: ["worship", "fellowship", "service", "mission", "leadership"],
      default: "fellowship",
    },
    image: { type: String, required: true },
    caption: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("GalleryItem", galleryItemSchema);