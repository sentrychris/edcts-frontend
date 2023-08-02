import Heading from '../../../components/heading';
import SystemPage from '../../components/system-page';

export default async function Page() {
  return (
    <>
      <Heading title="System Information" className="gap-2 mb-5" />
      <SystemPage />
    </>
  );
}
  