
import SystemsTable from './components/systems-table';
import Heading from '../components/heading';
import { getCollection, getResource } from '../lib/api';
import { System } from '../lib/interfaces/System';
import { Statistics } from '../lib/interfaces/Statistics';
import SystemStatistics from './components/system-statistics';

export default async function Page() {
  const systems = await getCollection<System>('systems', {
    withInformation: 1
  });

  const statistics = await getResource<Statistics>('statistics', {
    resetCache: 1
  });

  return (
    <>
      <Heading icon="icarus-terminal-info" title="System Statistics" className="gap-2 mb-5" />
      <SystemStatistics className="fx-fade-in" data={statistics} interval={300000} cached={true} />
      <Heading icon="icarus-terminal-system-orbits"
        largeIcon={true}
        title="Systems Information"
        className="gap-3 my-5 text-2xl" />
      <SystemsTable systems={systems} />
    </>
  );
}
  