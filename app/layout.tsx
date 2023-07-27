import type { Metadata } from 'next';
import { Jura } from 'next/font/google';
import Image from 'next/image';
import MainNavigation from './components/main-navigation';
import SvgFilters from './components/svg-filters';
import './css/main.css';

const jura = Jura({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SJ3F - Fleet Carrier Services',
  description: 'Check out the discord channel - https://discord.gg/KFaakj2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={jura.className + ' antialiased'}>
        <SvgFilters />
        <div className="hidden overlay absolute top-0 inset-x-0 dark:flex justify-center overflow-hidden pointer-events-none">
          <div className="w-[108rem] flex-none flex justify-end">
            <Image width="100" height="100" src="/avifb.png" className="w-[100rem] flex-none max-w-none dark:hidden" decoding="async" alt="glow"></Image>
            <Image width="100" height="100" src="/tinyb.png" className="w-[150rem] flex-none max-w-none hidden dark:block" decoding="async" alt="glow"></Image>
          </div>
        </div>
        <MainNavigation />
        <main className="flex flex-col px-6 md:px-12 lg:px-24 py-6 mx-auto text-neutral-800 dark:text-neutral-200 text-glow">
          <h1 className="uppercase text-glow-white text-4xl mb-5 ">ED:CTS - Carrier Transport Services</h1>
          {children}
        </main>
      </body>
    </html>
  );
}
