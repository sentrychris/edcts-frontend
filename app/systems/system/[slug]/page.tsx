import Heading from "../../../components/heading";
import SystemPage from "../../components/system-page";

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <Heading title="System Information" className="mb-5 gap-2" />
      <SystemPage params={params} />
    </>
  );
}
