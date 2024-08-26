import type { Metadata } from "next";
import type { Galnet } from "./core/interfaces/Galnet";
import { Jura } from "next/font/google";
import { settings } from "./core/config";
import { getCollection } from "./core/api";
import MainBackground from "./components/main-background";
import MainNavigation from "./components/main-navigation";
import NewsTicker from "./galnet/components/galnet-ticker";
import SvgFilters from "./components/svg-filters";
import "./css/main.css";

const jura = Jura({ subsets: ["latin"] });

const title = `ED:CTS`;
const description =
  "All the latest news and updates from the Elite: Dangerous galaxy. Find scheduled flights, carrier services, and more.";

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
    "Elite Dangerous",
    "Frontier Developments",
    "EDSM",
    "EDDN",
    "Spansh",
    "Icarus",
    "Galnet",
    "Milky Way",
    "Astronomy",
    "Carrier Services",
    "Fleet Carriers",
  ],
  openGraph: {
    title,
    description,
    images: [
      {
        url: "https://edcts.versyx.net/images/edcts.png",
      },
    ],
    url: "https://edcts.versyx.net/",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const news = await getCollection<Galnet>("galnet/news");
  const articles = news.data.map((article) => ({
    title: article.title,
    slug: article.slug,
    audio_file: article.audio_file,
    uploaded_at: article.uploaded_at,
  }));

  return (
    <html lang="en" data-fx-crt-text="true" className="scroll-smooth">
      <body className={jura.className + " overlay relative antialiased"}>
        <SvgFilters />
        <MainBackground />
        <MainNavigation />
        <NewsTicker articles={articles} />
        <main className="text-glow__white lg:px-18 mx-auto flex flex-col px-6 py-6 text-neutral-200 md:px-12">
          <h1 className="mb-5 text-4xl uppercase">
            ED:CTS <span className="hidden md:inline">- Carrier Transport Services</span>
          </h1>
          {children}
        </main>
        <footer className="flex flex-col items-center justify-center gap-x-10 border-t border-neutral-800 px-4 py-4 text-center text-sm text-neutral-200">
          <span className="">
            <span className="text-glow__orange">Elite: Dangerous</span> © 2012 - 2024 Frontier
            Developments plc. All rights reserved.
          </span>
          <span className="">
            ED:CTS is neither affiliated with nor endorsed by Frontier Developments.
          </span>
          <span className="">
            Made with <span className="text-glow__orange">♥</span> by{" "}
            <a className="text-glow__blue" href="https://versyx.dev">
              Chris Rowles
            </a>
            .
          </span>
        </footer>
      </body>
    </html>
  );
}
