import Heading from '../../../../../components/heading';
import { MappedSystemBody } from '../../../../../lib/interfaces/SystemBody';
import SystemTitle from '../../../../components/system-title';
import SystemMap from '../../../../lib/system-map';

interface Props {
  body: MappedSystemBody;
  system: SystemMap;
}


export default async function Page({ body, system }: Props) {
  return (
    <>
      <Heading title="System Information" className="gap-2 mb-5" />
      <div className="pb-5 border-b border-neutral-800">
        <SystemTitle
          title={system.name}
          celestials={system.objectsInSystem.length}
        />
      </div>
    </>
  );
}
  