import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import SystemDetail from "../components/system/system-detail";
import Panel from "@/components/panel";

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
      <Panel className="mb-5 px-6 py-4">

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
      </Panel>

      <SystemDetail params={params} />
    </>
  );
}
