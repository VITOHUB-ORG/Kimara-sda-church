import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { getLang } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/client";
import PwaRegister from "@/components/site/PwaRegister";
import PwaInstallPrompt from "@/components/site/PwaInstallPrompt";
import "./globals.css";

// The active language is read from a cookie at request time. Force dynamic
// rendering so every request (and router.refresh()) re-reads the cookie instead
// of serving a cached static shell with the default language.
export const dynamic = "force-dynamic";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Kimara Youth Ministry",
    template: "%s | Kimara Youth Ministry",
  },
  description:
    "Empowering young people to know Christ, serve others, and share His hope. Tazama live ibada zetu kwenye YouTube.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kimara Youth",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1e3a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getLang();

  return (
    <html
      lang={lang}
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider lang={lang}>{children}</I18nProvider>
        <PwaRegister />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
