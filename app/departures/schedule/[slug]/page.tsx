
import DepartureSchedule from '../../components/departure-schedule';
import { FunctionComponent } from 'react';

const Page: FunctionComponent = async () => {
  return (
    <>
      <div className="grid grid-cols-1 mt-6">
        <DepartureSchedule />
      </div>
    </>
  );
};

export default Page;
  