import { System } from '../../../../interfaces/System';
import SystemDetail from '../../components/system-detail';
import { getSystem } from '../../systems';

export default async function Page() {
  return (
    <>
      <div className="items-center justify-between">
        <h2>System information</h2>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-bold">

        </div>
      </div>
      <div className="mt-6">
        <SystemDetail />
      </div>
    </>
  );
}
  