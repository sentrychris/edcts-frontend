import SystemDetail from '../../components/system-detail';

export default async function Page() {
  return (
    <>
      <div className="items-center justify-between">
        <h2 className="uppercase mb-5">System information</h2>
      </div>
      <SystemDetail />
    </>
  );
}
  