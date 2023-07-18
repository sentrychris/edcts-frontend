import DepartureSchedule from '../../components/departure-schedule';

export default async function Page() {
  return (
    <>
      <div className="grid grid-cols-1 mt-6">
        <DepartureSchedule />
      </div>
    </>
  );
};
  