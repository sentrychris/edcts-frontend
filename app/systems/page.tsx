import { getAllSystems } from './systems';
import SystemsTable from './components/systems-table';

export default async function Page() {
  const systems = await getAllSystems('systems');

  return (
    <div className="z-20">
      <h2 className="uppercase">Systems Statistics</h2>
      <div className={'mt-5 p-6 rounded shadow-lg bg-slate-50 dark:bg-neutral-900'}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm tracking-wider">
          <div>
            <p><span className="font-bold tracking-widest">79,590,991</span> systems stored.</p>
            <p><span className="font-bold tracking-widest">78,267,030</span> have known coordinates.</p>
            <p><span className="font-bold tracking-widest">11,066,559</span> have locked coordinates.</p>
          </div>
          <div>
            <p><span className="font-bold tracking-widest">394,049,338</span> celestial bodies stored.</p>
            <p><span className="font-bold tracking-widest">114,505,215</span> have known coordinates.</p>
            <p><span className="font-bold tracking-widest">1,066,559</span> have confirmed footfalls.</p>
          </div>
          <div>
            <p><span className="font-bold tracking-widest">3,155</span> bounties claimed in last 24 hours</p>
            <p><span className="font-bold tracking-widest">11,459</span> trade routes in last 24 hours</p>
          </div>
        </div>
        <div className={'text-xs text-center tracking-wider'}>
          <p className="mt-6 mb-1">
            <span className="font-bold tracking-widest">0.019897%</span> of the galaxy has been discovered so far -
            it will take <span className="font-bold">40,565 years, 1 month, 12 days</span> to discover it entirely.
          </p>
          <p className="mb-1">Current known galactic population: <span className="font-bold tracking-widest">6,627,033,034,109</span></p>
          <p>Current commodities stock in galactic market: <span className="font-bold tracking-widest">99,689,890,482</span></p>
        </div>
      </div>
      <div className="flex items-center gap-3 my-5">
        <i className="icarus-terminal-system-orbits" style={{fontSize: '1.5rem'}}></i>
        <h2 className="uppercase text-3xl text-glow-white">Systems Information</h2>
      </div>
      <SystemsTable systems={systems} />
    </div>
  );
}
  