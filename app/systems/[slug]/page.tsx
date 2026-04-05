import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import SystemDetail from "../components/system/system-detail";

/**
 * Define the page properties.
 */
interface Props {
  params: {
    slug: string;
  };
}

/**
 * Generate the page metadata.
 *
 * @param params
 * @param parent
 * @returns
 */
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Star System Detail | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/systems/${params.slug}`,
      title: `Star System Detail | ${(await parent).title?.absolute}`,
      description: `Star system information including stars, orbital bodies, settlements, and more.`,
    },
    description: `Star system information including stars, orbital bodies, settlements, and more.`,
  };
}

/**
 * Create the page.
 *
 * @returns
 */
export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      {/* ── System Intelligence Terminal ── */}
      <div className="relative mb-5 border border-orange-900/40 bg-black/50 backdrop-blur backdrop-filter px-6 py-4">
        <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-orange-500" />
        <span className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-orange-500" />
        <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-orange-500" />
        <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-orange-500" />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-4">
            <span>MODULE:CARTOGRAPHIC</span>
            <span className="text-neutral-800">■</span>
            <span>DATABASE:STELLAR</span>
            <span className="text-neutral-800">■</span>
            <span>CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-orange h-1.5 w-1.5"></span>
            <span>TELEMETRY: ACTIVE</span>
          </div>
        </div>
      </div>

      <SystemDetail params={params} />
    </>
  );
}
