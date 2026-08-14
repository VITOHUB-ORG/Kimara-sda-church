# Kimara Youth Ministry Platform

A full-stack content management platform for the **Kimara Youth Ministry — Seventh-day Adventist Church**. A Christ-centered, youth-focused digital ministry and evangelism platform.

## Tech Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS v4 + TypeScript
- **Backend:** Express (Node.js) + MongoDB (Mongoose) — works with MongoDB Atlas
- **Auth:** JWT (admin panel)
- **Uploads:** Multer (images + PDFs), served with long-cache headers; optional free CDN via `CDN_BASE_URL`
- **Media:** YouTube live integration (thumbnail from Google's free image CDN, embedded player)
- **i18n:** Kiswahili / English language switcher (cookie-based, default English) on all public pages

## Project Structure

```
church/
├── client/          # Next.js frontend (public site + admin panel)
│   ├── src/app/(site)/     # Public website pages
│   ├── src/app/admin/      # Admin panel (login + content management)
│   ├── src/components/     # Shared components
│   └── src/lib/            # API client, types, design tokens
└── server/          # Express API + MongoDB models
    ├── src/models/         # Mongoose schemas
    ├── src/routes/         # Public + admin CRUD routes
    └── src/seed.js         # Seed default admin + sample content
```

## Design System

- **Primary:** Deep Navy `#12355B` (trust, stability, faith)
- **Spiritual:** Deep Blue `#1D4E89`
- **Hope:** Warm Gold `#D9A441`
- **Ministry accents:** Green (Adventurers), Blue (Pathfinders), Orange (Ambassadors), Purple (Young Adults), Gold (Senior Youth), Burgundy (Mission)
- **Typography:** Montserrat (sans-serif, used for both body and headings)
- **Theme:** "Know Christ → Grow in Faith → Serve Others → Lead with Purpose → Share His Hope"

## Getting Started

### 1. Prerequisites

- Node.js 20+ (tested on Node 24)
- A MongoDB database — free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster recommended

### 2. Backend setup

```bash
cd server
npm install
```

Create `.env` from `.env.example` and fill in your MongoDB Atlas connection string and a long random `JWT_SECRET`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sda_youth
JWT_SECRET=<long random secret>
ADMIN_EMAIL=admin@sdachurch.org
ADMIN_PASSWORD=Admin@123
```

Seed the default admin account and sample content, then start the API:

```bash
npm run seed
npm run dev       # http://localhost:5000
```

> `npm run test` runs an automated smoke test (uses an in-memory MongoDB; requires no credentials).

## Media Uploads & Free CDN

- **Image upload** — admins upload images (JPG, PNG, WEBP, GIF, max 15MB) directly in the admin panel. Files are stored on the server under `server/uploads/` and served with long cache headers (`immutable`, 365 days) for fast repeat loads.
- **PDF storage** — admins upload PDF files for resources (sermons, handbooks, study materials) using the same upload flow.
- **Free CDN (optional)** — set `CDN_BASE_URL` in `server/.env` to prefix uploaded file URLs with your free CDN domain (e.g. Cloudflare R2, Cloudinary free tier). When empty, files are served from this server.
- **Frontend optimization** — the frontend renders images through Next.js image optimization (self-hosted, cached, responsive) instead of raw `<img>` tags, so images are fast and mobile-friendly.
- **YouTube thumbnails** — live-event images are pulled automatically from Google's free image CDN (`img.youtube.com`), no upload needed.

## YouTube Live

The church broadcasts live on YouTube (channel: **Kimara Youth Ministry**) every **Wednesday, Friday and Saturday**. Events support a **YouTube Live Link** field:

- Event cards show the YouTube thumbnail, a pulsing **LIVE** badge and a **"Tazama Live Ibada ya Leo"** button.
- Event detail pages embed the YouTube player directly.
- The homepage has a dedicated **"Tazama Ibada ya Leo"** Watch Live section with the live stream, weekly schedule and channel link.
- Add a channel URL (e.g. `https://www.youtube.com/@KimaraYouthMinistry`) for "live now" style events, or a specific video/live URL to embed a stream.

### 3. Frontend setup

```bash
cd client
npm install
```

Create `.env.local` (already created by default):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev       # http://localhost:3000
```

### 4. Login to the admin panel

Visit **http://localhost:3000/admin** and sign in with the admin credentials from `.env` (defaults: `admin@sdachurch.org` / `Admin@123` — change after first login).

## Content Management

Admins can manage via `/admin`:

| Section    | Description                                  |
| ---------- | -------------------------------------------- |
| Events     | Events, dates, locations, YouTube Live link, image upload, registration links |
| News       | Announcements, reports, articles + image upload |
| Resources  | Bible studies, devotionals, sermons + PDF upload/download |
| Ministries | Ministry info, leaders, accent colors + image upload |
| Gallery    | Photos uploaded/categorized by worship/service/etc. |
| Prayer     | Prayer requests from the website             |
| Testimonies| Review and approve public testimonies        |
| Messages   | Contact form submissions                     |

The login form includes a **show/hide password** toggle for convenience on mobile.

## Language Switcher (Kiswahili / English)

The entire public site is translated into **English** and **Kiswahili**. A **EN / SW** toggle in the header switches the language on every public page:

- The choice is stored in a `lang` cookie (`en` default, `sw` for Kiswahili) and applies site-wide — no per-page setting needed.
- Server components read the cookie via `getI18n()`; client components use the `useI18n()` hook from the `I18nProvider` mounted in the root layout.
- Static UI strings live in `client/src/lib/i18n/dictionaries.ts` (`en` + `sw`, typed against a single `Dictionary` shape so a missing key fails the build).
- Admin panel and user-submitted content (event titles, news, testimonies, etc.) remain in the language the author wrote them.

## Public Pages

Home (hero, ministry pathway, journey, events, resources, salvation CTA), About, Ministries (+ detail), Events (+ detail), Resources, News (+ detail), Gallery, Testimonies, Prayer, Contact, Privacy.

## Security Notes

- Admin API routes require a valid JWT (`Authorization: Bearer <token>`).
- Passwords are hashed with bcrypt.
- Never commit `.env` files.
- Set a strong `JWT_SECRET` in production and serve the site over HTTPS (SSL).
