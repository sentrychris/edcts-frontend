import Heading from "../../../../../components/heading";
import SystemBodyPage from "../../../../components/system-body-page";

export default async function Page({params}: { params: { slug: string } }) {
  return (
    <>
      <Heading title="Body Information" className="mb-5 gap-2" />
      <SystemBodyPage params={params} />
    </>
  );
}
