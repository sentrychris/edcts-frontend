import Heading from "@/components/heading";
import SystemDetail from "../components/system/system-detail";

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <Heading title="System Information" className="mb-5 gap-2" />
      <SystemDetail params={params} />
    </>
  );
}
