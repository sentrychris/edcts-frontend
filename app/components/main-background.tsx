import type { FunctionComponent } from "react";
import Image from "next/image";

const MainBackground: FunctionComponent = () => {
  return (
    <div className="z-overlay pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden">
      <div className="flex w-[108rem] flex-none justify-end">
        <Image
          width="100"
          height="100"
          src="/tinyb.png"
          className="w-[150rem] max-w-none"
          decoding="async"
          alt="glow"
        ></Image>
      </div>
    </div>
  );
};

export default MainBackground;
