import { type FunctionComponent, memo } from "react";
import Heading from "@/components/heading";
import Link from "next/link";

interface Props {
  className?: string;
}

const PopularSystems: FunctionComponent<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Link
        className="hover:text-glow__orange flex items-center gap-x-2"
        href="/systems/10477373803-sol"
      >
        <Heading
          icon="icarus-terminal-location text-glow__blue"
          title="Sol"
          className="gap-2 text-xs"
        />
        <small className="text-xs">(Home sweet home)</small>
      </Link>
      <Link
        className="hover:text-glow__orange mt-5 flex items-center gap-x-2"
        href="/systems/1178708478315-alpha-centauri"
      >
        <Heading
          icon="icarus-terminal-location text-glow__blue"
          title="Alpha Centauri"
          className="gap-2 text-xs"
        />
        <small className="text-xs">(Free Anaconda)</small>
      </Link>
      <Link
        className="hover:text-glow__orange mt-5 flex items-center gap-x-2"
        href="/systems/1184840454858-synuefe-nl-n-c23-4"
      >
        <Heading
          icon="icarus-terminal-location text-glow__blue"
          title="Synuefe NL-N c23-4"
          className="gap-2 text-xs"
        />
        <small className="text-xs">(Closest Guardian ruins to bubble)</small>
      </Link>
      <Link
        className="hover:text-glow__orange mt-5 flex items-center gap-x-2"
        href="/systems/3238296097059-colonia"
      >
        <Heading
          icon="icarus-terminal-location text-glow__blue"
          title="Colonia"
          className="gap-2 text-xs"
        />
        <small className="text-xs">(Distant civilization 22,000 LY from Sol)</small>
      </Link>
      <Link
        className="hover:text-glow__orange mt-5 flex items-center gap-x-2"
        href="/systems/20578934-sagittarius-a"
      >
        <Heading
          icon="icarus-terminal-location text-glow__blue"
          title="Sagittarius A*"
          className="gap-2 text-xs"
        />
        <small className="text-xs">(Center of the Milky Way Galaxy)</small>
      </Link>
      <Link
        className="hover:text-glow__orange mt-5 flex items-center gap-x-2"
        href="/systems/2468576471-skaude-aa-a-h294"
      >
        <Heading
          icon="icarus-terminal-location text-glow__blue"
          title="Skaude AA-A h294"
          className="gap-2 text-xs"
        />
        <small className="text-xs">(The Collection of Wonders)</small>
      </Link>
    </div>
  );
};

export default memo(PopularSystems);
