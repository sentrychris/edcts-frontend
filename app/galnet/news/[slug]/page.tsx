import GalnetArticle from "../../components/galnet-article";

export default async function Page() {
  return (
    <>
      <div className="mt-6 grid grid-cols-1 bg-transparent backdrop-blur backdrop-filter">
        <GalnetArticle />
      </div>
    </>
  );
}
