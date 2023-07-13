import Image from 'next/image'
import DepartureCard from './shared/DepartureCard'

export default function Home() {
  return (
    <main className="flex flex-col p-24 mx-auto">
      <div className="w-full items-center justify-between font-mono text-sm">
        <div className="grid grid-cols-4 gap-4 font-mono text-white font-bold leading-6 bg-stripes-fuchsia rounded-lg">
          <DepartureCard
            title="Merope > Skaude AA-A H294 | 14 July '23 00:49 UTC"
            departure="Merope"
            destination="Skaude AA-A H294"
            departsAt="14 July '23 @ 00:49 UTC" />

          <DepartureCard
            title="Sagittarius A* > Rohini | 14 July '23 05:37 UTC"
            departure="Sagittarius A*"
            destination="Rohini"
            departsAt="14 July '23 @ 05:37 UTC" />

          <DepartureCard
            title="HIP 36601 > Eocs Aub AA-A E9 | 15 July '23 04:44 UTC"
            departure="HIP 36601"
            destination="Eocs Aub AA-A E9"
            departsAt="15 July '23 @ 04:44 UTC" />

          <DepartureCard
            title="Diaguandri > Beagle Point | 16 July '23 03:13 UTC"
            departure="Diaguandri"
            destination="Beagle Point"
            departsAt="16 July '23 @ 03:13 UTC" />
        </div>
      </div>
    </main>
    )
  }
  