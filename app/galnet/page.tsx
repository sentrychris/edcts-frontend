import type { Metadata, ResolvingMetadata } from "next";
import type { Galnet } from "@/core/interfaces/Galnet";
import { settings } from "@/core/config";
import { getCollection } from "@/core/api";
import GalnetList from "./components/galnet-list";

interface Props {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const getPageData = async () => {
  return await getCollection<Galnet>("galnet/news");
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Galnet News | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/galnet`,
      title: `Galnet News | ${(await parent).title?.absolute}`,
      description: `Latest news from the Galaxy, with Vox Galactica and other independent affiliates.`,
    },
    description: `Latest news from the Galaxy, with Vox Galactica and other independent affiliates.`,
  };
}

export default async function Page() {
  const articles = await getPageData();

  return (
    <>
      {/* ── Galnet Terminal ── */}
      <div className="relative mb-5 border border-orange-900/40 backdrop-blur backdrop-filter px-6 py-4">
        <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-orange-500" />
        <span className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-orange-500" />
        <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-orange-500" />
        <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-orange-500" />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-4">
            <span>MODULE:GALNET</span>
            <span className="text-neutral-800">■</span>
            <span>CHANNEL:VOX GALACTICA</span>
            <span className="text-neutral-800">■</span>
            <span>CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            <span>UPLINK: ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1">
        <div className="mb-5 flex items-center gap-3 border-b border-orange-900/20 pb-4">
          <i className="icarus-terminal-notifications text-glow__orange" style={{ fontSize: "1.5rem" }}></i>
          <div className="flex-1">
            <h2 className="text-glow__orange font-bold uppercase tracking-widest">Galnet Network</h2>
            <p className="text-xs uppercase tracking-wider text-neutral-500">Vox Galactica Transmissions</p>
          </div>
        </div>
        <GalnetList articles={articles} />
      </div>
    </>
  );
}
