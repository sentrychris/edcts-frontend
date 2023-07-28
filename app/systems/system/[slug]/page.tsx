import Heading from '@/app/components/heading';
import SystemDetail from '../../components/system-detail';

export default async function Page() {
  return (
    <>
      <Heading title="System Information" className="gap-2 mb-5" />
      <SystemDetail />
    </>
  );
}
  