import type { Galnet } from "../core/interfaces/Galnet";
import GalnetList from "./components/galnet-list";
import { getCollection } from "../core/api";
import Heading from "../components/heading";

export default async function Page() {
  return (
    <>
      <div className="mt-6 grid grid-cols-1">
        <Heading
          icon="icarus-terminal-notifications"
          largeIcon={true}
          title="Galnet News"
          className="gap-3 border-b border-neutral-800 pb-3 text-2xl"
        />

        <GalnetList articles={await getCollection<Galnet>("galnet/news")} />
      </div>
    </>
  );
}
