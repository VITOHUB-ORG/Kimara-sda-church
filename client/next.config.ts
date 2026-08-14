import type { NextConfig } from "next";

const API_TARGET = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const nextConfig: NextConfig = {
  images: {
    // Allow fetching from the local API server (localhost/private IP) in dev.
    // Next blocks private IPs by default as an SSRF safeguard.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      // Local API / uploads (dev & self-hosted)
      { protocol: "http", hostname: "localhost" },
      // YouTube thumbnails and any free CDN host (e.g. Cloudflare R2, Cloudinary)
      { protocol: "https", hostname: "**" },
    ],
  },
  // Proxy API requests to the backend so the browser can call the API
  // same-origin (works from any device / LAN IP, no CORS or localhost issues).
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_TARGET}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;