import DepartureSchedule from "../../components/departure-schedule";

export default async function Page() {
  return (
    <>
      <div className="mt-6 grid grid-cols-1">
        <DepartureSchedule />
      </div>
    </>
  );
}
