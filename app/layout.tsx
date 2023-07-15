import './globals.css'
import type { Metadata } from 'next'
import { Jura } from 'next/font/google'
import Image from 'next/image'
import LocalStorageNoSSR from './components/local-storage-no-ssr'
import MainNavigation from './components/main-navigation'

const jura = Jura({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FCOC - Fleet Carrier Services | Departure Board',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <LocalStorageNoSSR />
      <body className={jura.className + ` antialiased`}>
      <div className="absolute z-20 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none">
        <div className="w-[108rem] flex-none flex justify-end">
          <Image width="100" height="100" src="/avifb.png" className="w-[100rem] flex-none max-w-none dark:hidden" decoding="async" alt="glow"></Image>
          <Image width="100" height="100" src="/tinyb.png" className="w-[150rem] flex-none max-w-none hidden dark:block" decoding="async" alt="glow"></Image>
        </div>
      </div>
        <MainNavigation />
        {children}
      </body>
    </html>
  )
}
