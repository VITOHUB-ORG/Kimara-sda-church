import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Admin from "./models/Admin.js";
import Event from "./models/Event.js";
import News from "./models/News.js";
import Ministry from "./models/Ministry.js";
import Resource from "./models/Resource.js";

dotenv.config();

const ministries = [
  {
    name: "Adventurers",
    slug: "adventurers",
    tagline: "Discover • Learn • Grow",
    color: "green",
    description: "Growing with Christ through discovery, learning and outdoor adventure.",
  },
  {
    name: "Pathfinders",
    slug: "pathfinders",
    tagline: "Explore • Serve • Lead",
    color: "blue",
    description: "Following Christ and serving others through discipline, leadership and exploration.",
  },
  {
    name: "Ambassadors",
    slug: "ambassadors",
    tagline: "Connect • Grow • Serve",
    color: "orange",
    description: "Young people in action for Christ through energy, leadership and mission.",
  },
  {
    name: "Young Adults",
    slug: "young-adults",
    tagline: "Believe • Lead • Impact",
    color: "purple",
    description: "Faith with purpose — maturity, leadership and spiritual depth for young adults.",
  },
  {
    name: "Senior Youth",
    slug: "senior-youth",
    tagline: "Reflecting the Light of Christ",
    color: "gold",
    description: "Hope, light, purpose and mission — reflecting the Light of Christ to the world.",
  },
  {
    name: "Mission & Evangelism",
    slug: "mission",
    tagline: "Go and make disciples",
    color: "burgundy",
    description: "Evangelism, mission, service and community impact across the church and beyond.",
  },
];

const resources = [
  {
    title: "Quarterly Bible Study Guide",
    type: "bible-study",
    description: "Explore God's Word with the official Sabbath School study guide.",
    author: "SDA Youth Ministry",
  },
  {
    title: "Daily Youth Devotional",
    type: "devotional",
    description: "Daily spiritual encouragement written for today's generation.",
    author: "SDA Youth Ministry",
  },
  {
    title: "Sabbath Worship Sermons",
    type: "sermon",
    description: "Messages for today's generation — recorded sermons from youth services.",
    author: "SDA Youth Ministry",
  },
  {
    title: "Prayer Wall",
    type: "prayer",
    description: "Submit or share prayer requests — you are not alone.",
  },
  {
    title: "Testimonies of Grace",
    type: "testimony",
    description: "Stories of transformed lives by the power of God.",
  },
  {
    title: "Youth Leadership Handbook",
    type: "download",
    description: "Downloadable leadership training material for youth leaders.",
    author: "SDA Youth Ministry",
  },
];

const events = [
  {
    title: "SDA Youth Conference",
    slug: "sda-youth-conference",
    description: "KNOW • GROW • SERVE — a weekend of worship, workshops and fellowship.",
    location: "Dar es Salaam",
    startDate: new Date("2026-08-28"),
    endDate: new Date("2026-08-30"),
    ministry: "senior-youth",
    featured: true,
  },
  {
    title: "Pathfinder Camporee",
    slug: "pathfinder-camporee",
    description: "Explore, serve and lead — a camping adventure for Pathfinders.",
    location: "Morogoro",
    startDate: new Date("2026-09-12"),
    endDate: new Date("2026-09-14"),
    ministry: "pathfinders",
    featured: true,
  },
  {
    title: "Live Ibada ya Leo — Kimara Youth Ministry",
    slug: "live-ibada-ya-leo-kimara-youth-ministry",
    description:
      "Tazama live ibada ya leo kutoka Kimara Youth Ministry. Tunatangaza moja kwa moja kila Jumatano, Ijumaa na Jumamosi kwenye YouTube.",
    location: "Kimara SDA Church",
    startDate: new Date("2026-08-14"),
    time: "Every Wed · Fri · Sat",
    ministry: "senior-youth",
    youtubeUrl: "https://www.youtube.com/@kimarasdachurch6877",
    featured: true,
  },
  {
    title: "Young Adults Summit",
    slug: "young-adults-summit",
    description: "Faith with purpose — leadership and discipleship for young adults.",
    location: "Arusha",
    startDate: new Date("2026-10-03"),
    endDate: new Date("2026-10-04"),
    ministry: "young-adults",
  },
];

const news = [
  {
    title: "Walking in the Light of God's Word",
    slug: "walking-in-the-light-of-gods-word",
    excerpt: "A daily Bible study guide to help you grow in faith, one lesson at a time.",
    content:
      "God's Word is a lamp for our feet and a light for our path. Today, open your Bible and let the Holy Spirit guide you into all truth. Meditate on the scripture, pray about it, and share what you learn with someone.",
    type: "lesoni",
    bibleText: "Psalm 119:105",
    category: "Bible Study Guide",
  },
  {
    title: "Living a Purpose-Filled Youth Life",
    slug: "living-a-purpose-filled-youth-life",
    excerpt: "A youth lesson on knowing your identity and purpose in Christ.",
    content:
      "Young people are called to live with purpose. Know Christ, grow in faith, and serve others. Let your youth be an example to all believers in speech, conduct, love, faith and purity.",
    type: "bobea",
    bibleText: "1 Timothy 4:12",
    category: "Youth Lesson",
  },
  {
    title: "Morning Devotional: Start Your Day in Prayer",
    slug: "morning-devotional-start-your-day-in-prayer",
    excerpt: "Begin each morning with thanksgiving and surrender your day to God.",
    content:
      "Before the busyness of the day begins, spend quiet time with the Lord. Thank Him for His faithfulness, confess your needs, and ask for wisdom to walk in His ways throughout the day.",
    type: "kesha",
    bibleText: "Psalm 5:3",
    category: "Morning Devotional",
  },
];

const seed = async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "admin@sdachurch.org").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@123";

  const hash = await bcrypt.hash(password, 10);
  const existing = await Admin.findOne({ email });
  if (existing) {
    existing.password = hash;
    existing.role = "superadmin";
    await existing.save();
    console.log(`Admin password updated: ${email}`);
  } else {
    await Admin.create({ name: "Youth Director", email, password: hash, role: "superadmin" });
    console.log(`Admin created: ${email}`);
  }

  await Ministry.deleteMany({});
  await Ministry.insertMany(ministries);
  console.log(`Seeded ${ministries.length} ministries`);

  await Resource.deleteMany({});
  await Resource.insertMany(resources);
  console.log(`Seeded ${resources.length} resources`);

  await Event.deleteMany({});
  await Event.insertMany(events);
  console.log(`Seeded ${events.length} events`);

  await News.deleteMany({});
  await News.insertMany(news);
  console.log(`Seeded ${news.length} news items`);

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});