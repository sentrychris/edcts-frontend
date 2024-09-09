import type { FunctionComponent } from "react";
import Link from "next/link";

const Footer: FunctionComponent = () => {
  return (
    <footer className="flex flex-col items-center justify-center gap-x-10 border-t border-neutral-800 bg-transparent px-4 py-4 text-center text-neutral-200 backdrop-blur backdrop-filter">
      <div className="text-glow__orange mb-3 flex items-center gap-4 text-sm uppercase">
        <Link className="border-r border-neutral-800 pe-3 hover:text-glow__blue" href="/legal/privacy-policy">
          Privacy Policy
        </Link>
        <Link href="/legal/privacy-policy" className="hover:text-glow__blue">Terms & Conditions</Link>
      </div>
      <span className="text-xs">
        <span className="text-glow__orange">Elite: Dangerous</span> © 2012 - 2024 Frontier
        Developments plc. All rights reserved.
      </span>
      <span className="text-xs">
        ED:CTS is neither affiliated with nor endorsed by Frontier Developments.
      </span>
      <span className="text-xs">
        Made with <span className="text-glow__orange">♥</span> by{" "}
        <a className="text-glow__blue" href="https://versyx.dev">
          Chris Rowles
        </a>
        .
      </span>
    </footer>
  )
}

export default Footer;