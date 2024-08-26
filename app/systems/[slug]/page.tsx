import type { Metadata, ResolvingMetadata } from "next";
import type { System } from "@/core/interfaces/System";
import { getResource } from "@/core/api";
import Heading from "@/components/heading";
import SystemDetail from "../components/system/system-detail";

type Props = {
  params: {
    slug: string;
  };
};

const getPageData = async ({ params }: Props) => {
  const { data: system } = await getResource<System>(`systems/${params.slug}`, {
    withInformation: 1,
    withBodies: 1,
    withStations: 1,
  });

  return system;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const system = await getPageData({ params });
  return {
    title: `${system.name} - System Information | ${(await parent).title?.absolute}`,
    description: `System Information for ${system.name} including stars, orbital bodies, settlments, and more.`,
  };
}

export default async function Page({ params }: Props) {
  const { data: system } = await getResource<System>(`systems/${params.slug}`, {
    withInformation: 1,
    withBodies: 1,
    withStations: 1,
  });

  return (
    <>
      <Heading title="System Information" className="mb-5 gap-2" />
      <SystemDetail system={system} />
    </>
  );
}
