import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { getLang } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/client";
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
      </body>
    </html>
  );
}
