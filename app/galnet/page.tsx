import type { Galnet } from "@/core/interfaces/Galnet";
import { getCollection } from "@/core/api";
import Heading from "@/components/heading";
import GalnetList from "./components/galnet-list";

export default async function Page() {
  return (
    <>
      <div className="mt-4 grid grid-cols-1">
        <Heading
          icon="icarus-terminal-atmosphere"
          largeIcon={true}
          title="Galnet Network"
          className="gap-3 border-b border-neutral-800 pb-3 text-2xl"
        />

        <GalnetList articles={await getCollection<Galnet>("galnet/news")} />
      </div>
    </>
  );
}
