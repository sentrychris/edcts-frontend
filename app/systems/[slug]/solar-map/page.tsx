import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import SystemSolarMap from "../../components/system/system-solar-map";

interface Props {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Solar Map | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/systems/${params.slug}/solar-map`,
      title: `Solar Map | ${(await parent).title?.absolute}`,
      description: `Interactive 3D solar system visualisation showing orbital bodies, stars and planets.`,
    },
    description: `Interactive 3D solar system visualisation showing orbital bodies, stars and planets.`,
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  return <SystemSolarMap params={params} />;
}
