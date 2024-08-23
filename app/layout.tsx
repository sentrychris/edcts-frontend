import type { Metadata } from "next";
import { Jura } from "next/font/google";
import { settings } from "./core/config";
import MainBackground from "./components/main-background";
import MainNavigation from "./components/main-navigation";
import SvgFilters from "./components/svg-filters";
import "./css/main.css";

const jura = Jura({ subsets: ["latin"] });

console.log({ settings });

export const metadata: Metadata = {
  title: settings.app.name,
  description: "Check out the discord channel - https://discord.gg/KFaakj2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-fx-crt-text="true" className="scroll-smooth">
      <body className={jura.className + " relative antialiased"}>
        <SvgFilters />
        <MainBackground />
        <MainNavigation />
        <main className="text-glow__white mx-auto flex flex-col px-6 py-6 text-neutral-200 md:px-12 lg:px-24">
          <h1 className="mb-5 text-4xl uppercase">
            ED:CTS <span className="hidden md:inline">- Carrier Transport Services</span>
          </h1>
          {children}
        </main>
        <footer className="flex flex-col items-center justify-center gap-x-10 border-t border-neutral-800 py-4 text-center text-sm text-neutral-200">
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
