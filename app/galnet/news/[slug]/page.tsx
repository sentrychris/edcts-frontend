import Heading from "@/components/heading";
import GalnetArticle from "../../components/galnet-article";

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <div className="mt-6 grid grid-cols-1 bg-transparent backdrop-blur backdrop-filter">
        <Heading
          icon="icarus-terminal-notifications"
          largeIcon={true}
          title="Galnet News"
          className="gap-3 border-b border-neutral-800 pb-3 text-2xl"
        />

        <GalnetArticle params={params} />
      </div>
    </>
  );
}
