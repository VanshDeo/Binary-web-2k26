
import Gallary from "./components/gallary";
import ScrollFlipCard from "./components/ScrollFlipCard";

export default function Home() {
  return (
    <>
      {/* <section className="h-screen bg-neutral-900 flex items-center justify-center">
        
      </section> */}

      <ScrollFlipCard />      

      <section className="h-screen bg-white flex items-center justify-center">
        <h2 className="text-5xl font-bold">
          Fully Transitioned Section
        </h2>
      </section>

      <Gallary />
    </>
  );
}
