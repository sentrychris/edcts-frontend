import type { Metadata } from "next";
import type { Galnet } from "@/core/interfaces/Galnet";
import type { SessionUser } from "@/core/interfaces/Auth";
import { SessionProvider } from "next-auth/react";
import { Jura } from "next/font/google";
import { settings } from "@/core/config";
import { getCollection } from "@/core/api";
import { auth } from "@/core/auth";
import SvgFilters from "@/components/svg-filters";
import MainBackground from "@/components/main-background";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import NewsTicker from "./galnet/components/galnet-ticker";
import Footer from "@/components/footer";
import { SettingsProvider } from "@/core/contexts/settings-context";
import ThemeWrapper from "@/components/theme-wrapper";
import "@/css/main.css";

const jura = Jura({ subsets: ["latin"] });

const title = `ED:CS`;
const description =
  "All the latest news and updates from the Elite: Dangerous galaxy.";

export const metadata: Metadata = {
  authors: [
    {
      name: "Chris Rowles",
      url: "https://versyx.net",
    },
  ],
  title,
  description,
  keywords: [
    "EDCTS",
    "Elite Dangerous",
    "Frontier Developments",
    "EDSM",
    "EDDN",
    "Spansh",
    "Icarus",
    "Galnet",
    "Milky Way",
    "Astronomy",
  ],
  openGraph: {
    title,
    description,
    images: [
      {
        url: `${settings.app.url}/images/edcts.png`,
      },
    ],
    url: settings.app.url,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  const news = await getCollection<Galnet>("galnet/news");
  const articles = news.data.map((article) => ({
    title: article.title,
    slug: article.slug,
    audio_file: article.audio_file,
    uploaded_at: article.uploaded_at,
  }));

  return (
    <html lang="en" data-fx-crt-text="true" className="scroll-smooth">
      <body className={jura.className + " overlay text-glow relative antialiased"}>
        <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={true}>
          <SettingsProvider>
            <ThemeWrapper>
              <SvgFilters />
              <MainBackground />
              <div className="relative z-10 flex h-screen flex-col overflow-hidden">
                <NewsTicker articles={articles} />
                <MobileNav user={(session?.user as SessionUser) ?? null} />
                <div className="flex min-h-0 flex-1">
                  <Sidebar articles={articles} user={(session?.user as SessionUser) ?? null} />
                  <main className="main-content min-w-0 flex-1 overflow-y-auto p-3 text-neutral-200 text-glow__white">
                    {children}
                    <Footer />
                  </main>
                </div>
              </div>
            </ThemeWrapper>
          </SettingsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
