import JourneyTable from "../../components/journey-schedule";

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <div className="mt-6 grid grid-cols-1">
        <JourneyTable params={params} />
      </div>
    </>
  );
}
