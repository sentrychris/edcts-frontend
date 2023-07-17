import { getAllSystems } from './systems';
import SystemsTable from './components/systems-table';

export default async function Home() {
  const systems = await getAllSystems('systems');

  return (
    <>
      <div className="grid grid-cols-1">
        <div>
          <h2 className="uppercase text-3xl mb-5">Systems Index</h2>
          <SystemsTable systems={systems} />
        </div>
      </div>
    </>
  );
}
  