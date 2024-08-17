import type { Metadata } from "next";
import { Jura } from "next/font/google";
import Image from "next/image";
import MainNavigation from "./components/main-navigation";
import SvgFilters from "./components/svg-filters";
import "./css/main.css";

const jura = Jura({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SJ3F - Fleet Carrier Services",
  description: "Check out the discord channel - https://discord.gg/KFaakj2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-fx-crt-text="true" className="scroll-smooth">
      <body className={jura.className + " relative antialiased"}>
        <SvgFilters />
        <div className="overlay pointer-events-none absolute inset-x-0 top-0 hidden justify-center overflow-hidden dark:flex">
          <div className="flex w-[108rem] flex-none justify-end">
            <Image
              width="100"
              height="100"
              src="/avifb.png"
              className="w-[100rem] max-w-none flex-none dark:hidden"
              decoding="async"
              alt="glow"
            ></Image>
            <Image
              width="100"
              height="100"
              src="/tinyb.png"
              className="hidden w-[150rem] max-w-none flex-none dark:block"
              decoding="async"
              alt="glow"
            ></Image>
          </div>
        </div>
        <MainNavigation />
        <main className="text-glow__white mx-auto flex flex-col px-6 py-6 text-neutral-800 md:px-12 lg:px-24 dark:text-neutral-200">
          <h1 className="mb-5 text-4xl uppercase">
            ED:CTS <span className="hidden md:inline">- Carrier Transport Services</span>
          </h1>
          {children}
        </main>
      </body>
    </html>
  );
}
