import GalaxyMap from "./components/galaxy-map";

export default async function Page() {
  return (
    <div>
      <GalaxyMap isLoading={false} />
    </div>
  );
}
