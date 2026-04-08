import type { Metadata, ResolvingMetadata } from "next";
import type { Galnet } from "@/core/interfaces/Galnet";
import { settings } from "@/core/config";
import { getCollection } from "@/core/api";
import GalnetList from "./components/galnet-list";
import Panel from "@/components/panel";
import Heading from "@/components/heading";

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
      {/* ── Galnet Terminal status bar ── */}
      <Panel className="mb-5 px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-3">
            <span>MODULE:GALNET</span>
            <span className="hidden sm:inline text-neutral-800">■</span>
            <span className="hidden sm:inline">CHANNEL:VOX GALACTICA</span>
            <span className="hidden md:inline text-neutral-800">■</span>
            <span className="hidden md:inline">CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            <span>UPLINK: ACTIVE</span>
          </div>
        </div>
      </Panel>

      {/* ── Article list ── */}
      <Panel>

        <Heading bordered icon="icarus-terminal-notifications" title="Galnet Network" subtitle="Vox Galactica Transmissions" className="px-5 py-4">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-500">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            Live
          </span>
        </Heading>

        <div className="px-5">
          <GalnetList articles={articles} />
        </div>
      </Panel>
    </>
  );
}
